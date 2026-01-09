<script lang="ts">
	import { authState } from '$lib/auth.svelte';

	const props = $props();
	let error = $state<string | null>(null);
	let userHandle = $state<string>('');

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

		if (!userHandle.trim()) {
			error = 'Please enter your handle';
			return;
		}

		// If in iframe, open login page as popup instead of using modal
		if (isInIframe()) {
			const loginUrl = new URL('/login', window.location.origin);
			loginUrl.searchParams.set('handle', userHandle.trim());

			window.open(
				loginUrl.toString(),
				'juttu-login',
				'width=600,height=700,menubar=no,toolbar=no,location=no,status=no'
			);

			props.modal.close();
			return;
		}

		// Top-level window: redirect to login page
		window.location.href = `/login?handle=${encodeURIComponent(userHandle.trim())}`;
	}
</script>

<div class="flex w-full flex-row items-center justify-center gap-2">
	<input
		type="text"
		placeholder="Your Bluesky handle"
		class="input-bordered input w-full max-w-2xs font-comment"
		bind:value={userHandle}
	/>

	<button class="btn btn-primary" disabled={authState.isLoading} onclick={handleLogin}>
		Login with ATProtocol
	</button>
</div>
{#if error}
	<p class="text-sm text-error">{error}</p>
{/if}
