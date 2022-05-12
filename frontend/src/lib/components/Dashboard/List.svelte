<script lang="ts">
	import Domain from './Domain.svelte';
	import { upIn } from '$lib/animations';
	import { domainCount, domainFilter, domainResults, tags } from '$lib/stores';
	import { stringify } from 'query-string';
	import { onDestroy, onMount } from 'svelte';
	import { Endpoint, load } from '$lib/loader';
	import VirtualList from 'svelte-tiny-virtual-list';
	import InfiniteLoading from 'svelte-infinite-loading';

	let div: HTMLDivElement;
	let loading = false;
	let skipPages = 0;

	function distanceToBottom(el: HTMLElement) {
		return el.scrollHeight - el.offsetHeight - el.scrollTop;
	}

	async function loadResults() {
		console.log('loadResults', 'skipPages', skipPages);
		const queryObj = {
			skip: skipPages,
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
		if (loading) return;
		loading = true;
		const results = await loadResults();
		domainResults.push(results);
		loading = false;
		skipPages += 100;
	}
	// onMount(loadMore);

	const unsubscriber = domainFilter.subscribe(async (f) => {
		updateCount();
		const results = await loadResults();
		// console.log('domainFilter.subscribe set domainResults');
		domainResults.set(results);
		// console.log($domainResults.count);
	});

	$domainResults;
	let virtualList;

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
