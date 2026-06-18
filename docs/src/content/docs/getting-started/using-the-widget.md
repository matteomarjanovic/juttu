---
title: Using the Widget
description: What visitors see, and how to link an article to a Bluesky thread on first use.
sidebar:
  order: 3
---

## What visitors see

Visitors can read the full comment thread without a Bluesky account. To like, repost, or reply, they log in with their own Bluesky account — the widget opens a popup and handles the OAuth flow automatically.

## Linking an article (first visit)

Your [standard.site setup](/getting-started/standard-site) already published a `site.standard.document` record for the article — but it doesn't yet point to a Bluesky thread. The first time you load the widget, you link one. This step is required once per article and can only be done by you (the account whose DID is in the `<link>` tag).

Here is the flow:

1. **Load the page.** The widget finds your article's `site.standard.document` record and sees that no Bluesky post is linked yet.
2. **Log in** with your Bluesky account. A login popup opens and automatically targets the DID in the `<link>` tag — no typing required.
3. **Choose or create a post.** Pick one of your existing Bluesky posts or compose a new one directly from the widget. That post's reply thread becomes the comment section.
4. **Done.** The link is saved to your AT Protocol repo. From now on, the widget loads the thread automatically for all visitors.

The link only needs to be created once. Subsequent visits — by you or any visitor — simply display the live reply thread.
