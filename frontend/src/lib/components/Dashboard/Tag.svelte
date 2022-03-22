<script lang="ts">
	import MiniIcon from './MiniIcon.svelte';

	export let tag: UITag;
	export let tooltip: string;
	export let click = () => {};
	export let rClick = () => {};

	const hashCode = (s: string) =>
		Math.abs(
			s.split('').reduce((a, b) => {
				a = (a << 5) - a + b.charCodeAt(0);
				return a & a;
			}, 0) % 255
		);
</script>

<div title={tooltip} on:click={click} on:contextmenu|preventDefault={rClick}>
	{#if tag.inverted}Not{/if}
	<span class="select-none p-1" style:background-color={`hsl(${hashCode(tag.name)}, 89%, 89%)`}
		>{tag.name}</span
	>
</div>

<style>
</style>
