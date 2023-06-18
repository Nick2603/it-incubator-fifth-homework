import { IPost } from "../types/IPost";
import { QueryParamType } from "../types/QueryParamType";
import { PostModel } from "../models/postModel";
import { SortOrder } from "mongoose";

type PostsWithMetaType = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: IPost[],
}

interface IGetPostsInput {
  title: QueryParamType,
  sortBy: QueryParamType,
  sortDirection: QueryParamType,
  pageNumber: QueryParamType,
  pageSize: QueryParamType,
  blogId?: string
}

export const postsQueryRepository = {
  async getPosts({title, sortBy = "createdAt", sortDirection = "desc", pageNumber = "1", pageSize = "10", blogId}: IGetPostsInput): Promise<PostsWithMetaType> {
    const filter: any = {};
    
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    };

    if (blogId) {
      filter.blogId = blogId;
    };

    const totalCount =  await PostModel.countDocuments(filter);
    const posts = await PostModel.find(filter, { _id: 0 }).sort({ [sortBy.toString()]: sortDirection as SortOrder }).skip((+pageNumber - 1) * +pageSize).limit(+pageSize);

    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: posts,
    }
  },
};
