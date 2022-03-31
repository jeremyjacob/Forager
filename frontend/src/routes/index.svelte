<script context="module" lang="ts">
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import { domainResults } from '$lib/stores';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session, url: { origin } }) => {
		if (!session || !session['user']) {
			return {
				status: 302,
				redirect: '/login'
			};
		}

		const opts: RequestInit = { credentials: 'include', headers: { cookie: session['cookie'] } };
		const dashboardData = await (await fetch(origin + '/api/dashboard', opts)).json();
		const tags = await (await fetch(origin + '/api/tags', opts)).json();
		const results = await (await fetch(origin + '/api/results', opts)).json();
		domainResults.set(results);

		return {
			props: {
				user: session['user'],
				data: dashboardData,
				tags,
				origin
			}
		};
	};
</script>

<script lang="ts">
	import { browser } from '$app/env';

	export let data: DashboardData;
	export let origin: string;
	export let tags: DataTag[];
	if (browser) origin = location.origin;
</script>

<svelte:head>
	<title>Forager!</title>
</svelte:head>

<Dashboard {data} {origin} {tags} />
