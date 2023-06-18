import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { WithId } from 'mongodb';
import { IPost } from '../types/IPost';

const PostSchema = new Schema<WithId<IPost>>({
  _id: { type: String, required: true, immutable: true, alias: "id", default: uuidv4 },
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true },
});

PostSchema.set('toJSON', {
  transform: function (_, ret, __) {
      ret.id = ret._id;
      delete ret._id;
  }
});

export const PostModel = model<IPost>("posts", PostSchema);
