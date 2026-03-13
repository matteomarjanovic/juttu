<script lang="ts">
	import { onMount } from 'svelte';
	import { loginWithPopup, authState } from '$lib/auth.svelte';
	import JuttuLogo from '$lib/components/JuttuLogo.svelte';

	let error = $state<string | null>(null);
	let userHandle = $state<string>('');
	let openerOrigin = $state<string | null>(null);
	let autoLoginHandle = $state<string | null>(null);

	let pollInterval: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		// Get the opener origin from URL params
		const params = new URLSearchParams(window.location.search);
		openerOrigin = params.get('opener');
		const handleParam = params.get('handle');

		if (!openerOrigin) {
			error = 'Missing opener origin. This page should be opened from an embedded widget.';
		}

		// Start polling localStorage for callback params from the nested popup
		// The callback page will store params there since window.opener is lost after OAuth redirect
		pollInterval = setInterval(checkForCallbackParams, 100);

		// Auto-start login if a handle was pre-filled
		if (handleParam && openerOrigin) {
			autoLoginHandle = handleParam;
			localStorage.setItem('juttu-auth-mode', 'iframe-popup');
			loginWithPopup(handleParam).catch((err: Error) => {
				if (err.message !== 'Login continued in parent window') {
					error = err.message || 'Login failed';
					localStorage.removeItem('juttu-auth-mode');
					autoLoginHandle = null;
				}
			});
		}

		return () => {
			if (pollInterval) {
				clearInterval(pollInterval);
			}
			// Clean up any leftover auth mode flag
			localStorage.removeItem('juttu-auth-mode');
		};
	});

	function checkForCallbackParams() {
		const params = localStorage.getItem('juttu-auth-callback-params');
		if (params) {
			// Clear the params from localStorage
			localStorage.removeItem('juttu-auth-callback-params');

			// Stop polling
			if (pollInterval) {
				clearInterval(pollInterval);
				pollInterval = null;
			}

			// Forward the callback params to the parent iframe
			if (window.opener && openerOrigin) {
				window.opener.postMessage(
					{
						type: 'juttu-auth-callback',
						params: params
					},
					openerOrigin
				);
				// Close this login window after forwarding
				window.close();
			}
		}
	}

	async function handleBlueskyLogin() {
		error = null;
		try {
			localStorage.setItem('juttu-auth-mode', 'iframe-popup');
			await loginWithPopup('https://bsky.social');
		} catch (err: unknown) {
			const e = err as Error;
			// "Login continued in parent window" is expected — the OAuth popup completed
			// and /callback stored params in localStorage for us to relay to the iframe.
			if (e.message !== 'Login continued in parent window') {
				error = e.message || 'Login failed';
				localStorage.removeItem('juttu-auth-mode');
			}
		}
	}

	async function handleCustomLogin() {
		if (!userHandle.trim()) {
			error = 'Please enter your Bluesky handle';
			return;
		}
		error = null;
		try {
			localStorage.setItem('juttu-auth-mode', 'iframe-popup');
			await loginWithPopup(userHandle.trim());
		} catch (err: unknown) {
			const e = err as Error;
			if (e.message !== 'Login continued in parent window') {
				error = e.message || 'Login failed';
				localStorage.removeItem('juttu-auth-mode');
			}
		}
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-12 bg-base-200 p-4">
	<div class="w-32">
		<JuttuLogo />
	</div>
	<div class="border-grey card w-full max-w-md border border-base-300 bg-base-100">
		<div class="card-body">
			<h2 class="card-title text-2xl font-bold">Authenticate to Juttu</h2>

			{#if error && !openerOrigin}
				<div class="alert alert-error">
					<span>{error}</span>
				</div>
			{:else if autoLoginHandle}
				<div class="flex flex-col items-center gap-4 py-4">
					<span class="loading loading-lg loading-spinner"></span>
					<p class="font-comment text-sm">Signing in as @{autoLoginHandle}…</p>
					{#if error}
						<p class="text-sm text-error">{error}</p>
					{/if}
				</div>
			{:else}
				<p class="mb-4 font-comment">
					Authentication is required in order to post, like or repost comments.
				</p>

				<div class="flex flex-col items-center gap-4">
					<!-- Bluesky Login Button -->
					<button
						class="btn text-lg btn-accent"
						disabled={authState.isLoading}
						onclick={handleBlueskyLogin}
					>
						<svg
							class="h-auto w-5"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 568 501"
						>
							<title>Bluesky butterfly logo</title>
							<path
								fill="currentColor"
								d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.89-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.659 0 75.291 0 57.946 0-28.906 76.135-1.612 123.121 33.664Z"
							></path>
						</svg>
						Login with Bluesky
					</button>

					<div class="divider">OR</div>

					<p class="font-comment">Do you use a custom PDS?</p>

					<!-- Custom Handle Login -->
					<div class="flex w-full flex-row items-center justify-center gap-2">
						<input
							type="text"
							placeholder="Your Bluesky handle"
							class="input-bordered input w-full max-w-xs font-comment"
							bind:value={userHandle}
							onkeydown={(e) => e.key === 'Enter' && handleCustomLogin()}
						/>
						<button
							class="btn btn-primary"
							disabled={authState.isLoading}
							onclick={handleCustomLogin}
						>
							Login
						</button>
					</div>

					{#if error}
						<p class="text-sm text-error">{error}</p>
					{/if}

					{#if authState.isLoading}
						<div class="flex items-center gap-2">
							<span class="loading loading-sm loading-spinner"></span>
							<span class="text-sm">Authenticating...</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
