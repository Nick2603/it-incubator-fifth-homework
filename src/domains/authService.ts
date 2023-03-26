import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { usersService } from "./usersService";
import { usersRepository } from "../repositories/usersRepository";

export const authService = {
  async createUser(login: string, email: string, password: string) {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await usersService.generateHash(password, passwordSalt)

    const user = {
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
        isConfirmed: false,
      },
    };

    const savedUser = usersRepository.createUser(user);
    try {
      // await emailsManager.sendRegistrationConfirmationEmail();
    } catch (error) {
      console.error(error);
    };
    return savedUser;
  },
};
