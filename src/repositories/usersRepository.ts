import { InsertOneResult, ObjectId } from "mongodb";
import { usersCollection } from "../db";
import { IUserViewModel, IUserDBModel } from "../types/IUser";

export const usersRepository = {
  async deleteAllUsers(): Promise<void> {
    await usersCollection.deleteMany({});
  },

  async getUserById(id: string): Promise<IUserViewModel | null> {
    let userId: any;
    try {
      userId = new ObjectId(id);
    } catch (error) {
      return null;
    };
    const foundUser = await usersCollection.findOne({ _id: userId });
    if (!foundUser) return null;
    
    return {
      id: foundUser._id,
      login: foundUser.accountData.login,
      email: foundUser.accountData.email,
      createdAt: foundUser.accountData.createdAt,
    };
  },

  async getUserDBModelById(id: string): Promise<IUserDBModel | null> {
    let userId: any;
    try {
      userId = new ObjectId(id);
    } catch (error) {
      return null;
    };
    
    return usersCollection.findOne({ _id: userId });
  },

  async getUserByEmailConfirmationCode(code: string): Promise<IUserDBModel | null> {  
    return usersCollection.findOne({ "emailConfirmation.confirmationCode": code });
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<IUserDBModel | null> {
    return await usersCollection.findOne({ $or: [{ "accountData.email": loginOrEmail }, { "accountData.login": loginOrEmail }]});
  },

  async getUserByEmail(email: string): Promise<IUserDBModel | null> {  
    return usersCollection.findOne({ "accountData.email": email });
  },

  async getUserByLogin(login: string): Promise<IUserDBModel | null> {  
    return usersCollection.findOne({ "accountData.login": login });
  },

  async createUser(newUser: IUserDBModel): Promise<InsertOneResult<IUserDBModel>> {
    return await usersCollection.insertOne(newUser);
  },

  async deleteUser(id: string): Promise<boolean> {
    let userId: any;
    try {
      userId = new ObjectId(id);
    } catch (error) {
      return false;
    };
    const result = await usersCollection.deleteOne({ _id: userId })
    return result.deletedCount === 1;
  },

  async confirmEmail(userId: ObjectId) {
    let result = await usersCollection.updateOne({ _id: userId }, { $set: { "emailConfirmation.isConfirmed": true } });
    return result.modifiedCount === 1;
  },

  async changeUserConfirmationCode(userId: ObjectId, code: string) {
    let result = await usersCollection.updateOne({ _id: userId }, { $set: { "emailConfirmation.confirmationCode": code } });
    return result.modifiedCount === 1;
  },
};
