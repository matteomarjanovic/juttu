import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import Page from './+page.svelte';

// Import the same reactive object the mock will expose, so we can mutate it in tests.
import { authState as mockAuthState } from '../../../../../tests/mocks/auth.reactive.svelte.ts';

vi.mock('$lib/auth.svelte', async () =>
	await import('../../../../../tests/mocks/auth.reactive.svelte.ts'),
);

vi.mock('@atproto/api', () => ({
	Agent: vi.fn(function () {
		return {};
	}),
	RichText: vi.fn(function (this: any, opts: any) {
		this.text = opts?.text ?? '';
		this.facets = opts?.facets ?? [];
		this.segments = () => [
			{ text: this.text, isLink: () => false, isMention: () => false, isTag: () => false },
		];
	}),
	MENTION_REGEX: /(^|\s|\()(@)([a-zA-Z0-9.-]+)(\b)/g,
	URL_REGEX: /https?:\/\/[\S]+/g,
	TAG_REGEX: /(^|\s)(#[^\d\s]\S*)(\b|$)/g,
	TRAILING_PUNCTUATION_REGEX: /\p{P}+$/u,
}));

vi.mock('$app/state', () => ({
	page: { url: { searchParams: new URLSearchParams() } },
}));

const ROOT_URI = 'at://did:plc:owner/app.bsky.feed.post/rootpost';
const LIKE_URI = 'at://did:plc:viewer/app.bsky.feed.like/like123';

function makeReply(viewerLike?: string) {
	return {
		$type: 'app.bsky.feed.defs#threadViewPost',
		post: {
			uri: 'at://did:plc:commenter/app.bsky.feed.post/reply123',
			cid: 'bafy456',
			record: { $type: 'app.bsky.feed.post', text: 'A reply', facets: [] },
			author: {
				did: 'did:plc:commenter',
				handle: 'commenter.bsky.social',
				displayName: 'Commenter',
				avatar: undefined,
			},
			likeCount: 1,
			repostCount: 0,
			replyCount: 0,
			indexedAt: '2024-01-01T00:00:00.000Z',
			viewer: viewerLike ? { like: viewerLike } : {},
		},
		replies: [],
	};
}

function makeThread(viewerLike?: string) {
	return {
		$type: 'app.bsky.feed.defs#threadViewPost',
		post: {
			uri: ROOT_URI,
			cid: 'bafy123',
			record: { $type: 'app.bsky.feed.post', text: 'Root post', facets: [] },
			author: {
				did: 'did:plc:owner',
				handle: 'owner.bsky.social',
				displayName: 'Owner',
				avatar: undefined,
			},
			likeCount: 0,
			repostCount: 0,
			replyCount: 1,
			indexedAt: '2024-01-01T00:00:00.000Z',
			viewer: {},
		},
		replies: [makeReply(viewerLike)],
	};
}

describe('+page – re-fetches thread with authenticated agent after login', () => {
	let component: ReturnType<typeof mount>;

	afterEach(() => {
		if (component) unmount(component);
		document.body.innerHTML = '';
		vi.unstubAllGlobals();
		mockAuthState.agent = null;
	});

	it('like button turns red after login triggers authenticated re-fetch', async () => {
		// Public API returns thread without viewer.like
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => ({
				ok: true,
				json: async () => ({ thread: makeThread() }),
			})),
		);

		// Authenticated agent returns thread with viewer.like set
		const mockAgent = {
			getPostThread: vi.fn(async () => ({ data: { thread: makeThread(LIKE_URI) } })),
		};

		mockAuthState.agent = null;

		component = mount(Page, {
			target: document.body,
			props: {
				data: {
					rootPostUri: ROOT_URI,
					userHandle: 'owner.bsky.social',
					articleId: 'my-article',
					userDid: 'did:plc:owner',
				},
			},
		});

		// Wait for the initial unauthenticated fetch via public API
		await vi.waitFor(() => {
			expect(vi.mocked(fetch)).toHaveBeenCalledOnce();
		});

		// Let the async response resolve and component re-render
		await new Promise((r) => setTimeout(r, 0));
		flushSync();

		// Like button should be grey — public API returns no viewer.like
		const svg = document.body.querySelector('button[title="Like comment"] svg')!;
		expect(svg).toBeTruthy();
		expect(svg.classList.contains('fill-[#e0245e]')).toBe(false);

		// Simulate login: agent changes from null to an authenticated agent
		mockAuthState.agent = mockAgent as any;
		flushSync();

		// The page should re-fetch using the authenticated agent
		await vi.waitFor(() => {
			expect(mockAgent.getPostThread).toHaveBeenCalledOnce();
		});

		// Let the authenticated response resolve and component re-render.
		// The re-fetch is silent (no loading spinner), so the same SVG element stays in the DOM.
		await new Promise((r) => setTimeout(r, 0));
		flushSync();

		// Like button should now be red — authenticated re-fetch includes viewer.like
		expect(svg.classList.contains('fill-[#e0245e]')).toBe(true);
	});
});
