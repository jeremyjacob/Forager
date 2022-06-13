import type { ObjectId } from 'mongodb';

interface User {
	_id: ObjectId;
	email: string;
	hash: string;
	salt: string;
	enabled: boolean;
}

type WorkerSnippets = {
	_id: string;
	snippets: string[];
};

type DataTag = {
	name: string;
	color: string;
	keywords: string[];
	inverted?: boolean;
	selected?: boolean;
	time?: number;
};

type ScoredSnippet = {
	_id: string;
	score: number;
	snippet: string;
};
