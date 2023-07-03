import { AxiosInstance } from 'axios';
import { MESResponseType } from '../request-factory';

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

export class AuthenticationRemoteStore {
  private static instance: AuthenticationRemoteStore;
  private request: AxiosInstance;

  private constructor(request: AxiosInstance) {
    this.request = request;
  }

  static getInstance(request: AxiosInstance) {
    if (!AuthenticationRemoteStore.instance) {
      AuthenticationRemoteStore.instance = new AuthenticationRemoteStore(
        request,
      );
    }
    return AuthenticationRemoteStore.instance;
  }

  login(body) {
    return this.request.post<unknown, LoginResponse>('aut/user/sign-in/', body);
  }
}
