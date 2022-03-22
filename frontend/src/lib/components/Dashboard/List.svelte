<script lang="ts">
	import { upIn } from '$lib/animations';
	import { domainFilter, domainResults } from '$lib/stores';
	import { stringify } from 'query-string';
	import { bounceOut } from 'svelte/easing';

	let div: HTMLDivElement;
	let loading = false;
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
		return (await res.json()) as Results;
	}

	async function scroll(event: UIEvent) {
		if (distanceToBottom(div) < 350) {
			if (loading) return;
			loading = true;
			const lastPage = $domainResults.results.slice(-1)[0]._id;
			const results = await loadResults(lastPage);
			domainResults.push(results);
			loading = false;
		}
	}

	domainFilter.subscribe(async (f) => {
		const results = await loadResults();
		domainResults.set(results);
	});
</script>

<div class="overflow-scroll grow" on:scroll={scroll} bind:this={div}>
	{#if $domainResults.results}
		{#each $domainResults.results as result, i}
			{@const n = $domainResults.results.length - i}
			<p transition:upIn={{ delay: (28 - i) * 5, easing: bounceOut }}>{result.domain}</p>
		{/each}
	{/if}
</div>

<style>
</style>
