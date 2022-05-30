import { app } from '../main';
import type { WorkerSnippets } from '../types';
import { authCheck } from '../auth';
import { reportBatch } from '../db';
import { UNAUTHENTICATED } from '../responses';
import { broadcast } from './stream';

let averages = [];
function addDatum(size: number) {
	averages.push(size);
	averages.slice(-10); // last 10 seconds
}
function getAverage() {
	const added = averages.reduce((partialSum, a) => partialSum + a, 0);
	return added / averages.length;
}

// setInterval(async () => {
// 	addDatum(tagMatchQueue.length);
// 	console.log(`Average: ${getAverage()}/s`);

// 	if (!tagMatchQueue.length) return;
// 	const response = await reportBatch(tagMatchQueue);
// 	if (response.matchedCount) tagMatchQueue = [];
// 	// console.log(`Batched out ${response.matchedCount} results`);
// }, 1000 * 1);

app.post('/report', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);
	const request = req.body as WorkerSnippets[];
	// if (!(request[0]?._id && request[0]?.snippets[0])) return NO_BODY(res);
	// console.log('Recieved: ', request);
	console.log(`Report: ${request.length} domains from ${req.ip}`);
	// console.log(
	// 	scored.map((s) => s.snippets.filter((s) => s.score > minLogScore))
	// );

	// tagMatchQueue.push(...data);
	reportBatch(request);
	broadcast('result', request);

	return res.send(request);
});
