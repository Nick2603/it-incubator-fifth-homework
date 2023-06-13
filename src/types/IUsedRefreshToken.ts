import { ObjectId } from "mongodb";

export interface IUsedRefreshToken {
  _id: ObjectId;
  token: string;
};
