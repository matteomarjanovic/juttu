---
title: Using the Widget
description: What visitors see, and how to link an article to a Bluesky thread on first use.
sidebar:
  order: 2
---

## What visitors see

Visitors can read the full comment thread without a Bluesky account. To like, repost, or reply, they log in with their own Bluesky account — the widget opens a popup and handles the OAuth flow automatically.

## Linking an article (first visit)

The first time you load the widget on a new article, it shows an empty state with a prompt to link the article to a Bluesky post. This step is required once per article and can only be done by you (the account whose handle is set in `data-bsky-user-handle`).

Here is the flow:

1. **Load the page** with the widget embedded. The widget shows a "Link this article" prompt.
2. **Log in** with your Bluesky account. A login popup opens and you'll automatically be able to log in with the handle that matches `data-bsky-user-handle`.
3. **Choose or create a post.** Choose one of your existing posts to use it as the thread root, or create a new post directly from the widget. That post's reply thread becomes the comment section.
4. **Done.** The link is saved to your AT Protocol repo. From now on, the widget loads the thread automatically for all visitors.

The link only needs to be created once. Subsequent visits — by you or any visitor — simply display the live reply thread.
