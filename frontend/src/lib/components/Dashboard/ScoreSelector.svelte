<script lang="ts">
	import { fade } from 'svelte/transition';
	import { minScore } from '$lib/stores';

	let value = 80;
	$: debounce(value);

	let timer: NodeJS.Timeout;
	const debounce = (v) => {
		clearTimeout(timer);
		timer = setTimeout(() => minScore.set(v / 100), 150);
	};
</script>

<div class="p-6 pt-5 relative flex flex-col overflow-hidden dark:bg-gray-990" draggable="false">
	<h1 class="text-3xl mb-0.5">Score</h1>
	<h3 in:fade class="text-gray-400 dark:text-gray-300 text cursor-default# select-none text-sm">
		Drag the slider to adjust score cut-off
	</h3>
	<slider-input class="flex mt-2">
		<input class="grow mr-1.5" type="range" bind:value /><input
			type="number"
			class="w-6 outline-none border-none bg-transparent text-right"
			bind:value
		/>%
	</slider-input>
</div>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	input[type='number'] {
		-moz-appearance: textfield;
	}

	input[type='range'] {
		-webkit-appearance: none;
		margin: 10px 0;
		width: 100%;
		background-color: transparent;
	}
	input[type='range']:focus {
		outline: none;
	}
	input[type='range']::-webkit-slider-runnable-track {
		width: 100%;
		height: 10px;
		cursor: pointer;
		box-shadow: 1px 1px 1px #000000;
		@apply bg-blue-400;
		border-radius: 5px;
		border: 1px solid #000000;
	}
	input[type='range']::-webkit-slider-thumb {
		box-shadow: 1px 1px 1px #000000;
		border: 1px solid #000000;
		height: 30px;
		width: 15px;
		border-radius: 5px;
		background: #ffffff;
		cursor: pointer;
		-webkit-appearance: none;
		margin-top: -11px;
	}
	input[type='range']:focus::-webkit-slider-runnable-track {
		@apply bg-blue-400;
	}
	input[type='range']::-moz-range-track {
		width: 100%;
		height: 10px;
		cursor: pointer;
		box-shadow: 1px 1px 1px #000000;
		@apply bg-blue-400;
		border-radius: 5px;
		border: 1px solid #000000;
	}
	input[type='range']::-moz-range-thumb {
		box-shadow: 1px 1px 1px #000000;
		border: 1px solid #000000;
		height: 30px;
		width: 15px;
		border-radius: 5px;
		/* background: #ffffff; */
		cursor: pointer;
	}
</style>
