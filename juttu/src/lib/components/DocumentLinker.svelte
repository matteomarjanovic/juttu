<script lang="ts">
	import { authState, requestAuth } from '$lib/auth.svelte';
	import { formatDate } from '$lib/post-utils';
	import { RichText } from '@atproto/api';
	import RichTextEditor from './RichTextEditor.svelte';
	import type { AppBskyFeedDefs } from '@atproto/api';
	import * as site from '$lib/lexicons/site.js';
	import JuttuLogo from './JuttuLogo.svelte';

	// AT Protocol rkey charset validation
	const RKEY_RE = /^[A-Za-z0-9._~-]{1,512}$/;

	interface Props {
		documentAtUri: string;
		did: string;
		rkey: string;
		documentRecord: site.standard.document.Main | null;
		pageOrigin: string | null;
		pagePath: string | null;
		onDocumentLinked?: (rootPostUri: string) => void;
	}

	const {
		documentAtUri,
		did,
		rkey,
		documentRecord,
		pageOrigin,
		pagePath,
		onDocumentLinked
	}: Props = $props();

	// Mode A: record exists but has no bskyPostRef
	// Mode B: record doesn't exist at all (documentRecord === null)
	const isValidRkey = $derived(RKEY_RE.test(rkey));

	// Determine current step based on auth state
	let currentStep = $derived.by<
		'login' | 'loading-profile' | 'metadata-form' | 'choose-method' | 'create-post' | 'select-post' | 'confirm'
	>(() => {
		if (!authState.agent) return 'login';
		if (!authState.profile) return 'loading-profile';
		// In Mode B, show metadata form before choose-method (if not yet completed)
		if (documentRecord === null && !metadataCompleted) return 'metadata-form';
		return 'choose-method';
	});

	let metadataCompleted = $state(false);
	// Mode B metadata fields
	let title = $state('');
	let description = $state('');

	let selectedMethod = $state<'new' | 'existing' | null>(null);
	let newPostText = $state('');
	let userPosts = $state<AppBskyFeedDefs.FeedViewPost[]>([]);
	let selectedPost = $state<AppBskyFeedDefs.PostView | null>(null);
	let isLoadingPosts = $state(false);
	let isSubmitting = $state(false);
	let error = $state<string | null>(null);
	let loginError = $state<string | null>(null);

	// Check if logged-in user is the document owner
	let isCorrectUser = $derived(authState.profile?.did === did);

	function handleLogin() {
		loginError = null;
		const result = requestAuth(did);
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

	async function linkDocument(postUri: string, postCid: string) {
		if (!authState.agent) {
			error = 'Not authenticated';
			return;
		}

		isSubmitting = true;
		error = null;

		try {
			if (documentRecord !== null) {
				// Mode A: record exists, add bskyPostRef to the existing record
				await authState.agent.com.atproto.repo.putRecord({
					repo: authState.session!.did,
					collection: 'site.standard.document',
					rkey,
					record: {
						...documentRecord,
						bskyPostRef: { uri: postUri, cid: postCid }
					}
				});
			} else {
				// Mode B: create full document record
				await authState.agent.com.atproto.repo.putRecord({
					repo: authState.session!.did,
					collection: 'site.standard.document',
					rkey,
					record: {
						$type: 'site.standard.document',
						site: pageOrigin ?? documentAtUri.split('/')[2] ?? did,
						title,
						description: description || undefined,
						path: pagePath || undefined,
						publishedAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
						bskyPostRef: { uri: postUri, cid: postCid }
					}
				});
			}

			onDocumentLinked?.(postUri);
		} catch (err) {
			console.error('Error linking document:', err);
			error = 'Failed to link document. Please try again.';
		} finally {
			isSubmitting = false;
		}
	}

	async function handleCreateNewPost() {
		if (!authState.agent || !newPostText.trim()) return;

		isSubmitting = true;
		error = null;

		try {
			const rt = new RichText({ text: newPostText.trim() });
			await rt.detectFacets(authState.agent);

			const response = await authState.agent.post({
				text: rt.text,
				facets: rt.facets
			});

			await linkDocument(response.uri, response.cid);
		} catch (err) {
			console.error('Error creating post:', err);
			error = 'Failed to create post. Please try again.';
			isSubmitting = false;
		}
	}

	async function handleConfirmExistingPost() {
		if (!selectedPost) return;
		await linkDocument(selectedPost.uri, selectedPost.cid);
	}

	function truncateText(text: string, maxLength: number = 100): string {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + '...';
	}
</script>

<p class="text-end text-sm">
	<a href="https://juttu.app" class="font-sans hover:cursor-pointer" target="_blank">
		Powered by
		<span class="inline-block h-full w-9">
			<JuttuLogo />
		</span>
	</a>
</p>
<div class="mx-auto max-w-xl rounded-lg border border-base-300 bg-base-100 p-6">
	<h2 class="mb-4 text-xl font-bold">Link Article to Bluesky</h2>
	<p class="mb-6 text-sm text-base-content/70">
		Connect this article to a Bluesky post to enable comments.
	</p>

	{#if !isValidRkey}
		<div class="alert alert-error">
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
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<div>
				<p class="font-semibold">Invalid record key</p>
				<p class="text-sm">
					The document rkey <span class="font-mono">"{rkey}"</span> contains invalid characters. Only
					letters, digits, <span class="font-mono">. _ ~ -</span> are allowed (max 512 chars).
				</p>
			</div>
		</div>
	{:else if currentStep === 'login'}
		<div class="text-center">
			<p class="mb-4 text-base-content/70">Sign in as the document owner to link this article.</p>
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
				Login with Bluesky
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
					document belongs to <span class="font-mono">{did}</span>.
				</p>
			</div>
		</div>
	{:else if currentStep === 'metadata-form'}
		<!-- Mode B: collect title/description before choosing a post -->
		<div class="flex flex-col gap-4">
			<p class="text-sm text-base-content/70">
				This article doesn't have a document record yet. Fill in some details to create one.
			</p>
			<div class="flex flex-col gap-1">
				<label class="text-sm font-semibold" for="doc-title">Title <span class="text-error">*</span></label>
				<input
					id="doc-title"
					type="text"
					class="input input-bordered w-full"
					placeholder="My Article Title"
					bind:value={title}
				/>
			</div>
			<div class="flex flex-col gap-1">
				<label class="text-sm font-semibold" for="doc-description">Description <span class="text-base-content/50">(optional)</span></label>
				<textarea
					id="doc-description"
					class="textarea textarea-bordered w-full"
					placeholder="A brief description of this article…"
					rows="3"
					bind:value={description}
				></textarea>
			</div>
			<div class="rounded-lg border border-base-300 bg-base-200 p-3 text-sm text-base-content/70">
				<p><span class="font-semibold">Site:</span> {pageOrigin ?? '(unknown)'}</p>
				<p><span class="font-semibold">Path:</span> {pagePath ?? '(unknown)'}</p>
				<p><span class="font-semibold">Record key:</span> <span class="font-mono">{rkey}</span></p>
			</div>
			<button
				class="btn btn-primary"
				disabled={!title.trim()}
				onclick={() => (metadataCompleted = true)}
			>
				Continue
			</button>
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
			<RichTextEditor
				class="min-h-32"
				placeholder="Check out my new article at mywebsite.com/new-article!"
				bind:value={newPostText}
				maxlength={300}
			/>
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
									{formatDate(record.createdAt || post.indexedAt, {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
										hour: '2-digit',
										minute: '2-digit'
									})}
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
					{formatDate(record.createdAt || selectedPost.indexedAt, {
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					})}
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
