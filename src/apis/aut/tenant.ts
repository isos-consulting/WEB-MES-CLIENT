import { AxiosInstance, AxiosResponse } from 'axios';

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

export class TenantRemoteStore {
  private static instance: TenantRemoteStore;
  private request: AxiosInstance;

  private constructor(request: AxiosInstance) {
    this.request = request;
  }

  static getInstance(request: AxiosInstance): TenantRemoteStore {
    if (!TenantRemoteStore.instance) {
      TenantRemoteStore.instance = new TenantRemoteStore(request);
    }
    return TenantRemoteStore.instance;
  }

  get() {
    return this.request.get<unknown, TenantResponse>('tenant/auth', {
      params: { tenant_cd: import.meta.env.VITE_NAJS_LOCAL_WEB_URL },
    });
  }
}
