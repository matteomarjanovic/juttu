<script lang="ts">
	import { onMount } from 'svelte';
	import { processCallback } from '$lib/auth.svelte';

	let status = $state<'processing' | 'success' | 'error' | 'popup-closed'>('processing');
	let errorMessage = $state<string | null>(null);

	/**
	 * Check if this popup was opened by an iframe (cross-context scenario)
	 */
	function isOpenerInIframe(): boolean {
		try {
			return window.opener && window.opener !== window.opener.top;
		} catch (e) {
			// Cross-origin access might throw
			return false;
		}
	}

	onMount(async () => {
		try {
			console.log('Callback page: Processing OAuth response...');

			// Special handling for iframe context: redirect callback to opener iframe
			// This is necessary because the popup and iframe have different storage contexts
			if (isOpenerInIframe()) {
				console.log('Detected popup opened from iframe, using iframe storage context');

				// Send the callback URL to the opener (iframe) to process
				// The iframe has the correct storage context to complete the OAuth flow
				const callbackUrl = window.location.href;

				// Send to the opener iframe's origin (same as our origin)
				// The iframe is always loaded from our domain, so we can restrict the target
				const targetOrigin = window.location.origin;
				window.opener.postMessage(
					{
						type: 'juttu-oauth-callback',
						url: callbackUrl
					},
					targetOrigin
				);

				status = 'popup-closed';
				console.log('Sent callback to iframe, closing popup');
				setTimeout(() => {
					window.close();
				}, 1000);
				return;
			}

			const result = await processCallback();

			if (result?.session) {
				console.log('Callback processed successfully!');
				status = 'success';

				// Check if we're in an iframe
				const isInIframe = window.self !== window.top;

				if (isInIframe) {
					// In iframe: redirect back to the stored return path
					// Validate it's a safe path (starts with /) and is same-origin
					let returnUrl = sessionStorage.getItem('juttu_oauth_return_url') || '/';
					sessionStorage.removeItem('juttu_oauth_return_url');

					// Security: validate return URL is a safe relative path
					if (!returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
						console.warn('Invalid return URL, using default:', returnUrl);
						returnUrl = '/';
					}

					console.log('Callback in iframe, redirecting to:', returnUrl);
					setTimeout(() => {
						window.location.href = returnUrl;
					}, 500);
				} else {
					// Top-level window: redirect to home
					console.log('Callback processed, redirecting to home...');
					setTimeout(() => {
						window.location.href = '/';
					}, 1000);
				}
			}
		} catch (err: unknown) {
			const error = err as Error;

			// LoginContinuedInParentWindowError means popup mode succeeded
			// The parent window has the session, and this popup will close
			if (error?.message === 'Login continued in parent window') {
				console.log('Popup flow completed, window will close');
				status = 'popup-closed';
				// The library calls window.close() automatically
				return;
			}

			console.error('Error processing callback:', error);
			status = 'error';
			errorMessage = error?.message || 'Unknown authentication error';
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="max-w-md p-6 text-center">
		{#if status === 'processing'}
			<div class="loading mb-4 loading-lg loading-spinner text-primary"></div>
			<h1 class="mb-2 text-2xl font-bold">Completing authentication...</h1>
			<p class="text-gray-600">Please wait while we verify your credentials.</p>
		{:else if status === 'success'}
			<div class="mb-4 text-5xl text-success">✓</div>
			<h1 class="mb-2 text-2xl font-bold">Authentication successful!</h1>
			<p class="text-gray-600">Redirecting you to the app...</p>
		{:else if status === 'popup-closed'}
			<div class="mb-4 text-5xl text-info">✓</div>
			<h1 class="mb-2 text-2xl font-bold">Authentication complete</h1>
			<p class="text-gray-600">You can close this window.</p>
		{:else if status === 'error'}
			<div class="mb-4 text-5xl text-error">✗</div>
			<h1 class="mb-2 text-2xl font-bold">Authentication failed</h1>
			<p class="mb-4 text-error">{errorMessage}</p>
			<a href="/" class="btn btn-primary">Return to home</a>
		{/if}
	</div>
</div>
