<script lang="ts">
	import Stats from './Stats.svelte';
	import ResultStream from './ResultStream.svelte';
	import MachineControls from './MachineControls.svelte';
	import List from './List.svelte';
	import ScoreSelector from './ScoreSelector.svelte';
	import DocumentCounter from '../DocumentCounter.svelte';
	import PageTitle from '../PageTitle.svelte';
	import Background from '../Background.svelte';
	import { Endpoint, load } from '$lib/loader';

	let data: DashboardData;

	(async () => {
		data = await load(Endpoint.Dashboard);
	})();

	let loading = true;
	let resultStreamVisible = true;
</script>

<div class="dashboard grid overflow-hidden" class:fadeUp={loading}>
	<main class="ml-7 h-screen pt-2 flex flex-col relative">
		<div>
			<DocumentCounter />
			<PageTitle title="dashboard" />
		</div>
		<List />
		<!-- <Search /> -->
	</main>
	<aside class="bg-white border-l relative shadow-lg flex flex-col">
		<ScoreSelector />
		{#if resultStreamVisible}
			<ResultStream />
		{/if}
		<!-- <Stats /> -->
		<MachineControls data={data?.machineControls} />
	</aside>
</div>
<Background {loading} />

<style>
	@keyframes fadeUp {
		0% {
			opacity: 0;
			transform: translateY(-10px);
		}
		100% {
			opacity: 1;
			transform: translateY(0px);
		}
	}

	.fadeUp main,
	.fadeUp aside {
		animation-name: fadeUp;
		animation-duration: 500ms;
		animation-delay: 1300ms;
		animation-fill-mode: both;
		animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);
	}

	.dashboard {
		grid-template-columns: 1fr minmax(20em, 0.26fr);
	}
</style>
