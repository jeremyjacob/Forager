<script context="module">
	import Dashboard from '$lib/components/Dashboard.svelte';

	export async function load({ session }) {
		if (!session?.user) {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		return {
			props: {
				user: session.user
			}
		};
	}
</script>

<svelte:head>
	<title>Forager!</title>
</svelte:head>

<Dashboard />
