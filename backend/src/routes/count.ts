import type { WithId, Document } from 'mongodb';
import queryString from 'query-string';
import { app } from '../main';
import { makeFilter } from './results';
import { authCheck } from './_auth';
import { getDomains, getNumberDomains } from './_db';
import { UNAUTHENTICATED } from './_responses';

app.get('count', async (req, res) => {
	if (!authCheck(req)) return UNAUTHENTICATED(res);

	const { query } = queryString.parseUrl(req.url, { arrayFormat: 'comma' });
	const filter = makeFilter(query);
	const count = await getNumberDomains(filter);

	res.send({ count });
});
