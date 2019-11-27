import jwt from 'jsonwebtoken';
import secrets from './secrets';

export const signJwt = (user: any) => jwt.sign({
  iss: 'simple.chat',
  sub: user.id
}, secrets.PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '6h'});

export const verifyJwt = (token: string) => {
  try {
    jwt.verify(token, secrets.PUBLIC_KEY);
    return true;
  } catch(error) {
    return false;
  }
}