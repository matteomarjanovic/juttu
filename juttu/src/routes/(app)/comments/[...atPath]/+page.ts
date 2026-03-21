import { Agent } from '@atproto/api';
import type { PageLoad } from './$types';
import * as site from '$lib/lexicons/site.js';

export const load: PageLoad = async ({ params, url, setHeaders }) => {
    const atPath = params.atPath; // e.g. did:plc:abc123/site.standard.document/my-slug
    const parts = atPath.split('/');
    const pageOrigin = url.searchParams.get('pageOrigin');
    const pagePath = url.searchParams.get('pagePath');

    if (parts.length !== 3) {
        setHeaders({ 'cache-control': 'no-store' });
        return {
            documentAtUri: `at://${atPath}`,
            did: parts[0] ?? '',
            rkey: '',
            documentRecord: null as site.standard.document.Main | null,
            rootPostUri: null,
            pageOrigin,
            pagePath,
            error: 'Invalid AT URI path format'
        };
    }

    const [did, collection, rkey] = parts;

    if (collection !== 'site.standard.document') {
        setHeaders({ 'cache-control': 'no-store' });
        return {
            documentAtUri: `at://${atPath}`,
            did,
            rkey,
            documentRecord: null as site.standard.document.Main | null,
            rootPostUri: null,
            pageOrigin,
            pagePath,
            error: `Expected collection site.standard.document, got ${collection}`
        };
    }

    const agent = new Agent({ service: 'https://bsky.social' });

    try {
        const res = await agent.com.atproto.repo.getRecord({
            repo: did,
            collection: 'site.standard.document',
            rkey
        });

        const documentRecord = res?.data?.value as site.standard.document.Main;
        const rootPostUri = documentRecord?.bskyPostRef?.uri ?? null;

        setHeaders({
            'cache-control': rootPostUri
                ? 'public, max-age=3600, stale-while-revalidate=86400'
                : 'no-store'
        });

        return {
            documentAtUri: `at://${atPath}`,
            did,
            rkey,
            documentRecord,
            rootPostUri,
            pageOrigin,
            pagePath
        };
    } catch (error) {
        console.error('Error fetching document record:', error);

        setHeaders({ 'cache-control': 'no-store' });

        return {
            documentAtUri: `at://${atPath}`,
            did,
            rkey,
            documentRecord: null as site.standard.document.Main | null,
            rootPostUri: null,
            pageOrigin,
            pagePath
        };
    }
};
