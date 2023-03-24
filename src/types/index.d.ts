import { IUser } from "./IUser";

declare global {
  declare namespace Express {
    export interface Request {
      user?: IUser
    }
  }
}