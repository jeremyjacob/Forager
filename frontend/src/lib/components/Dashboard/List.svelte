<script lang="ts">
	import { upIn } from '$lib/animations';
	import { domainCount, domainFilter, domainResults } from '$lib/stores';
	import { stringify } from 'query-string';
	import { onDestroy } from 'svelte';

	let div: HTMLDivElement;
	let loading = false;
	let scrolled = false;
	export let origin: string;

	function distanceToBottom(el: HTMLElement) {
		return el.scrollHeight - el.offsetHeight - el.scrollTop;
	}

	async function loadResults(lastPage?: string) {
		const query = {
			lastPage,
			...$domainFilter
		};
		const qs = stringify(query, { arrayFormat: 'comma' });
		const res = await fetch(origin + '/api/results?' + qs);
		return (await res.json()) as Result[];
	}
	async function updateCount() {
		const qs = stringify({ ...$domainFilter }, { arrayFormat: 'comma' });
		const res = await fetch(origin + '/api/count?' + qs);
		const { count } = (await res.json()) as { count: number };
		domainCount.set(count);
	}

	async function scroll(event: UIEvent) {
		if (distanceToBottom(div) < 350) {
			if (loading) return;
			scrolled = true;
			loading = true;
			const lastPage = $domainResults.slice(-1)[0]._id;
			const results = await loadResults(lastPage);
			domainResults.push(results);
			loading = false;
		}
	}

	const unsubscriber = domainFilter.subscribe(async (f) => {
		updateCount();
		scrolled = false;
		const results = await loadResults();
		domainResults.set(results);
		// console.log($domainResults.count);
	});

	onDestroy(unsubscriber);
</script>

<div class="overflow-y-scroll grow no-scroll" on:scroll={scroll} bind:this={div}>
	{#if $domainResults}
		{#each $domainResults as result, i}
			{@const n = $domainResults.length - i}
			{@const delay = 8}
			<p
				out:upIn={{ delay: (28 - i) * delay, distance: 6 }}
				in:upIn={{ delay: i * delay, distance: -6, disable: scrolled }}
			>
				{result.domain}
			</p>
		{/each}
	{/if}
</div>

<style>
</style>
