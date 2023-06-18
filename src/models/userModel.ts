import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { WithId } from 'mongodb';
import { IAccountData, IUserDBModel, IEmailConfirmation } from '../types/IUser';

const AccountDataSchema = new Schema<IAccountData>(
  {
    login: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: String, required: true },
  },
  { _id: false }
);

const EmailConfirmationSchema = new Schema<IEmailConfirmation>(
  {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<WithId<IUserDBModel>>({
  _id: { type: String, required: true, immutable: true, alias: "id", default: uuidv4 },
  accountData: { type: AccountDataSchema, required: true },
  emailConfirmation: { type: EmailConfirmationSchema, required: true },
});

UserSchema.set('toJSON', {
  transform: function (_, ret, __) {
      ret.id = ret._id;
      delete ret._id;
  }
});

export const UserModel = model<IUserDBModel>("users", UserSchema);
