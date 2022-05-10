export enum Endpoint {
	Dashboard = 'dashboard',
	Count = 'count',
	Results = 'results',
	Tags = 'tags',
	MachineControl = 'machineControl',
	Login = 'login',
	Register = 'register'
}

const endpoints = {
	[Endpoint.Dashboard]: { method: 'GET' },
	[Endpoint.Count]: { method: 'GET' },
	[Endpoint.Results]: { method: 'GET' },
	[Endpoint.Tags]: { method: 'GET' },
	[Endpoint.MachineControl]: { method: 'POST' },
	[Endpoint.Login]: { method: 'POST' },
	[Endpoint.Register]: { method: 'POST' }
} as { [endpoint: string]: { method: string } };

const port = 8000;
const prodURL = 'https://forager.jeremyjacob.dev/api/';
export const apiURL = location.hostname == 'localhost' ? `http://localhost:${port}/` : prodURL;

export async function load(
	endpoint: Endpoint,
	{ query = '', body = {} }: { query?: string; body?: any } = {}
) {
	const { method } = endpoints[endpoint];
	const opts: RequestInit = {
		method,
		credentials: 'include'
	};
	if (body && method == 'POST') {
		opts.body = JSON.stringify(body);
		if (!opts.headers) opts.headers = {};
		opts.headers['Content-Type'] = 'application/json';
	}

	const res = await fetch(`${apiURL}${endpoint}?${query}`, opts);
	const json = await res.json();
	if (json?.mustLogin) location.pathname = 'login';
	return json;
}
