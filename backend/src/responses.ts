import type { Response } from 'express';

type CustomResponse = {
	status: number;
	headers?: any;
	body: {
		message: string;
	};
};

export const SIGNED_IN = (res: Response, id) =>
	res
		.cookie('session_id', id, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // one week
		})
		.redirect('/');

export const INCORRECT_PW = (res: Response) =>
	res.status(401).send({ message: 'Incorrect user or password' });

export const NOT_ENABLED = (res: Response) =>
	res
		.status(403)
		.send({ message: 'Please return with the blessing of the Forager' });

export const UNKNOWN_USER = (res: Response) =>
	res.status(401).send({ message: 'User does not exist. Sign up?' });

export const UNAUTHENTICATED = (res: Response) =>
	res.status(401).send({
		message: 'Authenticate to use this endpoint',
	});

export const NO_BODY = (res: Response) =>
	res.status(400).send({
		message: 'No body provided',
	});

export const BAD_BODY = (res: Response) =>
	res.status(400).send({
		message: 'Invalid body provided',
	});
