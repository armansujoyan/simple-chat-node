import { Socket, Server, Namespace} from 'socket.io';
import { verifyJwt } from '../utils/jwt';

export default class SocketController {
  private socket: Server;
  private chat: Namespace;

  constructor (io: Server) {
    this.socket = io;
    this.chat = this.socket.of('/chat');
    this.configSockets();
  }

  private configSockets() {
    this.socket.use(this.socketAuthentication);
  }

  private socketAuthentication(socket: Socket, next: Function) {
    const { token } = socket.handshake.query;
    const isAuthenticated = verifyJwt(token);
    isAuthenticated ? next() : next(new Error('Unauthorized'));
  }
}