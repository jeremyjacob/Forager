<script lang="ts">
	export let tag: DataTag;

	export let score: number;
	export let snippet: string;
</script>

{#if tag}
	<div title={snippet}>
		<span class="select-none p-1 bg-{tag.color}-200 dark:text-black dark:font-semibold bg-rose-500"
			>{Math.round(score * 100)}</span
		>
	</div>
{/if}

<style>
	:global(html.dark) span {
		filter: brightness(90%) saturate(150%);
	}
</style>
