import { crossfade, fade } from 'svelte/transition';
import { cubicOut, quintOut } from 'svelte/easing';

// export function letters(node, { i = 0 }) {
// 	return {
// 		duration: 50,
// 		delay: 1000 + i * 50,
// 		css: (t) => `opacity: ${t == 0 || t == 1 ? 0 : 1};`
// 	};
// }

export function upIn(node, { duration = 170, delay = 0, distance = 6, easing = quintOut }) {
	return {
		duration,
		delay,
		css: (t) => {
			const e = easing(t);
			return `
			opacity: ${e};
			transform: translateY(${distance * (1 - t)}px)
			`;
		}
	};
}

export const [send, receive] = crossfade({
	duration: (d) => Math.sqrt(d * 600),

	fallback(node, params) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 600,
			easing: quintOut,
			css: (t) => `
				transform: ${transform};
				opacity: ${t}
			`
		};
	}
});
