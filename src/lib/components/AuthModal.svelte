<script lang='ts'>
	import BskyLoginButton from "./BskyLoginButton.svelte";

    interface Props {
        modal: HTMLDialogElement | undefined;
    }

    let { modal = $bindable() }: Props = $props();
</script>

<dialog id="auth_modal" class="modal modal-bottom sm:modal-middle bg-black/0" bind:this={modal}>
    <div class="modal-box">
        <h3 class="text-lg font-bold">Hello!</h3>
        <p class="py-4">Press ESC key or click outside to close</p>
        <BskyLoginButton {modal} />
    </div>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>