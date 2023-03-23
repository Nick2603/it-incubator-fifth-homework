import { InsertOneResult } from "mongodb";
import { blogsCollection } from "../db";
import { IBlog } from "../types/IBlog";

export const blogsRepository = {
  async deleteAllBlogs(): Promise<void> {
    await blogsCollection.deleteMany({});
  },

  async getBlogById(id: string): Promise<IBlog | null> {
    return await blogsCollection.findOne({ id }, { projection: { _id: 0 }});
  },

  async createBlog(newBlog: IBlog): Promise<InsertOneResult<IBlog>> {
    return await blogsCollection.insertOne(newBlog);
  },

  async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    const result = await blogsCollection.updateOne({ id }, { $set: { name, description, websiteUrl }});
    return result.matchedCount === 1;
  },

  async deleteBlog(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({ id })
    return result.deletedCount === 1;
  },
};
