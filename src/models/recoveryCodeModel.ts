import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { WithId } from 'mongodb';
import { IRecoveryCode } from '../types/IRecoveryCode';

const RecoveryCodeSchema = new Schema<WithId<IRecoveryCode>>({
  _id: { type: String, required: true, immutable: true, alias: "id", default: uuidv4 },
  recoveryCode: { type: String, required: true },
  email: { type: String, required: true },
});

RecoveryCodeSchema.set('toJSON', {
  transform: function (_, ret, __) {
      ret.id = ret._id;
      delete ret._id;
  }
});

export const RecoveryCodeModel = model<IRecoveryCode>("recoveryCodes", RecoveryCodeSchema);
