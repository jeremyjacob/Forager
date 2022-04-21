import type { Handle, GetSession } from '@sveltejs/kit/types';
import { parse } from 'cookie';
import { get as updateTags } from './routes/api/updateTags';
import { getSession as getSessionFromApi, getTags, getUserByEmail } from './routes/api/_db';

let intervalSet = false;
if (!intervalSet) {
	setInterval(updateTags, 30 * 1000);
	intervalSet = true;
}

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

	return resolve(event, { ssr: false });
};

export const getSession: GetSession = async (event) => {
	if (!event?.locals) return {};
	// console.log(request.locals);
	const user = event.locals['user'];
	if (user)
		return {
			user: {
				email: event.locals['user'].email
			},
			cookie: event.request.headers.get('cookie')
		};
	return {};
};
