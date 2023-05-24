import { isEmpty } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import {
  MaterialReturnDetailGetResponseEntity,
  MaterialReturnDetailRequestDTO,
  MaterialReturnGetResponseEntity,
  MaterialReturnRequestDTO,
} from '../api/model/MaterialReturnDTO';
import { MESSAGE } from '../core/Message';
import { NotImplementedException } from '../core/NotImplementedException';
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';
import { MESService, MESWithHeaderDetailService } from './MesService';

export class MaterialReturnService
  implements MESService, MESWithHeaderDetailService
{
  private static instance: MaterialReturnService;

  private constructor() {}

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new MaterialReturnService();
    }

    return this.instance;
  }

  create(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('MaterialReturnService.create'),
    );
  }

  update(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('MaterialReturnService.update'),
    );
  }

  updateWithHeaderDetail(
    gridInstance: GridInstance,
    header: MaterialReturnGetResponseEntity,
  ) {
    const { updatedRows } =
      gridInstance.getModifiedRows<MaterialReturnDetailGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      return Promise.reject(
        new ZeroHandlingDataException(
          MESSAGE.MATERIAL_RETURN_UPDATABLE_NOT_FOUND,
        ),
      );
    }

    try {
      const materialReturnRequestDTO = MaterialReturnRequestDTO.of(header);

      const materialReturnDetailList = updatedRows.map(
        MaterialReturnDetailRequestDTO.of,
      );

      return RepositoryModule.materialReturn().update(
        materialReturnRequestDTO,
        materialReturnDetailList,
      );
    } catch (error: unknown) {
      return Promise.reject(error);
    }
  }

  delete(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('MaterialReturnService.delete'),
    );
  }

  deleteWithHeaderDetail(
    gridInstance: GridInstance,
    header: MaterialReturnGetResponseEntity,
  ) {
    return Promise.reject(
      new NotImplementedException(
        'MaterialReturnService.deleteWithHeaderDetail',
      ),
    );
  }
}
