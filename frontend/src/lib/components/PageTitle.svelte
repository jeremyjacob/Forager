<script lang="ts">
	import { upIn } from '$lib/animations';
	function capFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	export let title = '';
</script>

<svelte:head>
	<title>Forager – {capFirstLetter(title)}</title>
</svelte:head>

<header in:upIn class="text text-4xl tracking-wider font-semibold mb-4 m-3 ml-0 inline-block">
	FORAGER
	<span
		class="align-middle text-lg text-white dark:text-black bg-black dark:bg-white mb-[0.35rem] px-1 inline-block"
		>{title.toUpperCase()}</span
	>
</header>
