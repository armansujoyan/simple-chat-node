import { NextFunction, Request, Response } from "express";
import passport from "passport";
import bcrypt from 'bcryptjs';
import { signJwt } from '../utils/jwt'

import { User, ActiveUser } from '../models';
import { ExtRequest } from "../interfaces";

class UserController {
  public async signUp(req: Request, res: Response) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username
      });

      const token = signJwt(user);
      res.status(200).json({ token, user: user.authSerialize() });
    } catch(error) {
      res.status(500).json({ status: 'error', message: error })
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (error, user, info) => {
      if(error) return res.status(401).json({ error: error.message });
      if(!user) {
        res.status(401).json({ status: 'error', message: info.message});
      } else {
        const token = signJwt(user);
        res.status(200).json({token, user: user.authSerialize()});
      }
    })(req, res, next);
  }

  public async getUserById(req: ExtRequest, res: Response) {
    try {
      const { uid } = req.params;
      const { user: reqUser } = req;

      if(reqUser._id.toString() !== uid) {
        return res.status(401).json({ status: 'error', error: 'Unauthorized'});
      }

      const user = await User.findById(uid);

      if (user) {
        return res.status(200).json({ user: user.authSerialize() });
      }

      return res.status(500).json({ status: 'error', error: 'User not found'});
    } catch (error) {
      return res.status(500).json({ status: 'error', error });
    }
  }

  public async getActiveUsers(req: ExtRequest, res: Response) {
    try {
      const users = await ActiveUser.find({});

      if(users) {
        return res.status(200).json({ users });
      }

      return res.status(500).json({ status: 'error', error: 'Unable to find users' });
    } catch (error) {
      return res.status(500).json({ status: 'error', error });
    }
  }
}

export default UserController;