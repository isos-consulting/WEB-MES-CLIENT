import axios, { AxiosResponse } from 'axios';
import { getUserFactoryUuid } from '~/functions';
import { isNil } from '~/helper/common';

export type MESResponseType<T> = AxiosResponse<{
  success: boolean;
  state_cd: string;
  state: {
    state_tag: string;
    type: string;
    state_no: string;
  };
  message: {
    admin_message: string;
    user_message: string;
  };
  datas: {
    value: {
      count: number;
    };
    raws: T[];
  };
}>;

export const tenantRequest = axios.create({
  baseURL: import.meta.env.VITE_TENANT_SERVER_URL,
  params: { tenant_cd: import.meta.env.VITE_NAJS_LOCAL_WEB_URL },
  responseType: 'json',
});

tenantRequest.interceptors.response.use(
  function (response) {
    if (response.data.success === false) {
      throw new Error(response.data.message);
    }

    return response.data.datas.raws;
  },
  function (error) {
    return Promise.reject(error.response.data.message);
  },
);

export const mesRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  responseType: 'json',
  headers: {
    authorization: '',
    'restrict-access-to-tenants': '',
    'service-type': 'iso',
    environment: import.meta.env.VITE_ENVIRONMENT,
  },
});

mesRequest.interceptors.request.use(function (config) {
  const token = JSON.parse(localStorage.getItem('tokenInfo'));
  const tenant = JSON.parse(localStorage.getItem('tenantInfo'));

  if (!isNil(token)) {
    config.headers.authorization = `${
      import.meta.env.VITE_ACCESS_TOKEN_PREFIX
    } ${token.access_token}`;

    switch (config.method) {
      case 'get':
        config.params = {
          ...config.params,
          factory_uuid: getUserFactoryUuid(),
        };
        break;
      case 'post':
      case 'put':
        for (const [key, value] of Object.entries(config.data)) {
          if (Array.isArray(value)) {
            config.data[key] = value.map(item => ({
              ...item,
              factory_uuid: getUserFactoryUuid(),
            }));
          } else if (typeof value === 'object') {
            config.data[key] = {
              ...value,
              factory_uuid: getUserFactoryUuid(),
            };
          }
        }
        break;
      case 'delete':
        break;
    }
  }

  config.headers['restrict-access-to-tenants'] = tenant.tenantUuid;

  return config;
});

mesRequest.interceptors.response.use(
  function (response) {
    if (response.data.success === false) {
      throw new Error(response.data.message.admin_message);
    } else if (response.data.datas.value.count === 0) {
      throw new Error('조회된 데이터가 없습니다.');
    }

    return response.data.datas.raws;
  },
  function (error) {
    return Promise.reject(error.response.data.message.admin_message);
  },
);
