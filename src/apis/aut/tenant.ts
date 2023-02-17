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
  static get() {
    return tenantRequest.get<unknown, TenantResponse>('tenant/auth', {
      params: { tenant_cd: import.meta.env.VITE_NAJS_LOCAL_WEB_URL },
    });
  }
};
