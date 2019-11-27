import { Document, Schema } from "mongoose";

export default interface IMessage extends Document {
  chat: Schema.Types.ObjectId,
  owner: Schema.Types.ObjectId,
  message: String,
  created_at: Date
}