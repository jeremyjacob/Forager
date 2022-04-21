import express from 'express'
import type { Request, Response, NextFunction } from 'express'
export const app = express()

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack)
	res.status(500).send(err.stack)
})

app.get('/', (req, res) => {
	res.send('Hello Worldf')
})

app.listen(3000)
