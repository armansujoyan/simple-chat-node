import { Document, Schema } from "mongoose";

export default interface IMessage extends Document {
  message: String,
  created_at?: Date,
  owner: Schema.Types.ObjectId,
  receiver: Schema.Types.ObjectId
}