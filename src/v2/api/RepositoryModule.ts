import { isNil } from '~/helper/common';
import { PartnerTypeRepository } from './PartnerTypeRepository';
import { UnitConvertRepository } from './UnitConvertRepository';
import { RoutingRepository } from './RoutingRepository';
import { ProductionWorkRepository } from './ProductionWorkRepository';
import { MoldProductRepository } from './MoldProductRepository';

export class RepositoryModule {
  private static partnerTypeRepository: PartnerTypeRepository;
  private static unitConvertRepository: UnitConvertRepository;
  private static routingRepository: RoutingRepository;
  private static productionWorkRepository: ProductionWorkRepository;
  private static moldProductRepository: MoldProductRepository;

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

  /**
   *
   * @returns {RoutingRepository}
   * @memberof RepositoryModule
   * @example
   * RepositoryModule.routing();
   *
   */
  public static routing() {
    if (isNil(this.routingRepository)) {
      this.routingRepository = new RoutingRepository();
    }

    return this.routingRepository;
  }

  public static productionWork() {
    if (isNil(this.productionWorkRepository)) {
      this.productionWorkRepository = new ProductionWorkRepository();
    }

    return this.productionWorkRepository;
  }

  public static moldProduct() {
    if (isNil(this.moldProductRepository)) {
      this.moldProductRepository = new MoldProductRepository();
    }

    return this.moldProductRepository;
  }
}
