import { app } from '../main';
import { authCheck } from '../auth';
import { BAD_BODY, NO_BODY, UNAUTHENTICATED } from '../responses';
import {
	ECSClient,
	DescribeServicesCommand,
	UpdateServiceCommand,
	DescribeTasksCommand,
} from '@aws-sdk/client-ecs';
import { FORAGER_SERVICE } from '../config';

const client = new ECSClient({ region: 'us-east-1' });

// const command = new DescribeTasksCommand({
// 	tasks: ['arn:aws:ecs:us-east-1:781426676209:task-definition/forager-arm:3'],
// });
// (async () => {
// 	const res = await client.send(command);
// 	console.log(res);
// })();

app.get('/workers', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);

	const command = new DescribeServicesCommand({
		cluster: 'Foragers',
		services: [FORAGER_SERVICE],
	});
	const response = await client.send(command);
	res.send(response);
});

app.post('/workers', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);
	if (!req.body) return NO_BODY(res);

	const { desiredCount } = req.body;
	if (desiredCount == null) return BAD_BODY(res);
	const command = new UpdateServiceCommand({
		cluster: 'Foragers',
		service: FORAGER_SERVICE,
		desiredCount,
	});
	const response = await client.send(command);

	res.send({
		ok: true,
	});
});
