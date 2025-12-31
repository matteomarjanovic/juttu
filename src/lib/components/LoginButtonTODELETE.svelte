<script lang="ts">
    import { loginWithPopup, logout, authState } from '$lib/auth.svelte';

    let handle = $state('');
    let showInput = $state(false);
    let error = $state<string | null>(null);

    async function handleLogin() {
        if (!handle.trim()) {
            error = 'Please enter your Bluesky handle';
            return;
        }
        
        error = null;
        try {
            await loginWithPopup(handle);
            showInput = false;
            handle = '';
        } catch (err: unknown) {
            const e = err as Error;
            error = e.message || 'Login failed';
        }
    }

    async function handleLogout() {
        try {
            await logout();
        } catch (err: unknown) {
            console.error('Logout error:', err);
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleLogin();
        } else if (event.key === 'Escape') {
            showInput = false;
            error = null;
        }
    }
</script>

{#if authState.session}
    <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">
            Logged in as <span class="font-medium">{authState.session.sub}</span>
        </span>
        <button class="btn btn-outline btn-sm" onclick={handleLogout}>
            Logout
        </button>
    </div>
{:else if showInput}
    <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
            <input
                type="text"
                bind:value={handle}
                onkeydown={handleKeydown}
                placeholder="your-handle.bsky.social"
                class="input input-bordered input-sm w-64"
                disabled={authState.isLoading}
            />
            <button 
                class="btn btn-primary btn-sm" 
                onclick={handleLogin}
                disabled={authState.isLoading}
            >
                {#if authState.isLoading}
                    <span class="loading loading-spinner loading-xs"></span>
                {:else}
                    Login
                {/if}
            </button>
            <button 
                class="btn btn-ghost btn-sm" 
                onclick={() => { showInput = false; error = null; }}
            >
                Cancel
            </button>
        </div>
        {#if error}
            <p class="text-error text-sm">{error}</p>
        {/if}
    </div>
{:else}
    <button 
        class="btn bg-[#0A7AFF] text-white" 
        onclick={() => showInput = true}
        disabled={authState.isLoading}
    >
        <svg class="w-5 h-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 568 501">
            <title>Bluesky butterfly logo</title>
            <path fill="currentColor" d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"></path>
        </svg>
        Login with Bluesky
    </button>
{/if}