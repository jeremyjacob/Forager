import { app } from '../main';
import type { WorkerTagMatch } from '../types';
import { authCheck } from '../auth';
import { reportBatch } from '../db';
import { UNAUTHENTICATED } from '../responses';
import { broadcast } from './stream';
import { ObjectId } from 'mongodb';

let tagMatchQueue: WorkerTagMatch[] = [];

let averages = [];
function addDatum(size: number) {
	averages.push(size);
	averages.slice(-10); // last 10 seconds
}
function getAverage() {
	const added = averages.reduce((partialSum, a) => partialSum + a, 0);
	return added / averages.length;
}

setInterval(async () => {
	addDatum(tagMatchQueue.length);
	console.log(`Average: ${getAverage()}/s`);

	if (!tagMatchQueue.length) return;
	const response = await reportBatch(tagMatchQueue);
	if (response.matchedCount) tagMatchQueue = [];
	// console.log(`Batched out ${response.matchedCount} results`);
}, 1000 * 1);

app.post('/report', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);
	const data = req.body as WorkerTagMatch[];
	// console.log(`Report: ${data.length} domains from ${req.ip}`);
	// if (data.length > 100) console.log(data);

	tagMatchQueue.push(...data);
	broadcast('result', { data });

	return res.send({
		ok: true,
	});
});
