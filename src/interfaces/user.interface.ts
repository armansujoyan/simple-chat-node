import { Document } from 'mongoose';

export default interface IUser extends Document {
  email: string,
  username: string,
  verifyPassword: (password: string) => Promise<boolean>,
  authSerialize: () => any
}