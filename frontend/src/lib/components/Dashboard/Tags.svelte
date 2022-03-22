<script lang="ts">
	import { fade } from 'svelte/transition';
	import { receive, send, upIn } from '$lib/animations';
	import { flip } from 'svelte/animate';

	import MiniIcon from './MiniIcon.svelte';
	import { domainFilter } from '$lib/stores';
	export let tags: TagsData;
	$: unselected = tags ? Object.keys(tags) : [];
	let selected: string[] = [];

	function updateFilters() {
		console.log('updateFilters()');
		domainFilter.update((f) => {
			f.includes = selected;
			return f;
		});
	}

	function select(tag: string) {
		selected = [...selected, tag];
		unselected = unselected.filter((t) => t != tag);
		updateFilters();
	}
	function unselect(tag: string) {
		unselected = [tag, ...unselected];
		selected = selected.filter((t) => t != tag);
		updateFilters();
	}
</script>

<div class="p-6 pt-5">
	<h1 class="text-3xl {selected.length == 0 ? 'mb-3' : 'mb-0.5'}">Tags</h1>
	{#if tags}
		<tag-fodder class="block">
			{#each selected as tag, i (tag)}
				<div
					in:receive={{ key: tag }}
					out:send={{ key: tag }}
					animate:flip={{ duration: 300 }}
					class="mt-2.5 cursor-pointer inline-block mr-2"
					title={tags[tag].join(', ')}
					on:click={() => unselect(tag)}
				>
					<span class=" bg-blue-200 p-1">{tag}</span>
					<!-- <MiniIcon d="M12 4v16m8-8H4" />
					<MiniIcon d="M20 12H4" /> -->
				</div>
			{/each}
			{#if selected.length == 0}
				<h3 in:fade class="text-gray-400 text cursor-default select-none">
					Select a tag to narrow search
				</h3>
			{/if}
		</tag-fodder>
		<hr class="my-3" />
		{#each unselected as tag (tag)}
			<div
				in:receive={{ key: tag }}
				out:send={{ key: tag }}
				animate:flip={{ duration: 300 }}
				class="mb-2.5 cursor-pointer inline-block float-left clear-left"
				title={tags[tag].join(', ')}
				on:click={() => select(tag)}
			>
				<span class=" bg-blue-200 p-1">{tag}</span>
				<!-- <MiniIcon d="M12 4v16m8-8H4" />
					<MiniIcon d="M20 12H4" /> -->
			</div>
		{/each}
	{/if}
</div>

<style>
</style>
