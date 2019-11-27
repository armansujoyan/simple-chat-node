import express, { Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import http, { Server } from 'http';
import io from 'socket.io';
import mongoose, { Connection } from 'mongoose';

dotenv.config();

import APIRouter from './routes';
import { mongoConfig } from './config';
import secrets from './utils/secrets';
import { SocketController } from './controllers';

class AppServer {
  private server: Server;
  private app: Application;
  private socket: SocketController;
  private port: number = secrets.PORT;

  constructor() {
    this.app = express();
    this.configServer();
    this.configMongo();
    this.configRoutes();
    this.server = http.createServer(this.app);
    this.socket = new SocketController(io(this.server));
  }

  public listen() {
    this.server.listen(this.port, () => console.log(`Server is listening on ${this.port}`));
  }

  private configServer() {
    this.app.use(bodyParser.json());

    if (process.env.NODE_ENV === 'development') {
      this.app.use(cors());
    }
  }

  private configMongo() {
    const connection: Connection = mongoose.connection;

    connection.on('connected', () => console.log('Mongoose connected'));
    connection.on('reconnect', () => console.log('Mongoose reconnected'));
    connection.on('disconnect', () => {
      console.log('Mongoose disconnected');
      console.log('Trying to reconnect');
      setTimeout(() => {
        mongoose.connect(secrets.MONGODB_URI, {
        autoReconnect: true, keepAlive: true,
        socketTimeoutMS: 3000, connectTimeoutMS: 5000 })
      }, 3000);
    });
    connection.on('close', () => console.log('Mongoose coonnection is closed'));
    connection.on('error', (error: Error) => console.log('Mongoose connection error', error));
    const start = async () => {
      mongoose.connect(secrets.MONGODB_URI, mongoConfig);
    };

    start().catch(error => console.log(error));
  }

  private configRoutes() {
    this.app.use(new APIRouter().router);
  }
}

const server: AppServer = new AppServer();

server.listen();
