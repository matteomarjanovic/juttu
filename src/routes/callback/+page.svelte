<script lang="ts">
	import { onMount } from 'svelte';

	let error = $state<string | null>(null);

	onMount(() => {
		// Extract OAuth callback params from the URL hash and store them in localStorage.
		// The /login popup window polls for this and relays them back to the iframe via postMessage.
		const params = new URLSearchParams(window.location.hash.substring(1));
		if (params.size === 0) {
			error = 'No OAuth params found in callback URL.';
			return;
		}

		localStorage.setItem('juttu-auth-callback-params', params.toString());
		localStorage.removeItem('juttu-auth-mode');

		setTimeout(() => window.close(), 500);
	});
</script>

{#if error}
	<div class="flex min-h-screen items-center justify-center">
		<div class="max-w-md p-6 text-center">
			<div class="mb-4 text-5xl text-error">✗</div>
			<h1 class="mb-2 text-2xl font-bold">Authentication failed</h1>
			<p class="text-error">{error}</p>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<div class="max-w-md p-6 text-center">
			<div class="mb-4 text-5xl text-info">✓</div>
			<h1 class="mb-2 text-2xl font-bold">Authentication complete</h1>
			<p class="text-base-content/60">Closing this window...</p>
		</div>
	</div>
{/if}
