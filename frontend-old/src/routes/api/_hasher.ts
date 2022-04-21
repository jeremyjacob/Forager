import crypto from 'crypto';

export function generateSalt() {
	const rounds = 12;
	return crypto
		.randomBytes(Math.ceil(rounds / 2))
		.toString('hex')
		.slice(0, rounds);
}

export function hasher(password: string, salt: string) {
	let hash = crypto.createHmac('sha512', salt);
	hash.update(password);
	return hash.digest('hex');
}

export function compare(password: string, hash: string, salt: string) {
	const maybeHash = hasher(password, salt);
	return maybeHash === hash;
}
