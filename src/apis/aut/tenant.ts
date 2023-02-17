import { AxiosResponse } from 'axios';
import { tenantRequest } from '../request-factory';

type TenantResponse = AxiosResponse<{
  success: boolean;
  state_cd: string;
  message: string;
  datas: {
    value: {
      count: number;
    };
    raws: { uuid: string }[];
  };
}>;

export const TenantRemoteStore = class {
  static async get() {
    const res = await tenantRequest.get<unknown, TenantResponse>(
      'tenant/auth',
      {
        params: { tenant_cd: import.meta.env.VITE_NAJS_LOCAL_WEB_URL },
      },
    );

    return res.data.datas.raws;
  }
};
