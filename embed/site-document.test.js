import test from 'node:test';
import assert from 'node:assert/strict';

import {
	buildSiteDocumentTag,
	buildSiteDocumentUri,
	createTid,
	isTid,
	resolveHandleToDid
} from './site-document.js';

test('createTid encodes zero values as a valid TID', () => {
	const tid = createTid(0n, 0);

	assert.equal(tid, '2222222222222');
	assert.equal(isTid(tid), true);
});

test('createTid keeps the clock id in the encoded value', () => {
	assert.equal(createTid(0n, 1), '2222222222223');
});

test('buildSiteDocumentUri builds a site.standard.document at-uri', () => {
	assert.equal(
		buildSiteDocumentUri('did:plc:abc123', '2222222222222'),
		'at://did:plc:abc123/site.standard.document/2222222222222'
	);
});

test('buildSiteDocumentTag wraps the generated at-uri in a link tag', () => {
	assert.equal(
		buildSiteDocumentTag('did:plc:abc123', '2222222222222'),
		'<link rel="site.standard.document" href="at://did:plc:abc123/site.standard.document/2222222222222" />'
	);
});

test('buildSiteDocumentUri rejects invalid tids', () => {
	assert.throws(
		() => buildSiteDocumentUri('did:plc:abc123', 'my-article-slug'),
		/The TID must be a valid ATProto TID\./
	);
});

test('resolveHandleToDid resolves a handle to a did', async () => {
	const did = await resolveHandleToDid(
		'alice.bsky.social',
		async (url) => ({
			ok: true,
			json: async () => ({ did: 'did:plc:abc123' }),
			url
		})
	);

	assert.equal(did, 'did:plc:abc123');
});

test('resolveHandleToDid rejects failed lookups', async () => {
	await assert.rejects(
		() => resolveHandleToDid(
			'alice.bsky.social',
			async () => ({ ok: false, status: 404, json: async () => ({}) })
		),
		/Could not resolve handle "alice\.bsky\.social" \(HTTP 404\)\./
	);
});
