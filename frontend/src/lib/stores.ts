import { writable } from 'svelte/store';

function createResultStore() {
	const { subscribe, set, update } = writable<Results>();

	return {
		subscribe,
		set,
		update,
		push: (n: Results) => {
			update((o) => ({
				results: [...o.results, ...n.results],
				count: n.count
			}));
		}
	};
}

export const domainFilter = writable({ includes: [], excludes: [] });
export const domainResults = createResultStore();
export const domainCount = writable<number>();
