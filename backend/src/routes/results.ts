import type { WithId, Document } from 'mongodb';
import queryString from 'query-string';
import { app } from '../main';
import { authCheck } from '../auth';
import { getDomains, getNumberDomains, getTLDs } from '../db';
import { UNAUTHENTICATED } from '../responses';

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

app.get('/api/results', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);

	const { query } = queryString.parseUrl(req.url, {
		arrayFormat: 'comma',
	});
	const limit = parseInt(unArray(query.limit) || '100');
	const lastPage = unArray(query.lastPage);
	const filter = await makeFilter(query);
	// console.log(filter);

	const data = await getDomains(filter, {
		limit,
		lastPage: unArray(lastPage),
	});
	let body: WithId<Document>[] = data;

	return res.send(body);
});
