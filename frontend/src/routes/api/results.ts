import type { RequestHandler } from '@sveltejs/kit';
import type { WithId, Document } from 'mongodb';
import queryString from 'query-string';
import { authCheck } from './_auth';
import { getDomains, getNumberDomains, getTLDs } from './_db';
import { UNAUTHENTICATED } from './_responses';

function unArray(input: string | string[]) {
	if (typeof input == 'string') return input;
	if (input == null) return null;
	return input[0];
}

function array(input: string | string[]) {
	if (typeof input == 'string') return [input];
	return input;
}

export async function makeFilter(query: queryString.ParsedQuery<string>) {
	const includes = query.includes;
	const excludes = query.excludes;
	const filter: any = { tags: {}, TLD: { $in: await getTLDs() } };
	delete filter.TLD;

	if (includes?.includes('All')) {
		filter.tags.$exists = true;
		filter.tags.$ne = [];
	} else if (includes) filter.tags.$all = array(includes);
	if (excludes) filter.tags.$nin = array(excludes);
	if (!includes && !excludes) delete filter.tags;
	return filter;
}
// {$or: [{fetches: {$lt: 1}}, {fetches: {$exists: false}}]}

export const get: RequestHandler = async (event) => {
	if (!authCheck(event)) return UNAUTHENTICATED();

	const { query } = queryString.parseUrl(event.request.url, { arrayFormat: 'comma' });
	const limit = parseInt(unArray(query.limit) || '100');
	const lastPage = unArray(query.lastPage);
	const filter = await makeFilter(query);
	console.log(filter);

	const data = await getDomains(filter, { limit, lastPage: unArray(lastPage) });
	let body: WithId<Document>[] = data;

	return {
		status: 200,
		body
	};
};
