import { InsertOneResult } from "mongodb";
import { usedRefreshTokensCollection } from "../db";
import { IUsedRefreshToken } from "../types/IUsedRefreshToken";

export const usedRefreshTokensRepository = {
  async deleteAllUsedRefreshTokens(): Promise<void> {
    await usedRefreshTokensCollection.deleteMany({});
  },

  async getAllUsedRefreshTokens(): Promise<IUsedRefreshToken[]> {
    return await usedRefreshTokensCollection.find({}).toArray();
  },

  async addRefreshTokenToUsed(token: IUsedRefreshToken): Promise<InsertOneResult<IUsedRefreshToken>> {
    return await usedRefreshTokensCollection.insertOne(token);
  },
};
