import axios from 'axios';

export const TestMESRequest = axios.create();

TestMESRequest.get = (url: string): Promise<any> => {
  if (url === 'std/factories/sign-in') {
    return Promise.resolve([
      {
        factory_uuid: 'test-uuid',
        factory_id: 'test-id',
        factory_nm: 'test-factory',
      },
    ]);
  } else if (url === 'aut/menus/permission') {
    return Promise.resolve([]);
  } else if (url === 'das/overall-status') {
    return Promise.resolve([{ byDay: 0 }]);
  } else if (url === 'das/realtime-status') {
    return Promise.resolve([]);
  } else if (url === 'aut/bookmarks') {
    return Promise.resolve([]);
  }
};

TestMESRequest.post = (url: string, body: any): Promise<any> => {
  if (url === 'aut/user/sign-in/') {
    return Promise.resolve([
      {
        access_token: 'test-access-token',
        admin_fg: false,
        email: 'test-email',
        group_id: null,
        pwd_fg: false,
        refresh_token: 'test-refresh-token',
        super_admin_fg: true,
        uid: 0,
        user_nm: 'test-user',
        uuid: 'test-uuid',
      },
    ]);
  }
};
