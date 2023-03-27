import { CustomValidator } from 'express-validator';
import { usersRepository } from '../repositories/usersRepository';

export const isUniqueEmail: CustomValidator = async email => {

  const user = await usersRepository.getUserByEmail(email);
  if (!user) {
    return true;
  } else {
    throw new Error('Incorrect value for email');
  };
};
