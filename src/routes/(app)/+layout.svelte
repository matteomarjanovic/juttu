<script lang="ts">
	import { initAuth, setupAuthMessageListener } from '$lib/auth.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		// Set up listener for auth callbacks from the login popup
		const cleanup = setupAuthMessageListener();

		// Initialize auth (restore existing sessions)
		initAuth();

		return cleanup;
	});
</script>

{@render children()}
