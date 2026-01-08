import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Allow the app to be embedded in iframes from any origin
	// This is necessary for the embed script to work on external sites
	response.headers.delete('X-Frame-Options');

	// Allow embedding from any origin including file:// for local testing
	response.headers.set('Content-Security-Policy', "frame-ancestors * 'self' file:");

	return response;
};
