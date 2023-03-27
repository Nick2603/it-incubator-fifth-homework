import { CustomValidator } from 'express-validator';
import { usersRepository } from '../repositories/usersRepository';

export const isUniqueLogin: CustomValidator = async login => {

  const user = await usersRepository.getUserByLogin(login);
  if (!user) {
    return true;
  } else {
    throw new Error('Incorrect value for login');
  };
};
