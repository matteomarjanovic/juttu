package main

import (
	"context"
	_ "embed"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"

	_ "github.com/joho/godotenv/autoload"

	"github.com/bluesky-social/indigo/atproto/atcrypto"
	"github.com/bluesky-social/indigo/atproto/auth/oauth"
	"github.com/bluesky-social/indigo/atproto/identity"
	"github.com/bluesky-social/indigo/atproto/syntax"

	"github.com/gorilla/sessions"
	"github.com/urfave/cli/v3"
)

//go:embed index.html
var indexHTML []byte

//go:embed login.html
var loginHTML []byte

func main() {
	app := cli.Command{
		Name:   "bsky-api-service",
		Usage:  "Bluesky API service wrapping ATProto OAuth",
		Action: runServer,
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:     "session-secret",
				Usage:    "random string/token used for session cookie security",
				Required: true,
				Sources:  cli.EnvVars("SESSION_SECRET"),
			},
			&cli.StringFlag{
				Name:    "hostname",
				Usage:   "public host name for this client (if not localhost dev mode)",
				Sources: cli.EnvVars("CLIENT_HOSTNAME"),
			},
			&cli.StringFlag{
				Name:    "client-secret-key",
				Usage:   "confidential client secret key. should be P-256 private key in multibase encoding",
				Sources: cli.EnvVars("CLIENT_SECRET_KEY"),
			},
			&cli.StringFlag{
				Name:    "client-secret-key-id",
				Usage:   "key id for client-secret-key",
				Value:   "primary",
				Sources: cli.EnvVars("CLIENT_SECRET_KEY_ID"),
			},
			&cli.StringFlag{
				Name:     "redis-url",
				Usage:    "Redis connection URL",
				Required: true,
				Sources:  cli.EnvVars("REDIS_URL"),
			},
			&cli.BoolFlag{
				Name:    "development",
				Usage:   "serve the HTML test UI at /",
				Value:   false,
				Sources: cli.EnvVars("DEVELOPMENT"),
			},
		},
	}
	h := slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{Level: slog.LevelDebug})
	slog.SetDefault(slog.New(h))
	if err := app.Run(context.Background(), os.Args); err != nil {
		fmt.Printf("error: %s", err)
	}
}

type Server struct {
	CookieStore *sessions.CookieStore
	Dir         identity.Directory
	OAuth       *oauth.ClientApp
}

func runServer(ctx context.Context, cmd *cli.Command) error {
	scopes := []string{
		"atproto",
		"repo:app.bsky.feed.post?action=create",
		"repo:app.bsky.feed.post?action=delete",
		"repo:app.bsky.feed.like?action=create",
		"repo:app.bsky.feed.like?action=delete",
		"repo:app.bsky.feed.repost?action=create",
		"repo:app.bsky.feed.repost?action=delete",
		"repo:site.standard.document?action=create",
		"repo:site.standard.document?action=update",
		"rpc:app.bsky.feed.getPostThread?aud=did:web:api.bsky.app#bsky_appview",
	}
	bind := ":8080"

	var config oauth.ClientConfig
	hostname := cmd.String("hostname")
	if hostname == "" {
		config = oauth.NewLocalhostConfig(
			fmt.Sprintf("http://127.0.0.1%s/oauth/callback", bind),
			scopes,
		)
		slog.Info("configuring localhost OAuth client", "CallbackURL", config.CallbackURL)
	} else {
		config = oauth.NewPublicConfig(
			fmt.Sprintf("https://%s/oauth-client-metadata.json", hostname),
			fmt.Sprintf("https://%s/oauth/callback", hostname),
			scopes,
		)
	}

	if cmd.String("client-secret-key") != "" && hostname != "" {
		priv, err := atcrypto.ParsePrivateMultibase(cmd.String("client-secret-key"))
		if err != nil {
			return err
		}
		if err := config.SetClientSecret(priv, cmd.String("client-secret-key-id")); err != nil {
			return err
		}
		slog.Info("configuring confidential OAuth client")
	}

	store, err := NewRedisStore(&RedisStoreConfig{
		RedisURL:                  cmd.String("redis-url"),
		SessionExpiryDuration:     time.Hour * 24 * 90,
		SessionInactivityDuration: time.Hour * 24 * 14,
		AuthRequestExpiryDuration: time.Minute * 30,
	})
	if err != nil {
		return err
	}
	defer store.Close()

	oauthClient := oauth.NewClientApp(&config, store)

	cookieStore := sessions.NewCookieStore([]byte(cmd.String("session-secret")))
	if hostname != "" {
		// Production: cross-origin cookies require SameSite=None + Secure (HTTPS only)
		cookieStore.Options = &sessions.Options{
			Path:     "/",
			HttpOnly: true,
			Secure:   true,
			SameSite: http.SameSiteNoneMode,
		}
	} else {
		// Development: SameSite=Lax, no Secure (plain HTTP)
		cookieStore.Options = &sessions.Options{
			Path:     "/",
			HttpOnly: true,
			Secure:   false,
			SameSite: http.SameSiteLaxMode,
		}
	}

	srv := Server{
		CookieStore: cookieStore,
		Dir:         identity.DefaultDirectory(),
		OAuth:       oauthClient,
	}

	mux := http.NewServeMux()

	if cmd.Bool("development") {
		slog.Info("development mode: serving HTML UI at /")
		mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "text/html; charset=utf-8")
			w.Write(indexHTML)
		})
	}

	mux.HandleFunc("GET /login", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write(loginHTML)
	})

	mux.HandleFunc("GET /oauth-client-metadata.json", srv.ClientMetadata)
	mux.HandleFunc("GET /oauth/jwks.json", srv.JWKS)
	mux.HandleFunc("GET /oauth/callback", srv.OAuthCallback)

	mux.HandleFunc("POST /auth/login", srv.Login)
	mux.HandleFunc("POST /auth/logout", srv.Logout)
	mux.HandleFunc("GET /auth/me", srv.Me)

	mux.HandleFunc("POST /bsky/post", srv.CreatePost)
	mux.HandleFunc("DELETE /bsky/post", srv.DeletePost)
	mux.HandleFunc("POST /bsky/like", srv.CreateLike)
	mux.HandleFunc("DELETE /bsky/like", srv.DeleteLike)
	mux.HandleFunc("POST /bsky/repost", srv.CreateRepost)
	mux.HandleFunc("DELETE /bsky/repost", srv.DeleteRepost)

	mux.HandleFunc("GET /bsky/thread", srv.GetThread)

	mux.HandleFunc("PUT /atproto/document", srv.PutDocument)

	slog.Info("starting http server", "bind", bind)
	if err := http.ListenAndServe(bind, corsMiddleware(mux)); err != nil {
		slog.Error("http shutdown", "err", err)
	}
	return nil
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) currentSessionDID(r *http.Request) (*syntax.DID, string, string) {
	sess, _ := s.CookieStore.Get(r, "bsky-api-session")
	accountDID, ok := sess.Values["account_did"].(string)
	if !ok || accountDID == "" {
		return nil, "", ""
	}
	did, err := syntax.ParseDID(accountDID)
	if err != nil {
		return nil, "", ""
	}
	sessionID, ok := sess.Values["session_id"].(string)
	if !ok || sessionID == "" {
		return nil, "", ""
	}
	handle, ok := sess.Values["handle"].(string)
	if !ok || handle == "" {
		return nil, "", ""
	}
	return &did, sessionID, handle
}
