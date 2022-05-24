import queryString from 'query-string';
import { app } from '../main';
import { authCheck } from '../auth';
import { getDomains, getTLDs } from '../db';
import { UNAUTHENTICATED } from '../responses';
import { FETCHES_TARGET } from '../config';

function unArray(input: string | string[]) {
	if (typeof input == 'string') return input;
	if (input == null) return null;
	return input[0];
}

// {$or: [{fetches: {$lt: 1}}, {fetches: {$exists: false}}]}

export async function makeFilter(query: queryString.ParsedQuery<string>) {
	const filter: any = {
		TLD: { $in: await getTLDs() },
	};

	return filter;
}

app.get('/scrape', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);
	// console.log(`GET /scrape from ${req.ip}`);
	const { query } = queryString.parseUrl(req.url, {
		arrayFormat: 'comma',
	});
	const limit = parseInt(unArray(query.limit) || '100');
	const filter = {
		TLD: { $in: await getTLDs() },
		fetches: { $not: { $gte: FETCHES_TARGET } },
		lock: { $not: { $gt: new Date() } },
	};
	const data = await await getDomains(filter, {
		limit,
		lock: true,
	});
	let body = data.map(({ domain, _id }) => ({ domain, _id }));

	return res.send(body);
});
