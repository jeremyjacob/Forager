import type { RequestHandler } from '@sveltejs/kit';
import { main } from './_aws';

export const get: RequestHandler = async ({ locals }) => {
	main();
	return {
		body: {}
	};
};
