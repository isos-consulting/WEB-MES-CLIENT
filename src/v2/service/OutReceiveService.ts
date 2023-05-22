import { isEmpty } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import { MESEntity } from '../api/model/MESEntity';
import {
  OutReceiveDetailRequestDTO,
  OutReceiveGetResponseEntity,
  OutReceiveRequestDTO,
} from '../api/model/OutReceiveDTO';
import { MESSAGE } from '../core/Message';
import { NotImplementedException } from '../core/NotImplementedException';
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';
import { MESWithHeaderDetailService } from './MesService';

export class OutReceiveService
  implements MESEntity, MESWithHeaderDetailService
{
  private static instance: OutReceiveService;

  private constructor() {}

  public static getInstance(): OutReceiveService {
    if (!OutReceiveService.instance) {
      OutReceiveService.instance = new OutReceiveService();
    }

    return OutReceiveService.instance;
  }

  public create(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('OutReceiveService.create'),
    );
  }

  public update(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('OutReceiveService.update'),
    );
  }

  public updateWithHeaderDetail(
    gridInstance: GridInstance,
    header: OutReceiveGetResponseEntity,
  ) {
    const { updatedRows } = gridInstance.getModifiedRows();

    if (isEmpty(updatedRows)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.OUT_RECEIVE_UPDATABLE_NOT_FOUND),
      );
    }

    try {
      const outReceiveRequestDTO = OutReceiveRequestDTO.of(header);

      const outReceiveDetailList = updatedRows.map(
        OutReceiveDetailRequestDTO.of,
      );

      return RepositoryModule.outReceive().update(
        outReceiveRequestDTO,
        outReceiveDetailList,
      );
    } catch (error: unknown) {
      return Promise.reject(error);
    }
  }

  public delete(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('OutReceiveService.delete'),
    );
  }
}
