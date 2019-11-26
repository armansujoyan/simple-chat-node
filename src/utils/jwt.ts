import jwt from 'jsonwebtoken';
import secrets from './secrets';

export const signJwt = (user: any) => jwt.sign({
  iss: 'simple.chat',
  sub: user.id
}, secrets.PRIVATE_KEY, { algorithm: 'RSA256', expiresIn: '6h'});