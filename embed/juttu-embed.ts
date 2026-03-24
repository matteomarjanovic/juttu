// ─── Types ────────────────────────────────────────────────────────────────────

interface JuttuConfig {
	apiUrl: string;
	theme: 'auto' | 'light' | 'dark';
}

interface AtUri {
	did: string;
	collection: string;
	rkey: string;
}

interface BskyAuthor {
	did: string;
	handle: string;
	displayName?: string;
	avatar?: string;
}

interface BskyPostRecord {
	text: string;
	createdAt: string;
	facets?: BskyFacet[];
	reply?: {
		root: { uri: string; cid: string };
		parent: { uri: string; cid: string };
	};
}

interface BskyEmbedImage {
	thumb: string;
	fullsize: string;
	alt?: string;
}

interface BskyEmbed {
	$type: string;
	images?: BskyEmbedImage[];
}

interface BskyPost {
	uri: string;
	cid: string;
	author: BskyAuthor;
	record: BskyPostRecord;
	indexedAt: string;
	likeCount?: number;
	repostCount?: number;
	replyCount?: number;
	embed?: BskyEmbed;
	viewer?: { like?: string; repost?: string };
}

interface ThreadViewPost {
	$type: string;
	post: BskyPost;
	replies?: ThreadViewPost[];
}

interface FacetLink {
	$type: 'app.bsky.richtext.facet#link';
	uri: string;
}
interface FacetMention {
	$type: 'app.bsky.richtext.facet#mention';
	did: string;
}
interface FacetTag {
	$type: 'app.bsky.richtext.facet#tag';
	tag: string;
}
interface BskyFacet {
	index: { byteStart: number; byteEnd: number };
	features: Array<FacetLink | FacetMention | FacetTag>;
}

interface CurrentUser {
	did: string;
	handle: string;
	avatar?: string;
}

interface DocumentRecord {
	bskyPostRef?: { uri: string; cid: string };
	path?: string;
}

interface ViewerState {
	likeUri?: string;
	repostUri?: string;
}

interface PaginationState {
	visibleTopLevel: number;
	visibleReplies: Map<string, number>;
}

type SortOption = 'newest' | 'oldest' | 'most-liked';

// ─── Constants ────────────────────────────────────────────────────────────────

const TOP_LEVEL_PAGE_SIZE = 10;
const NESTED_PAGE_SIZE = 3;
const LOGIN_POLL_INTERVAL_MS = 1500;
const LOGIN_POLL_TIMEOUT_MS = 120_000;
const POST_REFETCH_DELAY_MS = 1500;

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SVG_LIKE = `<svg class="juttu-like-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`;

const SVG_REPOST = `<svg class="juttu-repost-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>`;

const SVG_REPLY = `<svg class="juttu-reply-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>`;

