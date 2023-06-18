import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IBlog } from '../types/IBlog';
import { WithId } from 'mongodb';

const BlogSchema = new Schema<WithId<IBlog>>({
  _id: { type: String, required: true, immutable: true, alias: "id", default: uuidv4 },
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
});

BlogSchema.set('toJSON', {
  transform: function (_, ret, __) {
      ret.id = ret._id;
      delete ret._id;
  }
});

export const BlogModel = model<IBlog>("blogs", BlogSchema);
