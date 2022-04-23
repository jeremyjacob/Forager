import type { Request } from 'express';
import { getSession } from './db';

const API_KEY = 'Bearer ' + process.env.FORAGER_API_KEY;

export async function authCheck(req: Request) {
	const session = req.cookies?.session_id;
	const hasSession = await getSession(session);
	return hasSession || req.headers.authorization == API_KEY;
}
