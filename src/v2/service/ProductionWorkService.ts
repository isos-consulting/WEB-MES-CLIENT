import { isEmpty, isNil } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import {
  ProductionOrderCustomField,
  ProductionOrderGetResponseEntity,
} from '../api/model/ProductionOrderDTO';
import {
  ProductionWorkFinishRequestDTO,
  ProductionWorkStartRequestDTO,
} from '../api/model/ProductionWorkDTO';
import { NotImplementedException } from '../core/NotImplementedException';
import { GridInstance } from '../core/ToastGrid';
import { MESService } from './MesService';

export class ProductionWorkServiceImpl implements MESService {
  private static instance: ProductionWorkServiceImpl;
  private constructor() {}

  /**
   *
   * @description This method is used to get a instance of ProductionWorkServiceImpl
   * @returns {ProductionWorkServiceImpl}
   * @memberof ProductionWorkServiceImpl
   * @example
   * ProductionWorkServiceImpl.getInstance();
   *
   */
  public static getInstance() {
    if (isNil(this.instance)) {
      this.instance = new ProductionWorkServiceImpl();
    }

    return this.instance;
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is not implemented
   * @memberof ProductionWorkServiceImpl
   * @throws NotImplementedException
   *
   */
  public create(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('ProductionWorkServiceImpl.create()'),
    );
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to update a production work
   * @memberof ProductionWorkServiceImpl
   * @example
   * ProductionWorkServiceImpl.getInstance().update(gridInstance);
   *
   */
  public update(gridInstance: GridInstance) {
    const { updatedRows } = gridInstance.getModifiedRows<
      ProductionOrderGetResponseEntity & ProductionOrderCustomField
    >();

    const workUpdatableDTOList = updatedRows.map(
      ProductionWorkFinishRequestDTO.of,
    );

    if (isEmpty(workUpdatableDTOList) === false) {
      return RepositoryModule.productionWork().update(workUpdatableDTOList);
    }
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is not implemented
   * @memberof ProductionWorkServiceImpl
   * @throws NotImplementedException
   *
   */
  public delete(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('ProductionWorkServiceImpl.delete()'),
    );
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to start a production work
   * @memberof ProductionWorkServiceImpl
   * @example
   * ProductionWorkServiceImpl.getInstance().startWork(gridInstance);
   *
   */
  public startWork(gridInstance: GridInstance) {
    const { updatedRows } = gridInstance.getModifiedRows<
      ProductionOrderGetResponseEntity & ProductionOrderCustomField
    >();

    const workStartAbleDTOList = updatedRows
      .filter(row => row._work_start === true)
      .map(ProductionWorkStartRequestDTO.of);

    if (isEmpty(workStartAbleDTOList) === false) {
      return RepositoryModule.productionWork().create(workStartAbleDTOList);
    }
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to finish a production work
   * @memberof ProductionWorkServiceImpl
   * @example
   * ProductionWorkServiceImpl.getInstance().finishWork(gridInstance);
   *
   */
  public finishWork(gridInstance: GridInstance) {
    const { updatedRows } = gridInstance.getModifiedRows<
      ProductionOrderGetResponseEntity & ProductionOrderCustomField
    >();

    const workFinishAbleDTOList = updatedRows
      .filter(row => row.complete_fg === true)
      .map(ProductionWorkFinishRequestDTO.of);

    if (isEmpty(workFinishAbleDTOList) === false) {
      return RepositoryModule.productionWork().update(workFinishAbleDTOList);
    }
  }
}
