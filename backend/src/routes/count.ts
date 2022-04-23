import type { WithId, Document } from 'mongodb';
import queryString from 'query-string';
import { app } from '../main';
import { makeFilter } from './results';
import { authCheck } from '../auth';
import { getDomains, getNumberDomains } from '../db';
import { UNAUTHENTICATED } from '../responses';

app.get('/api/count', async (req, res) => {
	if (!(await authCheck(req))) return UNAUTHENTICATED(res);

	const { query } = queryString.parseUrl(req.url, { arrayFormat: 'comma' });
	const filter = makeFilter(query);
	const count = await getNumberDomains(filter);

	res.send({ count });
});
