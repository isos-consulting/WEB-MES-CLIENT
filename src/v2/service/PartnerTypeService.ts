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
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';
import { MESSAGE } from '../core/Message';

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
   * @throws ZeroHandlingDataException
   * @example
   * PartnerTypeService.getInstance().createPartner(gridInstance);
   *
   */
  public createPartnerType(gridInstance: GridInstance) {
    const partnerTypes = gridInstance.getData<PartnerTypeCreateRequestEntity>();

    if (isEmpty(partnerTypes)) {
      throw new ZeroHandlingDataException(
        MESSAGE.PARTNER_TYPE_CREATABLE_NOT_FOUND,
      );
    }

    const partnerTypeDtoList = partnerTypes.map(PartnerTypeCreateRequestDTO.of);

    return RepositoryModule.partnerType().create(partnerTypeDtoList);
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to update a partner type
   * @memberof PartnerTypeService
   * @throws ZeroHandlingDataException
   * @example
   * PartnerTypeService.getInstance().updatePartner(gridInstance);
   *
   */
  public updatePartnerType(gridInstance: GridInstance) {
    const { updatedRows } =
      gridInstance.getModifiedRows<PartnerTypeGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      throw new ZeroHandlingDataException(
        MESSAGE.PARTNER_TYPE_UPDATABLE_NOT_FOUND,
      );
    }

    const partnerTypeDtoList = updatedRows.map(PartnerTypeUpdateRequestDTO.of);

    return RepositoryModule.partnerType().update(partnerTypeDtoList);
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to delete a partner type
   * @memberof PartnerTypeService
   * @throws ZeroHandlingDataException
   * @example
   * PartnerTypeService.getInstance().deletePartner(gridInstance);
   *
   */
  public deletePartnerType(gridInstance: GridInstance) {
    const deletedPartnerTypes =
      gridInstance.getCheckedRows<PartnerTypeGetResponseEntity>();

    if (isEmpty(deletedPartnerTypes)) {
      throw new ZeroHandlingDataException(
        MESSAGE.PARTNER_TYPE_DELETABLE_NOT_FOUND,
      );
    }

    const partnerTypeDtoList = deletedPartnerTypes.map(
      PartnerTypeDeleteRequestDTO.of,
    );

    return RepositoryModule.partnerType().delete(partnerTypeDtoList);
  }
}
