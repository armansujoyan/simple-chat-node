import { Schema, Model, model } from "mongoose";
import IMessage from "../interfaces/message.interface";

const MessageSchema: Schema = new Schema({
  chat: {
    type: Schema.Types.ObjectId,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true
  },
  message: {
    type: String,
    maxlength: [640, 'Message can\'t be longer than 640 characters']
  }
}, {
  timestamps: true
})

const MessageModel: Model<IMessage> = model('Message', MessageSchema);

export default MessageModel;