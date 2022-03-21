import type { RequestHandler } from '@sveltejs/kit';
import { parse } from 'cookie';
import { getTags } from './_db';
import { UNAUTHENTICATED } from './_responses';

export const get: RequestHandler = async ({ locals }) => {
	if (!locals['user']) return UNAUTHENTICATED();

	const tags = await getTags();
	return {
		body: { tags }
	};
};
