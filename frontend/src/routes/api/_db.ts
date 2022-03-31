import { v4 as uuidv4 } from 'uuid';
import { MongoClient, ObjectId } from 'mongodb';

import { generateSalt, hasher } from './_hasher';
import type { User } from './types';
import { timeout } from '$lib/utils';

const url = `mongodb://sveltekit:OlSW2Q91eSQrreiu@forager.jeremyjacob.dev?authSource=forager&readPreference=primary&appname=SvelteKit`;
const client = new MongoClient(url);
run();

export async function col(name: string) {
	const db = await client.db('forager');
	return db.collection(name);
}

export async function run() {
	await client.connect();
}

export async function getDomains(filter: object, count: number, lastPage?: string) {
	const domains = await col('domains');
	if (lastPage) filter = { _id: { $gt: new ObjectId(lastPage) }, ...filter };
	const found = domains.find(filter);
	return found.limit(count);
}

export async function getNumberDomains(filter: object = {}) {
	const domains = await col('domains');
	if (Object.keys(filter).length === 0) return domains.estimatedDocumentCount();
	let count = 0;
	try {
		count = await timeout(domains.countDocuments(filter), 2000);
	} catch (error) {
		count = NaN;
	}
	return count;
}

export async function getTags() {
	const reference = await col('tags');
	const { tags } = await reference.findOne({});
	return tags as DataTag[];
}

export async function setTags(tags: DataTag[]) {
	const reference = await col('tags');
	return reference.updateOne({}, { $set: { tags } });
}

export async function setMachineControls(update) {
	const workers = await col('workers');
	const res = await workers.updateOne({ type: 'controller' }, update);
	return res;
}

export async function getMachineControls() {
	const workers = await col('workers');
	const res = await workers.findOne({ type: 'controller' });
	return res;
}

// #region Auth Functions

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

// #endregion
