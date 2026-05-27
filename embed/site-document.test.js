import test from 'node:test';
import assert from 'node:assert/strict';

import { buildSiteDocumentTag, buildSiteDocumentUri, createTid, isTid } from './site-document.js';

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
