package main

import (
	"context"
	"encoding/json"
	"fmt"
	"html"
	"log/slog"
	"net/http"
	"net/url"
	"strings"

	"github.com/bluesky-social/indigo/atproto/syntax"
)

// Scope tiers. Readers ("comment") only get the scopes needed to post, like, and repost.
// Owners ("setup") additionally get write access to the standard.site records, which is
// required to link an article and create a publication.
const (
	scopeTierComment = "comment"
	scopeTierOwner   = "owner"
)

// Only the owner tier requests site.standard.document scopes, so a granted scope under this
// collection identifies an owner session (prefix match tolerates any action/format the auth
// server echoes back).
const ownerScopePrefix = "repo:site.standard.document"

var commentScopes = []string{
	"atproto",
	"repo:app.bsky.feed.post?action=create",
	"repo:app.bsky.feed.post?action=delete",
	"repo:app.bsky.feed.like?action=create",
	"repo:app.bsky.feed.like?action=delete",
	"repo:app.bsky.feed.repost?action=create",
	"repo:app.bsky.feed.repost?action=delete",
	"rpc:app.bsky.feed.getPostThread?aud=did:web:api.bsky.app#bsky_appview",
}

var ownerScopes = append(append([]string{}, commentScopes...),
	"repo:site.standard.document?action=create",
	"repo:site.standard.document?action=update",
	"repo:site.standard.publication?action=create",
	"blob:image/*",
)

func grantedTier(scopes []string) string {
	for _, s := range scopes {
		if strings.HasPrefix(s, ownerScopePrefix) {
			return scopeTierOwner
		}
	}
	return scopeTierComment
}

// startAuthFlow mirrors oauth.ClientApp.StartAuthFlow but requests a caller-chosen scope set
// (the wrapper hardcodes config.Scopes). The client metadata still declares the full owner set,
// so each login can request a subset.
func (s *Server) startAuthFlow(ctx context.Context, identifier string, scopes []string) (string, error) {
	app := s.OAuth

	var authserverURL string
	var accountDID syntax.DID

	if strings.HasPrefix(identifier, "https://") {
		authserverURL = identifier
		identifier = ""
	} else {
		atid, err := syntax.ParseAtIdentifier(identifier)
		if err != nil {
			return "", fmt.Errorf("not a valid account identifier (%s): %w", identifier, err)
		}
		ident, err := app.Dir.Lookup(ctx, atid)
		if err != nil {
			return "", fmt.Errorf("failed to resolve account (%s): %w", identifier, err)
		}
		accountDID = ident.DID
		host := ident.PDSEndpoint()
		if host == "" {
			return "", fmt.Errorf("identity does not link to an atproto host (PDS)")
		}
		authserverURL, err = app.Resolver.ResolveAuthServerURL(ctx, host)
		if err != nil {
			return "", fmt.Errorf("resolving auth server: %w", err)
		}
	}

	authserverMeta, err := app.Resolver.ResolveAuthServerMetadata(ctx, authserverURL)
	if err != nil {
		return "", fmt.Errorf("fetching auth server metadata: %w", err)
	}

	info, err := app.SendAuthRequest(ctx, authserverMeta, scopes, identifier)
	if err != nil {
		return "", fmt.Errorf("auth request failed: %w", err)
	}
	if accountDID != "" {
		info.AccountDID = &accountDID
	}
	if err := app.Store.SaveAuthRequestInfo(ctx, *info); err != nil {
		return "", fmt.Errorf("persisting auth request: %w", err)
	}

	params := url.Values{}
	params.Set("client_id", app.Config.ClientID)
	params.Set("request_uri", info.RequestURI)
	return fmt.Sprintf("%s?%s", authserverMeta.AuthorizationEndpoint, params.Encode()), nil
}

