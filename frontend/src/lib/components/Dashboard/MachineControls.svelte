<script lang="ts">
	import IncDec from './IncDec.svelte';

	import { upIn } from '$lib/animations';
	import AnimatedNumber from './AnimatedNumber.svelte';
	import { Endpoint, load } from '$lib/loader';

	export let data: MachineControls;

	$: localCount = data?.desiredCount ?? 0;

	function setLocalCount(num: number) {
		localCount = num;
		if (num) data.lastCount = num;
		load(Endpoint.MachineControl, { body: { desiredCount: localCount } });
	}
</script>

<div class="absolute bottom-0 w-full h-24 bg-white border-t p-4 pt-5 dark:bg-gray-990">
	<div class="flex">
		<machine-count class="flex flex-row gap-0">
			<span
				class="cursor-pointer"
				on:click={() => setLocalCount(localCount ? 0 : data?.lastCount || 1)}
			>
				<AnimatedNumber bind:number={localCount} /></span
			>
			{#if localCount}
				<IncDec mod={(n) => setLocalCount(Math.max(Math.min(localCount + n, 999), 0))} />
			{/if}
			<!-- <h1 class="text">Gatherers</h1> -->
		</machine-count>
		<machine-stats class="ml-3.5 flex items-center">
			{#if localCount}
				<h1 in:upIn={{ duration: 200, delay: 50 }}>
					{#if data}
						<div class="text-xs font-medium uppercase">
							{#if data.desiredCount > data.runningCount && !data.pendingCount}
								Awaiting workers
							{:else if data.pendingCount}
								Scaling up workers
							{:else if !data.desiredCount && data.runningCount}
								Scaling down workers
							{:else if data.runningCount}
								Forager Running
							{:else}
								Forager Stalled
							{/if}
						</div>
					{/if}
					<div>Rate: <span>15,000</span></div>
				</h1>
			{:else}
				<h1 in:upIn={{ duration: 250, delay: 250, distance: -6 }}>Forager not running</h1>
			{/if}
		</machine-stats>
	</div>
</div>

<style>
</style>
