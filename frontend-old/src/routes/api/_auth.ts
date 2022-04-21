import type { RequestEvent } from '@sveltejs/kit/types/internal';

const API_KEY = 'Bearer f6L3xYuZALbYwzZE242j58c4tZc7B9t3FB5RfwbVYCKWdkstGsdjz88wbGCxw8Nt';

export function authCheck(event: RequestEvent) {
	return event.locals['user'] || event.request.headers.get('Authorization') == API_KEY;
}
