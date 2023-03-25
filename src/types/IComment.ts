import { ObjectId } from "mongodb";

interface ICommentatorInfo {
  userId: string;
  userLogin: string;
};

export interface IComment {
  _id?: ObjectId;
  postId?: string;
  id: string;
  content: string;
  commentatorInfo: ICommentatorInfo;
  createdAt: string;
};
