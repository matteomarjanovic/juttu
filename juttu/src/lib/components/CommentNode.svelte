<script lang="ts">
	import { authState, requestAuth } from '$lib/auth.svelte';
	import { getContext, untrack } from 'svelte';
	import CommentNode from './CommentNode.svelte';
	import { RichText } from '@atproto/api';
	import { formatDate, makeOptimisticPost } from '$lib/post-utils';
	import { track } from '$lib/analytics';

	const userHandle = getContext<string>('juttu:userHandle');

	type SortOption = 'newest' | 'oldest' | 'most-liked';

	let { comment, sortOrder = 'newest' as SortOption } = $props<{
		comment: any;
		sortOrder?: SortOption;
	}>();
	let loadedFacets = $derived(
		new RichText({
			text: comment.post?.record.text,
			facets: comment.post?.record.facets
		})
	);

	// Popup blocked fallback state
	let popupBlockedUrl = $state<string | null>(null);

	// Track if the user has liked this post
	let likeUri = $state<string | undefined>(untrack(() => comment.post?.viewer?.like));
	let likeCount = $state<number>(untrack(() => comment.post?.likeCount || 0));

	// Derived: is the post liked?
	let isLiked = $derived(!!likeUri);

	// Track if the user has reposted this post
	let repostUri = $state<string | undefined>(untrack(() => comment.post?.viewer?.repost));
	let repostCount = $state<number>(untrack(() => comment.post?.repostCount || 0));

	// Derived: is the post reposted?
	let isReposted = $derived(!!repostUri);

	function isSafeUri(uri: string | undefined): boolean {
		return !!uri && (uri.startsWith('https://') || uri.startsWith('http://'));
	}

	// Reply form state
	let showReplyForm = $state(false);
	let replyText = $state('');
	let isSubmittingReply = $state(false);
	let replyCount = $state<number>(untrack(() => comment.post?.replyCount || 0));
	let localReplies = $state<any[]>([]);

	// Sync local state when the comment prop changes (e.g. after authenticated re-fetch)
	$effect(() => {
		likeUri = comment.post?.viewer?.like;
		likeCount = comment.post?.likeCount || 0;
		repostUri = comment.post?.viewer?.repost;
		repostCount = comment.post?.repostCount || 0;
		replyCount = comment.post?.replyCount || 0;
	});

	const NESTED_PAGE_SIZE = 3;
	let visibleReplyCount = $state(NESTED_PAGE_SIZE);

	// Sort replies: local replies always first, then sort fetched replies by sortOrder
	let sortedReplies = $derived.by(() => {
		const fetchedReplies = comment.replies || [];
		const sortedFetched = [...fetchedReplies].sort((a, b) => {
			if (sortOrder === 'most-liked') {
				return (b.post?.likeCount || 0) - (a.post?.likeCount || 0);
			} else if (sortOrder === 'oldest') {
				return new Date(a.post.indexedAt).getTime() - new Date(b.post.indexedAt).getTime();
			} else {
				// newest first (default)
				return new Date(b.post.indexedAt).getTime() - new Date(a.post.indexedAt).getTime();
			}
		});
		// Local replies always at the top (newest local first)
		return [...localReplies, ...sortedFetched];
	});

	let visibleReplies = $derived(sortedReplies.slice(0, visibleReplyCount));
	let hiddenReplyCount = $derived(sortedReplies.length - visibleReplyCount);

	// Helper to get the post ID for the reply link
	const getPostId = (uri: string) => uri.split('/').pop();

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

	async function handleLike() {
		if (!handleAuthRequired()) return;

		try {
			if (isLiked && likeUri) {
				// Unlike: delete the like record
				await authState.agent!.deleteLike(likeUri);
				likeUri = undefined;
				likeCount--;
				track('unlike', userHandle);
			} else {
				// Like: create a like record
				const response = await authState.agent!.like(comment.post?.uri, comment.post?.cid);
				likeUri = response.uri;
				likeCount++;
				track('like', userHandle);
			}
		} catch (error) {
			console.error('Error toggling like:', error);
		}
	}

	async function handleRepost() {
		if (!handleAuthRequired()) return;

		try {
			if (isReposted && repostUri) {
				// Unrepost: delete the repost record
				await authState.agent!.deleteRepost(repostUri);
				repostUri = undefined;
				repostCount--;
				track('unrepost', userHandle);
			} else {
				// Repost: create a repost record
				const response = await authState.agent!.repost(comment.post?.uri, comment.post?.cid);
				repostUri = response.uri;
				repostCount++;
				track('repost', userHandle);
			}
		} catch (error) {
			console.error('Error toggling repost:', error);
		}
	}

	function toggleReplyForm() {
		if (!handleAuthRequired()) return;
		showReplyForm = !showReplyForm;
		if (!showReplyForm) {
			replyText = '';
		}
	}

	async function handleReply() {
		if (!handleAuthRequired()) return;

		if (!replyText.trim()) {
			return;
		}

		isSubmittingReply = true;

		try {
			// Create a reply post
			const response = await authState.agent!.post({
				text: replyText.trim(),
				reply: {
					root: {
						uri: comment.post?.record.reply?.root?.uri || comment.post?.uri,
						cid: comment.post?.record.reply?.root?.cid || comment.post?.cid
					},
					parent: {
						uri: comment.post?.uri,
						cid: comment.post?.cid
					}
				}
			});

			// Add the new reply to local state so it appears immediately
			const newReply = makeOptimisticPost(response, replyText.trim());

			localReplies = [newReply, ...localReplies];
			replyCount++;
			track('reply', userHandle);

			// Reset form
			replyText = '';
			showReplyForm = false;
		} catch (error) {
			console.error('Error posting reply:', error);
		} finally {
			isSubmittingReply = false;
		}
	}

	function handleReplyKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			handleReply();
		} else if (event.key === 'Escape') {
			showReplyForm = false;
			replyText = '';
		}
	}
