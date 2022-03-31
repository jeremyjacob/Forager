<script lang="ts">
	// 	$(function() {
	//   var min = 1;
	//   var max = 9;
	//   var unit = -50;

	//   setInterval(function() {
	//       $(".cycle").each(function(index, el) {
	//           var rnd = Math.floor(Math.random() * (max - min + 1)) + min;
	//           $(el).css('top', rnd * unit);
	//       });
	//   }, 1000);
	// });

	export let number = 0;
	export let digits = 2;
	$: num = number.toString().padStart(digits, '0');
	export let height = 3;
</script>

<div style:--height={height + 'rem'} class:pulsing={number}>
	{#each Array(digits) as _, i}
		<span class="cycle" style:--digit={num[i]}>0 1 2 3 4 5 6 7 8 9</span>
	{/each}
</div>

<style>
	@keyframes MovingBG {
		0% {
			background-position: 1% 0%;
		}
		50% {
			background-position: 99% 100%;
		}
		100% {
			background-position: 1% 0%;
		}
	}

	div {
		--min-opacity: 0.7;
		--height: 3rem;
		margin: 0 auto;
		font-size: var(--height);
		line-height: 1;
		font-weight: bold;
		text-align: center;
		height: var(--height);
		overflow: hidden;
	}
	div span {
		--digit: 0;
		position: relative;
		width: 1ch;
		display: block;
		float: left;
		top: calc(var(--digit) * var(--height) * -1);
		transition: top 0.3s ease;
		background-size: 200% 200%;
		background-clip: text;
		background-image: linear-gradient(270deg, #000000, #5a5a5a);
		-webkit-text-fill-color: transparent;
		-webkit-background-clip: text;
		animation: MovingBG 1s ease infinite;
	}
</style>
