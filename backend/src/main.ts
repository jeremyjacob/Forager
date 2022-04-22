import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send(err.stack);
});

export const root = app.get('/', (req, res) => {
	res.send('Hello Worldf');
});

fs.readdirSync('./src/routes').forEach(
	(route) => import('./routes/' + route.replace('.ts', ''))
);

const port = 8000;
app.listen(port);
console.log('App listening on port ' + port);
