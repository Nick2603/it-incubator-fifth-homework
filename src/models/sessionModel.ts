import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ISessionDBModel } from '../types/ISession';
import { WithId } from 'mongodb';

const  SessionSchema = new Schema<WithId<ISessionDBModel>>({
  _id: { type: String, required: true, immutable: true, alias: "id", default: uuidv4 },
  ip: { type: String, required: true },
  title: { type: String, required: true },
  lastActiveDate: { type: String, required: true },
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
});

SessionSchema.set('toJSON', {
  transform: function (_, ret, __) {
      ret.id = ret._id;
      delete ret._id;
  }
}); 

export const SessionModel = model<ISessionDBModel>("sessions", SessionSchema);
