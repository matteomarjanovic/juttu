<script lang="ts">
	import { onMount } from 'svelte';
	import { processCallback } from '$lib/auth.svelte';

	let status = $state<'processing' | 'success' | 'error' | 'popup-closed' | 'relayed'>(
		'processing'
	);
	let errorMessage = $state<string | null>(null);

	onMount(async () => {
		// Check if we're in the iframe popup flow by checking localStorage flag
		// This flag is set by /login before calling loginWithPopup
		const isIframePopupFlow = localStorage.getItem('juttu-auth-mode') === 'iframe-popup';

		if (isIframePopupFlow) {
			console.log('Callback page: Storing OAuth params in localStorage for /login to read...');
			// Extract the OAuth callback params from the URL
			console.log('URL params:', window.location.hash.substring(1));
			const hash = window.location.hash.substring(1);
			const params = new URLSearchParams(hash);

			// Store params in localStorage - the /login window will poll for this
			// We use localStorage because it's shared across same-origin windows
			localStorage.setItem('juttu-auth-callback-params', params.toString());
			// Clean up the mode flag
			localStorage.removeItem('juttu-auth-mode');

			status = 'relayed';
			// Close this popup after a short delay
			setTimeout(() => {
				window.close();
			}, 500);
			return;
		}

		// Standard flow: process the callback directly
		try {
			console.log('Callback page: Processing OAuth response...');

			const result = await processCallback();

			if (result?.session) {
				console.log('Callback processed, redirecting to home...');
				status = 'success';
				// For redirect mode (non-popup), redirect to home after success
				setTimeout(() => {
					window.location.href = '/';
				}, 1000);
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
		{:else if status === 'relayed'}
			<div class="mb-4 text-5xl text-info">✓</div>
			<h1 class="mb-2 text-2xl font-bold">Authentication complete</h1>
			<p class="text-gray-600">Closing this window...</p>
		{:else if status === 'error'}
			<div class="mb-4 text-5xl text-error">✗</div>
			<h1 class="mb-2 text-2xl font-bold">Authentication failed</h1>
			<p class="mb-4 text-error">{errorMessage}</p>
			<a href="/" class="btn btn-primary">Return to home</a>
		{/if}
	</div>
</div>
