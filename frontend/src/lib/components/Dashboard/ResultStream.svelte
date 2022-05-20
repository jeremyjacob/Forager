<script lang="ts">
	import IncDec from './IncDec.svelte';

	import { upIn } from '$lib/animations';
	import { stream } from '$lib/stream';

	let logs = [];
	stream.addEventListener('message', (message) => {
		const data = JSON.parse(message.data);
		console.log('Stream:', data);
	});
</script>

<!-- <div class="absolute bottom-0 w-full h-24 bg-white border-t p-6 pt-5" transition:upIn>
	<code />
</div> -->
<style>
</style>
