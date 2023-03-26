import { InsertOneResult, ObjectId } from "mongodb";
import { usersCollection } from "../db";
import { IUserViewModel, IUserDBModel } from "../types/IUser";

export const usersRepository = {
  async deleteAllUsers(): Promise<void> {
    await usersCollection.deleteMany({});
  },

  async getUserById(id: string): Promise<IUserViewModel | null> {
    const foundUser = await usersCollection.findOne({ id });
    if (!foundUser) return null;
    return {
      id: foundUser._id,
      login: foundUser.accountData.login,
      email: foundUser.accountData.email,
      createdAt: foundUser.accountData.createdAt,
    };
  },

  async getUserDBModelById(id: string): Promise<IUserDBModel | null> {
    return  usersCollection.findOne({ id });
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<IUserDBModel | null> {
    return await usersCollection.findOne({ $or: [{ "accountData.email": loginOrEmail }, { "accountData.login": loginOrEmail }]});
  },

  async createUser(newUser: IUserDBModel): Promise<InsertOneResult<IUserDBModel>> {
    return await usersCollection.insertOne(newUser);
  },

  async deleteUser(id: string): Promise<boolean> {
    const userId = new ObjectId(id);
    const result = await usersCollection.deleteOne({ _id: userId })
    return result.deletedCount === 1;
  },
};
