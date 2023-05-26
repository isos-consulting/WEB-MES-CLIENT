import { isEmpty } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import {
  MaterialOrderDetailGetResponseEntity,
  MaterialOrderDetailRequestDTO,
  MaterialOrderGetResponseEntity,
  MaterialOrderRequestDTO,
} from '../api/model/MaterialOrderDTO';
import { MESSAGE } from '../core/Message';
import { NotImplementedException } from '../core/NotImplementedException';
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';
import { MESService, MESWithHeaderDetailService } from './MesService';

export class MaterialOrderService
  implements MESService, MESWithHeaderDetailService
{
  private static instance: MaterialOrderService;
  private constructor() {}

  /**
   * @description This method is used to get a instance of MaterialOrderService
   * @returns {MaterialOrderService}
   * @memberof MaterialOrderService
   * @example
   * MaterialOrderService.getInstance();
   *
   */
  public static getInstance() {
    if (this.instance == null) {
      this.instance = new MaterialOrderService();
    }

    return this.instance;
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is not implemented
   * @memberof MaterialOrderService
   * @throws NotImplementedException
   * @example
   * MaterialOrderService.getInstance().create(gridInstance);
   *
   */
  create(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('MaterialOrderService.create'),
    );
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to update a mold product
   * @memberof MaterialOrderService
   * @throws ZeroHandlingDataException
   * @example
   * MaterialOrderService.getInstance().update(gridInstance);
   *
   */
  update(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('MaterialOrderService.update'),
    );
  }

  updateWithHeaderDetail(
    gridInstance: GridInstance,
    header: MaterialOrderGetResponseEntity,
  ) {
    const { updatedRows } =
      gridInstance.getModifiedRows<MaterialOrderDetailGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      return Promise.reject(
        new ZeroHandlingDataException(
          MESSAGE.MATERIAL_ORDER_UPDATABLE_NOT_FOUND,
        ),
      );
    }

    try {
      const materialOrderRequestDTO = MaterialOrderRequestDTO.from(header);

      const materialOrderDetailList = updatedRows.map(
        MaterialOrderDetailRequestDTO.from,
      );

      return RepositoryModule.materialOrder().update(
        materialOrderRequestDTO,
        materialOrderDetailList,
      );
    } catch (error: unknown) {
      return Promise.reject(error);
    }
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to delete a mold product
   * @memberof MaterialOrderService
   * @throws ZeroHandlingDataException
   * @example
   * MaterialOrderService.getInstance().delete(gridInstance);
   *
   */
  delete(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('MaterialOrderService.delete'),
    );
  }

  deleteWithHeaderDetail(
    gridInstance: GridInstance,
    header: MaterialOrderGetResponseEntity,
  ) {
    return Promise.reject(
      new NotImplementedException(
        'MaterialOrderService.deleteWithHeaderDetail',
      ),
    );
  }
}
