package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func (s *Server) PutDocument(w http.ResponseWriter, r *http.Request) {
	s.putRecord(w, r, "site.standard.document")
}

func (s *Server) PutPublication(w http.ResponseWriter, r *http.Request) {
	s.putRecord(w, r, "site.standard.publication")
}

func (s *Server) putRecord(w http.ResponseWriter, r *http.Request, collection string) {
	ctx := r.Context()

	did, c, err := s.requireSession(r)
	if err != nil {
		jsonError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req struct {
		Rkey   string          `json:"rkey"`
		Record json.RawMessage `json:"record"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	if req.Rkey == "" {
		jsonError(w, "rkey is required", http.StatusBadRequest)
		return
	}
	if len(req.Record) == 0 {
		jsonError(w, "record is required", http.StatusBadRequest)
		return
	}

	body := map[string]any{
		"repo":       did.String(),
		"collection": collection,
		"rkey":       req.Rkey,
		"record":     req.Record,
	}
	var resp map[string]any
	if err := c.Post(ctx, "com.atproto.repo.putRecord", body, &resp); err != nil {
		jsonError(w, fmt.Sprintf("put record failed: %s", err), http.StatusInternalServerError)
		return
	}

	jsonOK(w, map[string]any{"uri": resp["uri"], "cid": resp["cid"]})
}
