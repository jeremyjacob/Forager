type UITag = {
	name: string;
	inverted: boolean;
	selected: boolean;
};

type TagsData = {
	[key: string]: string[];
};

type DashboardData = {
	tags: TagsData;
	documentCount: number;
};

type Results = {
	results?: Result[];
	count?: number;
};

type Result = {
	_id: string;
	domain: string;
	fetches: number;
	lock: boolean;
	tags: string[];
	snippets: {};
};
