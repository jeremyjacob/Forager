<script lang="ts">
	export let delayed = false;

	function capFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	export let title = '';
</script>

<svelte:head>
	<title>Forager – {capFirstLetter(title)}</title>
</svelte:head>

<header class:delayed class="text text-4xl tracking-wider font-semibold mb-6 m-3">
	FORAGER
	<div><span class="align-top text-xl text-white bg-black ">{title.toUpperCase()}</span></div>
</header>

<style>
	header.delayed {
		animation: 300ms flicker 1200ms reverse both;
	}
</style>
