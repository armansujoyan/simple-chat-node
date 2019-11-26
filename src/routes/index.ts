import { Router } from 'express';
import UserRouter from './user.router';
import { AuthMiddleware } from '../middleware';
import { Request, Response, NextFunction } from 'express-serve-static-core';
class APIRouter {
  public router: Router;
  private userRouter: Router = new UserRouter().router;
  private authMiddleware = new AuthMiddleware();

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.use('/api/users?', this.userRouter);
  }
}

export default APIRouter;