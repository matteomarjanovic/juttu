import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from './+page.js';

const mockResolveHandle = vi.hoisted(() => vi.fn());
const mockGetRecord = vi.hoisted(() => vi.fn());

vi.mock('@atproto/api', () => ({
	// Must use a regular function (not arrow) so `new Agent(...)` works as a constructor.
	Agent: vi.fn(function () {
		return {
			resolveHandle: mockResolveHandle,
			com: { atproto: { repo: { getRecord: mockGetRecord } } },
		};
	}),
}));

vi.mock('$lib/lexicons/app.js', () => ({}));

describe('load', () => {
	const params = { userHandle: 'alice.bsky.social', articleId: 'my-post-2024' };
	let setHeaders: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		setHeaders = vi.fn();
		vi.clearAllMocks();
	});

	it('returns rootPostUri on success', async () => {
		mockResolveHandle.mockResolvedValue({ data: { did: 'did:plc:alice123' } });
		mockGetRecord.mockResolvedValue({
			data: {
				value: {
					commentsThread: { uri: 'at://did:plc:alice123/app.bsky.feed.post/abc123' },
				},
			},
		});

		const result = await load({ params, setHeaders } as never);

		expect(result).toMatchObject({
			userHandle: 'alice.bsky.social',
			articleId: 'my-post-2024',
			userDid: 'did:plc:alice123',
			rootPostUri: 'at://did:plc:alice123/app.bsky.feed.post/abc123',
		});
		expect(setHeaders).toHaveBeenCalledWith({ 'cache-control': 'public, max-age=3600, stale-while-revalidate=86400' });
	});

	it('returns null userDid when handle resolution fails', async () => {
		mockResolveHandle.mockRejectedValue(new Error('Handle not found'));

		const result = await load({ params, setHeaders } as never);

		expect(result).toMatchObject({
			userDid: null,
			rootPostUri: null,
		});
		expect(setHeaders).toHaveBeenCalledWith({ 'cache-control': 'no-store' });
	});

	it('returns null rootPostUri when record not found', async () => {
		mockResolveHandle.mockResolvedValue({ data: { did: 'did:plc:alice123' } });
		mockGetRecord.mockRejectedValue(new Error('Record not found'));

		const result = await load({ params, setHeaders } as never);

		expect(result).toMatchObject({
			userDid: 'did:plc:alice123',
			rootPostUri: null,
		});
		expect(setHeaders).toHaveBeenCalledWith({ 'cache-control': 'no-store' });
	});
});
