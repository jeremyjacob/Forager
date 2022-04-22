import type { ObjectId } from 'mongodb'

interface User {
	_id: ObjectId
	email: string
	hash: string
	salt: string
	enabled: boolean
}

type WorkerTagMatch = {
	id: string
	tag: string
	keyword: string
}

type DataTag = {
	name: string
	color: string
	keywords: string[]
	inverted?: boolean
	selected?: boolean
	time?: number
}
