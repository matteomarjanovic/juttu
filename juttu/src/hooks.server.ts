import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);

    // Allow the app to be embedded in iframes from any origin
    // This is necessary for the embed script to work on external sites
    response.headers.delete('X-Frame-Options');

    // Allow embedding from any origin including file:// for local testing
    response.headers.set('Content-Security-Policy', "frame-ancestors * 'self' file:");

    const { pathname } = event.url;

    if (pathname.startsWith('/comments/')) {
        // Cache-Control is set per-branch in the load fn (success vs error).
        // Set Vary explicitly to prevent CDN from keying on Cookie or other headers.
        response.headers.set('Vary', 'Accept-Encoding');
    } else if (pathname === '/oauth-client-metadata.json') {
        // Stable content — safe to cache at CDN edge.
        response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    } else if (pathname === '/login' || pathname === '/callback') {
        // Transient OAuth popup pages — must never be served from cache.
        response.headers.set('Cache-Control', 'no-store');
    }

    return response;
};
