import { v4 as uuidv4 } from 'uuid';

import { MongoClient } from 'mongodb';
import { generateSalt, hasher } from './_hasher';
import type { User } from './types';

const isProd = process.env.FORAGER_CHIEF == 'true';
const url = `mongodb://jeremy:OlSW2Q91eSQrreiu@${isProd ? 'localhost:27017' : '52.9.44.109:27017/'}?authSource=forager`;
const client = new MongoClient(url);
client.connect();

async function col(name: string) {
	const db = await client.db('forager');
	return db.collection(name);
}

export async function getUserByEmail(email: string) {
	const users = await col('users');
	const res = await users.findOne({ email });
	if (!res) return null;
	return res;
}

export async function registerUser(email: string, password: string): Promise<User> {
	const existingUser = await getUserByEmail(email);
	if (existingUser) return Promise.reject(new Error('User already exists'));
	const users = await col('users');
	const salt = generateSalt();
	const data = {
		email,
		salt,
		hash: hasher(password, salt),
		enabled: false
	};
	const res = await users.insertOne(data);
	return { _id: res.insertedId, ...data };
}

export async function createSession(email, ip) {
	const expires = new Date();
	expires.setDate(expires.getDate() + 7); // Expires in a week
	const session = {
		id: uuidv4(),
		email,
		ip,
		expires
	};
	const sessions = await col('sessions');

	sessions.insertOne(session);
	return session;
}

export async function getSession(id) {
	const sessions = await col('sessions');
	const session = sessions.findOne({ id, expires: { $gte: new Date() } }); // Non-expired sessions for ID
	if (!session) return null;
	return session;
}

export async function removeSession(id) {
	const sessions = await col('sessions');
	const session = sessions.deleteOne({ id });
	if (!session) return Promise.reject(new Error('Session not found'));
	return session;
}
