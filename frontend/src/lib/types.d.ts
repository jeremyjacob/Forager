type DataTag = {
	name: string;
	color: string;
	keywords: string[];
};

type MachineControls = {
	desiredCount: number;
	lastCount: number;
	pendingCount: number;
	runningCount: number;
	// filter: string;
	// running: boolean;
};

type DashboardData = {
	documentCount: number;
	machineControls: MachineControls;
};

type Result = {
	_id: string;
	domain: string;
	fetches: ?number;
	lock: ?(Date | string);
	tags: ?string[];
	TLD: string;
	snippets: ?any;
};
