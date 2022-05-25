import { writable } from 'svelte/store';

function createResultStore() {
	const { subscribe, set, update } = writable<Result[]>();

	return {
		subscribe,
		set,
		update,
		push: (n: Result[]) => {
			update((o) => [...(o || []), ...n]);
		}
	};
}

export const minScore = writable(0.8);
export const domainResults = createResultStore();
export const domainCount = writable<number>();
export const tags = writable<DataTag[]>();
export const rate = writable(0);
