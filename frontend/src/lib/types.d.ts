interface TagsData {
	[key: string]: string[];
}

interface DashboardData {
	tags: TagsData;
	documentCount: number;
}

interface Results {
	results: Result[];
	count: number;
}

interface Result {
	domain: string;
	fetches: number;
	lock: boolean;
	tags: string[];
	snippets: {};
}
