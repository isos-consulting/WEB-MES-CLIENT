import { isNil } from '~/helper/common';
import { PartnerTypeRepository } from './PartnerTypeRepository';
import { UnitConvertRepository } from './UnitConvertRepository';
import { RoutingRepository } from './RoutingRepository';
import { ProductionWorkRepository } from './ProductionWorkRepository';
import { MoldProductRepository } from './MoldProductRepository';
import { MaterialOrderRepository } from './MaterialOrderRepository';
import { MaterialReturnRepository } from './MaterialReturnRepository';
import { SalesReturnRepository } from './SalesReturnRepository';
import { OutReceiveRepository } from './OutReceiveRepository';
import { QualityInspectReportRepository } from './QualityInspectReportRepository';

export class RepositoryModule {
  private static partnerTypeRepository: PartnerTypeRepository;
  private static unitConvertRepository: UnitConvertRepository;
  private static routingRepository: RoutingRepository;
  private static productionWorkRepository: ProductionWorkRepository;
  private static moldProductRepository: MoldProductRepository;
  private static materialOrderRepository: MaterialOrderRepository;
  private static materialReturnRepository: MaterialReturnRepository;
  private static salesReturnRepository: SalesReturnRepository;
  private static outReceiveRepository: OutReceiveRepository;
  private static qualityInspectReportRepository: QualityInspectReportRepository;

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

  public static materialOrder() {
    if (isNil(this.materialOrderRepository)) {
      this.materialOrderRepository = new MaterialOrderRepository();
    }

    return this.materialOrderRepository;
  }

  public static materialReturn() {
    if (isNil(this.materialReturnRepository)) {
      this.materialReturnRepository = new MaterialReturnRepository();
    }

    return this.materialReturnRepository;
  }

  public static salesReturn() {
    if (isNil(this.salesReturnRepository)) {
      this.salesReturnRepository = new SalesReturnRepository();
    }

    return this.salesReturnRepository;
  }

  public static outReceive() {
    if (isNil(this.outReceiveRepository)) {
      this.outReceiveRepository = new OutReceiveRepository();
    }

    return this.outReceiveRepository;
  }

  public static qualityInspectReport() {
    if (isNil(this.qualityInspectReportRepository)) {
      this.qualityInspectReportRepository =
        new QualityInspectReportRepository();
    }

    return this.qualityInspectReportRepository;
  }
}
