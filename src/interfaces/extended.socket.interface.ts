import { Socket } from "socket.io";

export default interface ExtSocket extends Socket {
  userId?: string
}