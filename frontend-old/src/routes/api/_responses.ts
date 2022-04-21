import { serialize } from 'cookie';

type CustomResponse = {
	status: number;
	headers?: any;
	body: {
		message: string;
	};
};

export const SIGNED_IN = (id) => ({
	status: 200,
	headers: {
		'Set-Cookie': serialize('session_id', id, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // one week
		})
	},
	body: {
		message: 'Successfully signed in'
	}
});

export const INCORRECT_PW = () => ({
	status: 401,
	body: {
		message: 'Incorrect user or password'
	}
});

export const NOT_ENABLED = () => ({
	status: 403,
	body: {
		message: 'Please return with the blessing of the Forager'
	}
});

export const UNKNOWN_USER = () => ({
	status: 401,
	body: {
		message: 'User does not exist. Sign up?'
	}
});

export const UNAUTHENTICATED = () => ({
	status: 401,
	body: {
		message: 'Authenticate to use this endpoint'
	}
});
