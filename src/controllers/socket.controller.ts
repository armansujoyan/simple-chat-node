import { Server, Namespace} from 'socket.io';
import { ActiveUser, Message, User } from '../models';
import jwt from 'jsonwebtoken';
import { ExtSocket as Socket } from '../interfaces/';
import secrets from '../utils/secrets';

enum socketMessage {
  NEW_USER_CONNECTION = 'NEW_USER_CONNECTION',
  NEW_USER_JOINED = 'NEW_USER_JOINED',
  USER_DISCONNECTED = 'USER_DISCONNECTED',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  SEND_PRIVATE_MESSAGE = 'SEND_PRIVATE_MESSAGE',
  NEW_PRIVATE_MESSAGE = 'NEW_PRIVATE_MESSAGE',
  DISCONNECT_USER = 'DISCONNECT_USER'
}

export default class SocketController {
  private socket: Server;
  private chat: Namespace;

  constructor (io: Server) {
    this.socket = io;
    this.chat = this.socket.of('/chat');
    this.configSockets();
  }

  private configSockets() {
    this.configChatNamespace();
  }

  private socketAuthentication(socket: Socket, next: Function) {
    const { token } = socket.handshake.query;
    if(token) {
      jwt.verify(token, secrets.PUBLIC_KEY, (error: Error, decoded: any) => {
        if (error) {
          return next(error)
        } else {
          socket.userId = decoded.sub;
          return next();
        }
      })
    } else {
      return next(new Error('Unauthorized'));
    }
  }

  private configChatNamespace() {
    this.chat.use(this.socketAuthentication);

    this.chat.on('connection', (socket: Socket) => {
      socket.on(socketMessage.NEW_USER_CONNECTION, (userId: string) => {
        this.userConnectionHandler(socket, userId);
      });
      socket.on(socketMessage.SEND_PRIVATE_MESSAGE, (message: any) => {
        this.priavteMessageHandler(socket, message);
      })
      socket.on(socketMessage.DISCONNECT_USER, (userId: string) => {
        this.userDisconnectionHandler(socket, userId);
      })
    })
  }

  private async userConnectionHandler(socket: Socket, userId: string) {
    try {
      const joinedUser = await User.findById(userId);
      const activePairExists = await ActiveUser.findOne({ userId })
      if(joinedUser && !activePairExists) {
        await ActiveUser.create({ userId, socketId: socket.id });
        this.chat.emit(socketMessage.NEW_USER_JOINED, joinedUser.authSerialize());
      }
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private async priavteMessageHandler(socket: Socket, message: any) {
    try {
      await Message.create(message);
      const receiver = await ActiveUser.findOne({ userId: message.receiver });
      if (receiver) {
        this.chat.to(receiver.socketId).emit(socketMessage.NEW_PRIVATE_MESSAGE, message);
      };
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private async userDisconnectionHandler(socket: Socket, userId: string) {
    try {
      if(!this.checkIdentity(socket, userId)) return;
      await ActiveUser.findOneAndDelete({ userId });

      this.chat.emit(socketMessage.USER_DISCONNECTED, userId );
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private handleError(socket: Socket, error: Error) {
    this.chat.to(socket.id).emit(socketMessage.CONNECTION_ERROR, {
      message: 'Unable to connect',
      error
     })
  }

  private checkIdentity(socket: Socket, userId: string) {
    if (socket.userId !== userId) {
      this.chat.to(socket.id).emit(socketMessage.AUTHENTICATION_ERROR, {
        message: 'Unathorized'
      });
      return false;
    }
    return true;
  }
}