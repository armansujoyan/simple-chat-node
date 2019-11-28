import { Request, Response, NextFunction } from 'express';
import '../config/passport.config';
import passport from 'passport';
import { IUser } from '../interfaces';

class AuthMiddleware {
  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err: Error, user: IUser) => {
      if(err) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized'});
      }
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized'});
      } else {
        req.user = user.authSerialize();
        next();
      }
    })(req, res, next);
  }
}

export default AuthMiddleware;