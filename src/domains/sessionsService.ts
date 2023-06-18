import { v4 as uuidv4 } from 'uuid';
import { DeleteResult } from "mongodb";
import { ISessionDBModel, ISessionViewModel } from "../types/ISession";
import { sessionsRepository } from "../repositories/sessionsRepository";
import { jwtService } from "../application/jwtService";
import { mapSessionDBTypeToViewType } from "../mappers/mapUserDBTypeToViewType copy";

export const sessionsService = {
  async deleteAllSessionsExceptCurrent(tokenString: string, userId: string): Promise<DeleteResult> {
    const metadata = await jwtService.getRefreshTokenMetadata(tokenString);
    let deviceId: string = "";

    if (metadata) {
      deviceId  = metadata.deviceId;
    }
  
    return await sessionsRepository.deleteAllSessionsExceptCurrent(deviceId, userId);
  },

  async deleteSessionByDeviceId(deviceId: string, userId: string): Promise<string | boolean> {
    const session = await sessionsRepository.getSessionByDeviceId(deviceId);

    if (session && session.userId !== userId) {
      return "Forbidden";
    };

    const result = await sessionsRepository.deleteSessionByDeviceId(deviceId);
    return result.deletedCount === 1;
  },

  async getSessionsByUserId(userId: string): Promise<ISessionViewModel[]> {
    const sessions = await sessionsRepository.getAllSessionsByUserId(userId);
    return sessions.map((session) => mapSessionDBTypeToViewType(session));
  },

  async addSession(token: string, ip: string, title: string, userId: string): Promise<ISessionDBModel> {
    const metadata = await jwtService.getRefreshTokenMetadata(token);
    let deviceId: string = "";
    let issuedAt: string = "";

    if (metadata) {
      issuedAt = metadata.issuedAt;
      deviceId  = metadata.deviceId;
    }

    const session = {
      id: uuidv4(),
      ip,
      title,
      lastActiveDate:	issuedAt,
      deviceId,
      userId,
    };

    return await sessionsRepository.addSession(session);
  },

  async isRefreshTokenInSession(tokenString: string): Promise<boolean> {
    const allTokens = await sessionsRepository.getAllSessions();

    const metadata = await jwtService.getRefreshTokenMetadata(tokenString);
    let deviceId: string = "";
    let issuedAt: string = "";

    if (metadata) {
      issuedAt = metadata.issuedAt;
      deviceId  = metadata.deviceId;
    }

    const match = allTokens.find(t => t.deviceId === deviceId && t.lastActiveDate === issuedAt);

    return Boolean(match);
  },

  async updateSession(oldTokenString: string, newTokenString: string): Promise<boolean> {
    const oldMetadata = await jwtService.getRefreshTokenMetadata(oldTokenString);
    const newMetadata = await jwtService.getRefreshTokenMetadata(newTokenString);

    let oldDeviceId: string = "";
    let newIssuedAt: string = "";

    if (oldMetadata) {
      oldDeviceId = oldMetadata.deviceId;
    }

    if (newMetadata) {
      newIssuedAt = newMetadata.issuedAt;
    }

    return await sessionsRepository.updateSession(oldDeviceId, newIssuedAt);
  },

  async deleteSession(tokenString: string): Promise<DeleteResult> {
    const metadata = await jwtService.getRefreshTokenMetadata(tokenString);
    let deviceId: string = "";
    let issuedAt: string = "";

    if (metadata) {
      issuedAt = metadata.issuedAt;
      deviceId  = metadata.deviceId;
    }
  
    return await sessionsRepository.deleteSession(deviceId, issuedAt);
  },
};
