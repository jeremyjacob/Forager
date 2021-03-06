import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './classification';
dotenv.config();

export const app = express();

const corsOrigins = ['https://forager.jeremyjacob.dev'];
if (process.env.NODE_ENV != 'production') {
	console.log('Running in development mode');
	corsOrigins.push('http://localhost:3000');
}

const rawBodySaver = (req, res, buf: Buffer, encoding) => {
	if (buf && buf.length) {
		req.rawBody = buf.toString(encoding || 'utf8');
	}
};

app.set('trust proxy', '127.0.0.1');
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(bodyParser.json({ verify: rawBodySaver, limit: '1mb' }));
app.use(cookieParser());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).send(err.stack);
});

app.get('/', (req, res) => {
	res.send('DELETE /climate/change');
});

fs.readdirSync('./src/routes').forEach(
	(route) => import('./routes/' + route.replace('.ts', ''))
);

// console.log('2');
const port = 8000;
app.listen(port);
console.log('Forager server alive on port ' + port);
