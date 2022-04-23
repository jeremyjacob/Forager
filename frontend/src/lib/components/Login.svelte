<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';

	import { createEventDispatcher } from 'svelte';
	import Background from './Background.svelte';
	import PageTitle from './PageTitle.svelte';
	import { Endpoint, load } from '$lib/loader';

	let email = '';
	let password = '';
	let error = '';

	const dispatch = createEventDispatcher();

	function submit(event: SubmitEvent) {
		const button = event.submitter as HTMLButtonElement;
		const endpoint = button.getAttribute('data-endpoint') as Endpoint;
		load(endpoint, {
			body: { email, password }
		}).then((res) => {
			error = res.message;
			if (res.ok) location.pathname = '';
		});
	}
</script>

<Background loading={false} />
<div class="ml-7 h-screen">
	<PageTitle title="login" />
	<div class="w-1/3 min-w-max m-auto flex flex-col justify-center h-[60%]">
		<div class="p-5 bg-white">
			<form on:submit|preventDefault={submit} class="space-y-5 {$$props.class}">
				<Input label="Email" id="email" name="email" type="email" bind:value={email} required />
				<Input
					label="Password"
					id="password"
					name="password"
					type="password"
					bind:value={password}
					required
				/>
				<Button type="submit" endpoint="login">Sign In</Button>
				<input-spacer class="w-1 inline-block" />
				<Button type="submit" endpoint="register" secondary>Sign Up</Button>
			</form>
		</div>
	</div>
	{#if error}
		<p class="text-center">
			<span class="mt-3 bg-red-500 text-white px-0.5 text-center font-semibold">{error}</span>
		</p>
	{/if}
</div>
