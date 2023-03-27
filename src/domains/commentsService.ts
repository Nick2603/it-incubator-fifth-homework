import { commentsRepository } from "../repositories/commentsRepository";
import { usersRepository } from "../repositories/usersRepository";
import { IComment } from "../types/IComment";

export const commentsService = {
  async deleteAllComments(): Promise<void> {
    await commentsRepository.deleteAllComments();
  },

  async getCommentById(id: string): Promise<IComment | null> {
    return await commentsRepository.getCommentById(id);
  },

  async createComment(content: string, postId: string, userId: string): Promise<IComment> {
    const user = await usersRepository.getUserById(userId);
    const newComment: IComment = {
      id: Date.now().toString(),
      postId,
      content,
      commentatorInfo: {
        userId,
        userLogin: user!.accountData.login,
      },
      createdAt: new Date().toISOString(),
    };
    await commentsRepository.createComment(newComment);
    return {
      id: newComment.id,
      content: newComment.content,
      commentatorInfo: newComment.commentatorInfo,
      createdAt: newComment.createdAt,
    };
  },

  async updateComment(commentId: string, content: string, userId: string): Promise<"Updated" | "Forbidden" | "Not found"> {
    const comment = await commentsRepository.getCommentById(commentId);
    if (!comment) return "Not found";
    if (comment?.commentatorInfo.userId !== userId) return "Forbidden";
    const updateResult = await commentsRepository.updateComment(commentId, content);
    if (!updateResult) return "Not found";
    return "Updated";
  },

  async deleteComment(commentId: string, userId: string): Promise<"Updated" | "Forbidden" | "Not found"> {
    const comment = await commentsRepository.getCommentById(commentId);
    if (!comment) return "Not found";
    if (comment?.commentatorInfo.userId !== userId) return "Forbidden";
    const updateResult =  await commentsRepository.deleteComment(commentId);
    if (!updateResult) return "Not found";
    return "Updated";
  },
};
