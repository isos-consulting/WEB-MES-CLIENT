import { mesRequest } from '../request-factory';

export type FactoryResponse = {
  factory_uuid: string;
  factory_cd: string;
  factory_nm: string;
};

export const FactoryRemoteStore = class {
  static get() {
    return mesRequest.get<unknown, FactoryResponse[]>('std/factories/sign-in');
  }
};
