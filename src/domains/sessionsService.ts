import { DeleteResult, InsertOneResult, WithId } from "mongodb";
import { ISession } from "../types/ISession";
import { sessionsRepository } from "../repositories/sessionsRepository";
import { jwtService } from "../application/jwtService";
import { CodeResponsesEnum } from "../types/CodeResponsesEnum";

export const sessionsService = {
  async getAllSessions(): Promise<ISession[]> {
    return await sessionsRepository.getAllSessions();
  },

  async deleteAllSessionsExceptCurrent(tokenString: string, userId: string): Promise<DeleteResult> {
    const metadata = await jwtService.getRefreshTokenMetadata(tokenString);
    let deviceId: string = "";
    let issuedAt: string = "";

    if (metadata) {
      issuedAt = metadata.issuedAt;
      deviceId  = metadata.deviceId;
    }
  
    return await sessionsRepository.deleteAllSessionsExceptCurrent(deviceId, userId, issuedAt);
  },

  async deleteSessionByDeviceId(deviceId: string, userId: string): Promise<CodeResponsesEnum | boolean> {
    const session = await sessionsRepository.getSessionByDeviceId(deviceId);

    if (session && session.userId !== userId) {
      return CodeResponsesEnum.Forbidden_403;
    };

    const result = await sessionsRepository.deleteSessionByDeviceId(deviceId);
    return result.deletedCount === 1;
  },

  async getSessionsByUserId(userId: string): Promise<ISession[]> {
    return await sessionsRepository.getAllSessionsByUserId(userId);
  },

  async addSession(token: string, ip: string, title: string, userId: string): Promise<InsertOneResult<ISession>> {
    const metadata = await jwtService.getRefreshTokenMetadata(token);
    let deviceId: string = "";
    let issuedAt: string = "";

    if (metadata) {
      issuedAt = metadata.issuedAt;
      deviceId  = metadata.deviceId;
    }

    const session = {
      ip,
      title,
      lastActiveDate:	issuedAt,
      deviceId,
      userId,
    };

    return await sessionsRepository.addSession(session);
  },

  async isRefreshTokenInSession(tokenString: string, userId: string): Promise<boolean> {
    const allTokens = await sessionsRepository.getAllSessions();

    const metadata = await jwtService.getRefreshTokenMetadata(tokenString);
    let deviceId: string = "";
    let issuedAt: string = "";

    if (metadata) {
      issuedAt = metadata.issuedAt;
      deviceId  = metadata.deviceId;
    }

    const match = allTokens.find(t => t.deviceId === deviceId && t.lastActiveDate === issuedAt && t.userId === userId);

    return Boolean(match);
  },

  async updateSession(tokenString: string, userId: string, previousLastActiveDate: string, newLastActiveDate: string): Promise<boolean> {
    return await sessionsRepository.updateSession(deviceId, newLastActiveDate);
  },

  async deleteSession(tokenString: string, userId: string): Promise<DeleteResult> {
    const metadata = await jwtService.getRefreshTokenMetadata(tokenString);
    let deviceId: string = "";
    let issuedAt: string = "";

    if (metadata) {
      issuedAt = metadata.issuedAt;
      deviceId  = metadata.deviceId;
    }
  
    return await sessionsRepository.deleteSession(deviceId, userId, issuedAt);
  },
};
