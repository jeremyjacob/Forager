import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

export const app = express();

const corsOrigins = ['https://forager.jeremyjacob.dev'];
if (process.env.NODE_ENV != 'production')
	corsOrigins.push('http://localhost:3000');

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
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
