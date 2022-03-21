import type { RequestHandler } from '@sveltejs/kit';
import queryString from 'query-string';
import { getDomains, getNumberDomains } from './_db';
import { UNAUTHENTICATED } from './_responses';

function narrowQuery(test) {
	typeof test.includes != 'object';
}

export const get: RequestHandler = async ({ locals, request }) => {
	if (!locals['user']) return UNAUTHENTICATED();
	const { query } = queryString.parseUrl(request.url, { arrayFormat: 'comma' });
	const { lastPage } = query;
	if (typeof lastPage != 'string' && typeof lastPage != 'undefined') return { body: { message: 'Invalid lastPage' } };
	const includes = query.includes;
	const excludes = query.excludes;
	const filter: { tags?: { $all?: {}; $nin?: {} } } = {};
	if (includes) filter.tags.$all = includes;
	if (excludes) filter.tags.$nin = excludes;
	console.log(filter);
	const data = await getDomains(filter, lastPage);

	return {
		status: 200,
		body: {
			results: await data.toArray(),
			count: await getNumberDomains(filter)
		}
	};
};
