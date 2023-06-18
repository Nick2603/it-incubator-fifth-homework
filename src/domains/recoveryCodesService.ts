import { v4 as uuidv4 } from 'uuid';
import { DeleteResult } from "mongodb";
import { IRecoveryCode } from '../types/IRecoveryCode';
import { recoveryCodesRepository } from '../repositories/recoveryCodesRepository';
import { emailsManager } from '../utils/emailsManager';

export const recoveryCodesService = {
  async validateRecoveryCode(code: string): Promise<IRecoveryCode | null> {
    const foundCode = await recoveryCodesRepository.getRecoveryCode(code);

    if (foundCode) {
      await recoveryCodesRepository.deleteRecoveryCode(foundCode.id);
      return foundCode;
    }

    return null;
  },

  async addRecoveryCode(email: string): Promise<IRecoveryCode | undefined> {
    const recoveryCode = {
      id: uuidv4(),
      recoveryCode: uuidv4(),
      email,
    };

    const savedCode = await recoveryCodesRepository.addRecoveryCode(recoveryCode);

    try {
      await emailsManager.sendPasswordRecoveryEmail(email, savedCode.recoveryCode);
    } catch (error) {
      console.log(error);
      recoveryCodesRepository.deleteRecoveryCode(savedCode.id);
      return;
    };
    
    return savedCode;
  },

  async deleteRecoveryCode(id: string): Promise<DeleteResult> {
    return await recoveryCodesRepository.deleteRecoveryCode(id);
  },
};
