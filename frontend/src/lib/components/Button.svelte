<script>
	export let type = 'button';
	export let formaction = '';
	export let secondary = false;
</script>

<button {type} {formaction} class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 ring-offset-2 focus:ring-offset-2 focus:ring-gray-500 transition" class:secondary>
	<slot />
</button>

<style>
	.secondary {
		@apply shadow-none text-gray-900 ring-transparent hover:text-gray-700;
		background: none;
	}
</style>
