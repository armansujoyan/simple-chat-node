import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models';
import secrets from '../utils/secrets';

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if(!user) {
      return done(undefined, false, { message: `Username ${username} not found.`});
    };

    const isPasswordValid: boolean = await user.validatePassword(password);

    if(!isPasswordValid) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    done(error, null);
  };
}))

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secrets.PUBLIC_KEY
}, async (payload, done) => {
  try {
    const user = User.findOne(payload.sub);

    if (!user) {
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}))