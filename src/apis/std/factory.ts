import { mesRequest, MESResponseType } from '../request-factory';

export type Factory = {
  factory_uuid: string;
  factory_cd: string;
  factory_nm: string;
};

type FactoryResponse = MESResponseType<Factory>;

export const FactoryRemoteStore = class {
  static async get() {
    const res = await mesRequest.get<unknown, FactoryResponse>(
      'std/factories/sign-in',
    );
    return res.data.datas.raws;
  }
};
