import passport, { Strategy } from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models';
import { JWT_SECRET } from '../utils/secrets';
import { IUser } from '../interfaces';

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    const foundUser: IUser | null = await User.findOne({ username });

    if(!foundUser) {
      return done(undefined, false, { message: `Username ${username} not found.`});
    };

    const isPasswordValid: boolean = await foundUser.validatePassword(password);

    if(!isPasswordValid) {
      return done(null, false);
    }

    return done(null, foundUser);
  } catch (error) {
    done(error, null);
  };
}))