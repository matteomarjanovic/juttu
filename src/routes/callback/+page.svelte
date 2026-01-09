<script lang="ts">
	import { onMount } from 'svelte';
	import { processCallback } from '$lib/auth.svelte';

	let status = $state<'processing' | 'success' | 'error' | 'popup-closed'>('processing');
	let errorMessage = $state<string | null>(null);

	onMount(async () => {
		try {
			console.log('Callback page: Processing OAuth response...');

			const result = await processCallback();

			if (result?.session) {
				console.log('Callback processed successfully, session:', result.session.sub);
				status = 'success';

				// Redirect to home after success
				// (This callback is now only used for nested OAuth popup, not the main login popup)
				setTimeout(() => {
					window.location.href = '/';
				}, 1000);
			}
		} catch (err: unknown) {
			const error = err as Error;

			// LoginContinuedInParentWindowError means popup mode succeeded
			// The parent window (login popup) has the session
			if (error?.message === 'Login continued in parent window') {
				console.log('OAuth popup flow completed, session in parent window');
				status = 'popup-closed';
				// The library calls window.close() automatically for the OAuth popup
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
