import { IUserDBModel } from "../types/IUser";
import { UserModel } from "../models/userModel";

export const usersRepository = {
  async deleteAllUsers(): Promise<void> {
    await UserModel.deleteMany({});
  },

  async getUserById(id: string): Promise<IUserDBModel | null> {
    return UserModel.findOne({ _id: id }, { "__v": 0 });
  },

  async getUserByEmailConfirmationCode(code: string): Promise<IUserDBModel | null> {  
    return UserModel.findOne({ "emailConfirmation.confirmationCode": code });
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<IUserDBModel | null> {
    return await UserModel.findOne({ $or: [{ "accountData.email": loginOrEmail }, { "accountData.login": loginOrEmail }]});
  },

  async getUserByEmail(email: string): Promise<IUserDBModel | null> {  
    return UserModel.findOne({ "accountData.email": email });
  },

  async getUserByLogin(login: string): Promise<IUserDBModel | null> {  
    return UserModel.findOne({ "accountData.login": login });
  },

  async createUser(newUser: IUserDBModel): Promise<IUserDBModel> {
    return await UserModel.create(newUser);
  },

  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.deleteOne({ _id: id })
    return result.deletedCount === 1;
  },

  async confirmEmail(id: string): Promise<boolean> {
    let result = await UserModel.updateOne({ _id: id }, { "emailConfirmation.isConfirmed": true });
    return result.modifiedCount === 1;
  },

  async changeUserConfirmationCode(id: string, code: string): Promise<boolean> {
    let result = await UserModel.updateOne({ _id: id }, { "emailConfirmation.confirmationCode": code });
    return result.modifiedCount === 1;
  },

  async updateUserPassword(id: string, password: string): Promise<boolean> {
    const result = await UserModel.updateOne({ _id: id }, { "accountData.password": password });
    return result.matchedCount === 1;
  }
};
