// spawn child python process to run the model

// import { type ChildProcessWithoutNullStreams, spawn } from 'child_process';

// let child: ChildProcessWithoutNullStreams;
// spawnClassifier();

// function spawnClassifier() {
// 	child = spawn('python3', ['forager_finetune_distilbert.py'], {
// 		cwd: './classification',
// 	});

// 	child.stderr.on('data', (e) =>
// 		console.error('Python model error', e.toString())
// 	);

// 	child.on('exit', () => {
// 		console.log('Restarting python model...');
// 		spawnClassifier();
// 	});
// }

// export async function modelInferenceArray(data: string[]): Promise<number[]> {
// 	return new Promise((resolve) => {
// 		child.stdout.on('data', (data) => {
// 			child.stdout.removeAllListeners('data');
// 			const results: number[] = JSON.parse(data.toString());
// 			return resolve(results);
// 		});

// 		child.stdin.write(JSON.stringify(data) + '\n');
// 	});
// }
