import type { RequestHandler } from '@sveltejs/kit';
import type { WorkerTagMatch } from './types';
import { authCheck } from './_auth';
import { reportBatch } from './_db';
import { UNAUTHENTICATED } from './_responses';

export const post: RequestHandler = async (event) => {
	if (!authCheck(event)) return UNAUTHENTICATED();

	const json = (await event.request.json()) as WorkerTagMatch[];
	const res = await reportBatch(json);

	return {
		body: {
			ok: !res.hasWriteErrors()
		}
	};
};

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
