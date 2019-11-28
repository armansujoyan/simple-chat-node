import { Router } from 'express';
import { MessageController } from '../controllers';

class MessageRouter {
  public router: Router;
  private messageController: MessageController = new MessageController();

  constructor(){
    this.router = Router();
    this.routes();
  }

  private routes() {
    this.router.get('/', this.messageController.getUserMessage);
  }
}

export default MessageRouter;
