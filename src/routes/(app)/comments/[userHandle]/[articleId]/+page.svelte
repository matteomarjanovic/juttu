<script lang="ts">
	import { authState, logout } from '$lib/auth.svelte';
	import { type AppBskyFeedGetPostThread } from '@atproto/api';
	import AuthModal from '$lib/components/AuthModal.svelte';
	import ArticleLinkCreator from '$lib/components/ArticleLinkCreator.svelte';
	import type { ThreadViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs.js';
	import CommentNode from '$lib/components/CommentNode.svelte';
	import CommentSortSelect from '$lib/components/CommentSortSelect.svelte';
	import RootCommentComposer from '$lib/components/RootCommentComposer.svelte';
	import { untrack } from 'svelte';
	import CommentsLoading from '$lib/components/CommentsLoading.svelte';
	import { page } from '$app/state';

	type SortOption = 'newest' | 'oldest' | 'most-liked';

	let modal = $state<HTMLDialogElement>();
	const { data } = $props();

	// Check for theme parameter in URL
	$effect(() => {
		const theme = page.url.searchParams.get('theme');
		if (theme === 'dark') {
			document.documentElement.setAttribute('data-theme', 'juttu-dark');
		} else {
			document.documentElement.removeAttribute('data-theme');
		}
	});

	// Handle OAuth callback when running in iframe
	// The callback popup sends the OAuth response here for processing
	$effect(() => {
		if (typeof window === 'undefined') return;

		const handleOAuthCallback = async (event: MessageEvent) => {
			// Only process juttu-oauth-callback messages
			if (event.data?.type !== 'juttu-oauth-callback') {
				return;
			}

			// Validate origin: must come from our own domain (the popup callback page)
			const expectedOrigin = window.location.origin;
			if (event.origin !== expectedOrigin) {
				console.warn('Received OAuth callback from untrusted origin:', event.origin);
				return;
			}

			console.log('Received OAuth callback from popup, redirecting iframe to callback URL');

			// Validate callback URL to ensure it's from our domain and is the callback endpoint
			try {
				const callbackUrl = new URL(event.data.url);
				if (callbackUrl.origin !== expectedOrigin) {
					console.warn('Callback URL origin does not match expected origin');
					return;
				}
				// Ensure it's the callback endpoint to prevent redirects to other pages
				if (!callbackUrl.pathname.startsWith('/callback')) {
					console.warn('Callback URL is not the callback endpoint:', callbackUrl.pathname);
					return;
				}
			} catch (err) {
				console.warn('Invalid callback URL received:', event.data.url);
				return;
			}

			// Redirect this iframe to the callback URL
			// This ensures the OAuth client in this context processes the callback
			// with access to the correct (partitioned) storage
			window.location.href = event.data.url;
		};

		window.addEventListener('message', handleOAuthCallback);

		return () => {
			window.removeEventListener('message', handleOAuthCallback);
		};
	});

	// Send height updates to parent window (for iframe embedding)
	$effect(() => {
		if (typeof window === 'undefined') return;

		const sendHeight = () => {
			const height = document.documentElement.scrollHeight;
			window.parent.postMessage(
				{
					type: 'juttu-resize',
					height
				},
				'*'
			);
		};

		// Send initial height
		sendHeight();

		// Setup ResizeObserver to detect content changes
		const resizeObserver = new ResizeObserver(sendHeight);
		resizeObserver.observe(document.body);

		// Also listen for dynamic content changes
		const observer = new MutationObserver(sendHeight);
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true
		});

		return () => {
			resizeObserver.disconnect();
			observer.disconnect();
		};
	});

	// Local override for rootPostUri after creating an article link
	let rootPostUriOverride = $state<string | null>(null);
	// Effective rootPostUri: use override if set, otherwise use data from server
	let rootPostUri = $derived(rootPostUriOverride ?? data.rootPostUri);
	let isLoading = $state(true);
	let threadData = $state<ThreadViewPost | null>(null);
	let sortOrder = $state<SortOption>('most-liked');
	let localRootComments = $state<any[]>([]);

	// Sort top-level replies based on sortOrder
	let sortedTopLevelReplies = $derived.by(() => {
		if (!threadData?.replies) return [];
		// Filter to only ThreadViewPost items (those with .post)
		const validReplies = threadData.replies.filter((r) => 'post' in r) as ThreadViewPost[];
		const sortedFetched = [...validReplies].sort((a, b) => {
			if (sortOrder === 'most-liked') {
				return (b.post?.likeCount || 0) - (a.post?.likeCount || 0);
			} else if (sortOrder === 'oldest') {
				return new Date(a.post.indexedAt).getTime() - new Date(b.post.indexedAt).getTime();
			} else {
				// newest first (default)
				return new Date(b.post.indexedAt).getTime() - new Date(a.post.indexedAt).getTime();
			}
		});
		// Local root comments always at the top
		return [...localRootComments, ...sortedFetched];
	});

	function handleRootCommentPosted(newComment: any) {
		localRootComments = [newComment, ...localRootComments];
	}

	// Close modal when user logs in
	$effect(() => {
		if (authState.session) {
			modal?.close();
		}
	});

	async function handleLogout() {
		try {
			await logout();
		} catch (err: unknown) {
			console.error('Logout error:', err);
		}
	}

	async function loadThreadData(rootPostUri: string) {
		isLoading = true;
		try {
			console.log('Loading comments for article ID:', rootPostUri, 'by user DID:', data.userDid);

			// Read agent without tracking to avoid re-running on auth changes
			const currentAgent = untrack(() => authState.agent);

			if (currentAgent) {
				// Use authenticated agent - viewer data will be populated
				const response = await currentAgent.getPostThread({ uri: rootPostUri, parentHeight: 0 });
				console.log('Loaded thread data (authenticated):', response.data);
				threadData = response.data.thread as ThreadViewPost;
			} else {
				// Fall back to public API - no viewer data
				const response = await fetch(
					'https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=' +
						encodeURIComponent(rootPostUri) +
						'&parentHeight=0',
					{
						method: 'GET',
						headers: {
							Accept: 'application/json'
						},
						cache: 'no-store'
					}
				);
				const threadDataJson = (await response.json()) as AppBskyFeedGetPostThread.OutputSchema;
				console.log('Loaded thread data (public):', threadDataJson);
				threadData = threadDataJson.thread as ThreadViewPost;
			}
		} catch (error) {
			console.error('Error loading comments:', error);
		} finally {
			isLoading = false;
		}
	}

	// Handle article link creation
	function handleArticleLinkCreated(newRootPostUri: string) {
		rootPostUriOverride = newRootPostUri;
	}

	// Load thread data when rootPostUri is available AND auth is initialized
	// We track authState.isInitialized to wait for auth, but use untrack inside loadThreadData for agent
	$effect(() => {
		if (rootPostUri && authState.isInitialized) {
			loadThreadData(rootPostUri);
		} else if (!rootPostUri) {
			isLoading = false;
		}
	});