func (s *Server) ClientMetadata(w http.ResponseWriter, r *http.Request) {
	slog.Info("client metadata request", "url", r.URL, "host", r.Host)

	meta := s.OAuth.Config.ClientMetadata()
	if s.OAuth.Config.IsConfidential() {
		meta.JWKSURI = strPtr(fmt.Sprintf("https://%s/oauth/jwks.json", r.Host))
	}
	meta.ClientName = strPtr("bsky-api-service")
	meta.ClientURI = strPtr(fmt.Sprintf("https://%s", r.Host))

	if err := meta.Validate(s.OAuth.Config.ClientID); err != nil {
		slog.Error("validating client metadata", "err", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(meta); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (s *Server) JWKS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	body := s.OAuth.Config.PublicJWKS()
	if err := json.NewEncoder(w).Encode(body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (s *Server) Login(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req struct {
		// Handle carries the account identifier: a handle, a DID (owner setup), or an auth
		// server URL (e.g. https://bsky.social).
		Handle string `json:"handle"`
		Intent string `json:"intent"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	identifier, _ := strings.CutPrefix(req.Handle, "@")
	if identifier == "" {
		jsonError(w, "handle is required", http.StatusBadRequest)
		return
	}

	scopes := commentScopes
	if req.Intent == scopeTierOwner || req.Intent == "setup" {
		scopes = ownerScopes
	}

	slog.Info("Login", "client_id", s.OAuth.Config.ClientID, "intent", req.Intent)

	redirectURL, err := s.startAuthFlow(ctx, identifier, scopes)
	if err != nil {
		slog.Error("OAuth login failed", "err", err)
		jsonError(w, fmt.Sprintf("OAuth login failed: %s", err), http.StatusInternalServerError)
		return
	}

	jsonOK(w, map[string]string{"redirect_url": redirectURL})
}

func (s *Server) OAuthCallback(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	params := r.URL.Query()
	slog.Info("received callback", "params", params)

	sessData, err := s.OAuth.ProcessCallback(ctx, r.URL.Query())
	if err != nil {
		slog.Error("failed processing oauth callback", "err", err)
		callbackError(w, fmt.Sprintf("failed processing oauth callback: %s", err))
		return
	}

	oauthSess, err := s.OAuth.ResumeSession(ctx, sessData.AccountDID, sessData.SessionID)
	if err != nil {
		callbackError(w, "not authenticated")
		return
	}
	c := oauthSess.APIClient()

	var resp struct {
		Handle string `json:"handle"`
	}
	if err := c.Get(ctx, "com.atproto.server.getSession", nil, &resp); err != nil {
		callbackError(w, err.Error())
		return
	}

	tier := grantedTier(oauthSess.Data.Scopes)

	sess, _ := s.CookieStore.Get(r, "bsky-api-session")
	sess.Values["account_did"] = sessData.AccountDID.String()
	sess.Values["session_id"] = sessData.SessionID
	sess.Values["handle"] = resp.Handle
	sess.Values["scope_tier"] = tier
	if err := sess.Save(r, w); err != nil {
		callbackError(w, err.Error())
		return
	}

	slog.Info("login successful", "did", sessData.AccountDID.String())
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprint(w, `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body><script>window.close();</script></body></html>`)
}

func callbackError(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusBadRequest)
	fmt.Fprintf(w, `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="font-family:system-ui;padding:2rem"><p style="color:#c0392b">Login failed: %s</p><button onclick="window.close()">Close</button></body></html>`, html.EscapeString(message))
}

func (s *Server) Logout(w http.ResponseWriter, r *http.Request) {
	did, sessionID, _ := s.currentSessionDID(r)
	if did != nil {
		if err := s.OAuth.Logout(r.Context(), *did, sessionID); err != nil {
			slog.Error("failed to delete session", "did", did, "err", err)
		}
	}

	sess, _ := s.CookieStore.Get(r, "bsky-api-session")
	sess.Values = make(map[any]any)
	if err := sess.Save(r, w); err != nil {
		jsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	slog.Info("logged out")
	jsonOK(w, map[string]string{"status": "logged out"})
}

func (s *Server) Me(w http.ResponseWriter, r *http.Request) {
	did, _, handle := s.currentSessionDID(r)
	if did == nil {
		jsonError(w, "not authenticated", http.StatusUnauthorized)
		return
	}
	sess, _ := s.CookieStore.Get(r, "bsky-api-session")
	tier, _ := sess.Values["scope_tier"].(string)
	if tier == "" {
		tier = scopeTierComment
	}
	jsonOK(w, map[string]string{"did": did.String(), "handle": handle, "scopeTier": tier})
}
