import type { RequestHandler } from '@sveltejs/kit';
import { Client } from '@notionhq/client';
import { setTags } from './_db';

export const get: RequestHandler = async () => {
	// console.log('updateTags');
	const NOTION_SECRET = 'secret_C5zaRlv2TsQHaqI0oQL84m1tWW1W7tQhpfjZqUChCgf';
	const DATABASE_ID = 'cf2066f1742a4ff7886d1fa2b1c40f08';
	const notion = new Client({
		auth: NOTION_SECRET
	});

	let data: DataTag[] = [];
	let more = true;
	let next_cursor: string;
	while (more) {
		const response = await notion.databases.query({
			database_id: DATABASE_ID,
			start_cursor: next_cursor
		});

		more = response.has_more;
		next_cursor = response.next_cursor;

		data = [
			...data,
			...response.results
				.map((e) => {
					const prop = e['properties'];
					const obj = {
						name: prop?.Name?.title[0]?.plain_text,
						color: prop?.Color?.select?.name,
						keywords: (prop?.Keywords?.rich_text[0]?.plain_text.split(', ') as string[]) || []
					};
					obj.keywords = obj.keywords.map((k) => k.trim()).filter((k) => k != '');
					return obj;
				})
				.filter((t) => t.color && t.name)
		];
	}

	const res = await setTags(data);

	return {
		body: { ok: res.acknowledged }
	};
};
