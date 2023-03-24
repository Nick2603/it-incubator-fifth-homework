import bcrypt from "bcrypt";
import { usersRepository } from "../repositories/usersRepository";
import { IUser } from "../types/IUser";

export const usersService = {
  async deleteAllUsers(): Promise<void> {
    await usersRepository.deleteAllUsers();
  },

  async getUserById(id: string): Promise<IUser | null> {
    return await usersRepository.getUserById(id);
  },

  async createUser(login: string, email: string, password: string): Promise<IUser> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
  
    const newUser: IUser = {
      id: Date.now().toString(),
      login,
      email,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    };

    await usersRepository.createUser(newUser);

    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
  },

  async deleteUser(id: string): Promise<boolean> {
    return await usersRepository.deleteUser(id);
  },

  async checkCredentials(loginOrEmail: string, password: string): Promise<IUser | null> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) return null;
    const comparePasswordsResult = await bcrypt.compare(password, user.password!);
    if (comparePasswordsResult) {
      return user;
    }
    return null;
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
};
