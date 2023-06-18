import { IComment } from './../types/IComment';
import { QueryParamType } from '../types/QueryParamType';
import { CommentModel } from '../models/commentModel';
import { SortOrder } from 'mongoose';

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

    const totalCount =  await CommentModel.countDocuments(filter);
    const comments = await CommentModel.find(filter, { _id: 0, postId: 0 }).sort({ [sortBy.toString()]: sortDirection as SortOrder }).skip((+pageNumber - 1) * +pageSize).limit(+pageSize);

    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: comments,
    }
  },
};
