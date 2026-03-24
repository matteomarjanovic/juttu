package main

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
)

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
		Handle string `json:"handle"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}

	handle, _ := strings.CutPrefix(req.Handle, "@")
	if handle == "" {
		jsonError(w, "handle is required", http.StatusBadRequest)
		return
	}

	slog.Info("Login", "client_id", s.OAuth.Config.ClientID, "callback_url", s.OAuth.Config.CallbackURL)

	redirectURL, err := s.OAuth.StartAuthFlow(ctx, handle)
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
		jsonError(w, fmt.Sprintf("failed processing oauth callback: %s", err), http.StatusBadRequest)
		return
	}

	oauthSess, err := s.OAuth.ResumeSession(ctx, sessData.AccountDID, sessData.SessionID)
	if err != nil {
		jsonError(w, "not authenticated", http.StatusUnauthorized)
		return
	}
	c := oauthSess.APIClient()

	var resp struct {
		Handle string `json:"handle"`
	}
	if err := c.Get(ctx, "com.atproto.server.getSession", nil, &resp); err != nil {
		jsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess, _ := s.CookieStore.Get(r, "bsky-api-session")
	sess.Values["account_did"] = sessData.AccountDID.String()
	sess.Values["session_id"] = sessData.SessionID
	sess.Values["handle"] = resp.Handle
	if err := sess.Save(r, w); err != nil {
		jsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}

	slog.Info("login successful", "did", sessData.AccountDID.String())
	jsonOK(w, map[string]string{"did": sessData.AccountDID.String(), "handle": resp.Handle})
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
	jsonOK(w, map[string]string{"did": did.String(), "handle": handle})
}
