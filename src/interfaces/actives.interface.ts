import { Document, Schema } from 'mongoose';

export default interface IActiveUser extends Document {
  userId: Schema.Types.ObjectId,
  socketId: String
}