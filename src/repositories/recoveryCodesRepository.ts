import { DeleteResult, WithId } from "mongodb";
import { RecoveryCodeModel } from "../models/recoveryCodeModel";
import { IRecoveryCode } from "../types/IRecoveryCode";

export const recoveryCodesRepository = {
  async deleteAllRecoveryCodes(): Promise<DeleteResult> {
    return await RecoveryCodeModel.deleteMany({});
  },

  async getRecoveryCode(code: string): Promise<WithId<IRecoveryCode> | null> {
    return await RecoveryCodeModel.findOne({ recoveryCode: code });
  },

  async deleteRecoveryCode(id: string): Promise<DeleteResult> {
    return await RecoveryCodeModel.deleteOne({id});
  },

  async addRecoveryCode(code: IRecoveryCode): Promise<IRecoveryCode> {
    return await RecoveryCodeModel.create(code);
  },
};
