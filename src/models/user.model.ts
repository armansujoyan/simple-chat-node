import { Schema, model, Model } from 'mongoose';

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
  }
})

const User: Model<IUser> = model('User', UserSchema);

export default User;