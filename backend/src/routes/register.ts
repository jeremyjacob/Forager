import { createSession, getUserByEmail, registerUser } from '../db';
import type { User } from '../types';
import { NOT_ENABLED, SIGNED_IN } from '../responses';
import { request } from 'https';
import { app } from '../main';

app.post('/register', async (req, res) => {
	try {
		const { email, password } = req.body;
		let user = (await getUserByEmail(email)) as User;

		if (user) {
			return res.status(409).send({
				message: `User already exists`,
			});
		}

		user = await registerUser(email, password);
		if (!user.enabled) return NOT_ENABLED(res);

		const { id } = await createSession(email, req.ip);
		return SIGNED_IN(res, id);
	} catch (error) {
		console.error(error);
		res.status(500).send({
			message: error.toString(),
		});
	}
});
