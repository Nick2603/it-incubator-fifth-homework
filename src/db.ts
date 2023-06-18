import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGO_URL;

if (!url) {
  throw new Error("URL is not found");
};

export const runDb = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected");
  } catch (e) {
    console.log("Not connected");
    await mongoose.disconnect();
  };
};
