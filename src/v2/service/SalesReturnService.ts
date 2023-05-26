import { isEmpty } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import {
  SalesReturnDetailGetResponseEntity,
  SalesReturnDetailRequestDTO,
  SalesReturnGetResponseEntity,
  SalesReturnRequestDTO,
} from '../api/model/SalesReturnDTO';
import { MESSAGE } from '../core/Message';
import { NotImplementedException } from '../core/NotImplementedException';
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';
import { MESService, MESWithHeaderDetailService } from './MesService';

export class SalesReturnService
  implements MESService, MESWithHeaderDetailService
{
  private static instance: SalesReturnService;

  private constructor() {}

  public static getInstance(): SalesReturnService {
    if (!SalesReturnService.instance) {
      SalesReturnService.instance = new SalesReturnService();
    }

    return SalesReturnService.instance;
  }

  public create(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('SalesReturnService.create'),
    );
  }

  public update(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('SalesReturnService.update'),
    );
  }

  public updateWithHeaderDetail(
    gridInstance: GridInstance,
    header: SalesReturnGetResponseEntity,
  ) {
    const { updatedRows } =
      gridInstance.getModifiedRows<SalesReturnDetailGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.SALES_RETURN_UPDATABLE_NOT_FOUND),
      );
    }

    try {
      const salesReturnRequestDTO = SalesReturnRequestDTO.from(header);

      const salesReturnDetailList = updatedRows.map(
        SalesReturnDetailRequestDTO.from,
      );

      return RepositoryModule.salesReturn().update(
        salesReturnRequestDTO,
        salesReturnDetailList,
      );
    } catch (error: unknown) {
      return Promise.reject(error);
    }
  }

  public delete(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('SalesReturnService.delete'),
    );
  }

  public deleteWithHeaderDetail(
    gridInstance: GridInstance,
    header: SalesReturnGetResponseEntity,
  ) {
    return Promise.reject(
      new NotImplementedException('SalesReturnService.deleteWithHeaderDetail'),
    );
  }
}
