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
<script defer src="https://cdn.jsdelivr.net/npm/juttu@latest/juttu-embed.js" data-theme="auto"></script>

<!-- in <body>, where you want comments -->
<div id="juttu-comments"></div>
```

The AT URI (`at://…`) identifies your article using the `site.standard.document` standard. Replace `did:plc:abc123` with your Bluesky DID and `my-article-slug` with a stable, unique slug for the article (letters, digits, `.`, `_`, `~`, `-`, up to 512 chars).

To find your DID: go to [this docs page](https://docs.bsky.app/getting-started/installation/#get-your-did).

The comment section resizes itself dynamically — no fixed height needed. On first load, you'll be prompted to log in with your Bluesky account to link the article to a Bluesky post — that post's reply thread becomes the comment section.

### Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-theme` | `auto` | `light`, `dark`, or `auto` (follows the site's color scheme) |
| `data-api-url` | `https://api.juttu.app` | API backend URL (override when self-hosting) |

## Self-hosting

Run your own instance with Docker Compose. The backend serves both the API and the embed script.

### Requirements

Create a `.env` file with:

```
SESSION_SECRET=your-random-secret
CLIENT_HOSTNAME=comments.example.com
CLIENT_SECRET_KEY=your-p256-private-key-in-multibase
```

`SESSION_SECRET` is a random string for cookie signing. `CLIENT_HOSTNAME` is your public domain (without `https://`). `CLIENT_SECRET_KEY` is a P-256 private key in multibase encoding for confidential OAuth.

### Docker Compose

```yaml
services:
  app:
    image: ghcr.io/matteomarjanovic/juttu:latest
    ports:
      - "8080:8080"
    env_file:
      - .env
    environment:
      REDIS_URL: redis://redis:6379/0
    depends_on:
      redis:
        condition: service_healthy
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

volumes:
  redis_data:
```

Then update your embed snippet to point at your own domain:

```html
<script defer src="https://comments.example.com/embed/juttu-embed.js"
  data-api-url="https://comments.example.com"
  data-theme="auto"></script>
```

### Building from source

```sh
docker build -t juttu .
```

## Development

### Backend

Requires Go 1.25+ and a running Redis instance.

Build the embed script first, then run the server:

```sh
cd embed && npm install && node minify.js && cp juttu-embed.js ../backend/
cd ../backend && go run . --development
```

The `--development` flag serves a test UI at `/`. You'll need a `.env` file in `backend/` with at least:

```
SESSION_SECRET=dev-secret
REDIS_URL=redis://localhost:6379/0
```

### Embed script

```sh
cd embed && npm install && node minify.js
```

Bundles `juttu-embed.ts` into a single minified IIFE at `juttu-embed.js`.

## License

AGPL-3.0 License. See [LICENSE](LICENSE).
