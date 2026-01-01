<script lang="ts">
	import BskyHandleLoginButton from './BskyHandleLoginButton.svelte';
	import BskyLoginButton from './BskyLoginButton.svelte';

	interface Props {
		modal: HTMLDialogElement | undefined;
	}

	let { modal = $bindable() }: Props = $props();
</script>

<dialog id="auth_modal" class="modal modal-bottom bg-black/0 sm:modal-middle" bind:this={modal}>
	<div class="modal-box border border-primary/20">
		<h2 class="text-lg font-bold">Authenticate to Juttu</h2>
		<div class="flex flex-col items-center gap-2 py-2">
			<p class="mb-2 font-comment">
				Authentication is required in order to post, like or repost comments.
			</p>
			<BskyLoginButton {modal} />
			<div class="divider">OR</div>
			<p class="font-comment">Do you use a custom PDS?</p>
			<BskyHandleLoginButton {modal} />
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
