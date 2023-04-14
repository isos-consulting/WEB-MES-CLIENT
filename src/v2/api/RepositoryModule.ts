import { isNil } from '~/helper/common';
import { PartnerTypeRepository } from './PartnerTypeRepository';

export class RepositoryModule {
  private static partnerTypeRepository: PartnerTypeRepository;

  private constructor() {}

  public static partnerType() {
    if (isNil(this.partnerTypeRepository)) {
      this.partnerTypeRepository = new PartnerTypeRepository();
    }
    return this.partnerTypeRepository;
  }
}
