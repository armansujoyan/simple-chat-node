import { Router } from 'express';
import { AuthController } from '../controllers';

class AuthRouter {
  public router: Router;
  private authController: AuthController = new AuthController();

  constructor(){
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post('/signup', this.authController.signup);
    this.router.post('/signin', this.authController.signin);
  }
}

export default AuthRouter;
