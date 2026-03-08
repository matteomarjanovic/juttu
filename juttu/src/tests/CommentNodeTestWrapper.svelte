<script lang="ts">
	import { untrack } from 'svelte';
	import CommentNode from '$lib/components/CommentNode.svelte';

	let { comment: initial } = $props();
	let comment = $state(untrack(() => initial));

	export const setComment = (next: any) => {
		comment = next;
	};
</script>

<CommentNode {comment} sortOrder="newest" />
