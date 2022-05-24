<script lang="ts">
	export let score: number;
	$: num = Math.round(score * 100);
	export let snippet: string;
</script>

<span title={snippet}>
	<span
		class="select-none p-1 dark:text-black dark:font-semibold w-9 text-sm inline-block text-center"
		style:--hue={num}>{num}</span
	>
</span>

<style>
	:global(html.dark) span {
		/* filter: brightness(90%) saturate(150%); */
	}

	span span {
		background-color: hsl(var(--hue), 80%, 61%);
	}
</style>
