import { ObjectId } from "mongodb";

export interface IBlackListRefreshToken {
  _id: ObjectId;
  token: string;
};
