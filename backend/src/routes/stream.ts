import type { Response } from 'express';
import { getFetched, getTotalDomains } from '../db';
import { app } from '../main';

let clients: Set<Response> = new Set();

type BroadcastType = 'result' | 'msg' | 'stats';
export function broadcast(type: BroadcastType, body: any, client?: Response) {
	const data = {
		type,
		body,
	};
	const _clients = client ? [client] : clients;
	_clients.forEach((c) => c.write(`data: ${JSON.stringify(data)}\n\n`));
}

export async function broadcastStats(client?: Response) {
	const fetched = await getFetched();
	const total = await getTotalDomains();
	broadcast('stats', { fetched, total }, client);
}

app.get('/stream', async (req, res) => {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Cache-Control': 'no-cache',
		'Content-Type': 'text/event-stream',
		Connection: 'keep-alive',
	});
	res.flushHeaders(); // flush the headers to establish SSE with client

	clients.add(res);
	broadcastStats(res);

	res.on('close', () => {
		clients.delete(res);
		res.end();
	});
	res.on('error', () => console.log('error'));
});
