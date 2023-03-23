import { SortDirection } from "mongodb";
import { postsCollection } from "../db";
import { IPost } from "../types/IPost";
import { QueryParamType } from "../types/QueryParamType";

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
      filter.title = { $regex: `(?i)${title}(?-i)` };
    };

    if (blogId) {
      filter.blogId = blogId;
    };

    const totalCount =  await postsCollection.countDocuments(filter);
    const posts = await postsCollection.find(filter).sort(sortBy.toString(), sortDirection as SortDirection).skip((+pageNumber - 1) * +pageSize).limit(+pageSize).project<IPost>({ _id: 0 }).toArray();

    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: posts,
    }
  },
};
