import { Schema, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

import { IUser } from '../interfaces';

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
  },
  is_logged_in: {
    type: Boolean,
    default: false
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

export default User;