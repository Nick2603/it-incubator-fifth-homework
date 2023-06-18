export interface IUserViewModel {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export interface IAccountData {
  login: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface IEmailConfirmation {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export interface IUserDBModel {
  id: string,
  accountData: IAccountData,
  emailConfirmation: IEmailConfirmation,
};