const SVG_BSKY = `<svg class="juttu-bsky-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568 501" width="16" height="16" fill="currentColor"><path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"/></svg>`;

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
.juttu-comments {
  --juttu-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --juttu-font-size: 14px;
  --juttu-bg: #ffffff;
  --juttu-surface: #f7f9f9;
  --juttu-border-color: #e1e8ed;
  --juttu-text: #0f1419;
  --juttu-text-muted: #536471;
  --juttu-accent-color: #1d9bf0;
  --juttu-like-color: #e0245e;
  --juttu-repost-color: #17bf63;
  --juttu-avatar-size: 32px;
  --juttu-radius: 8px;
}
@media (prefers-color-scheme: dark) {
  .juttu-comments:not([data-juttu-theme]) {
    --juttu-bg: #15202b;
    --juttu-surface: #1e2732;
    --juttu-border-color: #38444d;
    --juttu-text: #ffffff;
    --juttu-text-muted: #8b98a5;
  }
}
.juttu-comments[data-juttu-theme="dark"] {
  --juttu-bg: #15202b;
  --juttu-surface: #1e2732;
  --juttu-border-color: #38444d;
  --juttu-text: #ffffff;
  --juttu-text-muted: #8b98a5;
}
.juttu-comments[data-juttu-theme="light"] {
  --juttu-bg: #ffffff;
  --juttu-surface: #f7f9f9;
  --juttu-border-color: #e1e8ed;
  --juttu-text: #0f1419;
  --juttu-text-muted: #536471;
}
.juttu-comments {
  font-family: var(--juttu-font-family);
  font-size: var(--juttu-font-size);
  color: var(--juttu-text);
  background: var(--juttu-bg);
  border: 1px solid var(--juttu-border-color);
  border-radius: var(--juttu-radius);
  padding: 1.25rem;
  box-sizing: border-box;
}
.juttu-comments *, .juttu-comments *::before, .juttu-comments *::after {
  box-sizing: border-box;
}
.juttu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.juttu-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: var(--juttu-text);
}
.juttu-sort-controls { display: flex; gap: 0.25rem; }
.juttu-sort-btn {
  background: none;
  border: 1px solid var(--juttu-border-color);
  border-radius: 999px;
  padding: 0.2rem 0.65rem;
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--juttu-text-muted);
  font-family: var(--juttu-font-family);
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}
.juttu-sort-btn:hover { border-color: var(--juttu-accent-color); color: var(--juttu-accent-color); }
.juttu-sort-btn--active { background: var(--juttu-accent-color); border-color: var(--juttu-accent-color); color: #fff; }
.juttu-composer {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--juttu-border-color);
}
.juttu-login-area { display: flex; align-items: center; gap: 0.5rem; }
.juttu-login-btn {
  background: var(--juttu-accent-color);
  color: #fff;
  border: none;
  border-radius: var(--juttu-radius);
  padding: 0.45rem 1.1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: var(--juttu-font-family);
  font-weight: 500;
  transition: opacity 0.15s;
}
.juttu-login-btn:hover { opacity: 0.88; }
.juttu-login-form { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.juttu-handle-input {
  flex: 1;
  min-width: 160px;
  border: 1px solid var(--juttu-border-color);
  border-radius: var(--juttu-radius);
  padding: 0.4rem 0.65rem;
  font-family: var(--juttu-font-family);
  font-size: 0.875rem;
  background: var(--juttu-surface);
  color: var(--juttu-text);
}
.juttu-handle-input:focus { outline: none; border-color: var(--juttu-accent-color); }
.juttu-handle-input::placeholder { color: var(--juttu-text-muted); }
.juttu-login-submit {
  background: var(--juttu-accent-color);
  color: #fff;
  border: none;
  border-radius: var(--juttu-radius);
  padding: 0.4rem 0.85rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: var(--juttu-font-family);
  white-space: nowrap;
  transition: opacity 0.15s;
}
.juttu-login-submit:hover:not(:disabled) { opacity: 0.88; }
.juttu-login-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.juttu-login-cancel, .juttu-login-cancel-poll {
  background: none;
  border: 1px solid var(--juttu-border-color);
  border-radius: var(--juttu-radius);
  padding: 0.4rem 0.65rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--juttu-text-muted);
  font-family: var(--juttu-font-family);
}
.juttu-login-waiting { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; color: var(--juttu-text-muted); }
.juttu-login-error { font-size: 0.8rem; color: #c0392b; margin-top: 0.35rem; }
.juttu-compose-user { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.juttu-compose-avatar {
  width: var(--juttu-avatar-size);
  height: var(--juttu-avatar-size);
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.juttu-compose-handle { font-size: 0.875rem; color: var(--juttu-text-muted); flex: 1; }
.juttu-logout-btn {
  background: none;
  border: 1px solid var(--juttu-border-color);
  border-radius: 4px;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--juttu-text-muted);
  font-family: var(--juttu-font-family);
}
.juttu-logout-btn:hover { border-color: var(--juttu-text-muted); }
.juttu-compose-input {
  width: 100%;
  border: 1px solid var(--juttu-border-color);
  border-radius: var(--juttu-radius);
  padding: 0.5rem 0.75rem;
  font-family: var(--juttu-font-family);
  font-size: 0.875rem;
  resize: vertical;
  min-height: 4rem;
  background: var(--juttu-surface);
  color: var(--juttu-text);
  transition: border-color 0.15s;
}
.juttu-compose-input:focus { outline: none; border-color: var(--juttu-accent-color); }
.juttu-compose-input::placeholder { color: var(--juttu-text-muted); }
.juttu-submit-btn {
  margin-top: 0.5rem;
  background: var(--juttu-accent-color);
  color: #fff;
  border: none;
  border-radius: var(--juttu-radius);
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-family: var(--juttu-font-family);
  font-weight: 500;
  transition: opacity 0.15s;
}
.juttu-submit-btn:hover:not(:disabled) { opacity: 0.88; }
.juttu-submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.juttu-post-error { font-size: 0.75rem; color: #c0392b; margin-top: 0.25rem; }
.juttu-comment { margin-bottom: 1rem; }
.juttu-comment-header { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.35rem; }
.juttu-avatar-link { flex-shrink: 0; display: block; }
.juttu-avatar { width: var(--juttu-avatar-size); height: var(--juttu-avatar-size); border-radius: 50%; object-fit: cover; display: block; }
.juttu-avatar-placeholder { width: var(--juttu-avatar-size); height: var(--juttu-avatar-size); border-radius: 50%; background: var(--juttu-border-color); flex-shrink: 0; }
.juttu-author-info { display: flex; flex-direction: column; min-width: 0; flex: 1; gap: 0.1rem; }
.juttu-display-name { font-weight: 700; font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--juttu-text); text-decoration: none; }
.juttu-display-name:hover { text-decoration: underline; }
.juttu-handle { font-size: 0.8rem; color: var(--juttu-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-decoration: none; }
.juttu-handle:hover { text-decoration: underline; }
.juttu-time-link { font-size: 0.75rem; color: var(--juttu-text-muted); text-decoration: none; flex-shrink: 0; white-space: nowrap; }
.juttu-time-link:hover { text-decoration: underline; }
.juttu-comment-body { font-size: 0.875rem; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; margin-bottom: 0.4rem; color: var(--juttu-text); }
.juttu-mention, .juttu-link, .juttu-hashtag { color: var(--juttu-accent-color); text-decoration: none; }
.juttu-mention:hover, .juttu-link:hover, .juttu-hashtag:hover { text-decoration: underline; }
.juttu-comment-images { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.4rem; }
.juttu-comment-image-link { display: block; overflow: hidden; border-radius: var(--juttu-radius); border: 1px solid var(--juttu-border-color); transition: transform 0.15s; }
.juttu-comment-image-link:hover { transform: scale(1.01); }
.juttu-comment-image { max-height: 16rem; max-width: 100%; display: block; object-fit: cover; }
.juttu-comment-actions { display: flex; align-items: center; gap: 1rem; font-size: 0.75rem; color: var(--juttu-text-muted); margin-top: 0.4rem; }
.juttu-like-btn, .juttu-repost-btn, .juttu-reply-btn {
  background: none; border: none; display: flex; align-items: center; gap: 0.3rem;
  cursor: pointer; color: var(--juttu-text-muted); padding: 0;
  font-family: var(--juttu-font-family); font-size: 0.75rem; transition: color 0.15s;
}
.juttu-like-btn .juttu-like-icon { stroke: currentColor; transition: stroke 0.15s, fill 0.15s; }
.juttu-like-btn:hover .juttu-like-icon { stroke: var(--juttu-like-color); }
.juttu-like-btn[data-liked="true"] .juttu-like-icon { stroke: var(--juttu-like-color); fill: var(--juttu-like-color); }
.juttu-like-btn[data-liked="true"] .juttu-like-count { color: var(--juttu-like-color); }
.juttu-repost-btn .juttu-repost-icon { stroke: currentColor; transition: stroke 0.15s; }
.juttu-repost-btn:hover .juttu-repost-icon { stroke: var(--juttu-repost-color); }
.juttu-repost-btn[data-reposted="true"] .juttu-repost-icon { stroke: var(--juttu-repost-color); }
.juttu-repost-btn[data-reposted="true"] .juttu-repost-count { color: var(--juttu-repost-color); }
.juttu-reply-btn .juttu-reply-icon { stroke: currentColor; transition: stroke 0.15s; }
.juttu-reply-btn:hover .juttu-reply-icon { stroke: var(--juttu-accent-color); }
.juttu-bsky-link { color: var(--juttu-accent-color); text-decoration: none; display: flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; transition: opacity 0.15s; }
.juttu-bsky-link:hover { opacity: 0.75; }
.juttu-action-error { font-size: 0.72rem; color: #c0392b; margin-top: 0.2rem; }
.juttu-reply-form { margin-top: 0.5rem; }
.juttu-reply-input {
  width: 100%; border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.4rem 0.65rem; font-family: var(--juttu-font-family); font-size: 0.875rem;
  resize: vertical; background: var(--juttu-surface); color: var(--juttu-text);
  transition: border-color 0.15s;
}
.juttu-reply-input:focus { outline: none; border-color: var(--juttu-accent-color); }
.juttu-reply-input::placeholder { color: var(--juttu-text-muted); }
.juttu-reply-form-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; margin-top: 0.4rem; }
.juttu-reply-hint { font-size: 0.7rem; color: var(--juttu-text-muted); flex: 1; }
.juttu-reply-cancel {
  background: none; border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.3rem 0.65rem; cursor: pointer; font-size: 0.8rem;
  color: var(--juttu-text-muted); font-family: var(--juttu-font-family);
}
.juttu-reply-submit {
  background: var(--juttu-accent-color); color: #fff; border: none;
  border-radius: var(--juttu-radius); padding: 0.3rem 0.75rem;
  cursor: pointer; font-size: 0.8rem; font-family: var(--juttu-font-family);
  transition: opacity 0.15s;
}
.juttu-reply-submit:hover:not(:disabled) { opacity: 0.88; }
.juttu-reply-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.juttu-reply-error { font-size: 0.75rem; color: #c0392b; margin-top: 0.25rem; }
.juttu-replies { border-left: 2px solid var(--juttu-border-color); padding-left: 0.75rem; margin-top: 0.75rem; }
.juttu-show-replies-btn {
  background: none; border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.35rem 1rem; cursor: pointer; font-size: 0.8rem; color: var(--juttu-accent-color);
  font-family: var(--juttu-font-family); width: 100%; margin-top: 0.5rem; transition: border-color 0.15s;
}
.juttu-show-replies-btn:hover { border-color: var(--juttu-accent-color); }
.juttu-load-more { text-align: center; margin-top: 0.5rem; }
.juttu-load-more-btn {
  background: none; border: 1px solid var(--juttu-border-color); border-radius: var(--juttu-radius);
  padding: 0.4rem 1rem; cursor: pointer; font-size: 0.8rem; color: var(--juttu-accent-color);
  font-family: var(--juttu-font-family); width: 100%; transition: border-color 0.15s;
}
.juttu-load-more-btn:hover { border-color: var(--juttu-accent-color); }
.juttu-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--juttu-border-color); text-align: right; }
.juttu-powered-by { font-size: 0.7rem; color: var(--juttu-text-muted); text-decoration: none; }
.juttu-powered-by:hover { text-decoration: underline; }
.juttu-loading { padding: 2rem; text-align: center; color: var(--juttu-text-muted); font-size: 0.875rem; }
.juttu-error { padding: 1rem; color: #c0392b; font-size: 0.875rem; background: #fdf0ee; border-radius: var(--juttu-radius); border: 1px solid #f5c6c0; }
@keyframes juttu-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
.juttu-login-btn--pulse { animation: juttu-pulse 0.35s ease-in-out 2; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseAtUri(href: string): AtUri | null {
	if (!href.startsWith('at://')) return null;
	const parts = href.slice('at://'.length).split('/');
	if (parts.length !== 3) return null;
	const [did, collection, rkey] = parts;
	if (!did || !collection || !rkey) return null;
	return { did, collection, rkey };
}

async function resolveDid(did: string): Promise<string> {
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

async function fetchDocumentRecord(pdsUrl: string, atUri: AtUri): Promise<DocumentRecord> {
	const url =
		`${pdsUrl}/xrpc/com.atproto.repo.getRecord` +
		`?repo=${encodeURIComponent(atUri.did)}` +
		`&collection=${encodeURIComponent(atUri.collection)}` +
		`&rkey=${encodeURIComponent(atUri.rkey)}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch document record: ${res.status}`);
	const data = await res.json();
	return data.value as DocumentRecord;
}

async function fetchThread(rootUri: string): Promise<ThreadViewPost> {
	const url =
		`https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread` +
		`?uri=${encodeURIComponent(rootUri)}&depth=10&parentHeight=0`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to fetch thread: ${res.status}`);
	const data = await res.json();
	if (!data.thread) throw new Error('Thread data missing from response');
	return data.thread as ThreadViewPost;
}

async function checkCurrentUser(apiUrl: string): Promise<CurrentUser | null> {
	try {
		const res = await fetch(`${apiUrl}/auth/me`, { credentials: 'include' });
		if (!res.ok) return null;
		return (await res.json()) as CurrentUser;
	} catch {
		return null;
	}
}

async function fetchUserAvatar(handle: string): Promise<string | undefined> {
	try {
		const res = await fetch(
			`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`
		);
		if (!res.ok) return undefined;
		const data = await res.json();
		return data.avatar as string | undefined;
	} catch {
		return undefined;
	}
}

function formatRelativeTime(isoDate: string): string {
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

function renderRichText(text: string, facets: BskyFacet[] | undefined): DocumentFragment {
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

function getTopLevelReplies(thread: ThreadViewPost): ThreadViewPost[] {
	return (thread.replies ?? []).filter(
		(r): r is ThreadViewPost => r.$type === 'app.bsky.feed.defs#threadViewPost'
	);
}

function sortReplies(replies: ThreadViewPost[], order: SortOption): ThreadViewPost[] {
	return [...replies].sort((a, b) => {
		if (order === 'most-liked') return (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0);
		if (order === 'oldest')
			return new Date(a.post.indexedAt).getTime() - new Date(b.post.indexedAt).getTime();
		return new Date(b.post.indexedAt).getTime() - new Date(a.post.indexedAt).getTime();
	});
}

function collectViewerState(thread: ThreadViewPost, map: Map<string, ViewerState>): void {
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

function findPostInThread(thread: ThreadViewPost | null, uri: string): BskyPost | null {
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

// ─── Widget Class ─────────────────────────────────────────────────────────────

export class JuttuWidget {
	private config: JuttuConfig;
	private container: HTMLElement;
	private threadData: ThreadViewPost | null = null;
	private currentUser: CurrentUser | null = null;
	private rootPostUri: string | null = null;
	private rootPostCid: string | null = null;
	private sortOrder: SortOption = 'newest';
	private pagination: PaginationState = {
		visibleTopLevel: TOP_LEVEL_PAGE_SIZE,
		visibleReplies: new Map()
	};
	private viewerState: Map<string, ViewerState> = new Map();
	private openReplyFormUri: string | null = null;
	private loginPopup: Window | null = null;
	private loginPollInterval: ReturnType<typeof setInterval> | null = null;
	private loginPollStartTime = 0;
	private authMessageHandler: ((e: MessageEvent) => void) | null = null;

	constructor(container: HTMLElement, config: JuttuConfig) {
		this.container = container;
		this.config = config;
		this.injectStyles();
		this.init();
	}

	private injectStyles(): void {
		if (document.getElementById('juttu-styles')) return;
		const style = document.createElement('style');
		style.id = 'juttu-styles';
		style.textContent = STYLES;
		document.head.appendChild(style);
	}

	private async init(): Promise<void> {
		this.renderLoading();
		try {
			const linkEl = document.querySelector('link[rel="site.standard.document"]');
			if (!linkEl) {
				this.renderError(
					'Missing <link rel="site.standard.document"> tag on this page. Add it to enable comments.'
				);
				return;
			}
			const href = linkEl.getAttribute('href');
			if (!href || !href.startsWith('at://')) {
				this.renderError(
					'Invalid <link rel="site.standard.document" href> — must be an AT URI (at://).'
				);
				return;
			}
			const atUri = parseAtUri(href);
			if (!atUri) {
				this.renderError('Could not parse AT URI from link tag.');
				return;
			}
			const pdsUrl = await resolveDid(atUri.did);
			const docRecord = await fetchDocumentRecord(pdsUrl, atUri);
			if (!docRecord.bskyPostRef?.uri) {
				this.renderError('This article has no linked Bluesky post yet.');
				return;
			}
			this.rootPostUri = docRecord.bskyPostRef.uri;
			this.rootPostCid = docRecord.bskyPostRef.cid;

			const [user, thread] = await Promise.all([
				checkCurrentUser(this.config.apiUrl),
				fetchThread(docRecord.bskyPostRef.uri)
			]);
			this.currentUser = user;
			this.threadData = thread;
			collectViewerState(thread, this.viewerState);
			this.renderWidget();
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			this.renderError(`Could not load comments: ${message}`);
		}
	}

	// ─── Render ─────────────────────────────────────────────────────────────────

	private renderLoading(): void {
		this.container.innerHTML = '';
		const wrapper = this.makeRoot();
		const loading = document.createElement('div');
		loading.className = 'juttu-loading';
		loading.textContent = 'Loading comments…';
		wrapper.appendChild(loading);
		this.container.appendChild(wrapper);
	}

	private renderError(message: string): void {
		this.container.innerHTML = '';
		const wrapper = this.makeRoot();
		const error = document.createElement('div');
		error.className = 'juttu-error';
		error.textContent = `Juttu: ${message}`;
		wrapper.appendChild(error);
		this.container.appendChild(wrapper);
	}

	private makeRoot(): HTMLElement {
		const root = document.createElement('div');
		root.className = 'juttu-comments';
		if (this.config.theme !== 'auto') root.setAttribute('data-juttu-theme', this.config.theme);
		return root;
	}

	private renderWidget(): void {
		this.container.innerHTML = '';
		const root = this.makeRoot();

		const topLevelReplies = this.threadData ? getTopLevelReplies(this.threadData) : [];
		root.appendChild(this.renderHeader(topLevelReplies.length));
		root.appendChild(this.renderComposer());
		root.appendChild(this.renderThread(topLevelReplies));

		const footer = document.createElement('div');
		footer.className = 'juttu-footer';
		const poweredBy = document.createElement('a');
		poweredBy.className = 'juttu-powered-by';
		poweredBy.href = 'https://juttu.app';
		poweredBy.target = '_blank';
		poweredBy.rel = 'noopener noreferrer';
		poweredBy.textContent = 'Powered by Juttu';
		footer.appendChild(poweredBy);
		root.appendChild(footer);

		root.addEventListener('click', (e) => this.handleClick(e));
		root.addEventListener('input', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('juttu-compose-input')) {
				const submitBtn = root.querySelector<HTMLButtonElement>('.juttu-submit-btn');
				if (submitBtn) submitBtn.disabled = !(target as HTMLTextAreaElement).value.trim();
			}
			if (target.classList.contains('juttu-reply-input')) {
				const form = target.closest('.juttu-reply-form');
				const btn = form?.querySelector<HTMLButtonElement>('.juttu-reply-submit');
				if (btn) btn.disabled = !(target as HTMLTextAreaElement).value.trim();
			}
		});
		root.addEventListener('keydown', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('juttu-handle-input') && (e as KeyboardEvent).key === 'Enter') {
				this.handleLoginSubmit();
			}
		});

		this.container.appendChild(root);
	}

	private handleClick(e: MouseEvent): void {
		const target = e.target as HTMLElement;

		// Sort
		const sortBtn = target.closest<HTMLElement>('.juttu-sort-btn');
		if (sortBtn) {
			const order = sortBtn.dataset.sort as SortOption | undefined;
			if (order) this.setSortOrder(order);
			return;
		}

		// Pagination
		if (target.closest('.juttu-load-more-btn')) {
			this.pagination.visibleTopLevel += TOP_LEVEL_PAGE_SIZE;
			this.renderWidget();
			return;
		}
		const showRepliesBtn = target.closest<HTMLElement>('.juttu-show-replies-btn');
		if (showRepliesBtn) {
			const uri = showRepliesBtn.dataset.uri;
			if (uri) {
				const current = this.pagination.visibleReplies.get(uri) ?? NESTED_PAGE_SIZE;
				this.pagination.visibleReplies.set(uri, current + NESTED_PAGE_SIZE);
				this.renderWidget();
			}
			return;
		}

		// Login flow
		if (target.closest('.juttu-login-btn')) { this.showLoginForm(); return; }
		if (target.closest('.juttu-login-submit')) { this.handleLoginSubmit(); return; }
		if (target.closest('.juttu-login-cancel') || target.closest('.juttu-login-cancel-poll')) {
			this.cancelLogin();
			return;
		}

		// Logout
		if (target.closest('.juttu-logout-btn')) { this.handleLogout(); return; }

		// Like
		const likeBtn = target.closest<HTMLElement>('.juttu-like-btn');
		if (likeBtn) { if (this.requireAuth()) this.handleLike(likeBtn); return; }

		// Repost
		const repostBtn = target.closest<HTMLElement>('.juttu-repost-btn');
		if (repostBtn) { if (this.requireAuth()) this.handleRepost(repostBtn); return; }

		// Reply toggle
		const replyBtn = target.closest<HTMLElement>('.juttu-reply-btn');
		if (replyBtn) {
			const uri = replyBtn.dataset.uri;
			if (uri) { if (this.requireAuth()) this.handleToggleReplyForm(uri); }
			return;
		}

		// Reply form actions
		if (target.closest('.juttu-reply-cancel')) { this.closeReplyForm(); return; }
		if (target.closest('.juttu-reply-submit')) {
			if (this.openReplyFormUri) this.handleSubmitReply(this.openReplyFormUri);
			return;
		}

		// Top-level post
		if (target.closest('.juttu-submit-btn')) { if (this.requireAuth()) this.handlePost(); return; }
	}

	private setSortOrder(order: SortOption): void {
		this.sortOrder = order;
		this.pagination.visibleTopLevel = TOP_LEVEL_PAGE_SIZE;
		this.pagination.visibleReplies.clear();
		this.renderWidget();
	}

	private renderHeader(commentCount: number): HTMLElement {
		const header = document.createElement('div');
		header.className = 'juttu-header';

		const title = document.createElement('h2');
		title.className = 'juttu-title';
		title.textContent = `${commentCount} Comment${commentCount !== 1 ? 's' : ''}`;
		header.appendChild(title);

		const sortControls = document.createElement('div');
		sortControls.className = 'juttu-sort-controls';
		for (const { value, label } of [
			{ value: 'newest' as SortOption, label: 'Newest' },
			{ value: 'oldest' as SortOption, label: 'Oldest' },
			{ value: 'most-liked' as SortOption, label: 'Top' }
		]) {
			const btn = document.createElement('button');
			btn.className = 'juttu-sort-btn' + (this.sortOrder === value ? ' juttu-sort-btn--active' : '');
			btn.dataset.sort = value;
			btn.textContent = label;
			sortControls.appendChild(btn);
		}
		header.appendChild(sortControls);
		return header;
	}

	private renderComposer(): HTMLElement {
		const composer = document.createElement('div');
		composer.className = 'juttu-composer';
		if (!this.currentUser) {
			composer.appendChild(this.makeLoginArea());
		} else {
			composer.appendChild(this.makeComposeArea());
		}
		return composer;
	}

	private makeLoginArea(): HTMLElement {
		const area = document.createElement('div');
		area.className = 'juttu-login-area';
		const btn = document.createElement('button');
		btn.className = 'juttu-login-btn';
		btn.textContent = 'Login with Bluesky';
		area.appendChild(btn);
		return area;
	}

	private makeComposeArea(): HTMLElement {
		const area = document.createElement('div');
		area.className = 'juttu-compose-area';

		const userRow = document.createElement('div');
		userRow.className = 'juttu-compose-user';

		if (this.currentUser!.avatar) {
			const img = document.createElement('img');
			img.className = 'juttu-compose-avatar';
			img.src = this.currentUser!.avatar;
			img.alt = this.currentUser!.handle;
			userRow.appendChild(img);
		} else {
			const ph = document.createElement('div');
			ph.className = 'juttu-avatar-placeholder';
			userRow.appendChild(ph);
		}

		const handle = document.createElement('span');
		handle.className = 'juttu-compose-handle';
		handle.textContent = `@${this.currentUser!.handle}`;
		userRow.appendChild(handle);

		const logoutBtn = document.createElement('button');
		logoutBtn.className = 'juttu-logout-btn';
		logoutBtn.textContent = 'Logout';
		userRow.appendChild(logoutBtn);
		area.appendChild(userRow);

		const textarea = document.createElement('textarea');
		textarea.className = 'juttu-compose-input';
		textarea.placeholder = 'Write a comment…';
		textarea.rows = 3;
		area.appendChild(textarea);

		const submitBtn = document.createElement('button');
		submitBtn.className = 'juttu-submit-btn';
		submitBtn.textContent = 'Post comment';
		submitBtn.disabled = true;
		area.appendChild(submitBtn);

		return area;
	}

	private renderThread(topLevelReplies: ThreadViewPost[]): HTMLElement {
		const thread = document.createElement('div');
		thread.className = 'juttu-thread';

		const sorted = sortReplies(topLevelReplies, this.sortOrder);
		const visible = sorted.slice(0, this.pagination.visibleTopLevel);
		for (const reply of visible) thread.appendChild(this.renderComment(reply, 0));

		if (sorted.length > this.pagination.visibleTopLevel) {
			const loadMore = document.createElement('div');
			loadMore.className = 'juttu-load-more';
			const btn = document.createElement('button');
			btn.className = 'juttu-load-more-btn';
			const remaining = sorted.length - this.pagination.visibleTopLevel;
			btn.textContent = `Load ${Math.min(remaining, TOP_LEVEL_PAGE_SIZE)} more comments`;
			loadMore.appendChild(btn);
			thread.appendChild(loadMore);
		}
		return thread;
	}

	private renderComment(threadView: ThreadViewPost, depth: number): HTMLElement {
		const { post } = threadView;
		const postRkey = post.uri.split('/').pop() ?? '';
		const bskyPostUrl = `https://bsky.app/profile/${post.author.did}/post/${postRkey}`;
		const bskyProfileUrl = `https://bsky.app/profile/${post.author.handle}`;

		const comment = document.createElement('div');
		comment.className = 'juttu-comment';
		comment.dataset.uri = post.uri;
		comment.dataset.cid = post.cid;

		// Header
		const header = document.createElement('div');
		header.className = 'juttu-comment-header';

		if (post.author.avatar) {
			const avatarLink = document.createElement('a');
			avatarLink.className = 'juttu-avatar-link';
			avatarLink.href = bskyProfileUrl;
			avatarLink.target = '_blank';
			avatarLink.rel = 'noopener noreferrer';
			const img = document.createElement('img');
			img.className = 'juttu-avatar';
			img.src = post.author.avatar;
			img.alt = post.author.handle;
			img.loading = 'lazy';
			avatarLink.appendChild(img);
			header.appendChild(avatarLink);
		} else {
			const ph = document.createElement('div');
			ph.className = 'juttu-avatar-placeholder';
			header.appendChild(ph);
		}

		const authorInfo = document.createElement('div');
		authorInfo.className = 'juttu-author-info';

		const displayName = document.createElement('a');
		displayName.className = 'juttu-display-name';
		displayName.href = bskyProfileUrl;
		displayName.target = '_blank';
		displayName.rel = 'noopener noreferrer';
		displayName.textContent = post.author.displayName || post.author.handle;
		authorInfo.appendChild(displayName);

		const handle = document.createElement('a');
		handle.className = 'juttu-handle';
		handle.href = bskyProfileUrl;
		handle.target = '_blank';
		handle.rel = 'noopener noreferrer';
		handle.textContent = `@${post.author.handle}`;
		authorInfo.appendChild(handle);

		header.appendChild(authorInfo);

		const timeLink = document.createElement('a');
		timeLink.className = 'juttu-time-link';
		timeLink.href = bskyPostUrl;
		timeLink.target = '_blank';
		timeLink.rel = 'noopener noreferrer';
		timeLink.textContent = formatRelativeTime(post.indexedAt);
		timeLink.title = new Date(post.indexedAt).toLocaleString();
		header.appendChild(timeLink);
		comment.appendChild(header);

		// Body
		const body = document.createElement('div');
		body.className = 'juttu-comment-body';
		const p = document.createElement('p');
		p.style.margin = '0';
		p.appendChild(renderRichText(post.record.text, post.record.facets));
		body.appendChild(p);
		comment.appendChild(body);

		// Images
		if (post.embed?.$type === 'app.bsky.embed.images#view' && post.embed.images?.length) {
			const images = document.createElement('div');
			images.className = 'juttu-comment-images';
			for (const image of post.embed.images) {
				const link = document.createElement('a');
				link.className = 'juttu-comment-image-link';
				link.href = bskyPostUrl;
				link.target = '_blank';
				link.rel = 'noopener noreferrer';
				const img = document.createElement('img');
				img.className = 'juttu-comment-image';
				img.src = image.thumb;
				img.alt = image.alt || 'Embedded image';
				img.loading = 'lazy';
				link.appendChild(img);
				images.appendChild(link);
			}
			comment.appendChild(images);
		}

		// Actions — use live viewerState, not stale post.viewer
		const state = this.viewerState.get(post.uri) ?? {};
		const isLiked = !!state.likeUri;
		const isReposted = !!state.repostUri;

		const actions = document.createElement('div');
		actions.className = 'juttu-comment-actions';

		const likeBtn = document.createElement('button');
		likeBtn.className = 'juttu-like-btn';
		likeBtn.dataset.liked = String(isLiked);
		likeBtn.dataset.uri = post.uri;
		likeBtn.dataset.cid = post.cid;
		likeBtn.title = 'Like';
		likeBtn.innerHTML = SVG_LIKE;
		const likeCount = document.createElement('span');
		likeCount.className = 'juttu-like-count';
		likeCount.textContent = String(post.likeCount ?? 0);
		likeBtn.appendChild(likeCount);
		actions.appendChild(likeBtn);

		const repostBtn = document.createElement('button');
		repostBtn.className = 'juttu-repost-btn';
		repostBtn.dataset.reposted = String(isReposted);
		repostBtn.dataset.uri = post.uri;
		repostBtn.dataset.cid = post.cid;
		repostBtn.title = 'Repost';
		repostBtn.innerHTML = SVG_REPOST;
		const repostCount = document.createElement('span');
		repostCount.className = 'juttu-repost-count';
		repostCount.textContent = String(post.repostCount ?? 0);
		repostBtn.appendChild(repostCount);
		actions.appendChild(repostBtn);

		const replyBtn = document.createElement('button');
		replyBtn.className = 'juttu-reply-btn';
		replyBtn.dataset.uri = post.uri;
		replyBtn.title = 'Reply';
		replyBtn.innerHTML = SVG_REPLY;
		const replyCount = document.createElement('span');
		replyCount.className = 'juttu-reply-count';
		replyCount.textContent = String(post.replyCount ?? 0);
		replyBtn.appendChild(replyCount);
		actions.appendChild(replyBtn);

		const bskyLink = document.createElement('a');
		bskyLink.className = 'juttu-bsky-link';
		bskyLink.href = bskyPostUrl;
		bskyLink.target = '_blank';
		bskyLink.rel = 'noopener noreferrer';
		bskyLink.title = 'View on Bluesky';
		bskyLink.innerHTML = SVG_BSKY;
		actions.appendChild(bskyLink);

		comment.appendChild(actions);

		// Nested replies
		const nestedReplies = (threadView.replies ?? []).filter(
			(r): r is ThreadViewPost => r.$type === 'app.bsky.feed.defs#threadViewPost'
		);
		if (nestedReplies.length > 0) {
			const repliesContainer = document.createElement('div');
			repliesContainer.className = 'juttu-replies';
			const visibleCount = this.pagination.visibleReplies.get(post.uri) ?? NESTED_PAGE_SIZE;
			const sorted = sortReplies(nestedReplies, this.sortOrder);
			for (const reply of sorted.slice(0, visibleCount)) {
				repliesContainer.appendChild(this.renderComment(reply, depth + 1));
			}
			const hiddenCount = sorted.length - visibleCount;
			if (hiddenCount > 0) {
				const showMore = document.createElement('button');
				showMore.className = 'juttu-show-replies-btn';
				showMore.dataset.uri = post.uri;
				showMore.textContent = `Show ${Math.min(hiddenCount, NESTED_PAGE_SIZE)} more repl${hiddenCount === 1 ? 'y' : 'ies'}`;
				repliesContainer.appendChild(showMore);
			}
			comment.appendChild(repliesContainer);
		}

		return comment;
	}

	// ─── Login ───────────────────────────────────────────────────────────────────

	private getComposer(): HTMLElement | null {
		return this.container.querySelector<HTMLElement>('.juttu-composer');
	}

	private showLoginForm(): void {
		const composer = this.getComposer();
		if (!composer) return;
		composer.innerHTML = '';

		const form = document.createElement('div');
		form.className = 'juttu-login-form';

		const input = document.createElement('input');
		input.type = 'text';
		input.className = 'juttu-handle-input';
		input.placeholder = 'yourhandle.bsky.social';
		input.autocomplete = 'username';
		form.appendChild(input);

		const submitBtn = document.createElement('button');
		submitBtn.className = 'juttu-login-submit';
		submitBtn.textContent = 'Login →';
		form.appendChild(submitBtn);

		const cancelBtn = document.createElement('button');
		cancelBtn.className = 'juttu-login-cancel';
		cancelBtn.textContent = 'Cancel';
		form.appendChild(cancelBtn);

		composer.appendChild(form);
		input.focus();
	}

	private async handleLoginSubmit(): Promise<void> {
		const composer = this.getComposer();
		if (!composer) return;
		const input = composer.querySelector<HTMLInputElement>('.juttu-handle-input');
		const submitBtn = composer.querySelector<HTMLButtonElement>('.juttu-login-submit');
		if (!input || !submitBtn) return;

		const rawHandle = input.value.trim().replace(/^@/, '');
		if (!rawHandle) { input.focus(); return; }

		submitBtn.disabled = true;
		submitBtn.textContent = 'Opening…';

		// Remove any previous error
		composer.querySelector('.juttu-login-error')?.remove();

		try {
			const res = await fetch(`${this.config.apiUrl}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ handle: rawHandle })
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error((data as { error?: string }).error ?? `Login failed (${res.status})`);
			}
			const data = await res.json() as { redirect_url: string };

			this.loginPopup = window.open(
				data.redirect_url,
				'juttu-auth',
				'width=600,height=700,menubar=no,toolbar=no,location=no,status=no'
			);

			// Show waiting state
			composer.innerHTML = '';
			const waiting = document.createElement('div');
			waiting.className = 'juttu-login-waiting';
			const msg = document.createElement('span');
			msg.textContent = 'Waiting for Bluesky authorization…';
			waiting.appendChild(msg);
			const cancelBtn = document.createElement('button');
			cancelBtn.className = 'juttu-login-cancel-poll';
			cancelBtn.textContent = 'Cancel';
			waiting.appendChild(cancelBtn);
			composer.appendChild(waiting);

			// Primary signal: postMessage from the callback HTML page
			this.authMessageHandler = (e: MessageEvent) => {
				if (e.data?.type === 'juttu-auth-complete') {
					this.onAuthComplete();
				}
			};
			window.addEventListener('message', this.authMessageHandler);

			// Fallback polling (handles cases where postMessage doesn't fire)
			this.loginPollStartTime = Date.now();
			this.loginPollInterval = setInterval(() => this.pollForLogin(), LOGIN_POLL_INTERVAL_MS);
		} catch (err) {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Login →';
			const errEl = document.createElement('div');
			errEl.className = 'juttu-login-error';
			errEl.textContent = err instanceof Error ? err.message : 'Login failed';
			composer.appendChild(errEl);
		}
	}

	private async onAuthComplete(): Promise<void> {
		const user = await checkCurrentUser(this.config.apiUrl);
		if (user) await this.completeLogin(user);
	}

	private async pollForLogin(): Promise<void> {
		const elapsed = Date.now() - this.loginPollStartTime;
		if (elapsed > LOGIN_POLL_TIMEOUT_MS) {
			this.cancelLogin();
			return;
		}
		const user = await checkCurrentUser(this.config.apiUrl);
		if (user) await this.completeLogin(user);
	}

	private async completeLogin(user: CurrentUser): Promise<void> {
		if (this.loginPollInterval !== null) {
			clearInterval(this.loginPollInterval);
			this.loginPollInterval = null;
		}
		if (this.authMessageHandler) {
			window.removeEventListener('message', this.authMessageHandler);
			this.authMessageHandler = null;
		}
		try { this.loginPopup?.close(); } catch { /* cross-origin popup close may throw */ }
		this.loginPopup = null;

		// Fetch avatar from Bluesky public API
		const avatar = await fetchUserAvatar(user.handle);
		this.currentUser = { ...user, avatar };

		// Swap composer in-place
		const composer = this.getComposer();
		if (composer) {
			composer.innerHTML = '';
			composer.appendChild(this.makeComposeArea());
			// Re-attach input listener for the new textarea
			const textarea = composer.querySelector<HTMLTextAreaElement>('.juttu-compose-input');
			const submitBtn = composer.querySelector<HTMLButtonElement>('.juttu-submit-btn');
			if (textarea && submitBtn) {
				textarea.addEventListener('input', () => {
					submitBtn.disabled = !textarea.value.trim();
				});
			}
		}
	}

	private cancelLogin(): void {
		if (this.loginPollInterval !== null) {
			clearInterval(this.loginPollInterval);
			this.loginPollInterval = null;
		}
		if (this.authMessageHandler) {
			window.removeEventListener('message', this.authMessageHandler);
			this.authMessageHandler = null;
		}
		try { this.loginPopup?.close(); } catch { /* ignore */ }
		this.loginPopup = null;

		const composer = this.getComposer();
		if (composer) {
			composer.innerHTML = '';
			composer.appendChild(this.makeLoginArea());
		}
	}

	// ─── Logout ──────────────────────────────────────────────────────────────────

	private async handleLogout(): Promise<void> {
		try {
			await fetch(`${this.config.apiUrl}/auth/logout`, {
				method: 'POST',
				credentials: 'include'
			});
		} catch { /* ignore network errors on logout */ }

		this.currentUser = null;
		this.viewerState.clear();

		const composer = this.getComposer();
		if (composer) {
			composer.innerHTML = '';
			composer.appendChild(this.makeLoginArea());
		}
	}

	// ─── Auth guard ──────────────────────────────────────────────────────────────

	private requireAuth(): boolean {
		if (!this.currentUser) {
			const composer = this.container.querySelector<HTMLElement>('.juttu-composer');
			composer?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			const loginBtn = this.container.querySelector<HTMLElement>('.juttu-login-btn');
			if (loginBtn) {
				loginBtn.classList.remove('juttu-login-btn--pulse');
				// Force reflow to restart animation
				void (loginBtn as HTMLElement).offsetWidth;
				loginBtn.classList.add('juttu-login-btn--pulse');
				setTimeout(() => loginBtn.classList.remove('juttu-login-btn--pulse'), 800);
			}
			return false;
		}
		return true;
	}

	// ─── Like ────────────────────────────────────────────────────────────────────

	private async handleLike(btn: HTMLElement): Promise<void> {
		const uri = btn.dataset.uri;
		const cid = btn.dataset.cid;
		if (!uri || !cid) return;

		const state = this.viewerState.get(uri) ?? {};
		const wasLiked = !!state.likeUri;
		const countSpan = btn.querySelector<HTMLElement>('.juttu-like-count');
		const currentCount = parseInt(countSpan?.textContent ?? '0', 10);

		// Optimistic update
		const newLiked = !wasLiked;
		btn.dataset.liked = String(newLiked);
		if (countSpan) countSpan.textContent = String(currentCount + (newLiked ? 1 : -1));
		this.viewerState.set(uri, { ...state, likeUri: newLiked ? 'pending' : undefined });

		try {
			if (wasLiked && state.likeUri) {
				const rkey = state.likeUri.split('/').pop()!;
				await fetch(`${this.config.apiUrl}/bsky/like`, {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ rkey })
				}).then(this.checkApiResponse);
				this.viewerState.set(uri, { ...state, likeUri: undefined });
			} else {
				const res = await fetch(`${this.config.apiUrl}/bsky/like`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ uri, cid })
				}).then(this.checkApiResponse);
				const data = await res.json() as { uri: string };
				this.viewerState.set(uri, { ...state, likeUri: data.uri });
			}
		} catch (err) {
			// Roll back
			btn.dataset.liked = String(wasLiked);
			if (countSpan) countSpan.textContent = String(currentCount);
			this.viewerState.set(uri, state);
			this.showActionError(btn, err instanceof Error ? err.message : 'Action failed');
		}
	}

	// ─── Repost ──────────────────────────────────────────────────────────────────

	private async handleRepost(btn: HTMLElement): Promise<void> {
		const uri = btn.dataset.uri;
		const cid = btn.dataset.cid;
		if (!uri || !cid) return;

		const state = this.viewerState.get(uri) ?? {};
		const wasReposted = !!state.repostUri;
		const countSpan = btn.querySelector<HTMLElement>('.juttu-repost-count');
		const currentCount = parseInt(countSpan?.textContent ?? '0', 10);

		// Optimistic update
		const newReposted = !wasReposted;
		btn.dataset.reposted = String(newReposted);
		if (countSpan) countSpan.textContent = String(currentCount + (newReposted ? 1 : -1));
		this.viewerState.set(uri, { ...state, repostUri: newReposted ? 'pending' : undefined });

		try {
			if (wasReposted && state.repostUri) {
				const rkey = state.repostUri.split('/').pop()!;
				await fetch(`${this.config.apiUrl}/bsky/repost`, {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ rkey })
				}).then(this.checkApiResponse);
				this.viewerState.set(uri, { ...state, repostUri: undefined });
			} else {
				const res = await fetch(`${this.config.apiUrl}/bsky/repost`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ uri, cid })
				}).then(this.checkApiResponse);
				const data = await res.json() as { uri: string };
				this.viewerState.set(uri, { ...state, repostUri: data.uri });
			}
		} catch (err) {
			// Roll back
			btn.dataset.reposted = String(wasReposted);
			if (countSpan) countSpan.textContent = String(currentCount);
			this.viewerState.set(uri, state);
			this.showActionError(btn, err instanceof Error ? err.message : 'Action failed');
		}
	}

	// ─── Reply form ──────────────────────────────────────────────────────────────

	private handleToggleReplyForm(uri: string): void {
		if (this.openReplyFormUri === uri) {
			this.closeReplyForm();
			return;
		}
		this.closeReplyForm();

		const comment = this.container.querySelector<HTMLElement>(`.juttu-comment[data-uri="${CSS.escape(uri)}"]`);
		if (!comment) return;

		const form = document.createElement('div');
		form.className = 'juttu-reply-form';

		const textarea = document.createElement('textarea');
		textarea.className = 'juttu-reply-input';
		textarea.placeholder = 'Write a reply…';
		textarea.rows = 2;
		form.appendChild(textarea);

		const formActions = document.createElement('div');
		formActions.className = 'juttu-reply-form-actions';

		const hint = document.createElement('span');
		hint.className = 'juttu-reply-hint';
		hint.textContent = 'Reply posts to Bluesky';
		formActions.appendChild(hint);

		const cancelBtn = document.createElement('button');
		cancelBtn.className = 'juttu-reply-cancel';
		cancelBtn.textContent = 'Cancel';
		formActions.appendChild(cancelBtn);

		const submitBtn = document.createElement('button');
		submitBtn.className = 'juttu-reply-submit';
		submitBtn.textContent = 'Reply';
		submitBtn.disabled = true;
		formActions.appendChild(submitBtn);

		form.appendChild(formActions);

		// Insert after .juttu-comment-actions
		const actionsEl = comment.querySelector('.juttu-comment-actions');
		if (actionsEl?.nextSibling) {
			comment.insertBefore(form, actionsEl.nextSibling);
		} else {
			comment.appendChild(form);
		}

		this.openReplyFormUri = uri;
		textarea.focus();
	}

	private closeReplyForm(): void {
		if (!this.openReplyFormUri) return;
		const form = this.container.querySelector('.juttu-reply-form');
		form?.remove();
		this.openReplyFormUri = null;
	}

	// ─── Post comment ────────────────────────────────────────────────────────────

	private async handlePost(): Promise<void> {
		const textarea = this.container.querySelector<HTMLTextAreaElement>('.juttu-compose-input');
		const submitBtn = this.container.querySelector<HTMLButtonElement>('.juttu-submit-btn');
		if (!textarea || !submitBtn) return;

		const text = textarea.value.trim();
		if (!text || !this.rootPostUri || !this.rootPostCid) return;

		submitBtn.disabled = true;
		submitBtn.textContent = 'Posting…';
		this.container.querySelector('.juttu-post-error')?.remove();

		try {
			await fetch(`${this.config.apiUrl}/bsky/post`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					text,
					reply: {
						root: { uri: this.rootPostUri, cid: this.rootPostCid },
						parent: { uri: this.rootPostUri, cid: this.rootPostCid }
					}
				})
			}).then(this.checkApiResponse);

			textarea.value = '';
			submitBtn.disabled = true;
			submitBtn.textContent = 'Post comment';
			setTimeout(() => this.refetchAndRender(), POST_REFETCH_DELAY_MS);
		} catch (err) {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Post comment';
			const errEl = document.createElement('div');
			errEl.className = 'juttu-post-error';
			errEl.textContent = err instanceof Error ? err.message : 'Failed to post';
			submitBtn.insertAdjacentElement('afterend', errEl);
		}
	}

	// ─── Post reply ──────────────────────────────────────────────────────────────

	private async handleSubmitReply(parentUri: string): Promise<void> {
		const form = this.container.querySelector<HTMLElement>('.juttu-reply-form');
		if (!form) return;
		const textarea = form.querySelector<HTMLTextAreaElement>('.juttu-reply-input');
		const submitBtn = form.querySelector<HTMLButtonElement>('.juttu-reply-submit');
		if (!textarea || !submitBtn) return;

		const text = textarea.value.trim();
		if (!text || !this.rootPostUri || !this.rootPostCid) return;

		const parentPost = findPostInThread(this.threadData, parentUri);
		if (!parentPost) return;

		submitBtn.disabled = true;
		submitBtn.textContent = 'Replying…';
		form.querySelector('.juttu-reply-error')?.remove();

		try {
			await fetch(`${this.config.apiUrl}/bsky/post`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					text,
					reply: {
						root: { uri: this.rootPostUri, cid: this.rootPostCid },
						parent: { uri: parentPost.uri, cid: parentPost.cid }
					}
				})
			}).then(this.checkApiResponse);

			this.closeReplyForm();
			setTimeout(() => this.refetchAndRender(), POST_REFETCH_DELAY_MS);
		} catch (err) {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Reply';
			const errEl = document.createElement('div');
			errEl.className = 'juttu-reply-error';
			errEl.textContent = err instanceof Error ? err.message : 'Failed to post reply';
			form.appendChild(errEl);
		}
	}

	// ─── Re-fetch after posting ──────────────────────────────────────────────────

	private async refetchAndRender(): Promise<void> {
		if (!this.rootPostUri) return;
		try {
			const thread = await fetchThread(this.rootPostUri);
			this.threadData = thread;
			// Merge new viewer state but keep any pending optimistic state
			const newState: Map<string, ViewerState> = new Map();
			collectViewerState(thread, newState);
			for (const [uri, state] of newState) {
				// Prefer existing (locally updated) state if it has real URIs
				const existing = this.viewerState.get(uri);
				const merged: ViewerState = {
					likeUri: existing?.likeUri !== 'pending' ? (existing?.likeUri ?? state.likeUri) : state.likeUri,
					repostUri: existing?.repostUri !== 'pending' ? (existing?.repostUri ?? state.repostUri) : state.repostUri
				};
				if (merged.likeUri || merged.repostUri) newState.set(uri, merged);
			}
			this.viewerState = newState;
			this.renderWidget();
		} catch { /* silently ignore — stale view is acceptable */ }
	}

	// ─── Utilities ───────────────────────────────────────────────────────────────

	private checkApiResponse = async (res: Response): Promise<Response> => {
		if (!res.ok) {
			const data = await res.json().catch(() => ({}));
			throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
		}
		return res;
	};

	private showActionError(nearEl: HTMLElement, message: string): void {
		nearEl.parentElement?.querySelector('.juttu-action-error')?.remove();
		const errEl = document.createElement('div');
		errEl.className = 'juttu-action-error';
		errEl.textContent = message;
		nearEl.insertAdjacentElement('afterend', errEl);
		setTimeout(() => errEl.remove(), 4000);
	}

	public destroy(): void {
		if (this.loginPollInterval !== null) clearInterval(this.loginPollInterval);
		if (this.authMessageHandler) window.removeEventListener('message', this.authMessageHandler);
		try { this.loginPopup?.close(); } catch { /* ignore */ }
		this.container.innerHTML = '';
	}
}

// ─── Auto-Init ────────────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
	(window as unknown as Record<string, unknown>).JuttuWidget = JuttuWidget;

	const currentScript = document.currentScript as HTMLScriptElement | null;

	function autoInitFromScript(script: HTMLScriptElement): void {
		const apiUrl = script.getAttribute('data-api-url');
		const theme = (script.getAttribute('data-theme') ?? 'auto') as 'auto' | 'light' | 'dark';

		if (!apiUrl) {
			console.error('Juttu: Missing data-api-url attribute on script tag');
			return;
		}
		const container = document.getElementById('juttu-comments');
		if (!container) {
			console.error('Juttu: No element with id="juttu-comments" found on this page');
			return;
		}
		new JuttuWidget(container, { apiUrl, theme });
	}

	if (currentScript) {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => autoInitFromScript(currentScript));
		} else {
			autoInitFromScript(currentScript);
		}
	}
}
