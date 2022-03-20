import { createSession, getUserByEmail } from './_db';
import { serialize } from 'cookie';
import { compare } from './_hasher';
import type { User } from './types';
import type { RequestHandler } from '@sveltejs/kit';
import { INCORRECT_PW, NOT_ENABLED, SIGNED_IN, UNKNOWN_USER } from './_responses';

export const post: RequestHandler = async ({ request, clientAddress }) => {
	try {
		const { email, password } = await request.json();
		const user = (await getUserByEmail(email)) as User;

		if (!user) return UNKNOWN_USER();
		if (!compare(password, user.hash, user.salt)) return INCORRECT_PW();
		if (!user.enabled) return NOT_ENABLED();

		const { id } = await createSession(email, clientAddress);
		return SIGNED_IN(id);
	} catch (error) {
		console.error(error);
		return {
			status: 500,
			body: { message: error.toString() }
		};
	}
};
