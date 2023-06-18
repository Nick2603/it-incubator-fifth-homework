import { IBlog } from "../types/IBlog";
import { BlogModel } from "../models/blogModel";

export const blogsRepository = {
  async deleteAllBlogs(): Promise<void> {
    await BlogModel.deleteMany({});
  },

  async getBlogById(id: string): Promise<IBlog | null> {
    return await BlogModel.findOne({ _id: id }, { "__v": 0 });
  },

  async createBlog(newBlog: IBlog): Promise<IBlog> {
    return await BlogModel.create(newBlog);
  },

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    const result = await BlogModel.updateOne({ _id: id }, { name, description, websiteUrl });
    console.log(result);
    return result.matchedCount === 1;
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await BlogModel.deleteOne({ _id: id })
    return result.deletedCount === 1;
  },
};
