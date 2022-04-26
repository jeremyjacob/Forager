import type { Response } from 'express';
import { app } from '../main';

let clients: Set<Response> = new Set();

type BroadcastType = 'result';
export function broadcast(type: BroadcastType, body: any) {
	const data = {
		type,
		body,
	};
	clients.forEach((client) =>
		client.write(`data: ${JSON.stringify(data)}\n\n`)
	);
}

app.get('/api/stream', async (req, res) => {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Cache-Control': 'no-cache',
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
	});
	res.flushHeaders(); // flush the headers to establish SSE with client

	clients.add(res);

	res.on('close', () => {
		clients.delete(res);
		res.end();
	});
	res.on('error', () => console.log('error'));
});
