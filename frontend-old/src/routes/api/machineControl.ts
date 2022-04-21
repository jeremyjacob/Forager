import type { RequestHandler } from '@sveltejs/kit';
import { authCheck } from './_auth';
import { setMachineControls } from './_db';
import { UNAUTHENTICATED } from './_responses';

export const post: RequestHandler = async (event) => {
	if (!authCheck(req)) return UNAUTHENTICATED(res);

	const json = await event.request.json();
	const { desiredCount, running, filter } = json;
	const res = await setMachineControls({
		$set: {
			desiredCount,
			running
		}
	});

	return {
		status: res.acknowledged ? 200 : 500,
		body: { ok: res.acknowledged }
	};
};
