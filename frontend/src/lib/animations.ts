import { fade } from 'svelte/transition';
import { cubicOut, quintOut } from 'svelte/easing';

// export function letters(node, { i = 0 }) {
// 	return {
// 		duration: 50,
// 		delay: 1000 + i * 50,
// 		css: (t) => `opacity: ${t == 0 || t == 1 ? 0 : 1};`
// 	};
// }

export function upIn(node, { duration = 150, delay = 0, distance = 4, easing = quintOut }) {
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
