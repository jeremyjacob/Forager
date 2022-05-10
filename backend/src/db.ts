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
import { timeout } from './utils';
import { FETCHES_TARGET } from './config';

// Check if the Enviroment Variable MONGOPW is set, this is where we keep the MongoDB credentials
if (!process.env.MONGOPW) throw Error('MONGOPW not set!');
// Create the MongoDB connection string and insert the password
const uri = `mongodb+srv://app:${process.env.MONGOPW}@forager-cluster.szrph.mongodb.net/forager?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	connectTimeoutMS: 1000 * 60,
	socketTimeoutMS: 1000 * 60,
	serverSelectionTimeoutMS: 1000 * 60,
});
let connected = false;
let connectedCallback = () => {};
run();

// This function is awaited before every DB function
// It resolves when the MongoDB connection is sucessfull.
// This prevents errors about the client not being connected yet.
function awaitConnect() {
	if (connected) return;
	return new Promise<void>((resolve) => {
		connectedCallback = () => {
			console.log('resolve!');
			resolve();
		};
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

// Shorthand for getting a collection from the 'forager' db
export async function col(name: string) {
	const db = await client.db('forager');
	return db.collection(name);
}

export async function run() {
	await client.connect();
	console.log('MongoClient connected');
	connectedCallback();
	connected = true;
}

/* 
Fetch a list of domains from the DB
filter is an object that describes the filter to pass to Mongo
options.limit caps the size of the results
options.lastPage is an stringified ObjectID that tells Mongo where to start results from
	It is used for pagination
options.lock is a boolean that describes whether or not to impose a 3 minute lock on the results
	This means they couldn't be fetched again by the scraper (specified in the filter by caller in scrape.ts)
	Effectively this means that a worker has 3 minutes to report a response for a domain, or it will be given to another worker
*/
export async function getDomains(
	filter: object,
	options: { limit: number; lastPage?: string; lock?: boolean }
) {
	await awaitConnect();
	const { limit: count, lastPage, lock } = options;
	const domains = await col('domains');
	if (lastPage) filter = { _id: { $gt: new ObjectId(lastPage) }, ...filter };

	let results: WithId<Document>[] = undefined;
	// const session = client.startSession();
	try {
		// await session.withTransaction(async () => {
		results = await domains.find(filter).limit(count).toArray();
		const resultIds = results.map((doc) => doc._id);
		if (lock) {
			const date = new Date();
			date.setMinutes(date.getMinutes() + 3); // Lock expires in 3 minutes
			await domains.updateMany(
				{ _id: { $in: resultIds } },
				{ $set: { lock: date } }
				// { session }
			);
		}
		// });
	} catch (error) {
		console.error(
			'Domain lock error',
			error,
			`lock: ${lock}, lastPage: ${lastPage}, results: ${results}`
		);
	} finally {
		// await session.endSession();
		// await client.close();
	}

	return results;
}

// Get an approximate number of results that match a filter
// After 2 seconds of loading, it runs NaN (Not A Number)
export async function getNumberDomains(filter: object = {}) {
	await awaitConnect();
	const domains = await col('domains');
	if (Object.keys(filter).length === 0)
		return domains.estimatedDocumentCount();
	let count = 0;
	try {
		count = await timeout(domains.countDocuments(filter), 30000);
	} catch (error) {
		count = NaN;
	}
	return count;
}

// Get a list of all the TLDs we care about. About 15 at time of writing.
export async function getTLDs() {
	await awaitConnect();
	const reference = await col('ref');
	const { tlds } = await reference.findOne({ name: 'tlds' });
	return tlds as string[];
}

// Get the complete list of tags and their keywords
export async function getTags() {
	await awaitConnect();
	const reference = await col('ref');
	const { tags } = await reference.findOne({ name: 'tags' });
	const sorted = tags as DataTag[];
	sorted.sort((a, b) => b.name.localeCompare(a.name));
	return sorted;
}

// Update a tag
export async function setTags(tags: DataTag[]) {
	await awaitConnect();
	const reference = await col('ref');
	try {
		return reference.updateOne(
			{ name: 'tags' },
			{ $set: { tags } },
			{ upsert: true }
		);
	} catch (error) {
		console.error('Error updating tags', error);
	}
	return { acknowledged: false };
}

// Machine controls are the control plane for ECS
// Mainly, we are setting desiredCount, the number of workers we want working
export async function setMachineControls({
	desiredCount,
}: {
	desiredCount: number;
}) {
	await awaitConnect();
	const workers = await col('ref');
	// Only add these to the update object if they are defined
	const update = {
		desiredCount,
	};
	if (desiredCount) update['lastCount'] = desiredCount;

	const res = await workers.updateOne(
		{ name: 'controller' },
		{ $set: update }
	);
	return res;
}

export async function getMachineControls() {
	await awaitConnect();
	const workers = await col('ref');
	const res = await workers.findOne({ name: 'controller' });
	return res;
}

export async function reportBatch(data: WorkerTagMatch[]) {
	await awaitConnect();
	const workers = await col('domains');
	const batch: AnyBulkWriteOperation<{}>[] = data.map(
		({ _id, tag, keyword }) => ({
			updateOne: {
				filter: { _id: new ObjectId(_id) },
				update: {
					$addToSet: {
						tags: tag,
						['snippets.' + tag]: keyword,
					},
					$set: {
						fetches: FETCHES_TARGET,
					},
					$unset: {
						lock: null,
					},
				},
			},
		})
	);
	// console.log(JSON.stringify(batch));
	try {
		const res = await workers.bulkWrite(batch);
		// console.log(res);
		return res;
	} catch (error) {
		return {
			error,
			matchedCount: null,
		};
	}
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
