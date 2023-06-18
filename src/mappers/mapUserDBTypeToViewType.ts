import { IUserDBModel, IUserViewModel } from "../types/IUser";

export const mapUserDBTypeToViewType = (user: IUserDBModel): IUserViewModel => {
  return {
    id: user.id,
    login: user.accountData.login,
    email: user.accountData.email,
    createdAt: user.accountData.createdAt,
  };
};
