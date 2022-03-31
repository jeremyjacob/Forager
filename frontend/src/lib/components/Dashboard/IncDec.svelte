<script lang="ts">
	import { upIn } from '$lib/animations';
	import { fade } from 'svelte/transition';
	import AnimatedNumber from './AnimatedNumber.svelte';

	export let inc = () => {};
	export let dec = () => {};
</script>

<inc-dec transition:upIn={{ duration: 250 }} class="inline-flex flex-col ml-2 select-none">
	<span
		on:click={inc}
		class="bg-white transition hover:bg-gray-150 text-gray-600 hover:text-gray-700 border-2 border-gray-400 rounded-t-lg border-b-0 w-7 text-center text-lg cursor-pointer"
		><svg width="24" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M18 16L12 9L6 16"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</span>
	<span
		class="bg-white transition hover:bg-gray-150 text-gray-600 hover:text-gray-700 border-2 border-gray-400 rounded-b-lg border-t-0 w-7 text-center text-lg cursor-pointer"
		on:click={dec}
		><svg width="24" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M18 9L12 16L6 9"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</span>
</inc-dec>

<style>
</style>
