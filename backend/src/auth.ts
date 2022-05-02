import type { Request } from 'express';
import { getSession } from './db';

// Load in the API Key from Enviroment Variables
// It is not hardcoded because this code is publicly visible, and that's frowned upon anyway
export const API_KEY = process.env.FORAGER_API_KEY;

// This function gets called whenever someone makes a request to the backend
// It returns true if they are logged in with cookies or they have the secret API Key
// The API Key is used by the Forager worker
export async function authCheck(req: Request) {
	const session = req.cookies?.session_id;
	const hasSession = await getSession(session);
	const attemptKey = req.headers?.authorization.replace(/[^A-Za-z0-9]/g, ''); // Strip non-alpha-numeric
	const apiKey = attemptKey === API_KEY || attemptKey === 'Bearer ' + API_KEY;
	console.table({
		apiKey: apiKey,
		hasSession: hasSession,
		'req.headers': req.headers,
		'API_KEY:': API_KEY,
	});
	return hasSession || apiKey;
}
