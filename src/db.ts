import { MongoClient } from "mongodb";
import { IBlog } from "./types/IBlog";
import { IPost } from "./types/IPost";
import * as dotenv from "dotenv";
import { IUserDBModel } from "./types/IUser";
import { IComment } from "./types/IComment";
dotenv.config();

const url = process.env.MONGO_URL;

if (!url) {
  throw new Error("URL is not found");
};

const client = new MongoClient(url);

const db = client.db();
export const blogsCollection = db.collection<IBlog>("blogs");
export const postsCollection = db.collection<IPost>("posts");
export const usersCollection = db.collection<IUserDBModel>("users");
export const commentsCollection = db.collection<IComment>("comments");

export const runDb = async () => {
  try {
    await client.connect();
    console.log("Connected");
  } catch (e) {
    console.log("Not connected");
    await client.close();
  };
};
