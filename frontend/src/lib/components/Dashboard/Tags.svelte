<script lang="ts">
	import Tag from './Tag.svelte';

	import { fade } from 'svelte/transition';
	import { receive, send } from '$lib/animations';
	import { flip } from 'svelte/animate';

	import { domainFilter, tags } from '$lib/stores';

	function updateFilter() {
		domainFilter.update((f) => {
			f.includes = $tags
				?.filter((t) => t.selected && !t.inverted)
				.map((t) => t.name);
			f.excludes = $tags
				?.filter((t) => t.selected && t.inverted)
				.map((t) => t.name);
			return f;
		});
	}

	function invert(tag: DataTag, surpress = false) {
		$tags = $tags?.map((t) => {
			if (t.name == tag.name) t.inverted = !t.inverted;
			return t;
		});
		if (!surpress) updateFilter();
	}

	function toggleTag(tag: DataTag, surpress = false) {
		$tags = $tags?.map((t) => {
			if (t.name == tag.name) {
				t.selected = !t.selected;
				if (t.selected) t.time = Date.now();
				else t.inverted = false;
			}
			return t;
		});
		if (!surpress) updateFilter();
	}

	async function unselectAll() {
		for (const tag of $tags?.filter((t) => t.selected)) {
			toggleTag(tag, true);
		}
		updateFilter();
	}

	// hsl(0, 89%, 89%)
</script>

<div
	class="p-6 pt-5 h-[calc(100vh-5rem)] relative flex flex-col overflow-hidden"
	draggable="false"
>
	<tags-top>
		<h1
			class="text-3xl {$tags?.filter((t) => t.selected).length == 0
				? 'mb-3'
				: 'mb-0.5'}"
		>
			Tags
		</h1>
		{#if $tags?.filter((t) => t.selected).length}
			<span
				class="absolute right-6 top-6 transition text-gray-900  hover:text-red-700 cursor-pointer"
				transition:fade={{ duration: 150 }}
				on:click={unselectAll}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
					/>
				</svg>
			</span>
		{/if}
		{#if $tags}
			<!-- {(window.x = $tags?.filter((t) => t.selected).sort((a, b) => Number(a.time > b.time)))} -->
			{#each $tags
				.filter((t) => t.selected)
				.sort((a, b) => Number(a.time - b.time)) as tag, i (tag)}
				<div
					in:receive={{ key: tag }}
					out:send={{ key: tag }}
					animate:flip={{ duration: 300 }}
					class="mt-2.5 cursor-pointer inline-block mr-2"
				>
					<Tag
						{tag}
						click={() => toggleTag(tag)}
						rClick={() => invert(tag)}
					/>
				</div>
			{/each}
			{#if $tags?.filter((t) => t.selected).length == 0}
				<h3
					in:fade
					class="text-gray-400 text cursor-default select-none"
				>
					Select a tag to narrow search
				</h3>
			{/if}
			<hr class="my-3" />
		{/if}
	</tags-top>
	{#if $tags}
		<div class="overflow-y-scroll pt-1">
			{#each $tags?.filter((t) => !t.selected) as tag, i (tag)}
				<div
					in:receive={{ key: tag }}
					out:send={{ key: tag }}
					animate:flip={{ duration: 300, delay: i * 0 }}
					class="mb-2.5 cursor-pointer inline-block float-left clear-left"
				>
					<Tag
						{tag}
						click={() => toggleTag(tag)}
						rClick={() => {
							toggleTag(tag, true);
							invert(tag);
						}}
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
</style>
