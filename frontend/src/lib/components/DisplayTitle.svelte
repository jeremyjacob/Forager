<script lang="ts">
</script>

<div class="text text-9xl tracking-wider font-semibold mb-6 dark:text-white">
	<span style:--i={0}>F</span><span style:--i={1}>O</span><span style:--i={2}>R</span><span
		style:--i={3}>A</span
	><span style:--i={2}>G</span><span style:--i={1}>E</span><span style:--i={0}>R</span>
</div>

<style>
	@keyframes letterIn {
		0%,
		90% {
			opacity: 0;
		}

		90% {
			transform: translateY(5px);
			opacity: 0;
		}

		100% {
			transform: translateY(0px);
			opacity: 1;
		}
	}

	.text {
		z-index: 1;
		animation-name: flicker;
		animation-duration: 240ms;
		animation-delay: 1200ms;
		animation-fill-mode: forwards;
		animation-timing-function: ease-out;
	}
	span {
		display: inline-block;
		animation-name: letterIn;
		animation-duration: 500ms;
		animation-delay: calc(0ms + var(--i) * 145ms);
		animation-fill-mode: both;
		animation-timing-function: ease-in-out;
	}
</style>
