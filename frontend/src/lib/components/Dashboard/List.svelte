<script lang="ts">
	export let results: Results;
</script>

<div class="overflow-scroll grow">
	{#if results.results}
		{#each results.results as result}
			<p>{result.domain}</p>
		{/each}
	{/if}
</div>

<style>
</style>
