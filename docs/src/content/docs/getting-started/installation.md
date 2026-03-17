---
title: Installation
description: Add the Juttu embed snippet to your website.
sidebar:
  order: 1
---

## Prerequisites

- A [Bluesky](https://bsky.app) account (this will be the article owner handle)
- An article URL or a unique, stable identifier for each article you want to comment-enable

## Add the snippet

Place the following snippet where you want the comment section to appear:

```html
<div id="juttu-comments"></div>
<script
  defer
  src="https://juttu.app/embed/juttu-embed.min.js"
  data-bsky-user-handle="your-handle.bsky.social"
  data-article-id="your-article-slug"
></script>
```

The comment section resizes itself dynamically — no fixed height required.

## Attributes

### `data-bsky-user-handle` (required)

Your Bluesky handle. This identifies you as the article owner and is used to look up the linked Bluesky post for this article.

Example: `data-bsky-user-handle="alice.bsky.social"`

### `data-article-id` (required)

A stable, unique identifier for the article. It can be any string — a slug, a URL path, a numeric ID. It just needs to be unique across your site and not change over time.

Example: `data-article-id="my-first-post"` or `data-article-id="/blog/2024/my-first-post"`

### `data-theme` (optional)

Controls the color theme. Accepted values:

| Value | Behavior |
|-------|----------|
| `light` | Always use the light theme |
| `dark` | Always use the dark theme |
| `auto` | Follow the visitor's system preference (default) |

Example: `data-theme="dark"`
