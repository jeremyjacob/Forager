<script>
	export let type = 'button';
	export let onClick = () => {};
	export let endpoint = '';
	export let secondary = false;
</script>

<button
	{type}
	on:click={onClick}
	data-endpoint={endpoint}
	class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 ring-offset-1 focus:ring-offset-3 ring-gray-500 dark:ring-gray-100 ring-offset-transparent transition"
	class:secondary
>
	<slot />
</button>

<style>
	.secondary {
		@apply shadow-none text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-transparent dark:hover:ring-1;
		background: none;
	}
</style>
