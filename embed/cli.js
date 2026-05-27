#!/usr/bin/env node

import { buildSiteDocumentTag, buildSiteDocumentUri, resolveHandleToDid } from './site-document.js';

function printUsage() {
	console.error(`Usage:
  juttu site-document <handle> [--format tag|uri] [--tid <tid>]

Examples:
  npx juttu site-document alice.bsky.social
  npx juttu site-document alice.bsky.social --format uri
  npx juttu site-document alice.bsky.social --tid 3lq6yc4drhk2j

Generate the tag once per article, then keep reusing the same TID.`);
}

async function main(argv) {
	const [command, ...rest] = argv;
	if (command !== 'site-document') {
		printUsage();
		process.exitCode = 1;
		return;
	}

	let format = 'tag';
	let tid;
	let handle = '';

	for (let i = 0; i < rest.length; i += 1) {
		const arg = rest[i];
		if (arg === '--format') {
			format = rest[i + 1] ?? '';
			i += 1;
			continue;
		}
		if (arg === '--tid') {
			tid = rest[i + 1] ?? '';
			i += 1;
			continue;
		}
		if (!handle) {
			handle = arg;
			continue;
		}

		throw new Error(`Unknown argument: ${arg}`);
	}

	if (format !== 'tag' && format !== 'uri') {
		throw new Error('The --format value must be either "tag" or "uri".');
	}
	if (!handle) {
		throw new Error('A Bluesky handle is required.');
	}

	const did = await resolveHandleToDid(handle);
	const output = format === 'uri'
		? buildSiteDocumentUri(did, tid)
		: buildSiteDocumentTag(did, tid);

	console.log(output);
}

try {
	await main(process.argv.slice(2));
} catch (error) {
	console.error(error instanceof Error ? error.message : 'Unknown error.');
	printUsage();
	process.exitCode = 1;
}
