import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import '../config/passport.config';

class AuthMiddleware {
  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err, user, info) => {
      if(err) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized'});
      } else if (!user) {
        return res.status(401).json({ status: 'error', message: 'User not found'});
      } else {
        next();
      }
    })
  }
}

export default AuthMiddleware;