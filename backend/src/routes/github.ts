import { API_KEY } from '../auth';
import { app } from '../main';
import crypto from 'crypto';
import { exec } from 'child_process';

function pullRepo() {
	exec(
		[
			['git reset --hard HEAD', 'git pull'],
			['cd ~/Forager/frontend', 'pnpm install', 'pnpm build'],
			['cd ~/Forager/backend', 'pnpm install'],
		]
			.map((l) => l.join('&&'))
			.join(';')
	).on('exit', process.exit(0));
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
		setTimeout(pullRepo, 2000);
		console.log('Got pull notification from GitHub...');
		res.send({ ok: 1 });
	} else res.status(401).send({ ok: 0 });
});
