<script lang="ts">
	import IncDec from './IncDec.svelte';

	import { upIn } from '$lib/animations';
	import { stream } from '$lib/stream';
	import { rate } from '$lib/stores';

	let resultSum = 0;
	let startTime = new Date().getTime();

	$: {
		const secondsPassed = new Date().getTime() - startTime;
		$rate = resultSum / secondsPassed;
	}
	stream.addEventListener('message', (message) => {
		const data = JSON.parse(message.data);
		if (data.type == 'result') {
			console.log(data.body);
			resultSum += data.body.length;
		}
	});
</script>

<!-- <div class="absolute bottom-0 w-full h-24 bg-white border-t p-6 pt-5" transition:upIn>
	<code />
</div> -->
<style>
</style>
