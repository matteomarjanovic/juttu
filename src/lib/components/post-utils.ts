import { authState } from '$lib/auth.svelte';

export function formatDate(
	dateStr: string | undefined,
	options: Intl.DateTimeFormatOptions = {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}
): string {
	if (!dateStr) return '';
	return new Date(dateStr).toLocaleDateString(undefined, options);
}

export function makeOptimisticPost(response: { uri: string; cid: string }, text: string) {
	return {
		post: {
			uri: response.uri,
			cid: response.cid,
			author: {
				did: authState.profile?.did ?? authState.session?.did,
				handle: authState.profile?.handle ?? authState.session?.sub,
				displayName: authState.profile?.displayName,
				avatar: authState.profile?.avatar
			},
			record: { text, createdAt: new Date().toISOString() },
			indexedAt: new Date().toISOString(),
			likeCount: 0,
			repostCount: 0,
			replyCount: 0
		},
		replies: []
	};
}
