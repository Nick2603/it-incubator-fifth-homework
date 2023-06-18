import { DeleteResult, WithId } from "mongodb";
import { ISessionDBModel } from "../types/ISession";
import { SessionModel } from "../models/sessionModel";

export const sessionsRepository = { 
  async deleteAllSessions(): Promise<DeleteResult> {
    return await SessionModel.deleteMany({});
  },

  async getAllSessions(): Promise<ISessionDBModel[]> {
    return await SessionModel.find({});
  },

  async getSessionByDeviceId(deviceId: string): Promise<WithId<ISessionDBModel> | null> {
    return await SessionModel.findOne({deviceId});
  },

  async getAllSessionsByUserId(userId: string): Promise<ISessionDBModel[]> {
    return await SessionModel.find({userId});
  },

  async deleteAllSessionsExceptCurrent(deviceId: string, userId: string): Promise<DeleteResult> {
    return await SessionModel.deleteMany({ $and: [{ userId: userId }, { deviceId: { $ne: deviceId } }] });
  },

  async deleteSessionByDeviceId(deviceId: string): Promise<DeleteResult> {
    return await SessionModel.deleteOne({deviceId});
  },

  async addSession(session: ISessionDBModel): Promise<ISessionDBModel> {
    return await SessionModel.create(session);
  },

  async updateSession(deviceId: string, newIssuedAt: string): Promise<boolean> {
    const result = await SessionModel.updateOne({ deviceId }, { lastActiveDate: newIssuedAt });
    return result.matchedCount === 1;
  },

  async deleteSession(deviceId: string, lastActiveDate: string): Promise<DeleteResult> {
    return await SessionModel.deleteOne({ deviceId, lastActiveDate });
  },
};
