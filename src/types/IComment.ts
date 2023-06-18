export interface ICommentatorInfo {
  userId: string;
  userLogin: string;
};

export interface IComment {
  id: string;
  postId?: string;
  content: string;
  commentatorInfo: ICommentatorInfo;
  createdAt: string;
};
