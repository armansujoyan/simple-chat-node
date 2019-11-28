import { Response } from "express";
import { ExtRequest as Request} from '../interfaces';

import { Message } from '../models';

class MessageController {
  public async getUserMessage(req: Request, res: Response) {
    try {
      const { owner, receiver} = req.query;
      if (req.user._id.toString() !== owner) {
        return res.status(401).json({ status: 'error', message: 'Unathorized'});
      };

      const messages = await Message.find({
        owner: { $in: [owner, receiver] },
        receiver: { $in: [receiver, owner] }
      });

      res.status(200).json({ messages });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

export default MessageController;