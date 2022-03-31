import type { RequestHandler } from '@sveltejs/kit';
import { getTags } from './_db';
import { authCheck } from './_auth';
import { UNAUTHENTICATED } from './_responses';

export const get: RequestHandler = async (event) => {
	if (!authCheck(event)) return UNAUTHENTICATED();

	let tags = await getTags();
	tags = tags.reverse();
	// tags = tags.map((tag) => ({
	// 	...tag,
	// 	keywords: tag.keywords.map((kw) => (kw.toUpperCase() == kw ? ' ' + kw : kw)) // prepend with a space if ALL CAPS
	// }));
	// tags.length = 5;
	return {
		body: tags
	};
};
