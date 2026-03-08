<script lang="ts">
	type SortOption = 'newest' | 'oldest' | 'most-liked';

	interface Props {
		value: SortOption;
		onchange: (value: SortOption) => void;
	}

	const { value, onchange }: Props = $props();

	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		onchange(target.value as SortOption);
	}
</script>

<div class="flex min-w-28 flex-1 items-center justify-end gap-2">
	<label for="comment-sort" class="text-sm whitespace-nowrap text-base-content/60 md:block"
		>Sort by:</label
	>
	<select id="comment-sort" {value} onchange={handleChange} class="text-sm">
		<option value="newest">Newest first</option>
		<option value="oldest">Oldest first</option>
		<option value="most-liked">Most liked</option>
	</select>
</div>
