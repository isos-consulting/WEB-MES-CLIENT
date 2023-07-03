import { Authorization } from '~/apis/aut/authentication';
import { FactoryResponse } from '~/v2/api/FactoryRepository';

export const UserService = class {
  serializeUser(
    { uid, user_nm, pwd_fg, super_admin_fg }: Authorization,
    id: string,
    { factory_uuid }: FactoryResponse,
  ) {
    return JSON.stringify({
      uid,
      id,
      user_nm,
      factory_uuid,
      pwd_fg,
      super_admin_fg,
    });
  }

  serializeToken({ access_token, refresh_token }: Authorization) {
    return JSON.stringify({
      access_token,
      refresh_token,
    });
  }

  setAutoLoginData(user: string, token: string) {
    localStorage.setItem('userInfo', user);
    localStorage.setItem('tokenInfo', token);
  }

  rememberAutoInputData(factory_cd, id) {
    localStorage.setItem('iso-factory', factory_cd);
    localStorage.setItem('iso-user-id', id);
  }

  removeAutoInputData() {
    localStorage.removeItem('iso-factory');
    localStorage.removeItem('iso-user-id');
  }
};
