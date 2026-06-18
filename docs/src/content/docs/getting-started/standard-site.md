---
title: "Prerequisites: standard.site"
description: Juttu runs on the standard.site open publishing standard. Here's what that is and how to make your blog compatible.
sidebar:
  order: 1
---

Juttu is built on **[standard.site](https://standard.site)**. It doesn't keep your articles or comment links in a private database — it reads open records that your blog publishes. So your blog needs to speak standard.site before you add the widget.

If your blog already implements standard.site, you can skip straight to [Installation](/getting-started/installation).

## What is standard.site?

standard.site is a set of shared [AT Protocol](https://atproto.com) lexicons (data schemas) for long-form publishing. Its tagline says it best: **"One schema. Every platform."**

Instead of every Bluesky-native blogging tool inventing its own metadata format, standard.site defines two records:

- **Publication** — your blog itself (name, description, icon, theme).
- **Document** — an individual article, linked back to its publication.

These records live in *your* AT Protocol repository, so your content is portable, interoperable, and owned by you — not locked inside any single platform. It's already implemented across the ecosystem by tools like [Leaflet](https://leaflet.pub), [Pckt](https://pckt.blog), and [Offprint](https://offprint.app).

Juttu reads the `site.standard.document` record to know which article a page represents, then links it to a Bluesky post whose replies become your comment thread.

## Make your blog standard.site-compatible

You set this up once for your blog — not through Juttu. Once it's done, Juttu and every other standard.site tool just work. A few good places to start:

- **[Official documentation](https://standard.site/docs)** — the spec, the lexicons, and a quick-start guide.
- **[Sequoia](https://sequoia.pub)** — a CLI that publishes an existing static blog to standard.site. It works with Astro, Eleventy, Hugo, Next, Gatsby, Zola, SvelteKit, and any Markdown site, so it's the fastest path if you already have a blog.
- **["Understanding Standard.Site"](https://wil.to/posts/standard-site/)** by Mat Marquis — a friendly walkthrough of the concepts and a manual setup, with an RSS analogy that makes the whole thing click.

Once your blog is compatible, each article page emits a `<link rel="site.standard.document">` tag in its `<head>`. That's all Juttu needs — head to [Installation](/getting-started/installation) to add the widget.
