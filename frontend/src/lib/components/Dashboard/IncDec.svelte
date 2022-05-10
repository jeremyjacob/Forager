<script lang="ts">
	import { upIn } from '$lib/animations';
	import { fade } from 'svelte/transition';
	import AnimatedNumber from './AnimatedNumber.svelte';

	export let mod = (amount: number) => {};

	function updateMod(event: MouseEvent, num: number) {
		if (event.ctrlKey) num *= 10;
		mod(num);
	}
</script>

<inc-dec transition:upIn={{ duration: 250 }} class="inline-flex flex-col ml-2 select-none">
	<span
		on:click={(e) => updateMod(e, 1)}
		class="bg-white dark:bg-gray-950 transition hover:bg-gray-150 dark:hover:bg-gray-850 dark:text-gray-100 text-gray-600 hover:text-gray-700 dark:hover:text-white border-2 dark:border-gray-800 border-gray-400 rounded-t-lg border-b-0 w-7 text-center text-lg cursor-pointer"
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
		class="bg-white dark:bg-gray-950 transition hover:bg-gray-150 dark:hover:bg-gray-850 dark:text-gray-100 text-gray-600 hover:text-gray-700 dark:hover:text-white border-2 dark:border-gray-800 border-gray-400 rounded-b-lg border-t-0 w-7 text-center text-lg cursor-pointer"
		on:click={(e) => updateMod(e, -1)}
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
