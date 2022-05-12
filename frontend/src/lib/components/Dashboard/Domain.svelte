<script lang="ts">
	import Tag from './Tag.svelte';
	import { upIn } from '$lib/animations';
	import { tags } from '$lib/stores';
	import { onMount } from 'svelte';

	export let index: number;
	export let result: Result;

	const delay = 8;
</script>

<div
	class="mb-2 h-[25px] flex"
	out:upIn={{ delay: (28 - index) * 0, distance: 6 }}
	in:upIn={{ delay: 0, distance: -6 }}
>
	<a
		href="http://{result.domain}"
		target="_blank"
		class="whitespace-nowrap visited:text-purple-800"
	>
		{result.domain}
	</a>
	<div
		class="inline-block overflow-hidden overflow-x-scroll float-left w-full whitespace-nowrap no-scroll"
	>
		{#if result.tags?.length}
			{#each result.tags.slice(0, 89) as tagName}
				{@const tagf = $tags?.find((tag) => tag.name == tagName)}
				<div class="inline-block scale-90">
					<Tag tag={tagf} keywords={result.snippets[tagName]} />
				</div>
			{/each}
			<!-- {#if result.tags.length > 8} -->
			<!-- ... -->
			<!-- {/if} -->
		{/if}
	</div>
</div>

<style>
</style>
