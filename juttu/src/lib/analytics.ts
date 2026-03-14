const endpoint = import.meta.env.PUBLIC_ANALYTICS_ENDPOINT as string | undefined;

export type AnalyticsEvent = 'page_view' | 'like' | 'unlike' | 'repost' | 'unrepost' | 'reply';

export function track(event: AnalyticsEvent, userHandle: string, userDid?: string | null): void {
	if (!endpoint) return;
	fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ event, userHandle, ...(userDid && { userDid }), timestamp: new Date().toISOString() }),
		keepalive: true
	}).catch(() => {});
}
