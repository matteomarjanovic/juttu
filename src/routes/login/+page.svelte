<script lang="ts">
	import { onMount } from 'svelte';
	import { getClient } from '$lib/auth.svelte';
	import { page } from '$app/state';

	let status = $state<'login' | 'processing' | 'success' | 'error'>('login');
	let errorMessage = $state<string | null>(null);
	let userHandle = $state<string>('');
	let provider = $state<string>('');

	async function handleBskyLogin() {
		await handleLogin('https://bsky.social');
	}

	async function handleCustomLogin() {
		if (!userHandle.trim()) {
			errorMessage = 'Please enter your handle';
			return;
		}
		await handleLogin(userHandle.trim());
	}

	async function handleLogin(handle: string) {
		errorMessage = null;
		status = 'processing';

		try {
			const client = await getClient();
			console.log('Initiating OAuth login for:', handle);

			// Use 'popup' display mode - this opens a nested popup for OAuth
			// The current popup window stays open and can send postMessage to iframe
			const session = await client.signIn(handle.trim(), {
				display: 'popup',
				signal: AbortSignal.timeout(5 * 60 * 1000)
			});

			console.log('Login successful, session:', session.sub);
			status = 'success';

			// If this login page was opened as a popup from iframe, send message
			if (window.opener) {
				console.log('Sending login success message to opener (iframe)');

				// Send message to opener (iframe) to notify of successful login
				window.opener.postMessage(
					{
						type: 'juttu-login-success',
						session: {
							did: session.did,
							sub: session.sub
						}
					},
					window.location.origin
				);

				// Close this popup after a brief delay
				setTimeout(() => {
					window.close();
				}, 1000);
			} else {
				// Not opened from popup, redirect to home
				setTimeout(() => {
					window.location.href = '/';
				}, 1000);
			}
		} catch (err: unknown) {
			console.error('Login failed:', err);
			status = 'error';
			errorMessage = (err as Error).message || 'Login failed';
		}
	}

	onMount(() => {
		// Check for auto-login parameters
		const handleParam = page.url.searchParams.get('handle');
		const providerParam = page.url.searchParams.get('provider');

		if (handleParam) {
			userHandle = handleParam;
			handleCustomLogin();
		} else if (providerParam) {
			provider = providerParam;
			if (providerParam === 'bsky.social') {
				handleBskyLogin();
			}
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-base-200">
	<div class="w-full max-w-md">
		{#if status === 'login'}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Authenticate to Juttu</h2>
					<p class="mb-2 text-sm">
						Authentication is required in order to post, like or repost comments.
					</p>

					<div class="divider">Login with Bluesky</div>

					<button class="btn text-lg btn-accent" onclick={handleBskyLogin}>
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

					<div class="divider">OR use custom PDS</div>

					<div class="form-control">
						<label class="label" for="handle-input">
							<span class="label-text">Your Bluesky handle</span>
						</label>
						<div class="join">
							<input
								id="handle-input"
								type="text"
								placeholder="handle.bsky.social"
								class="input-bordered input join-item w-full"
								bind:value={userHandle}
								onkeypress={(e) => e.key === 'Enter' && handleCustomLogin()}
							/>
							<button class="btn join-item btn-primary" onclick={handleCustomLogin}> Login </button>
						</div>
					</div>

					{#if errorMessage}
						<div class="mt-2 alert alert-error">
							<span>{errorMessage}</span>
						</div>
					{/if}
				</div>
			</div>
		{:else if status === 'processing'}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body items-center text-center">
					<div class="loading loading-lg loading-spinner text-primary"></div>
					<h2 class="card-title">Authenticating...</h2>
					<p>You will be redirected to complete authentication.</p>
				</div>
			</div>
		{:else if status === 'success'}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body items-center text-center">
					<div class="text-5xl text-success">✓</div>
					<h2 class="card-title">Authentication successful!</h2>
					<p>You can now close this window.</p>
				</div>
			</div>
		{:else if status === 'error'}
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body items-center text-center">
					<div class="text-5xl text-error">✗</div>
					<h2 class="card-title">Authentication failed</h2>
					<p class="text-error">{errorMessage}</p>
					<button class="btn mt-4 btn-primary" onclick={() => (status = 'login')}>
						Try Again
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
