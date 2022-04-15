import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async (event) => {
	console.error(event.request.body);

	return {
		body: {
			ok: 1
		}
	};
};
