import { env } from '$env/dynamic/public';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
    return json({
        client_id: `https://${env.PUBLIC_HOSTNAME}/oauth-client-metadata.json`,
        client_name: 'Juttu',
        client_uri: `https://${env.PUBLIC_HOSTNAME}`,
        logo_uri: `https://${env.PUBLIC_HOSTNAME}/logo.png`,
        tos_uri: `https://${env.PUBLIC_HOSTNAME}/tos`,
        policy_uri: `https://${env.PUBLIC_HOSTNAME}/policy`,
        redirect_uris: [`https://${env.PUBLIC_HOSTNAME}/callback`],
        scope: 'atproto transition:generic',
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        token_endpoint_auth_method: 'none',
        application_type: 'web',
        dpop_bound_access_tokens: true
    });
};
