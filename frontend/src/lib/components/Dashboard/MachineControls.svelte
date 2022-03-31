<script lang="ts">
	import IncDec from './IncDec.svelte';

	import { upIn } from '$lib/animations';
	import AnimatedNumber from './AnimatedNumber.svelte';

	export let data: MachineControls;
	export let origin: string;

	$: displayCount = data?.running ? data?.desiredCount : 0;

	let init = false;
	$: {
		if (!init) {
			init = true;
		} else {
			displayCount;
			fetch(origin + '/api/machineControl', {
				method: 'POST',
				body: JSON.stringify(data)
			});
		}
	}
</script>

<div class="absolute bottom-0 w-full h-24 bg-white border-t p-6 pt-5">
	<div class="flex">
		<machine-count class="flex flex-row">
			<span class="cursor-pointer" on:click={() => (data.running = !data.running)}>
				<AnimatedNumber bind:number={displayCount} /></span
			>
			{#if data?.running}
				<IncDec inc={() => displayCount++} dec={() => displayCount && displayCount--} />
			{/if}
			<!-- <h1 class="text">Gatherers</h1> -->
		</machine-count>
		<machine-stats class="ml-3.5 flex items-center">
			{#if data?.running}
				<h1 in:upIn={{ duration: 200, delay: 50 }}>Pages/s: <span>15,000</span></h1>
			{:else}
				<h1 in:upIn={{ duration: 250, delay: 250, distance: -6 }}>Forager not running</h1>
			{/if}
		</machine-stats>
	</div>
</div>

<style>
</style>
