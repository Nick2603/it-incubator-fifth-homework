import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { IUserViewModel } from "../types/IUser";

export const jwtService = {
  async createJWTAccessToken(user: IUserViewModel) {
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "1", { expiresIn: 10 });
    return { accessToken };
  },

  async createJWTRefreshToken(user: IUserViewModel, deviceId?: string) {
    return jwt.sign({ userId: user.id, deviceId: deviceId || uuidv4(), issuedAt: new Date().toISOString() }, process.env.JWT_SECRET || "1", { expiresIn: 20 });
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET || "1");
      return result.userId;
    } catch (error) {
      return null;
    };
  },

  async getRefreshTokenMetadata(token: string) {
    try {
      const result: any = jwt.verify(token, process.env.JWT_SECRET || "1");
      return { deviceId: result.deviceId, issuedAt: result.issuedAt };
    } catch (error) {
      return null;
    };
  },
};
