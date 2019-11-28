import { Socket, Server, Namespace} from 'socket.io';
import { ActiveUser, Message } from '../models';
import { verifyJwt } from '../utils/jwt';
import IMessage from '../interfaces/message.interface';

enum socketMessage {
  NEW_USER_CONNECTION = 'NEW_USER_CONNECTION',
  NEW_USER_CONNECTION_SUCCESS = 'NEW_USER_CONNECTION_SUCCESS',
  USER_DISCONNECTION_SUCCESS = 'USER_DISCONNECTION_SUCCESS',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
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
    const isAuthenticated = verifyJwt(token);
    isAuthenticated ? next() : next(new Error('Unauthorized'));
  }

  private configChatNamespace() {
    this.chat.use(this.socketAuthentication);

    this.chat.on('connect', (socket: Socket) => {
      this.chat.on(socketMessage.NEW_USER_CONNECTION, (userId: string) => {
        this.userConnectionHandler(socket, userId);
      });
      this.chat.on(socketMessage.PRIVATE_MESSAGE, (message: IMessage) => {
        this.priavteMessageHandler(socket, message);
      })
      this.chat.on(socketMessage.DISCONNECT_USER, (userId: string) => {
        this.userDisconnectionHandler(socket, userId);
      })
    })
  }

  private async userConnectionHandler(socket: Socket, userId: string) {
    try {
      await ActiveUser.create({ userId, socketId: socket.id });
      this.chat.to(socket.id).emit(socketMessage.NEW_USER_CONNECTION_SUCCESS);
    } catch (error) {
      this.handleError(socket, error);
    }
  }

  private async priavteMessageHandler(socket: Socket, message: IMessage) {
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
      await ActiveUser.findOneAndDelete({ userId });
      this.chat.to(socket.id).emit(socketMessage.USER_DISCONNECTION_SUCCESS);
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
}