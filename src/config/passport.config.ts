import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models';
import secrets from '../utils/secrets';

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secrets.PUBLIC_KEY
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);

    if (!user) {
      return done(undefined, false);
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}))

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, async (username, password, done) => {
  try {
    const user = await User.findOne({ username });

    if(!user) {
      return done(undefined, false, { message: `Username ${username} not found.`});
    };

    const isPasswordValid: boolean = await user.verifyPassword(password);

    if(!isPasswordValid) {
      return done(null, false, { message: 'Unauthorized'});
    }

    return done(null, user);
  } catch (error) {
    done(error, null);
  };
}))