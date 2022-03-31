type DataTag = {
	name: string;
	color: string;
	keywords: string[];
	inverted?: boolean;
	selected?: boolean;
	time?: number;
};

type MachineControls = {
	desiredCount: number;
	pendingCount: number;
	runningCount: number;
	filter: string;
	running: boolean;
};

type DashboardData = {
	documentCount: number;
	machineControls: MachineControls;
};

type Result = {
	_id: string;
	domain: string;
	fetches: number;
	lock: boolean;
	tags: string[];
	snippets: {};
};
