package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"regexp"
	"sort"
	"strings"
	"sync"
)

var hashtagRegex = regexp.MustCompile(`#[\p{L}\p{N}_\-]+`)
var urlRegex = regexp.MustCompile(`https?://[^\s\x00-\x1f<>"]+`)
var plainDomainRegex = regexp.MustCompile(`(?:^|[\s(])((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?:/[^\s\x00-\x1f<>"]*)?)`)
var mentionRegex = regexp.MustCompile(`@([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+)`)
var trailingPunct = regexp.MustCompile(`[.,;!?)\]]+$`)
var tldRegex = regexp.MustCompile(`^[a-zA-Z]{2,}$`)

func hasValidTld(uri string) bool {
	domain := uri
	if i := strings.IndexByte(uri, '/'); i >= 0 {
		domain = uri[:i]
	}
	parts := strings.Split(domain, ".")
	return len(parts) >= 2 && tldRegex.MatchString(parts[len(parts)-1])
}

type facetHit struct {
	byteStart int
	byteEnd   int
	facet     map[string]any
}

func parseFacets(ctx context.Context, text string) []map[string]any {
	var hits []facetHit

	// Hashtags
	for _, match := range hashtagRegex.FindAllStringIndex(text, -1) {
		tag := text[match[0]+1 : match[1]]
		stripped := trailingPunct.ReplaceAllString(tag, "")
		if stripped == "" {
			continue
		}
		end := match[0] + 1 + len(stripped)
		hits = append(hits, facetHit{
			byteStart: match[0],
			byteEnd:   end,
			facet: map[string]any{
				"index":    map[string]any{"byteStart": match[0], "byteEnd": end},
				"features": []map[string]any{{"$type": "app.bsky.richtext.facet#tag", "tag": stripped}},
			},
		})
	}

	// https?:// URLs
	for _, match := range urlRegex.FindAllStringIndex(text, -1) {
		rawURL := text[match[0]:match[1]]
		stripped := trailingPunct.ReplaceAllString(rawURL, "")
		if stripped == "" {
			continue
		}
		end := match[0] + len(stripped)
		hits = append(hits, facetHit{
			byteStart: match[0],
			byteEnd:   end,
			facet: map[string]any{
				"index":    map[string]any{"byteStart": match[0], "byteEnd": end},
				"features": []map[string]any{{"$type": "app.bsky.richtext.facet#link", "uri": stripped}},
			},
		})
	}

	// Plain domain URLs (e.g. example.com) — de-overlap handled later
	for _, match := range plainDomainRegex.FindAllStringSubmatchIndex(text, -1) {
		if len(match) < 4 {
			continue
		}
		// match[2]:match[3] is the domain URL (capture group 1, without leading whitespace)
		rawURL := text[match[2]:match[3]]
		stripped := trailingPunct.ReplaceAllString(rawURL, "")
		if stripped == "" || !hasValidTld(stripped) {
			continue
		}
		byteStart := match[2]
		byteEnd := byteStart + len(stripped)
		hits = append(hits, facetHit{
			byteStart: byteStart,
			byteEnd:   byteEnd,
			facet: map[string]any{
				"index":    map[string]any{"byteStart": byteStart, "byteEnd": byteEnd},
				"features": []map[string]any{{"$type": "app.bsky.richtext.facet#link", "uri": "https://" + stripped}},
			},
		})
	}

	// Mentions — collect, then resolve concurrently
	type mentionInfo struct {
		byteStart int
		byteEnd   int
		handle    string
	}
	var mentions []mentionInfo
	for _, match := range mentionRegex.FindAllStringSubmatchIndex(text, -1) {
		atPos := match[0]
		if atPos > 0 {
			prev := text[atPos-1]
			if prev != ' ' && prev != '\t' && prev != '\n' && prev != '\r' && prev != '(' {
				continue
			}
		}
		handle := text[match[2]:match[3]]
		byteEnd := match[0] + 1 + len(handle) // +1 for '@'
		mentions = append(mentions, mentionInfo{byteStart: atPos, byteEnd: byteEnd, handle: handle})
	}

	type resolvedMention struct {
		byteStart int
		byteEnd   int
		did       string
	}
	resolvedSlice := make([]resolvedMention, len(mentions))
	var wg sync.WaitGroup
	var mu sync.Mutex
	for i, m := range mentions {
		wg.Add(1)
		go func(idx int, info mentionInfo) {
			defer wg.Done()
			did, err := resolveHandle(ctx, info.handle)
			if err != nil {
				return
			}
			mu.Lock()
			resolvedSlice[idx] = resolvedMention{byteStart: info.byteStart, byteEnd: info.byteEnd, did: did}
			mu.Unlock()
		}(i, m)
	}
	wg.Wait()

	for _, r := range resolvedSlice {
		if r.did == "" {
			continue
		}
		hits = append(hits, facetHit{
			byteStart: r.byteStart,
			byteEnd:   r.byteEnd,
			facet: map[string]any{
				"index":    map[string]any{"byteStart": r.byteStart, "byteEnd": r.byteEnd},
				"features": []map[string]any{{"$type": "app.bsky.richtext.facet#mention", "did": r.did}},
			},
		})
	}

	// Sort by byteStart and de-overlap
	sort.Slice(hits, func(i, j int) bool {
		return hits[i].byteStart < hits[j].byteStart
	})

	var result []map[string]any
	lastEnd := 0
	for _, hit := range hits {
		if hit.byteStart < lastEnd {
			continue
		}
		result = append(result, hit.facet)
		lastEnd = hit.byteEnd
	}

	return result
}

func resolveHandle(ctx context.Context, handle string) (string, error) {
	reqURL := "https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=" + url.QueryEscape(handle)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL, nil)
	if err != nil {
		return "", err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("resolve handle %q: status %d", handle, resp.StatusCode)
	}
	var result struct {
		DID string `json:"did"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}
	if result.DID == "" {
		return "", fmt.Errorf("resolve handle %q: empty DID", handle)
	}
	return result.DID, nil
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
