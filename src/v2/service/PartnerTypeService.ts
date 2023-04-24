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
import { MESService } from './MesService';

export class PartnerTypeServiceImpl implements MESService {
  private static instance: PartnerTypeServiceImpl;
  private constructor() {}

  /**
   * @description This method is used to get a instance of PartnerTypeServiceImpl
   * @returns {PartnerTypeServiceImpl}
   * @memberof PartnerTypeServiceImpl
   * @example
   * PartnerTypeServiceImpl.getInstance();
   *
   */
  public static getInstance() {
    if (isNil(this.instance)) {
      this.instance = new PartnerTypeServiceImpl();
    }

    return this.instance;
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to create a partner type
   * @memberof PartnerTypeServiceImpl
   * @throws ZeroHandlingDataException
   * @example
   * PartnerTypeServiceImpl.getInstance().create(gridInstance);
   *
   */
  public create(gridInstance: GridInstance) {
    const partnerTypes = gridInstance.getData<PartnerTypeCreateRequestEntity>();

    if (isEmpty(partnerTypes)) {
      throw new ZeroHandlingDataException(
        MESSAGE.PARTNER_TYPE_CREATABLE_NOT_FOUND,
      );
    }

    const partnerTypeDTOList = partnerTypes.map(PartnerTypeCreateRequestDTO.of);

    return RepositoryModule.partnerType().create(partnerTypeDTOList);
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to update a partner type
   * @memberof PartnerTypeServiceImpl
   * @throws ZeroHandlingDataException
   * @example
   * PartnerTypeServiceImpl.getInstance().update(gridInstance);
   *
   */
  public update(gridInstance: GridInstance) {
    const { updatedRows } =
      gridInstance.getModifiedRows<PartnerTypeGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      throw new ZeroHandlingDataException(
        MESSAGE.PARTNER_TYPE_UPDATABLE_NOT_FOUND,
      );
    }

    const partnerTypeDTOList = updatedRows.map(PartnerTypeUpdateRequestDTO.of);

    return RepositoryModule.partnerType().update(partnerTypeDTOList);
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to delete a partner type
   * @memberof PartnerTypeServiceImpl
   * @throws ZeroHandlingDataException
   * @example
   * PartnerTypeServiceImpl.getInstance().delete(gridInstance);
   *
   */
  public delete(gridInstance: GridInstance) {
    const deletedPartnerTypes =
      gridInstance.getCheckedRows<PartnerTypeGetResponseEntity>();

    if (isEmpty(deletedPartnerTypes)) {
      throw new ZeroHandlingDataException(
        MESSAGE.PARTNER_TYPE_DELETABLE_NOT_FOUND,
      );
    }

    const partnerTypeDTOList = deletedPartnerTypes.map(
      PartnerTypeDeleteRequestDTO.of,
    );

    return RepositoryModule.partnerType().delete(partnerTypeDTOList);
  }
}
