import type { Request } from 'express';
import { getSession } from './db';

const API_KEY = process.env.FORAGER_API_KEY;

export async function authCheck(req: Request) {
	const session = req.cookies?.session_id;
	const hasSession = await getSession(session);
	const apiKey =
		req.headers?.authorization == API_KEY ||
		req.headers?.authorization == 'Bearer ' + API_KEY;
	return hasSession || apiKey;
}
