import { ConnectionOptions } from 'mongoose';

const mongooseOptions: ConnectionOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoReconnect: true,
  keepAlive: true
}

export default mongooseOptions;
