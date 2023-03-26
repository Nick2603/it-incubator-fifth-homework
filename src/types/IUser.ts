import { ObjectId } from "mongodb";

export interface IUserViewModel{
  id: ObjectId;
  login: string;
  email: string;
  createdAt: string;
};

export interface IUserDBModel{
  _id: ObjectId,
  accountData: {
    login: string;
    email: string;
    password: string;
    createdAt: string;
  },
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  },
};
