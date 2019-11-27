import { Schema, Model, model } from 'mongoose';
import IChat from '../interfaces/chat.interface';

const ChatSchema = new Schema({
  users: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
}, {
  timestamps: true
});

ChatSchema.path('users').validate((users: [Schema.Types.ObjectId]) => users.length < 2,
  'No chat can exist with less than 2 users')

const ChatModel: Model<IChat> = model('Chat', ChatSchema);

export default ChatModel;