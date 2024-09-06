export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: {
    _id: string;
    username: string;
  };
  permissions?: {
    _id: string;
    username: string;
    apiPath: string;
    module: string;
  }[];
}
