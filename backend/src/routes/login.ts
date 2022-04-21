import { createSession, getUserByEmail } from './_db'
import { serialize } from 'cookie'
import { compare } from './_hasher'
import type { User } from './types'
import {
	INCORRECT_PW,
	NOT_ENABLED,
	SIGNED_IN,
	UNKNOWN_USER,
} from './_responses'
import { app } from '../main'

app.post('login', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = (await getUserByEmail(email)) as User

		if (!user) UNKNOWN_USER(res)
		if (!compare(password, user.hash, user.salt)) INCORRECT_PW(res)
		if (!user.enabled) NOT_ENABLED(res)

		const { id } = await createSession(email, req.ip)
		SIGNED_IN(res, id)
	} catch (error) {
		console.error(error)
		res.status(500).send({ message: error.toString() })
	}
})
