import { Schema, model, Model } from 'mongoose';

import { IActiveUser } from '../interfaces';

const ActiveUsersSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  socketId: {
    type: String,
    required: true
  }
})

const ActiveUser: Model<IActiveUser> = model('ActiveUser', ActiveUsersSchema);

export default ActiveUser;
