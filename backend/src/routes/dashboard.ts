import { getMachineControls, getNumberDomains, getTags } from './_db'
import { authCheck } from './_auth'
import { UNAUTHENTICATED } from './_responses'
import { app } from '../main'

app.get('dashboard', async (req, res) => {
	if (!authCheck(req)) return UNAUTHENTICATED(res)

	const documentCount = await getNumberDomains()
	const machineControls = await getMachineControls()
	res.send({
		documentCount,
		machineControls,
	})
})
