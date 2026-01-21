<script lang="ts">
	import { authState, logout, requestAuth } from '$lib/auth.svelte';

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
			const response = await authState.agent!.post({
				text: commentText.trim(),
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

			console.log('Comment posted:', response);

			// Create a new comment object to add to the UI
			const newComment = {
				post: {
					uri: response.uri,
					cid: response.cid,
					author: {
						did: authState.profile?.did || authState.session?.did,
						handle: authState.profile?.handle || authState.session?.sub,
						displayName: authState.profile?.displayName,
						avatar: authState.profile?.avatar
					},
					record: {
						text: commentText.trim(),
						createdAt: new Date().toISOString()
					},
					indexedAt: new Date().toISOString(),
					likeCount: 0,
					repostCount: 0,
					replyCount: 0
				},
				replies: []
			};

			onCommentPosted(newComment);
			commentText = '';
		} catch (error) {
			console.error('Error posting comment:', error);
		} finally {
			isSubmitting = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			handleSubmit();
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
					<div class="tooltip tooltip-right" data-tip="Logout">
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
		<div class="flex-grow"></div>
		<!-- <span class="text-sm text-base-content/90 pb-[2px]">Powered by Juttu</span> -->
	</div>
	<textarea
		bind:value={commentText}
		onkeydown={handleKeydown}
		placeholder="Add a comment..."
		class="textarea-bordered textarea min-h-20 w-full font-comment"
		disabled={isSubmitting}
		rows="3"
	></textarea>
	<div class="mt-2 flex items-start">
		<div class="flex items-center gap-2">
			<span class="text-xs text-base-content/80">Ctrl+Enter to submit</span>
			<div
				class="tooltip tooltip-bottom duration-50"
				data-tip="Every comment you will leave will be posted on your bluesky profile, as a reply to the original post by the author."
			>
				<button class="btn btn-circle btn-ghost btn-xs" aria-label="Info">
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
				</button>
			</div>
		</div>
		<div class="flex-grow"></div>
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
