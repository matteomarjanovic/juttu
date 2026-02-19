<script lang="ts">
	import { setupAuthMessageListener } from '$lib/auth.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		// Set up listener for auth callbacks from the login popup
		const cleanup = setupAuthMessageListener();
		return cleanup;
	});
</script>

{@render children()}
