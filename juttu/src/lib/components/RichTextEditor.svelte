<script lang="ts">
	import {
		Agent,
		MENTION_REGEX,
		URL_REGEX,
		TAG_REGEX,
		TRAILING_PUNCTUATION_REGEX
	} from '@atproto/api';
	import type { AppBskyActorDefs } from '@atproto/api';
	import { authState } from '$lib/auth.svelte';

	const PUBLIC_AGENT = new Agent({ service: 'https://public.api.bsky.app' });

	interface Props {
		value?: string;
		placeholder?: string;
		rows?: number;
		maxlength?: number;
		disabled?: boolean;
		class?: string;
		onkeydown?: (e: KeyboardEvent) => void;
	}

	let {
		value = $bindable(''),
		placeholder = '',
		rows = 3,
		maxlength = undefined,
		disabled = false,
		class: extraClass = '',
		onkeydown
	}: Props = $props();

	let textareaEl = $state<HTMLTextAreaElement | undefined>();
	let backdropEl = $state<HTMLDivElement | undefined>();

	let suggestions = $state<AppBskyActorDefs.ProfileViewBasic[]>([]);
	let mentionQuery = $state<string | null>(null);
	let isFetching = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout>;

	type SegType = 'mention' | 'link' | 'tag' | 'plain';

	// For non-http URLs: require a recognisable TLD (≥2 alphabetic chars after the last dot).
	// This prevents common abbreviations like "e.g" or "i.e" from being highlighted.
	function hasValidTld(domain: string): boolean {
		const tld = domain.split('.').at(-1) ?? '';
		return tld.length >= 2 && /^[a-z]+$/i.test(tld);
	}

	// Build visual highlight segments using the same regex patterns as Bluesky's decorators.
	function buildSegments(text: string): { text: string; type: SegType }[] {
		const hits: { start: number; end: number; type: SegType }[] = [];

		// Mentions: @handle — MENTION_REGEX is permissive enough for mid-typing highlight
		MENTION_REGEX.lastIndex = 0;
		let m: RegExpExecArray | null;
		while ((m = MENTION_REGEX.exec(text)) !== null) {
			const prefix = m[1] ?? '';
			hits.push({ start: m.index + prefix.length, end: m.index + m[0].length, type: 'mention' });
		}

		// URLs: http(s) links are always highlighted; plain domains require a valid TLD.
		// Trailing punctuation is stripped from the end, matching Bluesky's behaviour.
		URL_REGEX.lastIndex = 0;
		while ((m = URL_REGEX.exec(text)) !== null) {
			const prefix = m[1] ?? '';
			const uri = m[2];
			if (!uri.startsWith('http')) {
				const domain = m.groups?.domain;
				if (!domain || !hasValidTld(domain)) continue;
			}
			let from = m.index + prefix.length;
			let to = from + uri.length;
			if (/[.,;!?]$/.test(uri)) to--;
			if (/[)]$/.test(uri) && !uri.includes('(')) to--;
			hits.push({ start: from, end: to, type: 'link' });
		}

		// Tags: #hashtag — skip empty (#), skip >64 chars, strip trailing punctuation.
		TAG_REGEX.lastIndex = 0;
		while ((m = TAG_REGEX.exec(text)) !== null) {
			const [matchedString, , tag] = m;
			if (!tag) continue;
			const stripped = tag.replace(TRAILING_PUNCTUATION_REGEX, '');
			if (stripped.length === 0 || stripped.length > 64) continue;
			// matchedString.indexOf(tag) skips the leading whitespace to find the tag text.
			// Subtract 1 to include the '#' character.
			const tagContentStart = m.index + matchedString.indexOf(tag);
			hits.push({
				start: tagContentStart - 1,
				end: tagContentStart + stripped.length,
				type: 'tag'
			});
		}

		// Sort by start; on tie, prefer the longer match
		hits.sort((a, b) => a.start - b.start || b.end - a.end);

		const segs: { text: string; type: SegType }[] = [];
		let pos = 0;
		for (const h of hits) {
			if (h.start < pos) continue; // skip overlapping
			if (h.start > pos) segs.push({ text: text.slice(pos, h.start), type: 'plain' });
			segs.push({ text: text.slice(h.start, h.end), type: h.type });
			pos = h.end;
		}
		if (pos < text.length) segs.push({ text: text.slice(pos), type: 'plain' });
		return segs;
	}

	let segments = $derived(buildSegments(value));

	// Copy computed styles from textarea to backdrop for pixel-perfect alignment.
	// Runs once after mount when both elements are bound.
	$effect(() => {
		if (!textareaEl || !backdropEl) return;
		const cs = window.getComputedStyle(textareaEl);
		for (const prop of [
			'paddingTop',
			'paddingRight',
			'paddingBottom',
			'paddingLeft',
			'borderTopWidth',
			'borderRightWidth',
			'borderBottomWidth',
			'borderLeftWidth',
			'fontFamily',
			'fontSize',
			'fontWeight',
			'lineHeight',
			'letterSpacing'
		] as const) {
			backdropEl.style.setProperty(
				prop.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`),
				cs[prop]
			);
		}
	});

	function syncScroll() {
		if (backdropEl && textareaEl) backdropEl.scrollTop = textareaEl.scrollTop;
	}

	function onInput() {
		syncScroll();
		checkMentionTrigger();
	}

	function checkMentionTrigger() {
		if (!textareaEl) return;
		const cursor = textareaEl.selectionStart ?? value.length;
		const before = value.slice(0, cursor);
		const match = before.match(/@([a-zA-Z0-9.-]*)$/);
		if (match) {
			mentionQuery = match[1];
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => fetchSuggestions(match[1]), 1000);
		} else {
			dismissSuggestions();
		}
	}

	function dismissSuggestions() {
		clearTimeout(debounceTimer);
		mentionQuery = null;
		isFetching = false;
		suggestions = [];
	}

	async function fetchSuggestions(query: string) {
		const agent = authState.agent ?? PUBLIC_AGENT;
		isFetching = true;
		try {
			const res = await agent.searchActorsTypeahead({ q: query, limit: 4 });
			if (mentionQuery !== null) suggestions = res.data.actors;
		} catch {
			suggestions = [];
		} finally {
			isFetching = false;
		}
	}

	function applySuggestion(handle: string) {
		if (!textareaEl) return;
		const cursor = textareaEl.selectionStart;
		const before = value.slice(0, cursor).replace(/@([a-zA-Z0-9.-]*)$/, `@${handle} `);
		value = before + value.slice(cursor);
		dismissSuggestions();
		const newCursor = before.length;
		// Restore focus and cursor position after Svelte re-renders the textarea
		setTimeout(() => {
			textareaEl!.focus();
			textareaEl!.setSelectionRange(newCursor, newCursor);
		}, 0);
	}

	function handleKeydown(e: KeyboardEvent) {
		// Escape dismisses suggestions/loading state before propagating to parent handler
		if (e.key === 'Escape' && (suggestions.length > 0 || isFetching)) {
			e.stopPropagation();
			dismissSuggestions();
			return;
		}
		onkeydown?.(e);
	}
</script>

<div class="relative">
	<!--
		Backdrop: absolutely positioned behind the textarea, renders the same text
		with colored spans for mentions, links, and tags. The textarea on top has
		color: transparent so only the caret is visible, letting the backdrop show through.
	-->
	<div
		bind:this={backdropEl}
		class="wrap-break-words pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap"
		aria-hidden="true"
	>
		{#each segments as seg, i (i)}{#if seg.type !== 'plain'}<span class="text-blue-500"
					>{seg.text}</span
				>{:else}{seg.text}{/if}{/each}
	</div>

	<textarea
		bind:this={textareaEl}
		bind:value
		{placeholder}
		{rows}
		{maxlength}
		{disabled}
		oninput={onInput}
		onscroll={syncScroll}
		onkeydown={handleKeydown}
		class="textarea-bordered relative textarea w-full bg-transparent font-comment placeholder:text-base-content/40 {extraClass}"
		style="color: transparent; caret-color: var(--color-base-content); resize: none;"
	></textarea>

	<!-- Mention autocomplete dropdown -->
	{#if mentionQuery !== null && (isFetching || suggestions.length > 0)}
		<ul
			class="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-lg"
		>
			{#if isFetching && suggestions.length === 0}
				<!-- Skeleton placeholders for initial load -->
				{#each [0, 1, 2] as i (i)}
					<li class="flex items-center gap-2 bg-primary-content px-3 py-2">
						<div class="h-6 w-6 shrink-0 skeleton rounded-full"></div>
						<div class="flex flex-1 flex-col gap-1">
							<div class="h-3 w-24 skeleton rounded"></div>
							<div class="h-2 w-16 skeleton rounded"></div>
						</div>
					</li>
				{/each}
			{:else}
				{#each suggestions as actor (actor.did)}
					<li>
						<button
							class="flex w-full cursor-pointer items-center gap-2 bg-primary-content px-3 py-2 text-left text-sm"
							type="button"
							onmousedown={(e) => {
								e.preventDefault();
								applySuggestion(actor.handle);
							}}
						>
							{#if actor.avatar}
								<img src={actor.avatar} alt="" class="h-6 w-6 rounded-full object-cover" />
							{:else}
								<div class="h-6 w-6 rounded-full bg-base-300"></div>
							{/if}
							<div class="min-w-0">
								<div class="truncate font-medium">{actor.displayName || actor.handle}</div>
								<div class="truncate text-xs text-base-content/70">@{actor.handle}</div>
							</div>
						</button>
					</li>
				{/each}
				{#if isFetching}
					<!-- Subtle spinner when re-fetching after previous results -->
					<li class="flex justify-center py-1.5">
						<span class="loading loading-xs loading-spinner text-base-content/40"></span>
					</li>
				{/if}
			{/if}
		</ul>
	{/if}
</div>
