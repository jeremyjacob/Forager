<script lang="ts">
	import Tag from './Tag.svelte';

	import { fade } from 'svelte/transition';
	import { receive, send, upIn } from '$lib/animations';
	import { flip } from 'svelte/animate';

	import MiniIcon from './MiniIcon.svelte';
	import { domainFilter } from '$lib/stores';

	export let tagData: TagsData;
	$: tags = (
		tagData
			? Object.keys(tagData).map((name) => ({
					name,
					inverted: false,
					selected: false
			  }))
			: []
	) as UITag[];

	function updateFilter() {
		domainFilter.update((f) => {
			f.includes = tags.filter((t) => t.selected && !t.inverted).map((t) => t.name);
			f.excludes = tags.filter((t) => t.selected && t.inverted).map((t) => t.name);
			return f;
		});
		console.log('updateFilters()', $domainFilter);
	}

	function invert(tag: UITag, surpress = false) {
		tags = tags.map((t) => {
			if (t.name == tag.name) t.inverted = !t.inverted;
			return t;
		});
		if (!surpress) updateFilter();
	}

	function toggleTag(tag: UITag, surpress = false) {
		tag.selected = !tag.selected;
		const tmp = tags.filter(({ name }) => name != tag.name);
		if (tag.selected) tags = [...tmp, tag];
		else {
			tags = [tag, ...tmp];
			tag.inverted = false;
		}
		if (!surpress) updateFilter();
	}

	// hsl(0, 89%, 89%)
</script>

<div class="p-6 pt-5">
	<h1 class="text-3xl {tags.filter((t) => t.selected).length == 0 ? 'mb-3' : 'mb-0.5'}">Tags</h1>
	{#if tags}
		<tag-fodder class="block">
			{#each tags.filter((t) => t.selected) as tag, i (tag)}
				<div
					in:receive={{ key: tag }}
					out:send={{ key: tag }}
					animate:flip={{ duration: 300 }}
					class="mt-2.5 cursor-pointer inline-block mr-2"
				>
					<Tag
						{tag}
						tooltip={tags[tag.name]?.join(', ')}
						click={() => toggleTag(tag)}
						rClick={() => invert(tag)}
					/>
				</div>
			{/each}
			{#if tags.filter((t) => t.selected).length == 0}
				<h3 in:fade class="text-gray-400 text cursor-default select-none">
					Select a tag to narrow search
				</h3>
			{/if}
		</tag-fodder>
		<hr class="my-3" />
		{#each tags.filter((t) => !t.selected) as tag (tag)}
			<div
				in:receive={{ key: tag }}
				out:send={{ key: tag }}
				animate:flip={{ duration: 300 }}
				class="mb-2.5 cursor-pointer inline-block float-left clear-left"
			>
				<Tag
					{tag}
					tooltip={tags[tag.name]?.join(', ')}
					click={() => toggleTag(tag)}
					rClick={() => {
						toggleTag(tag, true);
						invert(tag);
					}}
				/>
			</div>
		{/each}
	{/if}
</div>

<style>
</style>
