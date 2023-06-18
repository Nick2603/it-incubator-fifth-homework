import { mapUserDBTypeToViewType } from "../mappers/mapUserDBTypeToViewType";
import { IUserViewModel } from "../types/IUser";
import { QueryParamType } from "../types/QueryParamType";
import { UserModel } from "../models/userModel";
import { SortOrder } from "mongoose";

type UsersWithMetaType = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: IUserViewModel[],
}

interface IGetUsersInput {
  searchLoginTerm: QueryParamType,
  searchEmailTerm: QueryParamType,
  sortBy: QueryParamType,
  sortDirection: QueryParamType,
  pageNumber: QueryParamType,
  pageSize: QueryParamType,
}

export const usersQueryRepository = {
  async getUsers({searchLoginTerm, searchEmailTerm, sortBy = "accountData.createdAt", sortDirection = "desc", pageNumber = "1", pageSize = "10"}: IGetUsersInput): Promise<UsersWithMetaType> {

    if (sortBy !== "accountData.createdAt" && sortBy.length) {
      sortBy = `accountData.${sortBy}`;
    };

    let filter: any = {};

    if (searchLoginTerm && searchEmailTerm) {
      filter = {
        $or: [
         { "accountData.login": { $regex: searchLoginTerm, $options: "i" } },
         { "accountData.email": { $regex: searchEmailTerm, $options: "i" } }
       ]
     }
    }

    if (searchLoginTerm && !searchEmailTerm) {
      filter["accountData.login"] = { $regex: searchLoginTerm, $options: "i" };
    };

    if (searchEmailTerm && !searchLoginTerm) {
      filter["accountData.email"] = { $regex: searchEmailTerm, $options: "i" };
    };

    const totalCount =  await UserModel.countDocuments(filter);
    const users = await UserModel.find(filter, { password: 0 }).sort({ [sortBy.toString()]: sortDirection as SortOrder }).skip((+pageNumber - 1) * +pageSize).limit(+pageSize);

    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: users.map(mapUserDBTypeToViewType),
    };
  },
};
