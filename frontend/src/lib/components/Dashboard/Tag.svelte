<script lang="ts">
	export let tag: DataTag;

	export let click = (event?: MouseEvent) => {};
	export let rClick = (event?: MouseEvent) => {};
	export let keywords: string[] = undefined;
	export let inverted = false;

	function handleClick(event: MouseEvent) {
		if (event.button == 0) click(event);
	}

	const hashCode = (s: string) =>
		Math.abs(
			('l' + s).split('').reduce((a, b) => {
				a = (a << 5) - a + b.charCodeAt(0);
				return a & a;
			}, 0) % 255
		) / 258;
</script>

{#if tag}
	<div
		title={(keywords || tag?.keywords)?.join(', ')}
		on:mousedown={handleClick}
		on:contextmenu|preventDefault={rClick}
	>
		{#if inverted}Not{/if}
		<span class="select-none p-1 bg-{tag.color}-200 dark:text-black dark:font-semibold"
			>{tag.name}</span
		>
	</div>
{/if}
{#if false}
	<do-nothing class="bg-lime-200" />
	<do-nothing class="bg-green-200" />
	<do-nothing class="bg-emerald-200" />
	<do-nothing class="bg-azure-200" />
	<do-nothing class="bg-blue-200" />
	<do-nothing class="bg-cerise-200" />
	<do-nothing class="bg-cyan-200" />
	<do-nothing class="bg-yellow-200" />
	<do-nothing class="bg-lemon-200" />
	<do-nothing class="bg-violet-200" />
	<do-nothing class="bg-indigo-200" />
	<do-nothing class="bg-red-200" />
	<do-nothing class="bg-orange-200" />
	<do-nothing class="bg-gray-200" />
{/if}

<style>
	:global(html.dark) div {
		filter: brightness(90%) saturate(150%);
	}
</style>
