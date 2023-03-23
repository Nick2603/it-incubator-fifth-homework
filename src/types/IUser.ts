import { ObjectId } from "mongodb";

export interface IUser{
  _id?: ObjectId;
  id: string;
  login: string;
  email: string;
  password?: string;
  createdAt: string;
};
