<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';

	import { createEventDispatcher } from 'svelte';

	let email = '';
	let password = '';

	const dispatch = createEventDispatcher();

	function submit(event: SubmitEvent) {
		const button = event.submitter as HTMLButtonElement;
		dispatch('submit', {
			email,
			password,
			endpoint: button.formAction
		});
	}
</script>

<div class="p-5 bg-white">
	<form on:submit|preventDefault={submit} class="space-y-5 {$$props.class}">
		<Input label="Email" id="email" name="email" type="email" bind:value={email} required />
		<Input label="Password" id="password" name="password" type="password" bind:value={password} required />
		<Button type="submit" formaction="api/login">Sign In</Button>
		<input-spacer class="w-1 inline-block" />
		<Button type="submit" formaction="api/register" secondary>Sign Up</Button>
	</form>
</div>
