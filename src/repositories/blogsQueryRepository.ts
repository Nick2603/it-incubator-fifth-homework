import { BlogModel } from "../models/blogModel"
import { IBlog } from "../types/IBlog";
import { QueryParamType } from "../types/QueryParamType";
import { SortOrder } from "mongoose";

type BlogsWithMetaType = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: IBlog[],
}

interface IGetBlogsInput {
  searchNameTerm: QueryParamType,
  sortBy: QueryParamType,
  sortDirection: QueryParamType,
  pageNumber: QueryParamType,
  pageSize: QueryParamType,
}

export const blogsQueryRepository = {
  async getBlogs({searchNameTerm, sortBy = "createdAt", sortDirection = "desc", pageNumber = "1", pageSize = "10"}: IGetBlogsInput): Promise<BlogsWithMetaType> {
    const filter: any = {};
    
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: "i" };
    };
    
    const totalCount =  await BlogModel.countDocuments(filter);
    const blogs =  await BlogModel.find(filter, { _id: 0 }).sort({ [sortBy.toString()]: sortDirection as SortOrder }).skip((+pageNumber - 1) * +pageSize).limit(+pageSize);

    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: blogs,
    }
  },
};
