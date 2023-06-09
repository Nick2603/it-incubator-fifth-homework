import jwt from "jsonwebtoken";
import { IUserViewModel } from "../types/IUser";

export const jwtService = {
  async createJWT(user: IUserViewModel) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "1", { expiresIn: "1h" });
    return {
      accessToken: token,
    };
  // async createJWTAccessToken(user: IUserViewModel) {
  //   const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "1", { expiresIn: "1h" });
  //   return { accessToken };
  // },

  // async createJWTRefreshToken(user: IUserViewModel) {
  //   return jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "1", { expiresIn: "1d" });
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET || "1");
      return result.userId;
    } catch (error) {
      return null;
    };
  },
};
