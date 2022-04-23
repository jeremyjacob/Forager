<script lang="ts">
	import Domain from './Domain.svelte';

	import { upIn } from '$lib/animations';
	import { domainCount, domainFilter, domainResults, tags } from '$lib/stores';
	import { stringify } from 'query-string';
	import { onDestroy, onMount } from 'svelte';
	import { Endpoint, load } from '$lib/loader';

	let div: HTMLDivElement;
	let loading = false;
	let scrolled = false;

	function distanceToBottom(el: HTMLElement) {
		return el.scrollHeight - el.offsetHeight - el.scrollTop;
	}

	async function loadResults(lastPage?: string) {
		const queryObj = {
			lastPage,
			...$domainFilter
		};
		const query = stringify(queryObj, { arrayFormat: 'comma' });
		const data = await load(Endpoint.Results, { query });
		return data as Result[];
	}

	async function updateCount() {
		const query = stringify({ ...$domainFilter }, { arrayFormat: 'comma' });
		const data = await load(Endpoint.Count, { query });
		const count: number = data.count;
		domainCount.set(count);
	}

	// domainResults.set(test);
	async function loadMore() {
		if (distanceToBottom(div) < 350 || !scrolled) {
			if (loading) return;
			scrolled = true;
			loading = true;
			const lastPage = $domainResults?.slice(-1)[0]?._id;
			const results = await loadResults(lastPage);
			// console.log(results);
			domainResults.push(results);
			// $domainResults = $domainResults;
			// console.log(
			// 'Total tags before:',
			// $domainResults.reduce((a, b) => a + (b.tags?.length ?? 0), 0)
			// );
			// domainResults.set($domainResults);
			// console.log(
			// 	'Total tags after:',
			// 	$domainResults.reduce((a, b) => a + (b.tags?.length ?? 0), 0)
			// );
			loading = false;
		}
	}
	onMount(loadMore);

	const unsubscriber = domainFilter.subscribe(async (f) => {
		updateCount();
		scrolled = false;
		const results = await loadResults();
		// console.log('domainFilter.subscribe set domainResults');
		domainResults.set(results);
		// console.log($domainResults.count);
	});

	onDestroy(unsubscriber);
</script>

<div class="overflow-y-scroll grow mr-1.5" on:scroll={loadMore} bind:this={div}>
	{#if $domainResults}
		{#each $domainResults as result, i}
			<Domain {scrolled} {i} {result} />
		{/each}
	{/if}
</div>

<style>
</style>
