<script lang="ts">
	import { receive, send, upIn } from '$lib/animations';
	import { flip } from 'svelte/animate';

	import MiniIcon from './MiniIcon.svelte';
	export let tags: TagsData;
	$: unselected = tags ? Object.keys(tags) : [];
	let selected: string[] = [];

	function select(tag: string) {
		selected = [...selected, tag];
		unselected = unselected.filter((t) => t != tag);
	}
	function unselect(tag: string) {
		unselected = [tag, ...unselected];
		selected = selected.filter((t) => t != tag);
	}
</script>

<div class="p-6 pt-5">
	<h1 class="text-3xl mb-2">Tags</h1>
	{#if tags}
		<tag-fodder class="h-7 block">
			{#each selected as tag, i (tag)}
				<div
					in:receive={{ key: tag }}
					out:send={{ key: tag }}
					animate:flip={{ duration: 300 }}
					class="mb-2.5 cursor-pointer inline-block  mr-2"
					on:click={() => unselect(tag)}
				>
					<span class=" bg-blue-200 p-1">{tag}</span>
					<!-- <MiniIcon d="M12 4v16m8-8H4" />
					<MiniIcon d="M20 12H4" /> -->
				</div>
			{/each}
		</tag-fodder>
		<hr class="my-3" />
		{#each unselected as tag (tag)}
			<div
				in:receive={{ key: tag }}
				out:send={{ key: tag }}
				animate:flip={{ duration: 300 }}
				class="mb-2.5 cursor-pointer inline-block float-left clear-left"
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
