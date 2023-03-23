import { CustomValidator } from 'express-validator';
import { blogsRepository } from '../repositories/blogsRepository';

export const isValidBlogId: CustomValidator = async blogId => {

  const blog = await blogsRepository.getBlogById(blogId);
  if (blog) {
    return true;
  } else {
    throw new Error('Incorrect value for blogId');
  };
};
