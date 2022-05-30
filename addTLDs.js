db.domains.updateMany(
	{ TLD: { $exists: false } },
	[{
		$addFields: {
			TLD: {
				$arrayElemAt: [{ $split: ["$domain", '.'] }, -1]
			}
		}
	}]
)
//
