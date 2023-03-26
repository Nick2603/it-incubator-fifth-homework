import { SortDirection } from "mongodb";
import { usersCollection } from "../db";
import { IUserDBModel, IUserViewModel } from "../types/IUser";
import { QueryParamType } from "../types/QueryParamType";

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
         { "accountData.login": { $regex: `(?i)${searchLoginTerm}(?-i)` } },
         { "accountData.email": { $regex: `(?i)${searchEmailTerm}(?-i)` } }
       ]
     }
    }

    if (searchLoginTerm && !searchEmailTerm) {
      filter["accountData.login"] = { $regex: `(?i)${searchLoginTerm}(?-i)` };
    };

    if (searchEmailTerm && !searchLoginTerm) {
      filter["accountData.email"] = { $regex: `(?i)${searchEmailTerm}(?-i)` };
    };

    const totalCount =  await usersCollection.countDocuments(filter);
    const users = await usersCollection.find(filter).sort(sortBy.toString(), sortDirection as SortDirection).skip((+pageNumber - 1) * +pageSize).limit(+pageSize).project<IUserDBModel>({ password: 0 }).toArray();

    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: users.map(user => ({
        id: user._id,
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
      })),
    }
  },
};
