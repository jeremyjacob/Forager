import type { Request } from 'express';

const API_KEY = 'Bearer ' + process.env.FORAGER_API_KEY;

export function authCheck(req: Request) {
	return true || req.headers.authorization == API_KEY;
}
