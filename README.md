![Juttu logo](assets/juttu_logo.png)

# Juttu

Juttu is an open-source Bluesky-powered comment widget. Add a comment section to any article with three lines of HTML — comments are backed by Bluesky threads.

## How it works

- Each embedded widget links an article to a root Bluesky post via the [`site.standard.document`](https://standard.site) AT Protocol lexicon from [standard.site](https://standard.site).
- Comments are the replies to that Bluesky post, fetched via the Bluesky API.
- Visitors can log in with their Bluesky account directly inside the widget to like, repost, or reply.

## Installation

Add the following to your page. The `<link>` and `<script>` tags go in `<head>`; the `<div>` goes in `<body>` where you want comments to appear:

```html
<!-- in <head> -->
<link rel="site.standard.document" href="at://did:plc:abc123/site.standard.document/my-article-slug" />
<script defer src="https://juttu.app/embed/juttu-embed.min.js" data-theme="auto"></script>

<!-- in <body>, where you want comments -->
<div id="juttu-comments"></div>
```

The AT URI (`at://…`) identifies your article using the `site.standard.document` standard. Replace `did:plc:abc123` with your Bluesky DID and `my-article-slug` with a stable, unique slug for the article (letters, digits, `.`, `_`, `~`, `-`, up to 512 chars).

To find your DID: go to [this docs page](https://docs.bsky.app/getting-started/installation/#get-your-did).

The comment section resizes itself dynamically — no fixed height needed. On first load, you'll be prompted to log in with your Bluesky account to link the article to a Bluesky post — that post's reply thread becomes the comment section.

`data-theme` accepts `light`, `dark`, or `auto` (follows the visitor's system preference).

## Self-hosting

Run your own instance if you prefer not to use the hosted service.

### Docker (recommended)

A pre-built image requires no code changes — just set `PUBLIC_HOSTNAME` to your domain:

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

To build the image yourself:

```sh
docker build -t juttu ./juttu
docker run -d -e PUBLIC_HOSTNAME=comments.example.com -p 3000:3000 juttu
```

Then point your embed snippet at your own domain instead of `juttu.app`.

### Manual deploy

Deploy it like any SvelteKit (`adapter-node`) app:

1. Set `PUBLIC_HOSTNAME` to your own domain.
2. Set `ORIGIN` to `https://<your-domain>` (required by `adapter-node`).
3. Run `npm run build` then `node build`.
4. Optionally set `PUBLIC_ANALYTICS_ENDPOINT` if you want usage tracking sent to your own server.

## Development

### Prerequisites

- Node.js 20+

### Setup

```sh
cd juttu && npm install
```

Create `juttu/.env`:

```
PUBLIC_HOSTNAME=yourapp.example.com
```

`PUBLIC_HOSTNAME` is required (without `https://`). It is used to construct OAuth redirect URIs, postMessage origins, and the OAuth client metadata served at `/oauth-client-metadata.json`.

### Commands

```sh
npm run dev          # Start dev server (runs prebuild scripts first)
npm run build        # Production build (runs prebuild scripts first)
npm run check        # TypeScript type-check
npm run lint         # Prettier + ESLint
npm run format       # Auto-format
npm test             # Run tests
npm run test:watch   # Tests in watch mode
```

## Telemetry

Juttu includes optional, minimal telemetry to help the hosted service operator understand usage. It is **disabled by default** and opt-in for self-hosters.

### Enabling telemetry

Set `PUBLIC_ANALYTICS_ENDPOINT` in your `.env` to the URL of an HTTP endpoint that accepts `POST` requests with a JSON body:

```
PUBLIC_ANALYTICS_ENDPOINT=https://your-analytics-server.example.com/event
```

If the variable is absent, no data is ever sent — there is no default endpoint and no fallback.

### What is collected

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

`userHandle` is the handle of the **site owner** who embedded the widget (from the widget URL `/comments/{atPath}`). It is never the handle of individual commenters.

Requests are fire-and-forget — they never block the UI and errors are silently ignored.

### Opting out (self-hosters)

Do not set `PUBLIC_ANALYTICS_ENDPOINT`. If the variable is absent, no analytics code runs.

## License

AGPL-3.0 License. See [LICENSE](LICENSE).
