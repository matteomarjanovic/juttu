---
title: Using the Widget
description: What visitors see, and how to link an article to a Bluesky thread on first use.
sidebar:
  order: 2
---

## What visitors see

Visitors can read the full comment thread without a Bluesky account. To like, repost, or reply, they log in with their own Bluesky account — the widget opens a popup and handles the OAuth flow automatically.

## Linking an article (first visit)

The first time you load the widget on a new article, it checks your AT Protocol repository for a `site.standard.document` record. This step is required once per article and can only be done by you (the account whose DID is in the `<link>` tag).

Here is the flow:

1. **Load the page.** The widget checks for a `site.standard.document` record in your AT Protocol repo.
   - If the record exists but has no Bluesky post linked → skip to step 3.
   - If no record exists yet → you'll first be asked to fill in a title (and optional description) for this document.
2. **Log in** with your Bluesky account. A login popup opens and automatically targets the DID in the `<link>` tag — no typing required.
3. **Choose or create a post.** Pick one of your existing Bluesky posts or compose a new one directly from the widget. That post's reply thread becomes the comment section.
4. **Done.** The link is saved to your AT Protocol repo. From now on, the widget loads the thread automatically for all visitors.

The link only needs to be created once. Subsequent visits — by you or any visitor — simply display the live reply thread.
