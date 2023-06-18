import { IPost } from "../types/IPost";
import { blogsRepository } from "./blogsRepository";
import { PostModel } from "../models/postModel";

export const postsRepository = {
  async deleteAllPosts(): Promise<void> {
    await PostModel.deleteMany({});
  },

  async getPostById(id: string): Promise<IPost | null> {
    return await PostModel.findOne({ _id: id }, { "__v": 0 });
  },

  async createPost(newPost: IPost): Promise<IPost> {
    return await PostModel.create(newPost);
  },

  async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
    const blog = await blogsRepository.getBlogById(blogId);
    const result = await PostModel.updateOne({ _id: id }, { title, shortDescription, content, blogId, blogName: blog!.name });
    return result.matchedCount === 1;
  },

  async deletePost(id: string): Promise<boolean> {
    const result = await PostModel.deleteOne({ _id: id })
    return result.deletedCount === 1;
  },
};
