import { createSession, getUserByEmail } from '../db';
import { serialize } from 'cookie';
import { compare } from '../hasher';
import type { User } from '../types';
import {
	INCORRECT_PW,
	NOT_ENABLED,
	SIGNED_IN,
	UNKNOWN_USER,
} from '../responses';
import { app } from '../main';

app.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = (await getUserByEmail(email)) as User;

		if (!user) return UNKNOWN_USER(res);
		if (!compare(password, user.hash, user.salt)) return INCORRECT_PW(res);
		if (!user.enabled) return NOT_ENABLED(res);

		const { id } = await createSession(email, req.ip);
		return SIGNED_IN(res, id);
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: error.toString() });
	}
});
