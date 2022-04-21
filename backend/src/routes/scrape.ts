import type { RequestHandler } from '@sveltejs/kit'
import type { WithId, Document } from 'mongodb'
import queryString from 'query-string'
import { app } from '../main'
import { makeFilter } from './results'
import { authCheck } from './_auth'
import { getDomains, getNumberDomains } from './_db'
import { UNAUTHENTICATED } from './_responses'

function unArray(input: string | string[]) {
	if (typeof input == 'string') return input
	if (input == null) return null
	return input[0]
}

function array(input: string | string[]) {
	if (typeof input == 'string') return [input]
	return input
}

// {$or: [{fetches: {$lt: 1}}, {fetches: {$exists: false}}]}
const FETCHES_TARGET = 1

app.get('scrape', async (req, res) => {
	if (!authCheck(req)) return UNAUTHENTICATED(res)

	const { query } = queryString.parseUrl(req.url, {
		arrayFormat: 'comma',
	})
	const limit = parseInt(unArray(query.limit) || '100')
	const lastPage = unArray(query.lastPage)
	const filter = await makeFilter(query)
	const date = new Date()
	date.setMinutes(date.getMinutes() - 3) // Lock expires in 3 minutes
	filter.fetches = { $not: { $gte: FETCHES_TARGET } }
	filter.lock = { $not: { $gt: date } }

	const data = await await getDomains(filter, {
		limit,
		lastPage: unArray(lastPage),
		lock: true,
	})
	let body = data.map(({ domain, _id }) => ({ domain, _id }))

	return res.send(body)
})
