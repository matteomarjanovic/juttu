const BASE32_SORT_ALPHABET = '234567abcdefghijklmnopqrstuvwxyz';
const TID_REGEX = /^[234567abcdefghij][234567abcdefghijklmnopqrstuvwxyz]{12}$/;
const TID_TIME_MASK = 0x1fffffffffffffn;
const TID_CLOCK_MASK = 0x3ffn;

export function createTid(unixMicros = BigInt(Date.now()) * 1000n, clockId = 0) {
	let value = ((unixMicros & TID_TIME_MASK) << 10n) | (BigInt(clockId) & TID_CLOCK_MASK);
	let tid = '';

	for (let i = 0; i < 13; i += 1) {
		tid = BASE32_SORT_ALPHABET[Number(value & 0x1fn)] + tid;
		value >>= 5n;
	}

	return tid;
}

export function isTid(value) {
	return TID_REGEX.test(value);
}

export function buildSiteDocumentUri(did, tid = createTid()) {
	const normalizedDid = did.trim();
	if (!normalizedDid) {
		throw new Error('A DID is required.');
	}
	if (!normalizedDid.startsWith('did:')) {
		throw new Error('The DID must start with "did:".');
	}
	if (!isTid(tid)) {
		throw new Error('The TID must be a valid ATProto TID.');
	}

	return `at://${normalizedDid}/site.standard.document/${tid}`;
}

export function buildSiteDocumentTag(did, tid = createTid()) {
	return `<link rel="site.standard.document" href="${buildSiteDocumentUri(did, tid)}" />`;
}
