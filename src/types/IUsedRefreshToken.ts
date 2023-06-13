import { ObjectId } from "mongodb";

export interface IUsedRefreshToken { // delete
  _id: ObjectId;
  token: string;
};
