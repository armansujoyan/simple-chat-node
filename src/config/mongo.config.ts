import { ConnectionOptions } from 'mongoose';

const mongooseOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

export default mongooseOptions;
