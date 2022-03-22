<script lang="ts">
	import { domainCount } from '$lib/stores';
	import { fade } from 'svelte/transition';

	$: big = $domainCount != null ? nFormatter($domainCount)[0] : '?';
	$: suffix = $domainCount != null ? nFormatter($domainCount)[1] : '';

	function nFormatter(n: number) {
		if (n >= 1000000) return [(n / 1000000).toFixed(1).replace(/\.0$/, ''), 'M'];
		if (n >= 1000) return [(n / 1000).toFixed(1).replace(/\.0$/, ''), 'K'];
		return [n, ''];
	}
</script>

<div class="inline-block float-right mt-2.5 mr-7 will-change-transform">
	<span class="text-5xl inline-block transition" class:translate-x-4={!suffix}>{big}</span>
	<span
		class="text-2xl inline-block transition w-4"
		class:opacity-0={!suffix}
		class:translate-x-2={!suffix}>{suffix}</span
	>
</div>

<style>
</style>
