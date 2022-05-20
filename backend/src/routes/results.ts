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
	if (input == null) return [];
	if (typeof input == 'string') return [input];
	return input;
}

export async function makeFilter(query: queryString.ParsedQuery<string>) {
	const filter: any = {
		TLD: { $in: await getTLDs() },
	};

	const minScore = parseFloat(unArray(query.minScore));
	if (minScore) {
		filter.score = { $gte: minScore };
	}

	return filter;
}

app.get('/results', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);
	console.log(`GET /results from ${req.ip}`);

	const { query } = queryString.parseUrl(req.url, {
		arrayFormat: 'comma',
	});
	const limit = parseInt(unArray(query.limit) || '100');
	const skip = unArray(query.skip);
	const filter = await makeFilter(query);
	// console.log(filter);

	const data = await getDomains(filter, {
		limit,
		skip: parseInt(unArray(skip)),
	});
	let body: WithId<Document>[] = data;

	return res.send(body);
});
