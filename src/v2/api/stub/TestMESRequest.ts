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
  }
};
