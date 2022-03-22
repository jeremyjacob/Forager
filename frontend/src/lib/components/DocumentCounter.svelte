<script lang="ts">
	import { domainResults } from '$lib/stores';

	$: count = $domainResults.count;
	$: big = count ? nFormatter(count)[0] : '?';
	$: suffix = count ? nFormatter(count)[1] : '?';

	function nFormatter(n: number) {
		if (n >= 1000000) return [(n / 1000000).toFixed(1).replace(/\.0$/, ''), 'M'];
		if (n >= 1000) return [(n / 1000).toFixed(1).replace(/\.0$/, ''), 'K'];
		return n;
	}
</script>

<div class="inline-block float-right mt-2.5 mr-7">
	<span class="text-5xl">{big}</span>
	<span class="text-2xl">{suffix}</span>
</div>

<style>
</style>
