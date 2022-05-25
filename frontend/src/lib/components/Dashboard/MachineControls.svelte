<script lang="ts">
	import IncDec from './IncDec.svelte';

	import { upIn } from '$lib/animations';
	import AnimatedNumber from './AnimatedNumber.svelte';
	import { Endpoint, load } from '$lib/loader';
	import { onMount } from 'svelte';
	import type { DescribeServicesCommandOutput, Service } from '@aws-sdk/client-ecs';
	import { rate } from '$lib/stores';

	$: desiredCount = awsServiceData?.desiredCount ?? 0;
	let updatesFrozen = false;
	function freezeUpdates() {
		updatesFrozen = true;
		setTimeout(() => (updatesFrozen = false), 2500); // thaw
	}

	let awsServiceData: Service;
	setInterval(async () => {
		if (updatesFrozen) return;
		const output = (await load(Endpoint.Workers)) as DescribeServicesCommandOutput;
		awsServiceData = output.services[0];
	}, 1000);

	function setDesiredCount(num: number) {
		desiredCount = num;
		freezeUpdates();
		console.log('Updating worker count to ', desiredCount);
		load(Endpoint.SetWorkers, { body: { desiredCount: desiredCount } });
	}
</script>

<div class="w-full grow bg-white border-t p-4 pt-5 dark:bg-gray-990">
	<div class="flex">
		<machine-count class="flex flex-row gap-0">
			<span class="cursor-pointer" on:click={() => setDesiredCount(desiredCount ? 0 : 1)}>
				<AnimatedNumber bind:number={desiredCount} /></span
			>
			{#if desiredCount}
				<IncDec mod={(n) => setDesiredCount(Math.max(Math.min(desiredCount + n, 999), 0))} />
			{/if}
			<!-- <h1 class="text">Gatherers</h1> -->
		</machine-count>
		<machine-stats class="ml-3.5 flex items-center">
			{#if desiredCount}
				<h1 in:upIn={{ duration: 200, delay: 50 }}>
					{#if awsServiceData}
						<div class="text-xs font-medium uppercase">
							{#if awsServiceData.pendingCount}
								Scaling up workers ({awsServiceData.desiredCount -
									awsServiceData.pendingCount}/{awsServiceData.desiredCount})
							{:else if awsServiceData.desiredCount < awsServiceData.runningCount}
								Scaling down workers ({awsServiceData.runningCount -
									awsServiceData.desiredCount}/{awsServiceData.desiredCount})
							{:else if awsServiceData.runningCount}
								Forager Running
							{:else}
								Forager Stalled
							{/if}
						</div>
					{/if}
					<div>Rate: <span>{$rate}</span></div>
				</h1>
			{:else}
				<h1 in:upIn={{ duration: 250, delay: 250, distance: -6 }}>Forager not running</h1>
			{/if}
		</machine-stats>
	</div>
</div>

<style>
</style>
