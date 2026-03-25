import type {
	AtUri,
	BskyFacet,
	BskyPost,
	CurrentUser,
	DocumentRecord,
	SortOption,
	ThreadViewPost,
	ViewerState
} from './types';

export function parseAtUri(href: string): AtUri | null {
	if (!href.startsWith('at://')) return null;
	const parts = href.slice('at://'.length).split('/');
	if (parts.length !== 3) return null;
	const [did, collection, rkey] = parts;
	if (!did || !collection || !rkey) return null;
	return { did, collection, rkey };
}

export async function resolveDid(did: string): Promise<string> {
	let didDoc: { service?: Array<{ id: string; type: string; serviceEndpoint: string }> };

	if (did.startsWith('did:plc:')) {
		const res = await fetch(`https://plc.directory/${did}`);
		if (!res.ok) throw new Error(`Failed to resolve DID: ${res.status}`);
		didDoc = await res.json();
	} else if (did.startsWith('did:web:')) {
		const host = did.split(':').slice(2).join(':');
		const res = await fetch(`https://${host}/.well-known/did.json`);
		if (!res.ok) throw new Error(`Failed to resolve did:web DID: ${res.status}`);
		didDoc = await res.json();
	} else {
		throw new Error(`Unsupported DID method: ${did}`);
	}

	const pds = didDoc.service?.find((s) => s.type === 'AtprotoPersonalDataServer');
	if (!pds?.serviceEndpoint) throw new Error('No PDS endpoint found in DID document');
	return pds.serviceEndpoint;
}

export async function fetchDocumentRecord(
	pdsUrl: string,
	atUri: AtUri
): Promise<DocumentRecord | null> {
	const url =
		`${pdsUrl}/xrpc/com.atproto.repo.getRecord` +
		`?repo=${encodeURIComponent(atUri.did)}` +
		`&collection=${encodeURIComponent(atUri.collection)}` +
		`&rkey=${encodeURIComponent(atUri.rkey)}`;
	const res = await fetch(url);
	if (res.status >= 400 && res.status < 500) return null;
	if (!res.ok) throw new Error(`Failed to fetch document record: ${res.status}`);
	const data = await res.json();
	return data.value as DocumentRecord;
}

export async function fetchThread(rootUri: string): Promise<ThreadViewPost> {
	const url =
		`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread` +
		`?uri=${encodeURIComponent(rootUri)}&depth=10&parentHeight=0`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch thread: ${res.status}`);
	const data = await res.json();
	if (!data.thread) throw new Error('Thread data missing from response');
	return data.thread as ThreadViewPost;
}

export async function checkCurrentUser(apiUrl: string): Promise<CurrentUser | null> {
	try {
		const res = await fetch(`${apiUrl}/auth/me`, { credentials: 'include' });
		if (!res.ok) return null;
		return (await res.json()) as CurrentUser;
	} catch {
		return null;
	}
}

export async function fetchUserProfile(handle: string): Promise<{ avatar?: string; displayName?: string }> {
	try {
		const res = await fetch(
			`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`
		);
		if (!res.ok) return {};
		const data = await res.json();
		return {
			avatar: data.avatar as string | undefined,
			displayName: data.displayName as string | undefined
		};
	} catch {
		return {};
	}
}

export function formatRelativeTime(isoDate: string): string {
	const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
	if (diff < 60) return 'just now';
	if (diff < 3600) return `${Math.floor(diff / 60)}m`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
	if (diff < 2592000) return `${Math.floor(diff / 86400)}d`;
	if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo`;
	return `${Math.floor(diff / 31536000)}y`;
}

function isSafeUri(uri: string): boolean {
	return uri.startsWith('https://') || uri.startsWith('http://');
}

export function renderRichText(text: string, facets: BskyFacet[] | undefined): DocumentFragment {
	const fragment = document.createDocumentFragment();
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();
	const bytes = encoder.encode(text);

	if (!facets || facets.length === 0) {
		fragment.appendChild(document.createTextNode(text));
		return fragment;
	}

	const sorted = [...facets].sort((a, b) => a.index.byteStart - b.index.byteStart);
	let cursor = 0;

	for (const facet of sorted) {
		const { byteStart, byteEnd } = facet.index;
		if (byteStart > cursor) {
			fragment.appendChild(document.createTextNode(decoder.decode(bytes.slice(cursor, byteStart))));
		}
		const displayText = decoder.decode(bytes.slice(byteStart, byteEnd));
		const feature = facet.features[0];

		if (!feature) {
			fragment.appendChild(document.createTextNode(displayText));
		} else if (feature.$type === 'app.bsky.richtext.facet#link') {
			if (isSafeUri(feature.uri)) {
				const a = document.createElement('a');
				a.className = 'juttu-link';
				a.href = feature.uri;
				a.target = '_blank';
				a.rel = 'noopener noreferrer';
				a.textContent = displayText;
				fragment.appendChild(a);
			} else {
				fragment.appendChild(document.createTextNode(displayText));
			}
		} else if (feature.$type === 'app.bsky.richtext.facet#mention') {
			const a = document.createElement('a');
			a.className = 'juttu-mention';
			a.href = `https://bsky.app/profile/${feature.did}`;
			a.target = '_blank';
			a.rel = 'noopener noreferrer';
			a.textContent = displayText;
			fragment.appendChild(a);
		} else if (feature.$type === 'app.bsky.richtext.facet#tag') {
			const a = document.createElement('a');
			a.className = 'juttu-hashtag';
			a.href = `https://bsky.app/search?q=${encodeURIComponent('#' + feature.tag)}`;
			a.target = '_blank';
			a.rel = 'noopener noreferrer';
			a.textContent = displayText;
			fragment.appendChild(a);
		} else {
			fragment.appendChild(document.createTextNode(displayText));
		}
		cursor = byteEnd;
	}

	if (cursor < bytes.length) {
		fragment.appendChild(document.createTextNode(decoder.decode(bytes.slice(cursor))));
	}
	return fragment;
}

export function getTopLevelReplies(thread: ThreadViewPost): ThreadViewPost[] {
	return (thread.replies ?? []).filter(
		(r): r is ThreadViewPost => r.$type === 'app.bsky.feed.defs#threadViewPost'
	);
}

export function sortReplies(replies: ThreadViewPost[], order: SortOption): ThreadViewPost[] {
	return [...replies].sort((a, b) => {
		if (order === 'most-liked') return (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0);
		if (order === 'oldest')
			return new Date(a.post.indexedAt).getTime() - new Date(b.post.indexedAt).getTime();
		return new Date(b.post.indexedAt).getTime() - new Date(a.post.indexedAt).getTime();
	});
}

export function collectViewerState(thread: ThreadViewPost, map: Map<string, ViewerState>): void {
	const { post } = thread;
	if (post.viewer?.like || post.viewer?.repost) {
		map.set(post.uri, { likeUri: post.viewer.like, repostUri: post.viewer.repost });
	}
	for (const reply of thread.replies ?? []) {
		if (reply.$type === 'app.bsky.feed.defs#threadViewPost') {
			collectViewerState(reply as ThreadViewPost, map);
		}
	}
}

export function findPostInThread(thread: ThreadViewPost | null, uri: string): BskyPost | null {
	if (!thread) return null;
	if (thread.post.uri === uri) return thread.post;
	for (const reply of thread.replies ?? []) {
		if (reply.$type === 'app.bsky.feed.defs#threadViewPost') {
			const found = findPostInThread(reply as ThreadViewPost, uri);
			if (found) return found;
		}
	}
	return null;
}
