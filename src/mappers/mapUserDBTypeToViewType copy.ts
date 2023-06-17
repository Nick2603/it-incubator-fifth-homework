import { ISessionDBModel, ISessionViewModel } from "../types/ISession";

export const mapSessionDBTypeToViewType = (session: ISessionDBModel): ISessionViewModel => {
  return {
    ip:	session.ip,
    title: session.title,
    lastActiveDate:	session.lastActiveDate,
    deviceId:	session.deviceId,
  };
};
