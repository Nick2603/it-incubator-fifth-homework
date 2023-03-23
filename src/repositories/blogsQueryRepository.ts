import { SortDirection } from "mongodb";
import { blogsCollection } from "../db";
import { IBlog } from "../types/IBlog";
import { QueryParamType } from "../types/QueryParamType";

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
      filter.name = { $regex: `(?i)${searchNameTerm}(?-i)` };
    };
    
    const totalCount =  await blogsCollection.countDocuments(filter);
    const blogs =  await blogsCollection.find(filter).sort(sortBy.toString(), sortDirection as SortDirection).skip((+pageNumber - 1) * +pageSize).limit(+pageSize).project<IBlog>({ _id: 0 }).toArray();

    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: blogs,
    }
  },
};
