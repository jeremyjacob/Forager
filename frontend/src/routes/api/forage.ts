import type { RequestHandler } from '@sveltejs/kit';
import type { WithId, Document } from 'mongodb';
import queryString from 'query-string';
import { getDomains, getNumberDomains } from './_db';
import { UNAUTHENTICATED } from './_responses';

export const get: RequestHandler = async ({ locals, request }) => {
	if (!locals['user']) return UNAUTHENTICATED();

	return {
		status: 200,
		body: ''
	};
};
