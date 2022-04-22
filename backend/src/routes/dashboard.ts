import { getMachineControls, getNumberDomains, getTags } from '../db';
import { authCheck } from '../auth';
import { UNAUTHENTICATED } from '../responses';
import { root } from '../main';

root.get('/dashboard', async (req, res) => {
	// if (!authCheck(req)) return UNAUTHENTICATED(res)

	const documentCount = await getNumberDomains();
	const machineControls = await getMachineControls();
	res.send({
		documentCount,
		machineControls,
	});
});
