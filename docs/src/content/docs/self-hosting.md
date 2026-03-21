---
title: Self-Hosting
description: Run your own Juttu instance with Docker or Node.js.
---

## Requirements

One environment variable is required:

- **`PUBLIC_HOSTNAME`** — your domain, without `https://` (e.g. `comments.example.com`)

This value is read at runtime and used to construct OAuth redirect URIs and the OAuth client metadata served at `/oauth-client-metadata.json`.

## Docker (recommended)

A pre-built image is available on the GitHub Container Registry:

```sh
docker run -d \
  -e PUBLIC_HOSTNAME=comments.example.com \
  -p 3000:3000 \
  ghcr.io/matteomarjanovic/juttu:latest
```

`ORIGIN` is automatically derived as `https://$PUBLIC_HOSTNAME`. To override it explicitly:

```sh
docker run -d \
  -e PUBLIC_HOSTNAME=comments.example.com \
  -e ORIGIN=https://comments.example.com \
  -p 3000:3000 \
  ghcr.io/matteomarjanovic/juttu:latest
```

### Building from source

To build the image yourself instead of pulling the pre-built one:

```sh
docker build -t juttu ./juttu
docker run -d -e PUBLIC_HOSTNAME=comments.example.com -p 3000:3000 juttu
```

## Manual deploy

Deploy it like any SvelteKit `adapter-node` app:

1. Clone the repository.
2. Create `juttu/.env` and set `PUBLIC_HOSTNAME`:
   ```
   PUBLIC_HOSTNAME=comments.example.com
   ```
3. Install dependencies and build:
   ```sh
   cd juttu && npm install && npm run build
   ```
4. Start the server:
   ```sh
   node build
   ```

Set `ORIGIN=https://<your-domain>` if `adapter-node` complains about cross-origin requests.

### Pointing the embed at your instance

After deploying, update your embed snippet to point at your own domain instead of `juttu.app`:

```html
<script
  defer
  src="https://comments.example.com/embed/juttu-embed.min.js"
  data-bsky-user-handle="your-handle.bsky.social"
  data-article-id="your-article-slug"
></script>
```

## Telemetry

Juttu includes optional, minimal telemetry. It is **disabled by default** — no data is ever sent unless you explicitly configure an endpoint.

To enable it, set `PUBLIC_ANALYTICS_ENDPOINT` to the URL of an HTTP endpoint that accepts `POST` requests with a JSON body:

```
PUBLIC_ANALYTICS_ENDPOINT=https://your-analytics-server.example.com/event
```

To opt out entirely: do not set `PUBLIC_ANALYTICS_ENDPOINT`. If the variable is absent, no analytics code runs.

### Events collected

| Event | Trigger |
|-------|---------|
| `page_view` | Widget iframe is loaded |
| `like` | A user likes a comment |
| `unlike` | A user removes a like |
| `repost` | A user reposts a comment |
| `unrepost` | A user removes a repost |
| `reply` | A user posts a reply or root comment |

Each request body:

```json
{
  "event": "page_view",
  "userHandle": "site-owner.bsky.social",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

`userHandle` is the handle of the **site owner** who embedded the widget. It is never the handle of individual commenters.

Requests are fire-and-forget — they never block the UI and errors are silently ignored.
