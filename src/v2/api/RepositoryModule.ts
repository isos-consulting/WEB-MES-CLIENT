import { isNil } from '~/helper/common';
import { PartnerTypeRepository } from './PartnerTypeRepository';
import { UnitConvertRepository } from './UnitConvertRepository';

export class RepositoryModule {
  private static partnerTypeRepository: PartnerTypeRepository;
  private static unitConvertRepository: UnitConvertRepository;

  private constructor() {}

  /**
   *
   * @returns {PartnerTypeRepository}
   * @memberof RepositoryModule
   * @example
   * RepositoryModule.partnerType();
   *
   */
  public static partnerType() {
    if (isNil(this.partnerTypeRepository)) {
      this.partnerTypeRepository = new PartnerTypeRepository();
    }
    return this.partnerTypeRepository;
  }

  /**
   *
   * @returns {UnitConvertRepository}
   * @memberof RepositoryModule
   * @example
   * RepositoryModule.unitConvert();
   *
   */
  public static unitConvert() {
    if (isNil(this.unitConvertRepository)) {
      this.unitConvertRepository = new UnitConvertRepository();
    }
    return this.unitConvertRepository;
  }
}
