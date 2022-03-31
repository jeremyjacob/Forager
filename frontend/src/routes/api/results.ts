import type { RequestHandler } from '@sveltejs/kit';
import type { WithId, Document } from 'mongodb';
import queryString from 'query-string';
import { authCheck } from './_auth';
import { getDomains, getNumberDomains } from './_db';
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

export function makeFilter(query: queryString.ParsedQuery<string>) {
	const includes = query.includes;
	const excludes = query.excludes;
	const filter: any = { tags: {} };

	if (includes) filter.tags.$all = array(includes);
	if (excludes) filter.tags.$nin = array(excludes);
	if (!includes && !excludes) delete filter.tags;
	return filter;
}
// {$or: [{fetches: {$lt: 1}}, {fetches: {$exists: false}}]}
const FETCHES_TARGET = 1;

export const get: RequestHandler = async (event) => {
	if (!authCheck(event)) return UNAUTHENTICATED();

	const { query } = queryString.parseUrl(event.request.url, { arrayFormat: 'comma' });
	const limit = parseInt(unArray(query.limit) || '100');
	const lastPage = unArray(query.lastPage);
	const stripped = !!query.stripped;
	const scrapable = !!query.scrapable;
	const filter = makeFilter(query);
	const date = new Date();
	date.setMinutes(date.getMinutes() - 1); // 1 Minute ago
	if (scrapable) {
		filter.fetches = { $not: { $gte: FETCHES_TARGET } };
		filter.lock = { $not: { $gt: date } };
	}

	const data = await (await getDomains(filter, limit, unArray(lastPage))).toArray();
	let body: WithId<Document>[];
	if (stripped) body = data.map(({ domain, _id }) => ({ domain, _id }));
	else body = data;

	return {
		status: 200,
		body
	};
};
