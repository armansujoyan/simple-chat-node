import { Router } from 'express';
import AuthRouter from './auth.router';

class APIRouter {
  public router: Router;
  private authRouter: Router = new AuthRouter().router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.use('/api/auth', this.authRouter);
  }
}

export default APIRouter;