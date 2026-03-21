import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from './+page.js';

const mockGetRecord = vi.hoisted(() => vi.fn());

vi.mock('@atproto/api', () => ({
	// Must use a regular function (not arrow) so `new Agent(...)` works as a constructor.
	Agent: vi.fn(function () {
		return {
			com: { atproto: { repo: { getRecord: mockGetRecord } } }
		};
	})
}));

vi.mock('$lib/lexicons/site.js', () => ({}));

describe('load', () => {
	const validAtPath = 'did:plc:alice123/site.standard.document/my-post-2024';
	const makeUrl = (searchParams = '') => ({ searchParams: new URLSearchParams(searchParams) });
	let setHeaders: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		setHeaders = vi.fn();
		vi.clearAllMocks();
	});

	it('returns rootPostUri when record has bskyPostRef, cache = public 1h', async () => {
		mockGetRecord.mockResolvedValue({
			data: {
				value: {
					$type: 'site.standard.document',
					site: 'https://example.com',
					title: 'My Article',
					publishedAt: '2024-01-01T00:00:00.000Z',
					bskyPostRef: {
						uri: 'at://did:plc:alice123/app.bsky.feed.post/abc123',
						cid: 'bafyabc'
					}
				}
			}
		});

		const result = await load({
			params: { atPath: validAtPath },
			url: makeUrl(),
			setHeaders
		} as never);

		expect(result).toMatchObject({
			documentAtUri: 'at://did:plc:alice123/site.standard.document/my-post-2024',
			did: 'did:plc:alice123',
			rkey: 'my-post-2024',
			rootPostUri: 'at://did:plc:alice123/app.bsky.feed.post/abc123'
		});
		expect(setHeaders).toHaveBeenCalledWith({
			'cache-control': 'public, max-age=3600, stale-while-revalidate=86400'
		});
	});

	it('returns documentRecord but null rootPostUri when bskyPostRef absent, cache = no-store', async () => {
		mockGetRecord.mockResolvedValue({
			data: {
				value: {
					$type: 'site.standard.document',
					site: 'https://example.com',
					title: 'My Article',
					publishedAt: '2024-01-01T00:00:00.000Z'
				}
			}
		});

		const result = await load({
			params: { atPath: validAtPath },
			url: makeUrl(),
			setHeaders
		} as never);

		expect(result).toMatchObject({
			documentRecord: expect.objectContaining({ title: 'My Article' }),
			rootPostUri: null
		});
		expect(setHeaders).toHaveBeenCalledWith({ 'cache-control': 'no-store' });
	});

	it('returns null documentRecord when getRecord throws, cache = no-store', async () => {
		mockGetRecord.mockRejectedValue(new Error('Record not found'));

		const result = await load({
			params: { atPath: validAtPath },
			url: makeUrl(),
			setHeaders
		} as never);

		expect(result).toMatchObject({
			documentRecord: null,
			rootPostUri: null
		});
		expect(setHeaders).toHaveBeenCalledWith({ 'cache-control': 'no-store' });
	});

	it('returns error for invalid collection, cache = no-store', async () => {
		const result = await load({
			params: { atPath: 'did:plc:alice123/app.juttu.articleLink/my-slug' },
			url: makeUrl(),
			setHeaders
		} as never);

		expect(result).toMatchObject({
			documentRecord: null,
			rootPostUri: null,
			error: expect.stringContaining('site.standard.document')
		});
		expect(setHeaders).toHaveBeenCalledWith({ 'cache-control': 'no-store' });
	});
});
