import { API_KEY } from '../auth';
import { app } from '../main';
import crypto from 'crypto';
import { exec } from 'child_process';

function pullRepo() {
	exec(
		[
			'cd ~/Forager/backend',
			'git reset --hard HEAD',
			'git pull',
			'pnpm install',
		].join('&&')
	);
} //

app.post('/api/github', async (req, res) => {
	const headerSig = req.headers['x-hub-signature-256'];
	console.log('/github', req.headers, headerSig);
	req.on('data', (chunk) => {
		let sig =
			'sha256=' +
			crypto
				.createHmac('sha256', API_KEY)
				.update(chunk.toString())
				.digest('hex');
		if (headerSig == sig) {
			// request is from GitHub
			pullRepo();
			console.log('Got pull notification from GitHub...');
			res.send({ ok: 1 });
		}
	});
	setTimeout(() => res.status(401).send({ ok: 0 }), 2000);
});
