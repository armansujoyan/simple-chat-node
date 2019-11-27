import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

import { IUser } from '../interfaces';
import { uniqueValidator } from '../utils/validators';

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

UserSchema.methods.verifyPassword = async function verifyPassword(password: string) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
}

UserSchema.methods.authSerialize = function authSerialize() {
  return {
    _id: this._id,
    email: this.email,
    username: this.username,
    is_logged_in: this.is_logged_in
  }
}

const User: Model<IUser> = model('User', UserSchema);

User.schema.path('username').validate(
  (username: string) => uniqueValidator({ username }, User),
  'User with this username already exists');

User.schema.path('email').validate(
  (email: string) => uniqueValidator({ email }, User),
  'User with this username already exists');

export default User;