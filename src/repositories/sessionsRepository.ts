import { DeleteResult, InsertOneResult, WithId } from "mongodb";
import { sessionsCollection } from "../db";
import { ISessionDBModel } from "../types/ISession";

export const sessionsRepository = { 
  async deleteAllSessions(): Promise<DeleteResult> {
    return await sessionsCollection.deleteMany({});
  },

  async getAllSessions(): Promise<ISessionDBModel[]> {
    return await sessionsCollection.find({}).toArray();
  },

  async getSessionByDeviceId(deviceId: string): Promise<WithId<ISessionDBModel> | null> {
    return await sessionsCollection.findOne({deviceId});
  },

  async getAllSessionsByUserId(userId: string): Promise<ISessionDBModel[]> {
    return await sessionsCollection.find({userId}).toArray();
  },

  async deleteAllSessionsExceptCurrent(deviceId: string, userId: string): Promise<DeleteResult> {
    return await sessionsCollection.deleteMany({ $and: [{ userId }, { deviceId: { $ne: deviceId } }] });
  },

  async deleteSessionByDeviceId(deviceId: string): Promise<DeleteResult> {
    return await sessionsCollection.deleteOne({deviceId});
  },

  async addSession(session: ISessionDBModel): Promise<InsertOneResult<ISessionDBModel>> {
    return await sessionsCollection.insertOne(session);
  },

  async updateSession(deviceId: string, newIssuedAt: string): Promise<boolean> {
    const result = await sessionsCollection.updateOne({ deviceId }, { $set: { lastActiveDate: newIssuedAt }});
    return result.matchedCount === 1;
  },

  async deleteSession(deviceId: string, lastActiveDate: string): Promise<DeleteResult> {
    return await sessionsCollection.deleteOne({ deviceId, lastActiveDate });
  },
};
