<script lang="ts">
    import { initAuth } from '$lib/auth.svelte';
    import { onMount } from 'svelte';

    let { children } = $props();

    onMount(async () => {
        await initAuth();
    });
</script>

{@render children()}