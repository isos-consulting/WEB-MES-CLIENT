import axios, { AxiosRequestConfig } from 'axios';

export const TestTenantRequest = axios.create();

TestTenantRequest.get = (
  url: string,
  config: AxiosRequestConfig,
): Promise<any> =>
  Promise.resolve([
    {
      uuid: 'test-uuid',
    },
  ]);
