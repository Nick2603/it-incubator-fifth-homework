import { IComment } from "../types/IComment";
import { CommentModel } from "../models/commentModel";

export const commentsRepository = {
  async deleteAllComments(): Promise<void> {
    await CommentModel.deleteMany({});
  },

  async getCommentById(id: string): Promise<IComment | null> {
    return await CommentModel.findOne({ _id: id }, { "__v": 0, "postId": 0 });
  },

  async createComment(newComment: IComment): Promise<IComment> {
    return await CommentModel.create(newComment);
  },

  async updateComment(id: string, content: string): Promise<boolean> {
    const result = await CommentModel.updateOne({ _id: id }, { content });
    return result.matchedCount === 1;
  },

  async deleteComment(id: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({ _id: id })
    return result.deletedCount === 1;
  },
};
