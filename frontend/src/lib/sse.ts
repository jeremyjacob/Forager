import http from 'http';
import { createSession } from 'better-sse';

// websockets.js
// import WebSocket, { WebSocketServer } from 'ws';
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const clients: http.ServerResponse[] = [];

const server = http.createServer(async (req, res) => {
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Access-Control-Allow-Origin', '*');

	clients.push(res);
	// setTimeout(() => res.write('world!'), 1000);
	// setTimeout(() => res.end(), 2000);
});

// const wss = new WebSocketServer({ server, path: '/fws' });
// wss.on('connection', (socket) => {
// socket.send('Hello');
// });

server.listen(3001);
console.log('Server started');
// export function initialize() {}

export function sendAll(message: string) {
	clients.forEach((client) => client.write(message));
	// wss.clients.forEach((client) => client.send(message));
}
