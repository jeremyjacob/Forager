<script lang="ts">
	import { minScore } from '$lib/stores';
	import Domain from './Domain.svelte';
	import { upIn } from '$lib/animations';
	import { domainCount, domainResults } from '$lib/stores';
	import { stringify } from 'query-string';
	import { onDestroy, onMount } from 'svelte';
	import { Endpoint, load } from '$lib/loader';
	import VirtualList from 'svelte-tiny-virtual-list';
	import InfiniteLoading from 'svelte-infinite-loading';

	let div: HTMLDivElement;
	let loading = false;
	let skipPages = 0;

	async function loadResults() {
		console.log('loadResults', 'skipPages', skipPages);
		const queryObj = {
			skip: skipPages,
			minScore: $minScore
		};
		const query = stringify(queryObj, { arrayFormat: 'comma' });
		const data = await load(Endpoint.Results, { query });
		return data as Result[];
	}

	// domainResults.set(test);
	async function loadMore() {
		if ($domainResults.length < 100) return;
		if (loading) return;
		loading = true;
		const results = await loadResults();
		domainResults.push(results);
		loading = false;
		skipPages += 100;
	}
	// onMount(loadMore);

	const unsubscriber = minScore.subscribe(async (f) => {
		const results = await loadResults();
		// console.log('domainFilter.subscribe set domainResults');
		domainResults.set(results);
		// console.log($domainResults.count);
	});

	let virtualList; // used by <VirtualList />

	onDestroy(unsubscriber);
</script>

<div class="overflow-y-scroll grow mr-[-0.5rem]" bind:this={div}>
	{#if $domainResults}
		<VirtualList
			bind:this={virtualList}
			height={div?.getBoundingClientRect().height}
			width="auto"
			itemCount={$domainResults.length}
			itemSize={30}
		>
			<div slot="item" let:index let:style {style} class="row">
				{#if $domainResults[index]}
					<Domain {index} result={$domainResults[index]} />
				{/if}
			</div>
			<div slot="footer">
				<InfiniteLoading on:infinite={loadMore} identifier={$domainResults} />
			</div>
		</VirtualList>
	{/if}
</div>

<style>
</style>
