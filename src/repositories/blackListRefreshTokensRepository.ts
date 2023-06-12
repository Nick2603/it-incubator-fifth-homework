import { InsertOneResult, ObjectId } from "mongodb";
import { blackListRefreshTokensCollection } from "../db";
import { IBlackListRefreshToken } from "../types/IBlackListRefreshToken";

export const blackListRefreshTokensRepository = {
  async deleteAllRefreshTokensInBlackList(): Promise<void> {
    await blackListRefreshTokensCollection.deleteMany({});
  },

  async getAllBlackListRefreshTokens(): Promise<IBlackListRefreshToken[]> {
    return await blackListRefreshTokensCollection.find({}).toArray();
  },

  async addRefreshTokenToBlackList(token: IBlackListRefreshToken): Promise<InsertOneResult<IBlackListRefreshToken>> {
    return await blackListRefreshTokensCollection.insertOne(token);
  },
};
