import { writable } from 'svelte/store';

function createResultStore() {
	const { subscribe, set, update } = writable<Result[]>();

	return {
		subscribe,
		set,
		update,
		push: (n: Result[]) => {
			update((o) => [...o, ...n]);
		}
	};
}

export const domainFilter = writable({ includes: [], excludes: [] });
export const domainResults = writable<Result[]>();
export const domainCount = writable<number>();
export const tags = writable<DataTag[]>();
