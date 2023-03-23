import { blogsRepository } from "../repositories/blogsRepository";
import { postsRepository } from "../repositories/postsRepository";
import { IPost } from "../types/IPost";

export const postsService = {
  async deleteAllPosts(): Promise<void> {
    await postsRepository.deleteAllPosts();
  },

  async getPostById(id: string): Promise<IPost | null> {
    return await postsRepository.getPostById(id);
  },

  async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<IPost> {
    const blog = await blogsRepository.getBlogById(blogId);
    const newPost: IPost = {
      id: Date.now().toString(),
      title,
      shortDescription,
      content,
      blogId,
      createdAt: new Date().toISOString(),
      blogName: blog!.name,
    };
    await postsRepository.createPost(newPost);
    return {
      id: newPost.id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      createdAt: newPost.createdAt,
      blogName: newPost.blogName,
    };
  },

  async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
    return await postsRepository.updatePost(id, title, shortDescription, content, blogId);
  },

  async deletePost(id: string): Promise<boolean> {
    return await postsRepository.deletePost(id);
  },
};
