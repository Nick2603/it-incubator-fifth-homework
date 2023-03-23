import { ObjectId } from "mongodb";

export interface IBlog {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
