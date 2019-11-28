import { Router } from 'express';
import { UserController } from '../controllers';
import { AuthMiddleware } from '../middleware';

class UserRouter {
  public router: Router;
  private userController: UserController = new UserController();
  private authMiddleware: AuthMiddleware = new AuthMiddleware();

  constructor(){
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.post('/signup', this.userController.signUp);
    this.router.post('/signin', this.userController.signIn);
    this.router.get('/:uid', this.authMiddleware.authenticateJWT, this.userController.getUserById);
  }
}

export default UserRouter;
