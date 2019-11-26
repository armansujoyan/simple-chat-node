import { Router } from 'express';
import { UserController } from '../controllers';

class AuthRouter {
  public router: Router;
  private userController: UserController = new UserController();

  constructor(){
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post('/signup', this.userController.signUp);
    this.router.post('/signin', this.userController.signIn);
  }
}

export default AuthRouter;
