import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

export const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send(err.stack);
});

app.get('/api/', (req, res) => {
	res.send('DELETE /climate/change');
});

fs.readdirSync('./src/routes').forEach(
	(route) => import('./routes/' + route.replace('.ts', ''))
);

const port = 8000;
app.listen(port);
console.log('App listening on port ' + port);
