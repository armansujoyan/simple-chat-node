import { Request } from 'express';

export default interface ExtRequest extends Request {
  user?: any;
}