import { Router } from 'express';
import UserRouter from './user.router';
import MessageRouter from './message.router';
import { AuthMiddleware } from '../middleware';

class APIRouter {
  public router: Router;
  private userRouter: Router = new UserRouter().router;
  private messageRouter: Router = new MessageRouter().router;
  private authMiddleware: AuthMiddleware = new AuthMiddleware();

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.use('/api/users?', this.userRouter);
    this.router.use('/api/messages?', this.authMiddleware.authenticateJWT, this.messageRouter);
  }
}

export default APIRouter;