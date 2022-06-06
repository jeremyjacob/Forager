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

app.get('/scoring', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);

	const filter = {
		TLD: { $in: await getTLDs() },
		score: { $exists: false },
		snippets: { $size: { $gt: 0 } },
	};

	const data = await getDomains(filter, { limit: 10000 });
	let body: WithId<Document>[] = data;

	return res.send(body);
});

type ScoredSnippet = {};

// app.post('/scoring', async (req, res) => {
// 	if (!(await authCheck(req))) return UNAUTHENTICATED(res);
// 	const request = req.body as WorkerSnippets[];
// 	// if (!(request[0]?._id && request[0]?.snippets[0])) return NO_BODY(res);
// 	// console.log('Recieved: ', request);
// 	console.log(`Report: ${request.length} domains from ${req.ip}`);
// 	// console.log(
// 	// 	scored.map((s) => s.snippets.filter((s) => s.score > minLogScore))
// 	// );

// 	// tagMatchQueue.push(...data);
// 	reportBatch(request);
// 	broadcast('result', request);

// 	return res.send(request);
// });
