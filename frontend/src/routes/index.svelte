<script context="module" lang="ts">
	import Dashboard from '$lib/components/Dashboard/Dashboard.svelte';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ session, url: { origin } }) => {
		if (!session || !session['user']) {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		const dashboardData = await (await fetch(origin + '/api/dashboard')).json();

		return {
			props: {
				user: session['user'],
				data: dashboardData
			}
		};
	};
</script>

<script lang="ts">
	export let data: DashboardData;
</script>

<svelte:head>
	<title>Forager!</title>
</svelte:head>

<Dashboard {data} />
