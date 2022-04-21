import { app } from '../main'
import { authCheck } from './_auth'
import { setMachineControls } from './_db'
import { UNAUTHENTICATED } from './_responses'

app.post('machineControl', async (req, res) => {
	if (!authCheck(req)) return UNAUTHENTICATED(res)

	const { desiredCount, running, filter } = req.body
	const { acknowledged } = await setMachineControls({
		$set: {
			desiredCount,
			running,
		},
	})

	res.status(acknowledged ? 200 : 500).send({
		ok: acknowledged,
	})
})
