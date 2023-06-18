export interface ISessionDBModel {
  id: string;
  ip:	string;
  title: string;
  lastActiveDate:	string;
  deviceId:	string;
  userId: string;
};

export interface ISessionViewModel {
  ip:	string;
  title: string;
  lastActiveDate:	string;
  deviceId:	string;
};
