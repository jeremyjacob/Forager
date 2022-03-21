<script lang="ts">
	import Tags from './Tags.svelte';
	import DocumentCounter from './../DocumentCounter.svelte';
	import Search from './Search.svelte';
	import PageTitle from '../PageTitle.svelte';
	import Background from '../Background.svelte';

	export let data: DashboardData;

	let still = true;
</script>

<div class="dashboard grid" class:fadeUp={!still}>
	<main class="ml-7 h-screen pt-2">
		<DocumentCounter count={12454355} />
		<PageTitle title="dashboard" />
		<!-- <Search /> -->
	</main>
	<aside class="bg-white border-l">
		<Tags tags={data?.tags} />
	</aside>
</div>
<Background {still} />

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
		grid-template-columns: 1fr 0.352fr;
	}
</style>
