import { goto } from '$app/navigation';
import type { Handle, GetSession } from '@sveltejs/kit/types';
import { parse } from 'cookie';
import { getSession as getSessionFromApi, getTags, getUserByEmail } from './routes/api/_db';
import { NOT_ENABLED } from './routes/api/_responses';

export const handle: Handle = async ({ event, resolve }) => {
	const { request } = event;
	const cookies = parse(request.headers.get('cookie') || '');

	event.locals['user'] = null;
	if (cookies.session_id) {
		const session = await getSessionFromApi(cookies.session_id);
		if (session) {
			const { enabled } = await getUserByEmail(session.email);
			if (enabled) {
				event.locals['user'] = { email: session.email };
				return resolve(event);
			}
		}
	}

	return resolve(event);
};

export const getSession: GetSession = async (request) => {
	if (!request?.locals) return {};
	const user = request.locals['user'];
	if (user)
		return {
			user: {
				email: request.locals['user'].email
			}
		};
	return {};
};
