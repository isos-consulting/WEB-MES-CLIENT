import { isEmpty } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import {
  MoldProductCreateRequestDTO,
  MoldProductCreateRequestEntity,
  MoldProductDeleteRequestDTO,
  MoldProductGetResponseEntity,
  MoldProductRequestDTO,
} from '../api/model/MoldProductDTO';
import { MESSAGE } from '../core/Message';
import { NotImplementedException } from '../core/NotImplementedException';
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';
import { MESService, MESWithUuidService } from './MesService';

export class MoldProductService implements MESService, MESWithUuidService {
  private static instance: MoldProductService;
  private constructor() {}

  /**
   * @description This method is used to get a instance of MoldProductService
   * @returns {MoldProductService}
   * @memberof MoldProductService
   * @example
   * MoldProductService.getInstance();
   *
   */
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new MoldProductService();
    }

    return this.instance;
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is not implemented
   * @memberof MoldProductService
   * @throws NotImplementedException
   * @example
   * MoldProductService.getInstance().create(gridInstance);
   *
   */
  create(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('MoldProductService.create'),
    );
  }

  /**
   *
   * @param gridInstance
   * @param prodUuid
   * @returns
   * @description This method is used to create a Mold product
   * @memberof MoldProductService
   * @throws ZeroHandlingDataException
   * @example
   * MoldProductService.getInstance().createWithUuid(gridInstance, prodUuid);
   *
   */
  createWithUuid(gridInstance: GridInstance, prodUuid: string) {
    const moldProducts = gridInstance.getData<MoldProductCreateRequestEntity>();

    if (isEmpty(moldProducts)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.MOLD_PRODUCT_CREATABLE_NOT_FOUND),
      );
    }

    try {
      const moldProductDTOList = moldProducts.map(moldProduct =>
        MoldProductCreateRequestDTO.from({
          ...moldProduct,
          prod_uuid: prodUuid,
        }),
      );

      return RepositoryModule.moldProduct().create(moldProductDTOList);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to update a mold product
   * @memberof MoldProductService
   * @throws ZeroHandlingDataException
   * @example
   * MoldProductService.getInstance().update(gridInstance);
   *
   */
  update(gridInstance: GridInstance) {
    const { updatedRows } =
      gridInstance.getModifiedRows<MoldProductGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.MOLD_PRODUCT_UPDATABLE_NOT_FOUND),
      );
    }

    try {
      const moldProductUpdatableDTOList = updatedRows.map(
        MoldProductRequestDTO.of,
      );

      return RepositoryModule.moldProduct().update(moldProductUpdatableDTOList);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to delete a mold product
   * @memberof MoldProductService
   * @throws ZeroHandlingDataException
   * @example
   * MoldProductService.getInstance().delete(gridInstance);
   *
   */
  delete(gridInstance: GridInstance) {
    const deletedMoldProducts =
      gridInstance.getCheckedRows<MoldProductGetResponseEntity>();

    if (isEmpty(deletedMoldProducts)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.MOLD_PRODUCT_DELETABLE_NOT_FOUND),
      );
    }

    try {
      const moldProductUuidList = deletedMoldProducts.map(
        MoldProductDeleteRequestDTO.of,
      );

      return RepositoryModule.moldProduct().delete(moldProductUuidList);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
