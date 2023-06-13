import { InsertOneResult, ObjectId } from "mongodb";
import { IUsedRefreshToken } from '../types/IUsedRefreshToken';
import { usedRefreshTokensRepository } from '../repositories/usedRefreshTokensRepository';

export const usedRefreshTokensService = {
  async getAllUsedRefreshTokens(): Promise<IUsedRefreshToken[]> { // delete
    return await usedRefreshTokensRepository.getAllUsedRefreshTokens();
  },

  async addRefreshTokenToUsed(tokenString: string): Promise<InsertOneResult<IUsedRefreshToken>> {  
    const token = {
      _id: new ObjectId(),
      token: tokenString,
    };

    return await usedRefreshTokensRepository.addRefreshTokenToUsed(token);
  },

  async isUsedRefreshToken(tokenString: string): Promise<boolean> {
    const allTokens = await usedRefreshTokensRepository.getAllUsedRefreshTokens();

    const allTokensStrings = allTokens.map(t => t.token);

    const match = allTokensStrings.find(t => t === tokenString);

    return Boolean(match);
  }
};
