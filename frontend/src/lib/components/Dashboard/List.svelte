<script lang="ts">
	import Domain from './Domain.svelte';

	import { upIn } from '$lib/animations';
	import { domainCount, domainFilter, domainResults } from '$lib/stores';
	import { stringify } from 'query-string';
	import { onDestroy } from 'svelte';

	let div: HTMLDivElement;
	let loading = false;
	let scrolled = false;

	function distanceToBottom(el: HTMLElement) {
		return el.scrollHeight - el.offsetHeight - el.scrollTop;
	}

	async function loadResults(lastPage?: string) {
		const query = {
			lastPage,
			...$domainFilter,
		};
		const qs = stringify(query, { arrayFormat: 'comma' });
		const res = await fetch('api/results?' + qs);
		return (await res.json()) as Result[];
	}
	async function updateCount() {
		const qs = stringify({ ...$domainFilter }, { arrayFormat: 'comma' });
		const res = await fetch('api/count?' + qs);
		const { count } = (await res.json()) as { count: number };
		domainCount.set(count);
	}

	// if (!browser) throw Error('mann');
	// let test: Result[];
	let test = [
		{
			_id: '623b632f4ce636977e694096',
			domain: 'engage.abbott',
			TLD: 'abbott',
			fetches: 27,
			snippets: {
				Cybersecurity: ['environment'],
				Telehealth: ['patient'],
				'Staffing Agencies': ['resources'],
				'Web Design': ['design', 'Portfolio', 'professional'],
				Business: ['contact', 'benefits', 'solution'],
				Furniture: ['bar', 'home'],
				'Event Tickets': ['live'],
				'Corporate Housing': ['rent', 'across'],
				'Online Forms': ['form', 'lease'],
				'Car Dealers': ['trade'],
				Accountants: ['seamless'],
				'Foreign Language Courses': ['learn'],
				'Sign Up': ['register'],
				Software: ['program'],
				'Precious Metals': ['metal', 'trusted'],
				Finance: ['financ'],
				'E-Commerce': ['product'],
				Nutraceuticals: ['health'],
				'Diet Programs': ['nutrition'],
			},
			tags: ['E-Commerce', 'Nutraceuticals', 'Diet Programs'],
		},
	] as Result[];
	// domainResults.set(test);
	async function scroll() {
		console.log('scorll');
		// if (distanceToBottom(div) < 350) {
		if (loading) return;
		scrolled = true;
		loading = true;
		const lastPage = $domainResults.slice(-1)[0]?._id;
		// const results = await loadResults(lastPage);
		// domainResults.push(results);
		// $domainResults = $domainResults;
		console.log(
			'Total tags before:',
			$domainResults.reduce((a, b) => a + (b.tags?.length ?? 0), 0)
		);
		domainResults.set($domainResults);
		console.log(
			'Total tags after:',
			$domainResults.reduce((a, b) => a + (b.tags?.length ?? 0), 0)
		);
		loading = false;
		// }
	}

	domainResults.subscribe(console.log);

	const unsubscriber = domainFilter.subscribe(async (f) => {
		updateCount();
		scrolled = false;
		const results = await loadResults();
		// console.log('domainFilter.subscribe set domainResults');
		// domainResults.set(results);
		// console.log($domainResults.count);
	});

	onDestroy(unsubscriber);
</script>

<div class="overflow-y-scroll grow mr-1.5" on:click={scroll} bind:this={div}>
	{#if $domainResults}
		{#each $domainResults as result, i}
			<Domain {scrolled} {i} {result} />
		{/each}
	{/if}
</div>

<style>
</style>
