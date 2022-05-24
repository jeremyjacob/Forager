<script lang="ts">
	import Score from './Score.svelte';
	import { upIn } from '$lib/animations';
	import { tags } from '$lib/stores';
	import { onMount } from 'svelte';

	export let index: number;
	export let result: Result;

	const delay = 8;

	function copy(event: MouseEvent) {
		const range = document.createRange();
		const node = event.target as HTMLElement;
		range.selectNode(node);
		window.getSelection().removeAllRanges();
		window.getSelection().addRange(range);
		document.execCommand('copy');
		window.getSelection().removeAllRanges();

		node.classList.add('flash');
		setTimeout(() => node.classList.remove('flash'), 250);
	}
</script>

<div
	class="pb-3 h-[25px] flex"
	out:upIn={{ delay: (28 - index) * 0, distance: 6 }}
	in:upIn={{ delay: 0, distance: -6 }}
>
	<td>
		<a
			href="http://{result.domain}"
			target="_blank"
			class="whitespace-nowrap visited:text-purple-800 dark:visited:text-purple-400 w-56 inline-block"
		>
			{result.domain}
		</a>
	</td>
	<td class="mr-3">
		<Score score={result.score} snippet={result.snippet} />
	</td>
	<td
		><span
			class="whitespace-nowrap text-gray-700 dark:text-gray-200 cursor-pointer transition-colors"
			on:click={copy}>{result.snippet}</span
		></td
	>
	<!-- <div
		class="inline-block overflow-hidden overflow-x-scroll float-left w-full whitespace-nowrap no-scroll"
	>
		<div class="inline-block ml-2">
			
		</div>
	</div> -->
</div>

<style>
	:global(span.flash) {
		@apply text-blue-400;
	}
</style>
