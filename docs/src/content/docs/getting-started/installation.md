---
title: Installation
description: Add the Juttu embed snippet to your website.
sidebar:
  order: 1
---

## Prerequisites

- A [Bluesky](https://bsky.app) account (this will be the article owner)
- Your Bluesky DID (see below for how to find it)
- A stable, unique slug for each article you want to comment-enable

## Add the snippet

Add the following to your page. The `<link>` and `<script>` tags go in `<head>`; the `<div>` goes in `<body>` where you want comments to appear:

```html
<!-- in <head> -->
<link rel="site.standard.document" href="at://YOUR_DID/site.standard.document/YOUR_ARTICLE_SLUG" />
<script defer src="https://juttu.app/embed/juttu-embed.min.js"></script>

<!-- in <body> -->
<div id="juttu-comments"></div>
```

The comment section resizes itself dynamically — no fixed height required.

## The `<link>` tag (required)

The `<link rel="site.standard.document">` tag tells Juttu which article to show comments for. Its `href` must be a full AT URI in the format:

```
at://YOUR_DID/site.standard.document/YOUR_ARTICLE_SLUG
```

- **`YOUR_DID`** — your Bluesky DID, e.g. `did:plc:abc123`. Find it by looking up your handle at:
  ```
  https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=your.handle.bsky.social
  ```
- **`YOUR_ARTICLE_SLUG`** — a stable, unique identifier for this article. Allowed characters: letters, digits, `.`, `_`, `~`, `-` (max 512 chars). Must not change after setup.

If a platform you use (e.g. a Bluesky-native blogging tool) already emits `<link rel="site.standard.document">` tags, no manual configuration is needed.

## The `<script>` tag (required)
The `<script>` tag loads the Juttu embed code. The `src` must be exactly `https://juttu.app/embed/juttu-embed.min.js` if you want to use the hosted version. Self-hosters can change the `src` to their own hosted domain.

### `data-theme` (optional)

Controls the color theme. Accepted values:

| Value | Behavior |
|-------|----------|
| `light` | Always use the light theme |
| `dark` | Always use the dark theme |
| `auto` | Follow the visitor's system preference (default) |

Example: `data-theme="dark"`
