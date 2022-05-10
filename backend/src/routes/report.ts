import { app } from '../main';
import type { WorkerTagMatch } from '../types';
import { authCheck } from '../auth';
import { reportBatch } from '../db';
import { UNAUTHENTICATED } from '../responses';
import { broadcast } from './stream';
import { ObjectId } from 'mongodb';

app.post('/report', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);

	const data = req.body as WorkerTagMatch[];
	const response = await reportBatch(data);
	broadcast('result', { data, response });

	return res.send({
		ok: !response.hasWriteErrors(),
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
