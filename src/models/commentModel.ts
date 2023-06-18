import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { WithId } from 'mongodb';
import { IComment, ICommentatorInfo } from '../types/IComment';

const CommentatorInfoSchema = new Schema<ICommentatorInfo>(
  { userId: { type: String, required: true }, userLogin: { type: String, required: true } },
  { _id: false }
);

const CommentSchema = new Schema<WithId<IComment>>({
  _id: { type: String, required: true, immutable: true, alias: "id", default: uuidv4 },
  postId: { type: String },
  content: { type: String, required: true },
  createdAt: { type: String, required: true },
  commentatorInfo: { type: CommentatorInfoSchema, required: true },
});

CommentSchema.set('toJSON', {
  transform: function (_, ret, __) {
      ret.id = ret._id;
      delete ret._id;
  }
});

export const CommentModel = model<IComment>("comments", CommentSchema);
