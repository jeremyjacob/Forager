import type { RequestHandler } from '@sveltejs/kit';
import type { WithId, Document } from 'mongodb';
import queryString from 'query-string';
import { makeFilter } from './results';
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

// {$or: [{fetches: {$lt: 1}}, {fetches: {$exists: false}}]}
const FETCHES_TARGET = 1;

export const get: RequestHandler = async (event) => {
	if (!authCheck(event)) return UNAUTHENTICATED();

	const { query } = queryString.parseUrl(event.request.url, { arrayFormat: 'comma' });
	const limit = parseInt(unArray(query.limit) || '100');
	const lastPage = unArray(query.lastPage);
	const filter = makeFilter(query);
	const date = new Date();
	date.setMinutes(date.getMinutes() - 1); // 1 Minute ago
	filter.fetches = { $not: { $gte: FETCHES_TARGET } };
	filter.lock = { $not: { $gt: date } };

	const data = await (await getDomains(filter, limit, unArray(lastPage))).toArray();
	let body = data.map(({ domain, _id }) => ({ domain, _id }));

	return {
		status: 200,
		body
	};
};
