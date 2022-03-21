<script lang="ts">
	export let tags: Tags;
</script>

<div>
	{#if tags}
		{#each Object.entries(tags) as [tag, contents]}
			<p>{tag}</p>
		{/each}
	{/if}
</div>

<style>
</style>
