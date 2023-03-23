import { InsertOneResult, WithId } from "mongodb";
import { usersCollection } from "../db";
import { IUser } from "../types/IUser";

export const usersRepository = {
  async deleteAllUsers(): Promise<void> {
    await usersCollection.deleteMany({});
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<IUser> | null> {
    const user = await usersCollection.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }]});
    return user;
  },

  async createUser(newUser: IUser): Promise<InsertOneResult<IUser>> {
    return await usersCollection.insertOne(newUser);
  },

  async deleteUser(id: string): Promise<boolean> {
    const result = await usersCollection.deleteOne({ id })
    return result.deletedCount === 1;
  },
};
