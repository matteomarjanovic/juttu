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

<div class="flex items-center justify-center min-h-screen">
    <div class="text-center max-w-md p-6">
        {#if status === 'processing'}
            <div class="loading loading-spinner loading-lg text-primary mb-4"></div>
            <h1 class="text-2xl font-bold mb-2">Completing authentication...</h1>
            <p class="text-gray-600">Please wait while we verify your credentials.</p>
        {:else if status === 'success'}
            <div class="text-success text-5xl mb-4">✓</div>
            <h1 class="text-2xl font-bold mb-2">Authentication successful!</h1>
            <p class="text-gray-600">Redirecting you to the app...</p>
        {:else if status === 'popup-closed'}
            <div class="text-info text-5xl mb-4">✓</div>
            <h1 class="text-2xl font-bold mb-2">Authentication complete</h1>
            <p class="text-gray-600">You can close this window.</p>
        {:else if status === 'error'}
            <div class="text-error text-5xl mb-4">✗</div>
            <h1 class="text-2xl font-bold mb-2">Authentication failed</h1>
            <p class="text-error mb-4">{errorMessage}</p>
            <a href="/" class="btn btn-primary">Return to home</a>
        {/if}
    </div>
</div>