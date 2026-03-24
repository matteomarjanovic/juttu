package main

import (
	"encoding/json"
	"net/http"
	"regexp"
)

var hashtagRegex = regexp.MustCompile(`#[\p{L}\p{N}_\-]+`) // Allow Unicode letters + Unicode numbers

// TODO: support more than just hashtags!
func parseFacets(text string) []map[string]any {
	var res []map[string]any
	for _, match := range hashtagRegex.FindAllStringSubmatchIndex(text, -1) {
		res = append(res, map[string]any{
			"index": map[string]any{
				"byteStart": match[0],
				"byteEnd":   match[1],
			},
			"features": []map[string]any{
				{
					"$type": "app.bsky.richtext.facet#tag",
					"tag":   text[match[0]+1 : match[1]],
				},
			},
		})
	}
	return res
}

func jsonError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

func jsonOK(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func strPtr(s string) *string {
	return &s
}
