import type { RequestHandler } from '@sveltejs/kit';
import { getMachineControls, getNumberDomains, getTags } from './_db';
import { authCheck } from './_auth';
import { UNAUTHENTICATED } from './_responses';

export const get: RequestHandler = async (event) => {
	if (!authCheck(req)) return UNAUTHENTICATED(res);

	const documentCount = await getNumberDomains();
	const machineControls = await getMachineControls();
	return {
		body: {
			documentCount,
			machineControls
		}
	};
};