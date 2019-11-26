import { Request, Response, NextFunction } from 'express';
import '../config/passport.config';
import passport from 'passport';

class AuthMiddleware {
  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err, user, info) => {
      if(err) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized'});
      }
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized'});
      } else {
        next();
      }
    })(req, res, next);
  }
}

export default AuthMiddleware;