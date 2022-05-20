// spawn child python process to run the model

import { spawn } from 'child_process';

const child = spawn('python3', ['forager_finetune_distilbert.py'], {
	cwd: './classification',
});

child.stderr.on('data', (e) =>
	console.error('Python model error', e.toString())
);
child.on('exit', (e) => console.error('Python model exited', e));

export async function modelInferenceArray(data: string[]): Promise<number[]> {
	return new Promise((resolve) => {
		child.stdout.on('data', (data) => {
			const results: number[] = JSON.parse(data.toString());
			child.stdout.removeAllListeners();
			return resolve(results);
		});

		child.stdin.write(JSON.stringify(data) + '\n');
	});
}
