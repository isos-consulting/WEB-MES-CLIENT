import { AxiosInstance } from 'axios';

export type FactoryResponse = {
  factory_uuid: string;
  factory_cd: string;
  factory_nm: string;
};

export class FactoryRepository {
  private static instance: FactoryRepository;
  private request: AxiosInstance;

  private constructor(request) {
    this.request = request;
  }

  public static getInstance(request: AxiosInstance): FactoryRepository {
    if (!FactoryRepository.instance) {
      FactoryRepository.instance = new FactoryRepository(request);
    }

    return FactoryRepository.instance;
  }

  get() {
    return this.request.get<unknown, FactoryResponse[]>(
      'std/factories/sign-in',
    );
  }
}
