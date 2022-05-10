import { app } from '../main';
import type { WorkerTagMatch } from '../types';
import { authCheck } from '../auth';
import { reportBatch } from '../db';
import { UNAUTHENTICATED } from '../responses';
import { broadcast } from './stream';
import { ObjectId } from 'mongodb';

let tagMatchQueue: WorkerTagMatch[] = [];

setInterval(async () => {
	if (!tagMatchQueue.length) return;
	const response = await reportBatch(tagMatchQueue);
	if (response.matchedCount) tagMatchQueue = [];
	console.log(`Batched out ${response.matchedCount} results`);
}, 1000 * 1);

app.post('/report', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);

	const data = req.body as WorkerTagMatch[];
	tagMatchQueue.push(...data);
	broadcast('result', { data });

	return res.send({
		ok: true,
	});
});

/*
[
  {
    id: '623b632f4ce636977e694292',
    tag: 'Online Forms',
    keyword: 'form'
  },
  {
    id: '623b632f4ce636977e694292',
    tag: 'Staffing Agencies',
    keyword: 'resources'
  }
]
*/

/*
[
	{
		updateOne: {
			filter: {_id: ObjectId(id)}
			update: {
				$addToSet: {
					tags: tag
					snippets.[tag]: keyword
				}
			}
		}
	}
]
*/