</script>

{#if !comment.blocked && !comment.notFound}
	<div class="relative mb-4">
		<div>
			<!-- Header -->
			<div class="mb-1 flex items-start gap-2">
				<div class="flex min-w-0 flex-1 items-center gap-2">
					{#if comment.post?.author.avatar}
						<a
							class="avatar hover:cursor-pointer"
							href={`https://bsky.app/profile/${comment.post?.author.handle}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							<div class="w-8 rounded-full">
								<img src={comment.post?.author.avatar} alt="avatar" />
							</div>
						</a>
					{:else}
						<div class="placeholder avatar">
							<div class="w-8 rounded-full bg-base-300 text-base-content"></div>
						</div>
					{/if}

					<div class="flex min-w-0 flex-col text-sm">
						<a
							href={`https://bsky.app/profile/${comment.post?.author.handle}`}
							target="_blank"
							rel="noopener noreferrer"
							class="max-w-full truncate font-bold text-base-content no-underline hover:underline"
							>{comment.post?.author.displayName || comment.post?.author.handle}</a
						>
						<a
							href={`https://bsky.app/profile/${comment.post?.author.handle}`}
							target="_blank"
							rel="noopener noreferrer"
							class="max-w-full truncate text-base-content/80 no-underline hover:underline"
							>@{comment.post?.author.handle}</a
						>
					</div>
				</div>
				<span class="shrink-0 text-xs whitespace-nowrap text-base-content/80">
					{formatDate(comment.post?.indexedAt)}
				</span>
			</div>

			<!-- Body -->
			<div
				class="py-1 font-comment text-sm leading-relaxed wrap-anywhere whitespace-pre-wrap text-base-content"
			>
				<!-- {comment.post?.record.text} -->
				{#each loadedFacets?.segments() as segment}
					{#if segment.isLink()}
						{#if isSafeUri(segment.link?.uri)}
							<a
								href={segment.link?.uri}
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-500 hover:underline"
							>
								{segment.text}
							</a>
						{:else}
							{segment.text}
						{/if}
					{:else if segment.isMention()}
						<a
							href={`https://bsky.app/profile/${segment.mention?.did}`}
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline"
						>
							{segment.text}
						</a>
					{:else if segment.isTag()}
						<a
							href={`https://bsky.app/search?q=%23${segment.tag?.tag}`}
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-500 hover:underline"
						>
							{segment.text}
						</a>
					{:else}
						{segment.text}
					{/if}
				{/each}
			</div>

			<!-- Embedded Images -->
			{#if comment.post?.embed?.$type === 'app.bsky.embed.images#view'}
				{@const imagesEmbed = comment.post.embed}
				<div class="flex flex-wrap gap-2">
					{#each imagesEmbed.images as image}
						<a
							href={`https://bsky.app/profile/${comment.post?.author?.did}/post/${getPostId(comment.post?.uri || '')}`}
							target="_blank"
							rel="noopener noreferrer"
							class="block overflow-hidden rounded-lg border border-base-300 transition-transform duration-150 hover:scale-[101%]"
						>
							<img
								src={image.thumb}
								alt={image.alt || 'Embedded image'}
								class="h-auto max-h-64 w-auto object-cover"
								loading="lazy"
							/>
						</a>
					{/each}
				</div>
			{/if}

			<!-- Actions -->
			<div class="mt-2 flex gap-4 text-xs text-base-content/80">
				<!-- <div class="tooltip duration-50" data-tip="Like comment"> -->
				<button
					class="group flex cursor-pointer items-center gap-1 border-none bg-transparent p-0"
					onclick={handleLike}
					title="Like comment"
				>
					<svg
						class="h-4 w-4 transition-all duration-150 group-hover:stroke-[#e0245e] {isLiked
							? 'fill-[#e0245e] stroke-[#e0245e]'
							: 'stroke-current'}"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill={isLiked ? 'currentColor' : 'none'}
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path
							d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
						/></svg
					>
					<span class={isLiked ? 'text-[#e0245e]' : ''}>{likeCount}</span>
				</button>
				<!-- </div> -->
				<!-- <div class="tooltip" data-tip="Repost comment"> -->
				<button
					class="group flex cursor-pointer items-center gap-1 border-none bg-transparent p-0"
					onclick={handleRepost}
					title="Repost comment"
				>
					<svg
						class="h-4 w-4 transition-all duration-150 group-hover:stroke-[#17bf63] {isReposted
							? 'stroke-[#17bf63]'
							: 'stroke-current'}"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path
							d="m7 22-4-4 4-4"
						/><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg
					>
					<span class={isReposted ? 'text-[#17bf63]' : ''}>{repostCount}</span>
				</button>
				<!-- </div> -->
				<!-- <div class="tooltip" data-tip="Reply to comment"> -->
				<button
					class="group flex cursor-pointer items-center gap-1 border-none bg-transparent p-0"
					onclick={toggleReplyForm}
					title="Reply to comment"
				>
					<svg
						class="h-4 w-4 stroke-current transition-all duration-150 group-hover:stroke-[#1d9bf0]"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path
							d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"
						/></svg
					>
					<span>{replyCount}</span>
				</button>
				<!-- </div> -->
				<!-- Bluesky logo for "View on Bluesky" -->
				<div class="tooltip tooltip-right duration-50" data-tip="View on Bluesky">
					<a
						class="group flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-blue-500 no-underline transition-transform duration-150 hover:scale-105"
						href={`https://bsky.app/profile/${comment.post?.author?.did}/post/${getPostId(comment.post?.uri || '')}`}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="View on Bluesky"
					>
						<svg
							class="h-4 w-4 stroke-current hover:stroke-[#1d9bf0]"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 568 501"
						>
							<title>View on Bluesky</title>
							<path
								fill="currentColor"
								d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"
							></path>
						</svg>
					</a>
				</div>
			</div>

			<!-- Reply Form -->
			{#if showReplyForm}
				<div class="mt-3">
					<textarea
						bind:value={replyText}
						onkeydown={handleReplyKeydown}
						placeholder="Write a reply..."
						class="textarea-bordered textarea min-h-16 w-full font-comment text-sm"
						disabled={isSubmittingReply}
						rows="3"
					></textarea>
					<div class="mt-2 flex items-start justify-between">
						<span class="text-xs text-base-content/80">The reply will also appear on Bluesky</span>
						<div class="flex gap-2">
							<button
								class="btn btn-ghost btn-sm"
								onclick={() => {
									showReplyForm = false;
									replyText = '';
								}}
								disabled={isSubmittingReply}
							>
								Cancel
							</button>
							<button
								class="btn btn-sm btn-primary"
								onclick={handleReply}
								disabled={isSubmittingReply || !replyText.trim()}
							>
								{isSubmittingReply ? 'Posting...' : 'Reply'}
							</button>
						</div>
					</div>
				</div>
			{/if}

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

		<!-- Nested Replies -->
		{#if (comment.replies && comment.replies.length > 0) || localReplies.length > 0}
			<div class="mt-3 border-l-2 border-base-300 pl-3">
				{#each visibleReplies as reply (reply.post?.uri)}
					<CommentNode comment={reply} {sortOrder} />
				{/each}
				{#if hiddenReplyCount > 0}
					<button
						class="btn mt-2 w-full btn-ghost btn-sm"
						onclick={() => (visibleReplyCount += NESTED_PAGE_SIZE)}
					>
						Show {Math.min(hiddenReplyCount, NESTED_PAGE_SIZE)} more replies
					</button>
				{/if}
			</div>
		{/if}
	</div>
{/if}
