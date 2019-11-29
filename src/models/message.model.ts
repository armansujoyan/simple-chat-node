import { Schema, Model, model } from "mongoose";
import IMessage from "../interfaces/message.interface";

const MessageSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true
  },
  reciever: {
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