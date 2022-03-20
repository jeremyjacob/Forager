import type { ObjectId } from 'mongodb';

interface User {
	_id: ObjectId;
	email: string;
	hash: string;
	salt: string;
	enabled: boolean;
}
