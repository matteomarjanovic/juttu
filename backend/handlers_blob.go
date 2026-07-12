package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// coverImage blobs must stay under 1MB per the site.standard.document lexicon.
const maxCoverImageSize = 1_000_000

// blobFetchClient downloads candidate cover images. Its dialer refuses to connect to
// loopback/private/link-local addresses so this endpoint can't be used as an SSRF proxy
// against internal services — the target URL comes from the page's og:image meta tag, which
// an attacker-controlled site could set to anything.
var blobFetchClient = &http.Client{
	Timeout:   10 * time.Second,
	Transport: &http.Transport{DialContext: dialPublicOnly},
}

func dialPublicOnly(ctx context.Context, network, addr string) (net.Conn, error) {
	host, port, err := net.SplitHostPort(addr)
	if err != nil {
		return nil, err
	}
	ips, err := net.DefaultResolver.LookupIPAddr(ctx, host)
	if err != nil {
		return nil, err
	}
	for _, ip := range ips {
		if ip.IP.IsLoopback() || ip.IP.IsPrivate() || ip.IP.IsLinkLocalUnicast() || ip.IP.IsLinkLocalMulticast() || ip.IP.IsUnspecified() {
			return nil, fmt.Errorf("refusing to fetch from non-public address: %s", ip.IP)
		}
	}
	dialer := net.Dialer{Timeout: 10 * time.Second}
	return dialer.DialContext(ctx, network, net.JoinHostPort(ips[0].IP.String(), port))
}

// UploadBlob fetches an image by URL and uploads it as a blob to the authenticated user's
// PDS, returning the blob reference for embedding in a record (e.g. a document's coverImage).
func (s *Server) UploadBlob(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	_, c, err := s.requireSession(r)
	if err != nil {
		jsonError(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var req struct {
		URL string `json:"url"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "invalid request body", http.StatusBadRequest)
		return
	}
	u, err := url.Parse(req.URL)
	if err != nil || (u.Scheme != "http" && u.Scheme != "https") || u.Host == "" {
		jsonError(w, "url must be an absolute http(s) URL", http.StatusBadRequest)
		return
	}

	imgReq, err := http.NewRequestWithContext(ctx, http.MethodGet, u.String(), nil)
	if err != nil {
		jsonError(w, "invalid url", http.StatusBadRequest)
		return
	}
	resp, err := blobFetchClient.Do(imgReq)
	if err != nil {
		jsonError(w, fmt.Sprintf("fetching image failed: %s", err), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		jsonError(w, fmt.Sprintf("fetching image failed: status %d", resp.StatusCode), http.StatusBadGateway)
		return
	}

	data, err := io.ReadAll(io.LimitReader(resp.Body, maxCoverImageSize+1))
	if err != nil {
		jsonError(w, "reading image failed", http.StatusBadGateway)
		return
	}
	if len(data) > maxCoverImageSize {
		jsonError(w, "image exceeds 1MB limit", http.StatusRequestEntityTooLarge)
		return
	}

	contentType := http.DetectContentType(data)
	if !strings.HasPrefix(contentType, "image/") {
		jsonError(w, "url does not point to an image", http.StatusBadRequest)
		return
	}

	var uploadResp struct {
		Blob json.RawMessage `json:"blob"`
	}
	if err := c.LexDo(ctx, http.MethodPost, contentType, "com.atproto.repo.uploadBlob", nil, bytes.NewReader(data), &uploadResp); err != nil {
		jsonError(w, fmt.Sprintf("blob upload failed: %s", err), http.StatusInternalServerError)
		return
	}

	jsonOK(w, uploadResp.Blob)
}
