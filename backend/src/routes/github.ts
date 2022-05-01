import { API_KEY } from '../auth';
import { app } from '../main';
import crypto from 'crypto';
import { exec, spawn } from 'child_process';

function pullRepo() {
	console.log('Refreshing local files...');
	const executor = exec(
		[
			[
				'git fetch',
				'git reset --hard HEAD',
				// 'git clean -f -d',
				`git merge -m '@{u}'`,
			],
			['cd ~/Forager/frontend', 'pnpm install', 'pnpm build'],
			['cd ~/Forager/backend', 'pnpm install'],
		]
			.map((l) => l.join('&&'))
			.join(';')
	);
	executor.stdout.pipe(process.stdout);
	executor.stderr.pipe(process.stderr);
	executor.on('exit', () => {
		console.log('Done!');
		process.exit(0);
	});
}

app.post('/github', async (req, res) => {
	const headerSig = req.headers['x-hub-signature-256'];
	const sig =
		'sha256=' +
		crypto
			.createHmac('sha256', API_KEY)
			.update(req['rawBody'])
			.digest('hex');
	if (headerSig === sig) {
		// request is from GitHub
		// setTimeout(pullRepo, 2000);
		pullRepo();
		console.log(req.body?.commits?.map((c) => c.modified));
		res.send({ ok: 1 });
	} else res.status(401).send({ ok: 0 });
});
