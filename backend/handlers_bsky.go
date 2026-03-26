package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/bluesky-social/indigo/atproto/atclient"
	"github.com/bluesky-social/indigo/atproto/syntax"
)

type threadPostViewer struct {
	Like   string `json:"like"`
	Repost string `json:"repost"`
}

type threadPost struct {
	URI    string            `json:"uri"`
	Viewer *threadPostViewer `json:"viewer"`
}

type threadViewPost struct {
	Post    threadPost       `json:"post"`
	Replies []threadViewPost `json:"replies"`
}

type getPostThreadResponse struct {
	Thread threadViewPost `json:"thread"`
}

func extractViewerStates(node threadViewPost, out map[string]map[string]string) {
	if node.Post.URI != "" && node.Post.Viewer != nil {
		entry := map[string]string{}
		if node.Post.Viewer.Like != "" {
			entry["likeUri"] = node.Post.Viewer.Like
		}
		if node.Post.Viewer.Repost != "" {
			entry["repostUri"] = node.Post.Viewer.Repost
		}
		if len(entry) > 0 {
			out[node.Post.URI] = entry
		}
	}
	for _, reply := range node.Replies {
		extractViewerStates(reply, out)
	}
}

func (s *Server) GetThread(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	_, c, err := s.requireSession(r)
	if err != nil {
		jsonError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	uri := r.URL.Query().Get("uri")
	if uri == "" {
		jsonError(w, "uri is required", http.StatusBadRequest)
		return
	}

	proxy := c.WithService("did:web:api.bsky.app#bsky_appview")
	var resp getPostThreadResponse
	if err := proxy.Get(ctx, "app.bsky.feed.getPostThread", map[string]any{
		"uri":          uri,
		"depth":        10,
		"parentHeight": 0,
	}, &resp); err != nil {
		jsonError(w, fmt.Sprintf("getPostThread failed: %s", err), http.StatusInternalServerError)
		return
	}

	states := map[string]map[string]string{}
	extractViewerStates(resp.Thread, states)
	jsonOK(w, map[string]any{"states": states})
}

func (s *Server) requireSession(r *http.Request) (*syntax.DID, *atclient.APIClient, error) {
	did, sessionID, _ := s.currentSessionDID(r)
	if did == nil {
		return nil, nil, fmt.Errorf("not authenticated")
	}
	oauthSess, err := s.OAuth.ResumeSession(r.Context(), *did, sessionID)
	if err != nil {
		return nil, nil, err
	}
	return did, oauthSess.APIClient(), nil
}

type replyRef struct {
	URI string `json:"uri"`
	CID string `json:"cid"`
}

type replyRefs struct {
	Root   replyRef `json:"root"`
	Parent replyRef `json:"parent"`
}

func (s *Server) CreatePost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	did, c, err := s.requireSession(r)
	if err != nil {
		jsonError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req struct {
		Text  string     `json:"text"`
		Reply *replyRefs `json:"reply,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.Text == "" {
		jsonError(w, "text is required", http.StatusBadRequest)
		return
	}

	record := map[string]any{
		"$type":     "app.bsky.feed.post",
		"text":      req.Text,
		"createdAt": time.Now().UTC().Format(time.RFC3339),
	}
	if facets := parseFacets(ctx, req.Text); facets != nil {
		record["facets"] = facets
	}
	if req.Reply != nil {
		record["reply"] = map[string]any{
			"root":   map[string]any{"uri": req.Reply.Root.URI, "cid": req.Reply.Root.CID},
			"parent": map[string]any{"uri": req.Reply.Parent.URI, "cid": req.Reply.Parent.CID},
		}
	}
	body := map[string]any{
		"repo":       did.String(),
		"collection": "app.bsky.feed.post",
		"record":     record,
	}
	var resp map[string]any
	if err := c.Post(ctx, "com.atproto.repo.createRecord", body, &resp); err != nil {
		jsonError(w, fmt.Sprintf("posting failed: %s", err), http.StatusInternalServerError)
		return
	}

	jsonOK(w, map[string]any{"uri": resp["uri"], "cid": resp["cid"]})
}

func (s *Server) DeletePost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	did, c, err := s.requireSession(r)
	if err != nil {
		jsonError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req struct {
		Rkey string `json:"rkey"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.Rkey == "" {
		jsonError(w, "rkey is required", http.StatusBadRequest)
		return
	}

	body := map[string]any{
		"repo":       did.String(),
		"collection": "app.bsky.feed.post",
		"rkey":       req.Rkey,
	}
	if err := c.Post(ctx, "com.atproto.repo.deleteRecord", body, nil); err != nil {
		jsonError(w, fmt.Sprintf("delete failed: %s", err), http.StatusInternalServerError)
		return
	}

	jsonOK(w, map[string]string{"status": "deleted"})
}

func (s *Server) CreateLike(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	did, c, err := s.requireSession(r)
	if err != nil {
		jsonError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req struct {
		URI string `json:"uri"`
		CID string `json:"cid"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.URI == "" || req.CID == "" {
		jsonError(w, "uri and cid are required", http.StatusBadRequest)
		return
	}

	body := map[string]any{
		"repo":       did.String(),
		"collection": "app.bsky.feed.like",
		"record": map[string]any{
			"$type":     "app.bsky.feed.like",
			"subject":   map[string]any{"uri": req.URI, "cid": req.CID},
			"createdAt": time.Now().UTC().Format(time.RFC3339),
		},
	}
	var resp map[string]any
	if err := c.Post(ctx, "com.atproto.repo.createRecord", body, &resp); err != nil {
		jsonError(w, fmt.Sprintf("like failed: %s", err), http.StatusInternalServerError)
		return
	}

	jsonOK(w, map[string]any{"uri": resp["uri"], "cid": resp["cid"]})
}

func (s *Server) DeleteLike(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	did, c, err := s.requireSession(r)
	if err != nil {
		jsonError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req struct {
		Rkey string `json:"rkey"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.Rkey == "" {
		jsonError(w, "rkey is required", http.StatusBadRequest)
		return
	}

	body := map[string]any{
		"repo":       did.String(),
		"collection": "app.bsky.feed.like",
		"rkey":       req.Rkey,
	}
	if err := c.Post(ctx, "com.atproto.repo.deleteRecord", body, nil); err != nil {
		jsonError(w, fmt.Sprintf("delete like failed: %s", err), http.StatusInternalServerError)
		return
	}

	jsonOK(w, map[string]string{"status": "deleted"})
}

func (s *Server) CreateRepost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	did, c, err := s.requireSession(r)
	if err != nil {
		jsonError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req struct {
		URI string `json:"uri"`
		CID string `json:"cid"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.URI == "" || req.CID == "" {
		jsonError(w, "uri and cid are required", http.StatusBadRequest)
		return
	}

	body := map[string]any{
		"repo":       did.String(),
		"collection": "app.bsky.feed.repost",
		"record": map[string]any{
			"$type":     "app.bsky.feed.repost",
			"subject":   map[string]any{"uri": req.URI, "cid": req.CID},
			"createdAt": time.Now().UTC().Format(time.RFC3339),
		},
	}
	var resp map[string]any
	if err := c.Post(ctx, "com.atproto.repo.createRecord", body, &resp); err != nil {
		jsonError(w, fmt.Sprintf("repost failed: %s", err), http.StatusInternalServerError)
		return
	}

	jsonOK(w, map[string]any{"uri": resp["uri"], "cid": resp["cid"]})
}

func (s *Server) DeleteRepost(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	did, c, err := s.requireSession(r)
	if err != nil {
		jsonError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req struct {
		Rkey string `json:"rkey"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.Rkey == "" {
		jsonError(w, "rkey is required", http.StatusBadRequest)
		return
	}

	body := map[string]any{
		"repo":       did.String(),
		"collection": "app.bsky.feed.repost",
		"rkey":       req.Rkey,
	}
	if err := c.Post(ctx, "com.atproto.repo.deleteRecord", body, nil); err != nil {
		jsonError(w, fmt.Sprintf("delete repost failed: %s", err), http.StatusInternalServerError)
		return
	}

	jsonOK(w, map[string]string{"status": "deleted"})
}
