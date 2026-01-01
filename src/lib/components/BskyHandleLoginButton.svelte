<script lang="ts">
	import { loginWithPopup, logout, authState } from '$lib/auth.svelte';

	const props = $props();
	let error = $state<string | null>(null);
	let userHandle = $state<string>('');

	async function handleLogin() {
		error = null;
		try {
			await loginWithPopup(userHandle);
			props.modal.close();
		} catch (err: unknown) {
			const e = err as Error;
			error = e.message || 'Login failed';
		}
	}
</script>

<div class="flex w-full flex-row items-center justify-center gap-2">
	<input
		type="text"
		placeholder="Your Bluesky handle"
		class="input-bordered input w-full max-w-2xs"
		bind:value={userHandle}
	/>

	<button class="btn btn-primary" disabled={authState.isLoading} onclick={handleLogin}>
		Login with ATProtocol
		{#if error}
			<p class="text-sm text-error">{error}</p>
		{/if}
	</button>
</div>
