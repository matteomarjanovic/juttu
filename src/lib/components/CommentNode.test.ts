import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import CommentNodeTestWrapper from './CommentNodeTestWrapper.svelte';

vi.mock('$lib/auth.svelte', () => ({
	authState: {
		agent: null,
		session: null,
		profile: null,
		isInitialized: true,
		isLoading: false,
	},
	requestAuth: vi.fn(() => ({ success: false, fallbackUrl: null })),
}));

vi.mock('@atproto/api', () => ({
	Agent: vi.fn(function () {
		return {};
	}),
	RichText: vi.fn(function (this: any, opts: any) {
		this.text = opts?.text ?? '';
		this.facets = opts?.facets ?? [];
		this.segments = () => [{ text: this.text, isLink: () => false, isMention: () => false, isTag: () => false }];
	}),
}));

function makeComment(viewerLike?: string) {
	return {
		post: {
			uri: 'at://did:plc:test/app.bsky.feed.post/abc123',
			cid: 'bafy123',
			record: { text: 'Hello', facets: [] },
			author: {
				did: 'did:plc:test',
				handle: 'test.bsky.social',
				displayName: 'Test User',
				avatar: undefined,
			},
			likeCount: 5,
			repostCount: 2,
			replyCount: 0,
			indexedAt: '2024-01-01T00:00:00.000Z',
			viewer: viewerLike ? { like: viewerLike } : {},
		},
		replies: [],
	};
}

describe('CommentNode – like button reflects viewer.like', () => {
	let component: ReturnType<typeof mount>;

	afterEach(() => {
		if (component) unmount(component);
		document.body.innerHTML = '';
	});

	it('is grey when viewer.like is absent, turns red when viewer.like is set', () => {
		// Render without viewer.like (public API, not logged in)
		component = mount(CommentNodeTestWrapper, {
			target: document.body,
			props: { comment: makeComment(undefined) },
		});

		const svg = document.body.querySelector('button[title="Like comment"] svg')!;
		expect(svg.classList.contains('fill-[#e0245e]')).toBe(false);

		// Simulate receiving an updated comment after authenticated re-fetch
		(component as any).setComment(
			makeComment('at://did:plc:test/app.bsky.feed.like/likerecord123'),
		);
		flushSync();

		expect(svg.classList.contains('fill-[#e0245e]')).toBe(true);
	});
});
