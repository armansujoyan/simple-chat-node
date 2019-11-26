import { Document } from 'mongoose';

export default interface IUser extends Document {
  email: string,
  username: string,
  is_logged_in: boolean,
  verifyPassword: (password: string) => Promise<boolean>,
  authSerialize: () => any
}