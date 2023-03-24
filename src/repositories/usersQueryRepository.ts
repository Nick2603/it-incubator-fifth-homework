import { SortDirection } from "mongodb";
import { usersCollection } from "../db";
import { IUser } from "../types/IUser";
import { QueryParamType } from "../types/QueryParamType";

type UsersWithMetaType = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: IUser[],
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
  async getUsers({searchLoginTerm, searchEmailTerm, sortBy = "createdAt", sortDirection = "desc", pageNumber = "1", pageSize = "10"}: IGetUsersInput): Promise<UsersWithMetaType> {
    let filter: any = {};

    if (searchLoginTerm && searchEmailTerm) {
      filter = {
        $or: [
         { login: { $regex: `(?i)${searchLoginTerm}(?-i)` } },
         { email: { $regex: `(?i)${searchEmailTerm}(?-i)` } }
       ]
     }
    }

    if (searchLoginTerm && !searchEmailTerm) {
      filter.login = { $regex: `(?i)${searchLoginTerm}(?-i)` };
    };

    if (searchEmailTerm && !searchLoginTerm) {
      filter.email = { $regex: `(?i)${searchEmailTerm}(?-i)` };
    };

    const totalCount =  await usersCollection.countDocuments(filter);
    const users = await usersCollection.find(filter).sort(sortBy.toString(), sortDirection as SortDirection).skip((+pageNumber - 1) * +pageSize).limit(+pageSize).project<IUser>({ _id: 0, password: 0 }).toArray();

    return {
      pagesCount: Math.ceil(totalCount / +pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount,
      items: users,
    }
  },
};
