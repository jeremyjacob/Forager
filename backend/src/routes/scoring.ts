import type { WithId, Document } from 'mongodb';
import queryString from 'query-string';
import { app } from '../main';
import { authCheck } from '../auth';
import {
	getDomains,
	getNumberDomains,
	getTLDs,
	reportBatch,
	reportScores,
} from '../db';
import { UNAUTHENTICATED } from '../responses';
import type { ScoredSnippet } from 'src/types';

function unArray(input: string | string[]) {
	if (typeof input == 'string') return input;
	if (input == null) return null;
	return input[0];
}

app.get('/scoring', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);

	const { query } = queryString.parseUrl(req.url);
	const skip = parseInt(unArray(query.skip));
	const filter = {
		TLD: { $in: await getTLDs() },
		scores: { $exists: false },
		snippets: { $exists: true, $type: 'array', $ne: [] },
	};

	const data = await getDomains(filter, { limit: 10000, skip });
	let body: WithId<Document>[] = data;

	return res.send(body);
});

app.post('/scoring', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);
	const request = req.body as ScoredSnippet[];
	// if (!(request[0]?._id && request[0]?.snippets[0])) return NO_BODY(res);
	// console.log('Recieved: ', request);
	console.log(`Report: ${request.length} domains from ${req.ip}`);
	// console.log(
	// 	scored.map((s) => s.snippets.filter((s) => s.score > minLogScore))
	// );

	// tagMatchQueue.push(...data);
	reportScores(request);
	// broadcast('result', request);

	return res.send(request);
});
