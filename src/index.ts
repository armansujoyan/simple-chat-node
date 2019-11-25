import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http, { Server } from 'http';

import ApiRouter from './routes';

const port: number | string = process.env.PORT || 5000;

const app: Application = express();
const server: Server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
  app.use(cors());
}

app.use(ApiRouter);

server.listen(port, () => console.log(`Listening on port ${port}`));
