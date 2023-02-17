import axios, { AxiosResponse } from 'axios';

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

  config.headers.authorization = `${import.meta.env.VITE_ACCESS_TOKEN_PREFIX} ${
    token.access_token
  }`;
  config.headers['restrict-access-to-tenants'] = tenant.tenantUuid;

  return config;
});

mesRequest.interceptors.response.use(
  function (response) {
    if (response.data.success === false) {
      throw new Error(response.data.message.admin_message);
    }

    return response.data.datas.raws;
  },
  function (error) {
    return Promise.reject(error.response.data.message.admin_message);
  },
);
