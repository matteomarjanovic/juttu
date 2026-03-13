import { Agent } from '@atproto/api';
import type { PageLoad } from './$types';
import * as app from '$lib/lexicons/app.js'

export const load: PageLoad = async ({ params, setHeaders }) => {
    const { userHandle, articleId } = params;

    const agent = new Agent({ service: 'https://bsky.social' });

    let userDid: string | null = null;

    try {
        const resDid = await agent.resolveHandle({ handle: userHandle });
        userDid = resDid?.data?.did;

        if (!userDid) {
            throw new Error(`Could not resolve DID for handle: ${userHandle}`);
        }
    } catch (error) {
        console.error("Error resolving handle:", error);

        setHeaders({
            'cache-control': 'no-store',
        });

        return {
            userHandle,
            articleId,
            userDid: null,
            rootPostUri: null,
            error: `Failed to resolve handle: ${userHandle}`,
        };
    }

    try {
        const resPost = await agent.com.atproto.repo.getRecord({
            collection: 'app.juttu.articleLink',
            rkey: articleId,
            repo: userDid,
        });
        const articleLink = resPost?.data?.value as app.juttu.articleLink.Main;

        const rootPostUri = articleLink?.commentsThread?.uri;
        setHeaders({
            'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
        });

        return {
            userHandle,
            articleId,
            userDid,
            rootPostUri,
        };
    } catch (error) {
        console.error("Error fetching post record:", error);

        setHeaders({
            'cache-control': 'no-store',
        });

        return {
            userHandle,
            articleId,
            userDid,
            rootPostUri: null,
            error: `Failed to fetch post record for articleId: ${articleId}`,
        };
    }
};