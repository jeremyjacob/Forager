import { getMachineControls, getNumberDomains, getTags } from '../db';
import { authCheck } from '../auth';
import { UNAUTHENTICATED } from '../responses';
import { app } from '../main';

app.get('/api/dashboard', async (req, res) => {
	// if (!authCheck(req)) return UNAUTHENTICATED(res)

	const documentCount = await getNumberDomains();
	const machineControls = await getMachineControls();
	res.send({
		documentCount,
		machineControls,
	});
});
