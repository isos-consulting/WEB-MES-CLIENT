import { isEmpty, isNil } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import {
  PartnerTypeCreateRequestDTO,
  PartnerTypeCreateRequestEntity,
  PartnerTypeDeleteRequestDTO,
  PartnerTypeGetResponseEntity,
  PartnerTypeUpdateRequestDTO,
} from '../api/model/PartnerTypeDTO';
import { GridInstance } from '../core/ToastGrid';
import { ZeroCreateDataException } from '../core/ZeroCreateDataException';

export class PartnerTypeService {
  private static instance: PartnerTypeService;
  private constructor() {}

  /**
   * @description This method is used to get a instance of PartnerTypeService
   * @returns {PartnerTypeService}
   * @memberof PartnerTypeService
   * @example
   * PartnerTypeService.getInstance();
   *
   */
  public static getInstance() {
    if (isNil(this.instance)) {
      this.instance = new PartnerTypeService();
    }

    return this.instance;
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to create a partner type
   * @memberof PartnerTypeService
   * @example
   * PartnerTypeService.getInstance().createPartner(gridInstance);
   *
   */
  public createPartnerType(gridInstance: GridInstance) {
    const partnerTypes = gridInstance.getData<PartnerTypeCreateRequestEntity>();

    if (isEmpty(partnerTypes)) {
      throw new ZeroCreateDataException('partnerTypes');
    }

    const partnerTypeDtoList = partnerTypes.map(PartnerTypeCreateRequestDTO.of);

    return RepositoryModule.PartnerType().create(partnerTypeDtoList);
  }

  public updatePartnerType(gridInstance: GridInstance) {
    const { updatedRows } =
      gridInstance.getModifiedRows<PartnerTypeGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      throw new ZeroCreateDataException('partnerTypes');
    }

    const partnerTypeDtoList = updatedRows.map(PartnerTypeUpdateRequestDTO.of);

    return RepositoryModule.PartnerType().update(partnerTypeDtoList);
  }

  public deletePartnerType(gridInstance: GridInstance) {
    const { updatedRows } =
      gridInstance.getModifiedRows<PartnerTypeGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      throw new ZeroCreateDataException('partnerTypes');
    }

    const partnerTypeDtoList = updatedRows.map(PartnerTypeDeleteRequestDTO.of);

    return RepositoryModule.PartnerType().delete(partnerTypeDtoList);
  }
}
