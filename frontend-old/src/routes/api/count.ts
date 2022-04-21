import type { RequestHandler } from '@sveltejs/kit';
import type { WithId, Document } from 'mongodb';
import queryString from 'query-string';
import { makeFilter } from './results';
import { authCheck } from './_auth';
import { getDomains, getNumberDomains } from './_db';
import { UNAUTHENTICATED } from './_responses';

export const get: RequestHandler = async (event) => {
	if (!authCheck(req)) return UNAUTHENTICATED(res);

	const { query } = queryString.parseUrl(event.request.url, { arrayFormat: 'comma' });
	const filter = makeFilter(query);
	const count = await getNumberDomains(filter);

	return {
		status: 200,
		body: { count }
	};
};
