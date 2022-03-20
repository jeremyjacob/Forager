<script>
	export let value = '';
	export let id;
	export let label;
	export let type = 'text';
	export let name;
	export let required = false;

	export let inputRef = null;

	function setType(node) {
		node.type = type;
	}
</script>

<div class={$$props.class}>
	<label for={id} class="block text-sm font-medium text-black">
		{label}
	</label>
	<div class="mt-1">
		<input use:setType {name} {id} {required} bind:value bind:this={inputRef} class="outline-none p-2 border focus:border-gray-500 block w-full sm:text-sm border-gray-300 rounded-md" />
	</div>
</div>
