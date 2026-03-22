import { env } from '$env/dynamic/public';

const endpoint = env.PUBLIC_ANALYTICS_ENDPOINT;

export type AnalyticsEvent = 'page_view' | 'like' | 'unlike' | 'repost' | 'unrepost' | 'reply';

export function track(event: AnalyticsEvent, userDid: string | null): void {
	if (!endpoint) return;
	fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ event, ...(userDid && { userDid }), timestamp: new Date().toISOString() }),
		keepalive: true
	}).catch(() => { });
}
