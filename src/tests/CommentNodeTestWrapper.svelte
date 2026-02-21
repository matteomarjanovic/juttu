<script lang="ts">
	import CommentNode from '$lib/components/CommentNode.svelte';

	let { comment: initial } = $props();
	let comment = $state(initial);

	export const setComment = (next: any) => {
		comment = next;
	};
</script>

<CommentNode {comment} sortOrder="newest" />
