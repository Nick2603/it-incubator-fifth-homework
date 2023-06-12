import { InsertOneResult, ObjectId } from "mongodb";
import { IBlackListRefreshToken } from '../types/IBlackListRefreshToken';
import { blackListRefreshTokensRepository } from '../repositories/blackListRefreshTokensRepository';

export const blackListRefreshTokensService = {
  async getAllBlackListRefreshTokens(): Promise<IBlackListRefreshToken[]> {
    return await blackListRefreshTokensRepository.getAllBlackListRefreshTokens();
  },

  async addRefreshTokenToBlackList(tokenString: string): Promise<InsertOneResult<IBlackListRefreshToken>> {  
    const token = {
      _id: new ObjectId(),
      token: tokenString,
    };

    return await blackListRefreshTokensRepository.addRefreshTokenToBlackList(token);
  },

  async checkIfTokenInBlackList(tokenString: string): Promise<boolean> {
    const allTokens = await blackListRefreshTokensRepository.getAllBlackListRefreshTokens();

    const allTokensStrings = allTokens.map(t => t.token);

    const match = allTokensStrings.find(t => t === tokenString);

    return Boolean(match);
  }
};
