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
  static async login(body) {
    try {
      const res = await mesRequest.post<unknown, LoginResponse>(
        'aut/user/sign-in/',
        body,
      );

      this.validateLoginSuccess(res);

      return res.data.datas.raws;
    } catch (e) {
      throw new Error(e.response.data.message.admin_message);
    }
  }

  private static validateLoginSuccess(res: LoginResponse): asserts res {
    if (res.data.success === false) {
      throw new Error(res.data.message.user_message);
    }
  }
};
