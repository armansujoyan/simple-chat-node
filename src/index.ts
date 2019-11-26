import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http, { Server } from 'http';
import mongoose from 'mongoose';

dotenv.config();

import ApiRouter from './routes';
import { mongoConfig } from './config';
import { MONGODB_URI } from './utils/secrets';

const port: number | string = process.env.PORT || 5000;

const app: Application = express();
const server: Server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
  mongoose.connect(MONGODB_URI, mongoConfig)
    .then(() => console.log('Connected to Mongo.'));
}

app.use(ApiRouter);

server.listen(port, () => console.log(`Listening on port ${port}`));
