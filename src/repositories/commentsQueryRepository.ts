import { IComment } from './../types/IComment';
import { commentsCollection } from "../db";
import { QueryParamType } from '../types/QueryParamType';
import { SortDirection } from 'mongodb';

type CommentsWithMetaType = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: IComment[],
}

export const commentsQueryRepository = {
  async getComments(sortBy: QueryParamType = "createdAt", sortDirection: QueryParamType = "desc", pageNumber: QueryParamType = "1", pageSize: QueryParamType = "10", postId: string): Promise<CommentsWithMetaType> {
    const filter: any = {};

    if (postId) {
      filter.postId = postId;
    };

    const totalCount =  await commentsCollection.countDocuments(filter);
    const comments = await commentsCollection.find(filter).sort(sortBy.toString(), sortDirection as SortDirection).skip((+pageNumber - 1) * +pageSize).limit(+pageSize).project<IComment>({ _id: 0, postId: 0 }).toArray();

    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: comments,
    }
  },
};