</script>

{#if rootPostUri === null}
	<div class="mx-auto max-w-xl p-5">
		<ArticleLinkCreator
			userHandle={data.userHandle}
			articleId={data.articleId}
			onArticleLinkCreated={handleArticleLinkCreated}
		/>
	</div>
{:else if isLoading}
	<div class="mx-auto max-w-xl p-5">
		<CommentsLoading />
	</div>
{:else}
	<!-- Here you would render the comments thread -->
	<div class="mx-auto max-w-xl p-5">
		{#if threadData}
			<p class="text-end text-sm">
				<a href="https://juttu.app" class="hover:cursor-pointer hover:underline" target="_blank"
					>Powered by (Juttu)</a
				>
			</p>
			<div class="divider mt-0"></div>
			<RootCommentComposer
				{modal}
				rootPostUri={threadData.post.uri}
				rootPostCid={threadData.post.cid}
				onCommentPosted={handleRootCommentPosted}
			/>

			{#if sortedTopLevelReplies.length > 0}
				<div class="mb-4 flex w-full items-end">
					<h1 class="grow text-xl font-bold">Comments</h1>
					<CommentSortSelect value={sortOrder} onchange={(v) => (sortOrder = v)} />
				</div>
				{#each sortedTopLevelReplies as reply (reply.post.uri)}
					<CommentNode comment={reply} {modal} {sortOrder} />
				{/each}
			{:else}
				<p class="py-8 text-center text-base-content/60 italic">
					No comments yet. Be the first to comment!
				</p>
			{/if}
		{:else}
			<p class="text-center text-base-content/60">No thread data available.</p>
		{/if}
	</div>
{/if}

<AuthModal bind:modal />
