<script lang="ts" context="module">
	export async function load({ session }) {
		if (session?.user) {
			return {
				status: 302,
				redirect: '/'
			};
		}
		return {
			props: {
				user: session.user
			}
		};
	}
</script>

<script lang="ts">
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Login from '$lib/components/Login.svelte';
	import Background from '$lib/components/Background.svelte';
	import { goto } from '$app/navigation';
	import { upIn } from '$lib/animations';
	let error = '';

	async function handleSubmit({ detail: { email, password, endpoint } }) {
		const response = await fetch(endpoint, {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			error = (await response.json()).message;
			return;
		}

		// goto('/'); // doesnt work?
		location.href = '/';
	}
</script>

<PageTitle title="login" />
<Background still />
<div class="w-1/3 min-w-max m-auto flex flex-col justify-center">
	<Login on:submit={handleSubmit} />
</div>
{#if error}
	<p class="text-center"><span class="mt-3 bg-red-500 text-white px-0.5 text-center font-semibold">{error}</span></p>
{/if}

<style>
	div {
		height: 54%;
	}
</style>
