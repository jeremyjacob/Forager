import type { WithId, Document } from 'mongodb';
import queryString from 'query-string';
import { app } from '../main';
import { authCheck } from '../auth';
import { getDomains, getNumberDomains, getTLDs } from '../db';
import { UNAUTHENTICATED } from '../responses';

export function unArray(input: string | string[]) {
	if (typeof input == 'string') return input;
	if (input == null) return null;
	return input[0];
}

app.get('/results', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);
	console.log(`GET /results from ${req.ip}`);

	const { query } = queryString.parseUrl(req.url, {
		arrayFormat: 'comma',
	});
	const minScore = parseFloat(unArray(query.minScore));
	const limit = parseInt(unArray(query.limit) || '100');
	const skip = unArray(query.skip);
	const filter = {
		TLD: { $in: await getTLDs() },
		score: { $gte: minScore },
	};

	const data = await getDomains(filter, {
		limit,
		skip: parseInt(skip),
	});
	let body: WithId<Document>[] = data;

	return res.send(body);
});
