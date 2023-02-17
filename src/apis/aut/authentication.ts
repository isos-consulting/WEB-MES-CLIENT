import { mesRequest, MESResponseType } from '../request-factory';

export type Authorization = {
  access_token: string;
  admin_fg: boolean;
  email: string;
  group_id: null | string;
  pwd_fg: boolean;
  refresh_token: string;
  super_admin_fg: boolean;
  uid: number;
  user_nm: string;
  uuid: string;
};

type LoginResponse = MESResponseType<Authorization>;

export const AuthenticationRemoteStore = class {
  static login(body) {
    return mesRequest.post<unknown, LoginResponse>('aut/user/sign-in/', body);
  }
};
