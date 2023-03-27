import bcrypt from "bcrypt";
import { usersRepository } from './../repositories/usersRepository';
import { emailsManager } from "../utils/emailsManager";
import { usersService } from "./usersService";
import { IUserViewModel } from '../types/IUser';

export const authService = {
  async createUser(login: string, email: string, password: string): Promise<boolean> {
    const savedUser = await usersService.createUser(login, email, password, false, true, true);

    try {
      await emailsManager.sendRegistrationConfirmationEmail(savedUser.email, savedUser.code!);
    } catch (error) {
      console.error(error);
      await usersService.deleteUser(savedUser.id.toString());
      return false;
    };
    return true;
  },

  async resendEmail(email: string): Promise<boolean> {
    const user = await usersRepository.getUserByEmail(email);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;

    try {
      await emailsManager.sendRegistrationConfirmationEmail(user.accountData.email, user.emailConfirmation.confirmationCode);
    } catch (error) {
      console.error(error);
      return false;
    };

    return true;
  },

  async confirmEmail(code: string): Promise<boolean> {
    const user = await usersService.getUserByEmailConfirmationCode(code);
    if (!user) return false;
    if (user.emailConfirmation.isConfirmed) return false;
    if (user.emailConfirmation.expirationDate < new Date()) return false;
    const result = await usersRepository.confirmEmail(user._id);
    return result;
  },

  async checkCredentials(loginOrEmail: string, password: string): Promise<IUserViewModel | null> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    
    if (!user) return null;
    // if (!user.emailConfirmation.isConfirmed) return null;
    const comparePasswordsResult = await bcrypt.compare(password, user.accountData.password);
    
    if (!comparePasswordsResult) {
      return null;
    };
  
    return {
      id: user._id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
    };
  },

  async getHashedPassword(password: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(password, passwordSalt);
    return passwordHash;
  },

  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
};
