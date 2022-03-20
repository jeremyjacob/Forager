import { createSession, getUserByEmail, registerUser } from './_db';
import type { RequestHandler } from '@sveltejs/kit';
import type { User } from './types';
import { goto } from '$app/navigation';
import { NOT_ENABLED, SIGNED_IN } from './_responses';

export const post: RequestHandler = async ({ request, clientAddress }) => {
	try {
		const { email, password } = await request.json();
		let user = (await getUserByEmail(email)) as User;

		if (user) {
			return {
				status: 409,
				body: {
					message: `User already exists`
				}
			};
		}

		user = await registerUser(email, password);
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
