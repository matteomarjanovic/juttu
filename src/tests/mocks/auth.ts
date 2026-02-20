import { vi } from 'vitest';

export function createMockAgent(overrides = {}) {
	return {
		getPostThread: vi.fn(),
		post: vi.fn(),
		like: vi.fn(),
		deleteLike: vi.fn(),
		repost: vi.fn(),
		deleteRepost: vi.fn(),
		resolveHandle: vi.fn(),
		com: { atproto: { repo: { getRecord: vi.fn(), putRecord: vi.fn() } } },
		...overrides,
	};
}

export function createMockAuthState(agent = createMockAgent()) {
	return {
		session: { did: 'did:plc:testuser123' },
		agent,
		profile: { displayName: 'Test User', handle: 'test.bsky.social' },
		isInitialized: true,
		isLoading: false,
	};
}
