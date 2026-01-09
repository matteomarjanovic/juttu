<script lang="ts">
	import { authState } from '$lib/auth.svelte';

	const props = $props();
	let error = $state<string | null>(null);

	/**
	 * Check if we're in an iframe
	 */
	function isInIframe(): boolean {
		try {
			return window.self !== window.top;
		} catch (e) {
			return true;
		}
	}

	async function handleLogin() {
		error = null;

		// If in iframe, open login page as popup instead of using modal
		if (isInIframe()) {
			const loginUrl = new URL('/login', window.location.origin);
			loginUrl.searchParams.set('provider', 'bsky.social');

			window.open(
				loginUrl.toString(),
				'juttu-login',
				'width=600,height=700,menubar=no,toolbar=no,location=no,status=no'
			);

			props.modal.close();
			return;
		}

		// Top-level window: redirect to login page
		window.location.href = '/login?provider=bsky.social';
	}
</script>

<button class="btn text-lg btn-accent" disabled={authState.isLoading} onclick={handleLogin}>
	<svg class="h-auto w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 568 501">
		<title>Bluesky butterfly logo</title>
		<path
			fill="currentColor"
			d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"
		></path>
	</svg>
	Login with Bluesky
</button>
{#if error}
	<p class="text-sm text-error">{error}</p>
{/if}
