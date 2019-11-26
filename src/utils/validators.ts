import { Model } from 'mongoose';

export const uniqueValidator = async (field: any, model: Model<any>) => {
  const user = await model.findOne(field);
  if(user) {
    return false;
  }
  return true;
}