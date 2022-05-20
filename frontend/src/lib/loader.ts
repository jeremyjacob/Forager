export enum Endpoint {
	Dashboard,
	Count,
	Results,
	Tags,
	Workers,
	SetWorkers,
	Login,
	Register
}

const endpoints = {
	[Endpoint.Dashboard]: { url: 'dashboard', method: 'GET' },
	[Endpoint.Count]: { url: 'count', method: 'GET' },
	[Endpoint.Results]: { url: 'results', method: 'GET' },
	[Endpoint.Tags]: { url: 'tags', method: 'GET' },
	[Endpoint.Workers]: { url: 'workers', method: 'GET' },
	[Endpoint.SetWorkers]: { url: 'workers', method: 'POST' },
	[Endpoint.Login]: { url: 'login', method: 'POST' },
	[Endpoint.Register]: { url: 'register', method: 'POST' }
} as { [endpoint: string]: { url: string; method: string } };

const port = 8000;
const prodURL = 'https://forager.jeremyjacob.dev/api/';
export const apiURL = location.hostname == 'localhost' ? `http://localhost:${port}/` : prodURL;

export async function load(
	endpoint: Endpoint,
	{ query = '', body = {} }: { query?: string; body?: any } = {}
) {
	const { url, method } = endpoints[endpoint];
	const opts: RequestInit = {
		method,
		credentials: 'include'
	};
	if (body && method == 'POST') {
		opts.body = JSON.stringify(body);
		if (!opts.headers) opts.headers = {};
		opts.headers['Content-Type'] = 'application/json';
	}

	const res = await fetch(`${apiURL}${url}?${query}`, opts);
	const json = await res.json();
	if (json?.mustLogin) location.pathname = 'login';
	return json;
}
