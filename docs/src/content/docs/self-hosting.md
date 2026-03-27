---
title: Self-Hosting
description: Run your own Juttu instance with Docker Compose.
---

## Requirements

The backend needs the following environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `SESSION_SECRET` | Yes | Random string for cookie signing |
| `REDIS_URL` | Yes | Redis connection URL (e.g. `redis://redis:6379/0`) |
| `CLIENT_HOSTNAME` | Yes | Your public domain, without `https://` |
| `CLIENT_SECRET_KEY` | Recommended | P-256 private key in multibase encoding (confidential OAuth) |

`CLIENT_HOSTNAME` is used to construct OAuth redirect URIs and the client metadata served at `/oauth-client-metadata.json`.

## Docker Compose

Create a `docker-compose.yml`:

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

Create a `.env` file alongside it:

```
SESSION_SECRET=your-random-secret
CLIENT_HOSTNAME=comments.example.com
CLIENT_SECRET_KEY=your-p256-private-key-in-multibase
```

Then start everything:

```sh
docker compose up -d
```

### Building from source

To build the image yourself instead of pulling the pre-built one:

```sh
git clone https://github.com/matteomarjanovic/juttu.git
cd juttu
docker build -t juttu .
```

Then replace `image: ghcr.io/matteomarjanovic/juttu:latest` with `build: .` in your `docker-compose.yml`.

## Pointing the embed at your instance

The backend serves both the API and the embed script. Update your snippet to use your own domain for both:

```html
<script
  defer
  src="https://comments.example.com/embed/juttu-embed.js"
  data-api-url="https://comments.example.com"
></script>
```
