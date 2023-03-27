import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { ObjectId } from "mongodb";
import { usersRepository } from "../repositories/usersRepository";
import { IUserViewModel, IUserDBModel } from "../types/IUser";
import { authService } from "./authService";

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

  async getUserByEmailConfirmationCode(code: string): Promise<IUserDBModel | null> {
    return await usersRepository.getUserByEmailConfirmationCode(code);
  },

  async createUser(login: string, email: string, password: string, isEmailConfirmed: boolean, returnPassword: boolean | undefined = false, returnCode: boolean | undefined = false): Promise<IUserViewModel & { password?: string; code?: string; }> {
    const passwordHash = await authService.getHashedPassword(password);
  
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
        expirationDate: add(new Date(), { hours: 1 }),
        isConfirmed: isEmailConfirmed,
      },
    };

    await usersRepository.createUser(newUser);

    let savedUser: IUserViewModel & { password?: string; code?: string; } = {
      id: newUser._id,
      login: newUser.accountData.login,
      email: newUser.accountData.email,
      createdAt: newUser.accountData.createdAt,
    };

    if (returnPassword) {
      savedUser = {
        ...savedUser,
        password: newUser.accountData.password,
      };
    };

    if (returnCode) {
      savedUser = {
        ...savedUser,
        code: newUser.emailConfirmation.confirmationCode,
      };
    };

    return savedUser;
  },

  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id);
  },
};
