import { Document, Schema } from "mongoose";

export default interface IChat extends Document {
  users: [Schema.Types.ObjectId],
  created_at: Date
}