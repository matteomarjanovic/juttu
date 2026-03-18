---
title: Why Juttu
description: The philosophy and motivation behind Juttu.
---

## The problem with existing comment systems

Most comment systems (Disqus and similar tools) share the same structural problems:

- **Heavyweight**: they bring a bundle of JavaScript, ads, or tracking pixels into your page.
- **Privacy-invasive**: user data is collected and monetized by a third-party platform you don't control.
- **Platform-controlled**: if the vendor shuts down, changes pricing, or alters their terms, your comment history goes with it.

They also create a new social silo. Readers have to create yet another account on yet another platform just to leave a comment.

## The Bluesky angle

[Bluesky](https://bsky.app) is built on the AT Protocol — an open, decentralized standard for social data. Every post on Bluesky is a public record owned by its author, stored in their personal data repository, and portable across services.

Juttu uses this directly. When you embed Juttu on an article, you link that article to a Bluesky post. The reply thread of that post becomes the comment section. Comments are real Bluesky posts — they exist on the open network, they belong to their authors, and they are readable by anyone with a Bluesky client.

## No new accounts

Visitors authenticate with their existing Bluesky identity. There is no Juttu account, no separate password, and no profile to maintain. Login happens via AT Protocol OAuth, and the session is stored only in the user's browser.

## Open source

Juttu is licensed under [AGPL-3.0](https://github.com/matteomarjanovic/juttu/blob/main/LICENSE). The source code is public, auditable, and forkable. You can run your own instance on your own infrastructure with full control over the data.

## What Juttu stores

Juttu stores nothing beyond an OAuth session token in the user's browser (IndexedDB). There is no database of users, no comment archive, and no analytics by default. The comments themselves live on Bluesky — Juttu just displays them.

Optional, minimal telemetry can be enabled by self-hosters who want usage data sent to their own endpoint. It is disabled by default and there is no hosted fallback. See [Self-Hosting](/self-hosting/#telemetry) for details.
