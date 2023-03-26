import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { ObjectId } from "mongodb";
import { usersRepository } from "../repositories/usersRepository";
import { IUserViewModel, IUserDBModel } from "../types/IUser";

export const usersService = {
  async deleteAllUsers(): Promise<void> {
    await usersRepository.deleteAllUsers();
  },

  async getUserById(id: string): Promise<IUserViewModel | null> {
    return await usersRepository.getUserById(id);
  },

  async getUserDBModelById(id: string): Promise<IUserDBModel | null> {
    return await usersRepository.getUserDBModelById(id);
  },

  async createUser(login: string, email: string, password: string): Promise<IUserViewModel> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this.generateHash(password, passwordSalt);
  
    const newUser: IUserDBModel = {
      _id: new ObjectId(),
      accountData: {
        login,
        email,
        password: passwordHash,
        createdAt: new Date().toISOString(),
      },
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), { hours: 1, minutes: 10 }),
        isConfirmed: true,
      },
    };

    await usersRepository.createUser(newUser);

    return {
      id: newUser._id,
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };
  },

  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id);
  },

  async checkCredentials(loginOrEmail: string, password: string): Promise<IUserViewModel | null> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    
    if (!user) return null;
    const comparePasswordsResult = await bcrypt.compare(password, user.accountData.password);
    
    if (comparePasswordsResult) {
      return {
        id: user._id,
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
      };
    }
    return null;
  },

  async generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
};
