import { CustomValidator } from 'express-validator';
import { commentsRepository } from '../repositories/commentsRepository';

export const isValidCommentId: CustomValidator = async commentId => {

  const comment = await commentsRepository.getCommentById(commentId);
  if (comment) {
    return true;
  } else {
    throw new Error('Incorrect value for commentId');
  };
};
