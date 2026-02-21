<script lang="ts">
	import { authState, requestAuth } from '$lib/auth.svelte';
	import { formatDate } from './post-utils';
	import type { AppBskyFeedDefs } from '@atproto/api';
	import { l } from '@atproto/lex';
	import * as app from '$lib/lexicons/app.js';

	interface Props {
		userHandle: string;
		articleId: string;
		onArticleLinkCreated?: (rootPostUri: string) => void;
	}

	const { userHandle, articleId, onArticleLinkCreated }: Props = $props();

	type Step =
		| 'login'
		| 'loading-profile'
		| 'choose-method'
		| 'create-post'
		| 'select-post'
		| 'confirm';

	// Determine current step based on auth state
	let currentStep = $derived.by<Step>(() => {
		if (!authState.agent) return 'login';
		// Wait for profile to load before showing options or wrong-account warning
		if (!authState.profile) return 'loading-profile';
		return 'choose-method';
	});

	let selectedMethod = $state<'new' | 'existing' | null>(null);
	let newPostText = $state('');
	let userPosts = $state<AppBskyFeedDefs.FeedViewPost[]>([]);
	let selectedPost = $state<AppBskyFeedDefs.PostView | null>(null);
	let isLoadingPosts = $state(false);
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);
	let loginError = $state<string | null>(null);

	// Check if logged-in user matches the URL handle
	let isCorrectUser = $derived.by(() => {
		if (!authState.profile) return false;
		return authState.profile.handle === userHandle || authState.profile.did === userHandle;
	});

	function handleLogin() {
		loginError = null;
		const result = requestAuth();
		if (!result.success) {
			loginError = 'Popup was blocked. Please allow popups for this site.';
		}
	}

	async function loadUserPosts() {
		if (!authState.agent) return;

		isLoadingPosts = true;
		error = null;

		try {
			const response = await authState.agent.getAuthorFeed({
				actor: authState.profile?.did || authState.session!.did,
				limit: 50,
				filter: 'posts_no_replies'
			});

			userPosts = response.data.feed;
		} catch (err) {
			console.error('Error loading posts:', err);
			error = 'Failed to load your posts';
		} finally {
			isLoadingPosts = false;
		}
	}

	function selectMethod(method: 'new' | 'existing') {
		selectedMethod = method;
		if (method === 'existing') {
			loadUserPosts();
		}
	}

	function selectPost(post: AppBskyFeedDefs.PostView) {
		selectedPost = post;
	}

	function goBack() {
		if (selectedPost) {
			selectedPost = null;
		} else if (selectedMethod) {
			selectedMethod = null;
			newPostText = '';
		}
	}

	async function createArticleLink(postUri: string, postCid: string) {
		if (!authState.agent) {
			error = 'Not authenticated';
			return;
		}

		isSubmitting = true;
		error = null;

		try {
			// Build the articleLink record using the lexicon schema
			const record = app.juttu.articleLink.$build({
				articleId: articleId,
				createdAt: new Date().toISOString(),
				commentsThread: {
					uri: postUri as l.AtUriString,
					cid: postCid as l.CidString
				}
			});

			// Validate the record before creating
			const validation = app.juttu.articleLink.$safeParse(record);
			if (!validation.success) {
				console.error('Validation failed:', validation.reason);
				error = `Invalid article link data: ${validation.reason?.message || 'Unknown error'}`;
				isSubmitting = false;
				return;
			}

			await authState.agent.com.atproto.repo.putRecord({
				repo: authState.session!.did,
				collection: 'app.juttu.articleLink',
				rkey: articleId,
				record: validation.value
			});

			console.log('ArticleLink created successfully');
			onArticleLinkCreated?.(postUri);
		} catch (err) {
			console.error('Error creating articleLink:', err);
			error = 'Failed to link article. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleCreateNewPost() {
		if (!authState.agent || !newPostText.trim()) return;

		isSubmitting = true;
		error = null;

		try {
			// Create a new post
			const response = await authState.agent.post({
				text: newPostText.trim()
			});

			console.log('Post created:', response);

			// Now create the articleLink with this new post
			await createArticleLink(response.uri, response.cid);
		} catch (err) {
			console.error('Error creating post:', err);
			error = 'Failed to create post. Please try again.';
			isSubmitting = false;
		}
	}

	async function handleConfirmExistingPost() {
		if (!selectedPost) return;
		await createArticleLink(selectedPost.uri, selectedPost.cid);
	}

	function truncateText(text: string, maxLength: number = 100): string {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + '...';
	}
</script>

<p class="mb-2 text-end text-sm">
	<a href="https://juttu.app" class="hover:cursor-pointer hover:underline" target="_blank"
		>Powered by (Juttu)</a
	>
</p>
<div class="mx-auto max-w-xl rounded-lg border border-base-300 bg-base-100 p-6">
	<h2 class="mb-4 text-xl font-bold">Link Article to Bluesky</h2>
	<p class="mb-6 text-sm text-base-content/70">
		Connect this article to a Bluesky post to enable comments.
	</p>

	{#if currentStep === 'login'}
		<div class="text-center">
			<p class="mb-4 text-base-content/70">
				Sign in as <span class="font-semibold">@{userHandle}</span> to link this article.
			</p>
			<button class="btn text-lg btn-accent" disabled={authState.isLoading} onclick={handleLogin}>
				{#if authState.isLoading}
					<span class="loading loading-sm loading-spinner"></span>
				{/if}
				<svg
					class="h-auto w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 568 501"
				>
					<title>Bluesky butterfly logo</title>
					<path
						fill="currentColor"
						d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"
					></path>
				</svg>
				Login as @{userHandle}
			</button>
			{#if loginError}
				<p class="mt-2 text-sm text-error">{loginError}</p>
			{/if}
		</div>
	{:else if currentStep === 'loading-profile'}
		<div class="flex justify-center py-8">
			<span class="loading loading-lg loading-spinner"></span>
		</div>
	{:else if !isCorrectUser}
		<div class="alert alert-warning">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
			<div>
				<p class="font-semibold">Wrong account</p>
				<p class="text-sm">
					You're logged in as <span class="font-mono">@{authState.profile?.handle}</span>, but this
					article belongs to <span class="font-mono">@{userHandle}</span>.
				</p>
			</div>
		</div>
	{:else if selectedMethod === null}
		<div class="flex flex-col gap-3">
			<button class="btn btn-primary" onclick={() => selectMethod('new')}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Create a New Post
			</button>
			<button class="btn btn-outline" onclick={() => selectMethod('existing')}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 10h16M4 14h16M4 18h16"
					/>
				</svg>
				Select an Existing Post
			</button>
		</div>
	{:else if selectedMethod === 'new'}
		<div class="flex flex-col gap-4">
			<button class="btn self-start btn-ghost btn-sm" onclick={goBack}> ← Back </button>
			<p class="text-sm text-base-content/70">
				Create a new post on Bluesky that will serve as the comments thread for this article.
			</p>
			<textarea
				class="textarea-bordered textarea min-h-32 w-full font-comment"
				placeholder="Write your post... (e.g., 'Comments thread for my new article!')"
				bind:value={newPostText}
				maxlength="300"
			></textarea>
			<div class="flex items-center justify-between">
				<span class="text-sm text-base-content/50">{newPostText.length}/300</span>
				<button
					class="btn btn-primary"
					disabled={!newPostText.trim() || isSubmitting}
					onclick={handleCreateNewPost}
				>
					{#if isSubmitting}
						<span class="loading loading-sm loading-spinner"></span>
					{/if}
					Create Post & Link Article
				</button>
			</div>
			{#if error}
				<p class="text-sm text-error">{error}</p>
			{/if}
		</div>
	{:else if selectedMethod === 'existing' && !selectedPost}
		<div class="flex flex-col gap-4">
			<button class="btn self-start btn-ghost btn-sm" onclick={goBack}> ← Back </button>
			<p class="text-sm text-base-content/70">
				Select one of your existing posts to use as the comments thread.
			</p>

			{#if isLoadingPosts}
				<div class="flex justify-center py-8">
					<span class="loading loading-lg loading-spinner"></span>
				</div>
			{:else if userPosts.length === 0}
				<p class="py-8 text-center text-base-content/60 italic">
					No posts found. Try creating a new post instead.
				</p>
			{:else}
				<div class="max-h-80 space-y-2 overflow-y-auto">
					{#each userPosts as feedPost (feedPost.post.uri)}
						{@const post = feedPost.post}
						{@const record = post.record as { text?: string; createdAt?: string }}
						<button
							class="btn h-auto w-full justify-start p-3 text-left btn-ghost"
							onclick={() => selectPost(post)}
						>
							<div class="flex w-full flex-col gap-1">
								<p class="text-sm">{truncateText(record.text || '')}</p>
								<p class="text-xs text-base-content/50">
									{formatDate(record.createdAt || post.indexedAt, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
								</p>
							</div>
						</button>
					{/each}
				</div>
			{/if}

			{#if error}
				<p class="text-sm text-error">{error}</p>
			{/if}
		</div>
	{:else if selectedPost}
		{@const record = selectedPost.record as { text?: string; createdAt?: string }}
		<div class="flex flex-col gap-4">
			<button class="btn self-start btn-ghost btn-sm" onclick={goBack}> ← Back </button>
			<p class="text-sm text-base-content/70">Confirm linking this post to the article:</p>

			<div class="rounded-lg border border-base-300 bg-base-200 p-4">
				<p class="mb-2">{record.text}</p>
				<p class="text-xs text-base-content/50">
					{formatDate(record.createdAt || selectedPost.indexedAt, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
				</p>
			</div>

			<div class="flex gap-2">
				<button class="btn flex-1 btn-outline" onclick={goBack} disabled={isSubmitting}>
					Cancel
				</button>
				<button
					class="btn flex-1 btn-primary"
					disabled={isSubmitting}
					onclick={handleConfirmExistingPost}
				>
					{#if isSubmitting}
						<span class="loading loading-sm loading-spinner"></span>
					{/if}
					Confirm & Link
				</button>
			</div>

			{#if error}
				<p class="text-sm text-error">{error}</p>
			{/if}
		</div>
	{/if}
</div>
