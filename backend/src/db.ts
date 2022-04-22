import { v4 as uuidv4 } from 'uuid';
import {
	FindCursor,
	MongoClient,
	ObjectId,
	type AnyBulkWriteOperation,
	type WithId,
	type Document,
} from 'mongodb';

import { generateSalt, hasher } from './hasher';
import type { DataTag, User, WorkerTagMatch } from './types';
import { delay, timeout } from './utils';

if (!process.env.MONGOPW) throw Error('MONGOPW not set!');
const uri = `mongodb+srv://app:${process.env.MONGOPW}@forager-cluster.szrph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	connectTimeoutMS: 3000,
	socketTimeoutMS: 3000,
	serverSelectionTimeoutMS: 3000,
});
let connected = false;
run();

function awaitConnect() {
	if (connected) return;
	return new Promise((resolve) => {
		connected = true;
		client.on('connectionReady', resolve);
	});
}

export type DbDomain = {
	_id: ObjectId;
	domain: string;
	fetches: number;
	lock: Date;
	tags: string[];
	snippets: {
		[tag: string]: string[];
	};
	TLD: string;
};

export async function col(name: string) {
	const db = await client.db('forager');
	return db.collection(name);
}

export async function run() {
	await client.connect();
	console.log('MongoClient connected');
	var log = console.log;
}

// client.on('serverClosed', console.log);

export async function getDomains(
	filter: object,
	options: { limit: number; lastPage?: string; lock?: boolean }
) {
	await awaitConnect();
	const { limit: count, lastPage, lock } = options;
	const domains = await col('domains');
	if (lastPage) filter = { _id: { $gt: new ObjectId(lastPage) }, ...filter };

	let results: WithId<Document>[] = undefined;
	const session = client.startSession();
	try {
		await session.withTransaction(async () => {
			results = await domains.find(filter).limit(count).toArray();
			const resultIds = results.map((doc) => doc._id);
			if (lock) {
				await domains.updateMany(
					{ _id: { $in: resultIds } },
					{ $set: { lock: new Date() } },
					{ session }
				);
			}
		});
	} finally {
		await session.endSession();
		// await client.close();
	}

	return results;
}

export async function getNumberDomains(filter: object = {}) {
	await awaitConnect();
	const domains = await col('domains');
	if (Object.keys(filter).length === 0)
		return domains.estimatedDocumentCount();
	let count = 0;
	try {
		count = await timeout(domains.countDocuments(filter), 2000);
	} catch (error) {
		count = NaN;
	}
	return count;
}

export async function getTLDs() {
	await awaitConnect();
	const reference = await col('ref');
	const { tlds } = await reference.findOne({ name: 'tlds' });
	return tlds as string[];
}

export async function getTags() {
	await awaitConnect();
	const reference = await col('ref');
	const { tags } = await reference.findOne({ name: 'tags' });
	const sorted = tags as DataTag[];
	sorted.sort((a, b) => b.name.localeCompare(a.name));
	return sorted;
}

export async function setTags(tags: DataTag[]) {
	await awaitConnect();
	const reference = await col('ref');
	return reference.updateOne(
		{ name: 'tags' },
		{ $set: { tags } },
		{ upsert: true }
	);
}

export async function setMachineControls({
	desiredCount,
	running,
}: {
	desiredCount: number;
	running: boolean;
}) {
	await awaitConnect();
	const workers = await col('workers');
	const update = Object.assign(
		{},
		desiredCount && { desiredCount },
		running && { running }
	);
	if (!Object.values(update).length) return null;

	const res = await workers.updateOne(
		{ type: 'controller' },
		{ $set: update }
	);
	return res;
}

export async function getMachineControls() {
	await awaitConnect();
	const workers = await col('workers');
	const res = await workers.findOne({ type: 'controller' });
	return res;
}

export async function reportBatch(data: WorkerTagMatch[]) {
	await awaitConnect();
	const workers = await col('domains');
	const batch: AnyBulkWriteOperation<{}>[] = data.map(
		({ id, tag, keyword }) => ({
			updateOne: {
				filter: { _id: new ObjectId(id) },
				update: {
					$addToSet: {
						tags: tag,
						['snippets.' + tag]: keyword,
					},
					$inc: {
						fetches: 1,
					},
					$unset: {
						lock: null,
					},
				},
			},
		})
	);
	const res = await workers.bulkWrite(batch);
	return res;
}

// #region Auth Functions

export async function getUserByEmail(email: string) {
	await awaitConnect();
	const users = await col('users');
	const res = await users.findOne({ email });
	if (!res) return null;
	return res;
}

export async function registerUser(
	email: string,
	password: string
): Promise<User> {
	await awaitConnect();
	const existingUser = await getUserByEmail(email);
	if (existingUser) return Promise.reject(new Error('User already exists'));
	const users = await col('users');
	const salt = generateSalt();
	const data = {
		email,
		salt,
		hash: hasher(password, salt),
		enabled: false,
	};
	const res = await users.insertOne(data);
	return { _id: res.insertedId, ...data };
}

export async function createSession(email, ip) {
	await awaitConnect();
	const expires = new Date();
	expires.setDate(expires.getDate() + 7); // Expires in a week
	const session = {
		id: uuidv4(),
		email,
		ip,
		expires,
	};
	const sessions = await col('sessions');

	sessions.insertOne(session);
	return session;
}

export async function getSession(id) {
	await awaitConnect();
	const sessions = await col('sessions');
	const session = sessions.findOne({ id, expires: { $gte: new Date() } }); // Non-expired sessions for ID
	if (!session) return null;
	return session;
}

export async function removeSession(id) {
	await awaitConnect();
	const sessions = await col('sessions');
	const session = sessions.deleteOne({ id });
	if (!session) return Promise.reject(new Error('Session not found'));
	return session;
}

// #endregion
