import { InsertOneResult } from "mongodb";
import { commentsCollection } from "../db";
import { IComment } from "../types/IComment";

export const commentsRepository = {
  async deleteAllComments(): Promise<void> {
    await commentsCollection.deleteMany({});
  },

  async getCommentById(id: string): Promise<IComment | null> {
    return await commentsCollection.findOne({ id }, { projection: { _id: 0, postId: 0 }});
  },

  async createComment(newComment: IComment): Promise<InsertOneResult<IComment>> {
    return await commentsCollection.insertOne(newComment);
  },

  async updateComment(id: string, content: string): Promise<boolean> {
    const result = await commentsCollection.updateOne({ id }, { $set: { content }});
    return result.matchedCount === 1;
  },

  async deleteComment(id: string): Promise<boolean> {
    const result = await commentsCollection.deleteOne({ id })
    return result.deletedCount === 1;
  },
};
