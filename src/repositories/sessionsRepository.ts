import { DeleteResult, InsertOneResult, WithId } from "mongodb";
import { sessionsCollection } from "../db";
import { ISession } from "../types/ISession";

export const sessionsRepository = { 
  async deleteAllSessions(): Promise<DeleteResult> {
    return await sessionsCollection.deleteMany({});
  },

  async getAllSessions(): Promise<ISession[]> {
    return await sessionsCollection.find({}).toArray();
  },

  async getSessionByDeviceId(deviceId: string): Promise<WithId<ISession> | null> {
    return await sessionsCollection.findOne({deviceId});
  },

  async getAllSessionsByUserId(userId: string): Promise<ISession[]> {
    return await sessionsCollection.find({userId}).toArray();
  },

  async deleteAllSessionsExceptCurrent(deviceId: string, userId: string, lastActiveDate: string): Promise<DeleteResult> {
    return await sessionsCollection.deleteMany({ deviceId, userId, lastActiveDate : { $ne: lastActiveDate } });
  },

  async deleteSessionByDeviceId(deviceId: string): Promise<DeleteResult> {
    return await sessionsCollection.deleteOne({deviceId});
  },

  async addSession(session: ISession): Promise<InsertOneResult<ISession>> {
    return await sessionsCollection.insertOne(session);
  },

  async updateSession(deviceId: string, newLastActiveDate: string): Promise<boolean> {
    const result = await sessionsCollection.updateOne({ deviceId }, { $set: { lastActiveDate: newLastActiveDate }});
    return result.matchedCount === 1;
  },

  async deleteSession(deviceId: string, userId: string, lastActiveDate: string): Promise<DeleteResult> {
    return await sessionsCollection.deleteOne({ deviceId, userId, lastActiveDate });
  },
};
