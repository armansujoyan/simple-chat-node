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
    this.router.use('/api/user', this.userRouter);
    this.router.use('/api/secret', this.authMiddleware.authenticateJWT, (req: Request, res: Response, next: NextFunction) => {
      res.json({ yeeey: 'hdalkgej'})
    })
  }
}

export default APIRouter;