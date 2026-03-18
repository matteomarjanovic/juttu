<script lang="ts">
	import { authState, logout, requestAuth } from '$lib/auth.svelte';
	import { getContext } from 'svelte';
	import { makeOptimisticPost } from '$lib/post-utils';
	import { track } from '$lib/analytics';
	import { RichText } from '@atproto/api';
	import RichTextEditor from './RichTextEditor.svelte';
	import JuttuLogo from './JuttuLogo.svelte';

	const userHandle = getContext<string>('juttu:userHandle');
	const userDid = getContext<string | null>('juttu:userDid');

	interface Props {
		rootPostUri: string;
		rootPostCid: string;
		onCommentPosted: (newComment: any) => void;
	}

	const { rootPostUri, rootPostCid, onCommentPosted }: Props = $props();

	let commentText = $state('');
	let isSubmitting = $state(false);
	let loggingOut = $state(false);
	let popupBlockedUrl = $state<string | null>(null);

	async function handleLogout() {
		try {
			loggingOut = true;
			await logout();
		} catch (err: unknown) {
			console.error('Logout error:', err);
		} finally {
			loggingOut = false;
		}
	}

	function handleAuthRequired(): boolean {
		if (!authState.agent) {
			const result = requestAuth();
			if (!result.success && result.fallbackUrl) {
				popupBlockedUrl = result.fallbackUrl;
			}
			return false;
		}
		popupBlockedUrl = null;
		return true;
	}

	async function handleSubmit() {
		if (!commentText.trim()) {
			return;
		}

		if (!handleAuthRequired()) return;

		isSubmitting = true;

		try {
			const rt = new RichText({ text: commentText.trim() });
			await rt.detectFacets(authState.agent!);

			const response = await authState.agent!.post({
				text: rt.text,
				facets: rt.facets,
				reply: {
					root: {
						uri: rootPostUri,
						cid: rootPostCid
					},
					parent: {
						uri: rootPostUri,
						cid: rootPostCid
					}
				}
			});

			// Create a new comment object to add to the UI
			const newComment = makeOptimisticPost(response, rt.text, rt.facets);

			onCommentPosted(newComment);
			track('reply', userHandle, userDid);
			commentText = '';
		} catch (error) {
			console.error('Error posting comment:', error);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="mb-6">
	<div class="mb-2 flex items-end gap-2">
		{#if authState.agent}
			<div class="flex min-w-0 flex-1 items-center gap-2">
				{#if authState.profile?.avatar}
					<div class="avatar">
						<div class="w-8 rounded-full">
							<img src={authState.profile.avatar} alt="Your avatar" />
						</div>
					</div>
				{:else}
					<div class="h-8 w-8 shrink-0 skeleton rounded-full"></div>
				{/if}
				<div class="flex flex-col">
					{#if authState.profile?.displayName}
						<span class="truncate text-sm font-medium">{authState.profile?.displayName}</span>
					{:else}
						<span class="mb-1 h-4 w-20 skeleton"></span>
					{/if}
					{#if authState.profile?.handle}
						<span class="truncate text-xs text-base-content/80">@{authState.profile?.handle}</span>
					{:else}
						<span class="h-3 w-16 skeleton"></span>
					{/if}
				</div>
				{#if loggingOut}
					<div class="ml-auto">
						<button class="btn loading btn-circle btn-ghost btn-xs" aria-label="Logging out"
						></button>
					</div>
				{:else}
					<!-- Logout button -->
					<div class="tooltip tooltip-right tooltip-accent" data-tip="Logout">
						<button
							class="btn btn-circle text-error btn-ghost btn-xs"
							aria-label="Logout"
							onclick={handleLogout}
						>
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
									d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
								/>
							</svg>
						</button>
					</div>
				{/if}
			</div>
		{:else}
			<!-- <div class="avatar placeholder">
                <div class="bg-base-300 text-base-content w-8 rounded-full"></div>
            </div> -->
			<button
				class="btn px-0 text-base-content/90 btn-link btn-sm"
				onclick={() => handleAuthRequired()}
			>
				Log in to comment
			</button>
		{/if}
		<div class="grow"></div>
	</div>
	<RichTextEditor
		bind:value={commentText}
		placeholder="Add a comment..."
		class="min-h-20"
		disabled={isSubmitting}
		rows={3}
	/>
	<div class="mt-2 flex items-start">
		<div class="flex items-center justify-center gap-2">
			<p class="mt-0.5 text-sm">
				<a href="https://juttu.app" class="font-sans hover:cursor-pointer" target="_blank">
					Powered by
					<span class="inline-block h-full w-9">
						<JuttuLogo />
					</span>
				</a>
			</p>
			<div class="dropdown-hover dropdown dropdown-bottom">
				<div tabindex="0" role="button" class="btn btn-circle text-info btn-ghost btn-xs">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<div
					class="dropdown-content card z-1 w-36 rounded-box bg-accent text-accent-content shadow-sm card-sm sm:w-62"
				>
					<div class="card-body">
						<p>
							Every comment you will leave will be posted on your Bluesky profile, as a reply to the
							original post by the author. <a
								href="https://juttu.app/policy"
								class="text-base-content/80 underline hover:text-base-content"
								target="_blank"
								rel="noopener noreferrer"
							>
								Privacy policy
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
		<div class="grow"></div>
		<button
			class="btn btn-sm btn-primary"
			onclick={handleSubmit}
			disabled={isSubmitting || !commentText.trim()}
		>
			{isSubmitting ? 'Posting...' : 'Comment'}
		</button>
	</div>

	<!-- Popup Blocked Alert -->
	{#if popupBlockedUrl}
		<div class="mt-3 alert text-sm alert-warning">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 shrink-0"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				/>
			</svg>
			<span>Popup was blocked.</span>
			<a
				href={popupBlockedUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="btn btn-sm"
				onclick={() => (popupBlockedUrl = null)}
			>
				Click here to login
			</a>
		</div>
	{/if}
</div>
