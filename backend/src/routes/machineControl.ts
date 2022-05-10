import { app } from '../main';
import { authCheck } from '../auth';
import { setMachineControls } from '../db';
import { NO_BODY, UNAUTHENTICATED } from '../responses';

app.post('/machineControl', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);
	if (!req.body) return NO_BODY(res);

	const { desiredCount, running, filter } = req.body;
	const response = await setMachineControls({
		desiredCount,
		running,
	});

	res.status(response?.acknowledged ? 200 : 500).send({
		ok: !!response?.acknowledged,
	});
});
