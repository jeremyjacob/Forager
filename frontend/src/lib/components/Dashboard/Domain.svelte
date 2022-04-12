<script lang="ts">
	import Tag from './Tag.svelte';
	import { upIn } from '$lib/animations';
	import { tags } from '$lib/stores';

	export let i: number;
	export let result: Result;
	export let scrolled: boolean;

	const delay = 8;
</script>

<div
	class="mb-1"
	out:upIn={{ delay: (28 - i) * delay, distance: 6 }}
	in:upIn={{ delay: i * delay, distance: -6, disable: scrolled }}
>
	<a href="http://{result.domain}" target="_blank">
		{result.domain}
	</a>
	<span class="overflow-x-hidden">
		{#if result.tags?.length}
			{#each result.tags.splice(0, 8) as tagName}
				{@const tagf = $tags.find((tag) => tag.name == tagName)}
				<div class="inline-block scale-90">
					<Tag tag={tagf} keywords={result.snippets[tagName]} />
				</div>
			{/each}
		{/if}
	</span>
</div>

<style>
</style>
