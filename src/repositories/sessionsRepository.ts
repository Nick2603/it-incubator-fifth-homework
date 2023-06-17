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
    console.log(userId, "userId in repo on get");
    const r = await sessionsCollection.find({userId}).toArray();
    console.log(r, "result in repo on get");
    return r;
  },

  async deleteAllSessionsExceptCurrent(deviceId: string, userId: string): Promise<DeleteResult> {
    console.log(deviceId, userId, "deviceId, userId in repo");
    const r = await sessionsCollection.deleteMany({ $and: [{ userId }, { deviceId: { $ne: deviceId } }] });
    console.log(r, "result of deleting in repo");
    return r;
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
