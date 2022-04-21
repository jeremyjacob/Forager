import { getTags } from './_db'
import { authCheck } from './_auth'
import { UNAUTHENTICATED } from './_responses'
import { app } from '../main'

app.get('tags', async (req, res) => {
	if (!authCheck(req)) return UNAUTHENTICATED(res)

	let tags = await getTags()
	tags = tags.reverse()
	// tags = tags.map((tag) => ({
	// 	...tag,
	// 	keywords: tag.keywords.map((kw) => (kw.toUpperCase() == kw ? ' ' + kw : kw)) // prepend with a space if ALL CAPS
	// }));
	// tags.length = 5;
	return res.send(tags)
})
