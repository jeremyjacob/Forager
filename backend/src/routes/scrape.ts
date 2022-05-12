import queryString from 'query-string';
import { app } from '../main';
import { makeFilter } from './results';
import { authCheck } from '../auth';
import { getDomains } from '../db';
import { UNAUTHENTICATED } from '../responses';
import { FETCHES_TARGET } from '../config';
import { broadcast } from './stream';

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

app.get('/scrape', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);
	broadcast('msg', 'GET /scrape');
	const { query } = queryString.parseUrl(req.url, {
		arrayFormat: 'comma',
	});
	const limit = parseInt(unArray(query.limit) || '100');
	const lastPage = unArray(query.lastPage);
	const filter = await makeFilter(query, {client: false});
	const date = new Date();
	filter.fetches = { $not: { $gte: FETCHES_TARGET } };
	filter.lock = { $not: { $gt: date } };

	const data = await await getDomains(filter, {
		limit,
		lastPage: unArray(lastPage),
		lock: true,
	});
	let body = data.map(({ domain, _id }) => ({ domain, _id }));

	return res.send(body);
});
