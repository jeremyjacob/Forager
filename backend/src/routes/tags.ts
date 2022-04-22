import { getTags } from '../db';
import { authCheck } from '../auth';
import { UNAUTHENTICATED } from '../responses';
import { app } from '../main';

app.get('/api/tags', async (req, res) => {
	if (!authCheck(req)) return UNAUTHENTICATED(res);

	let tags = await getTags();
	tags = tags.reverse();
	// tags = tags.map((tag) => ({
	// 	...tag,
	// 	keywords: tag.keywords.map((kw) => (kw.toUpperCase() == kw ? ' ' + kw : kw)) // prepend with a space if ALL CAPS
	// }));
	// tags.length = 5;
	return res.send(tags);
});
