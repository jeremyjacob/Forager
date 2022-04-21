import type { Request } from 'express'

const API_KEY =
	'Bearer f6L3xYuZALbYwzZE242j58c4tZc7B9t3FB5RfwbVYCKWdkstGsdjz88wbGCxw8Nt'

export function authCheck(req: Request) {
	return event.locals['user'] || req.headers.authorization == API_KEY
}
