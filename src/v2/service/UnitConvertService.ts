import { isEmpty } from 'lodash';
import { isNil } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import {
  UnitConvertCreateRequestDTO,
  UnitConvertCreateRequestEntity,
  UnitConvertDeleteRequestDTO,
  UnitConvertGetResponseEntity,
  UnitConvertUpdateRequestDTO,
} from '../api/model/UnitConvertDTO';
import { MESSAGE } from '../core/Message';
import { NotImplementedException } from '../core/NotImplementedException';
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';
import { MESService, MESWithUuidService } from './MesService';

export class UnitConvertServiceImpl implements MESService, MESWithUuidService {
  private static instance: UnitConvertServiceImpl;
  private constructor() {}

  /**
   * @description This method is used to get a instance of UnitConvertService
   * @returns {UnitConvertServiceImpl}
   * @memberof UnitConvertServiceImpl
   * @example
   * UnitConvertServiceImpl.getInstance();
   *
   */
  public static getInstance() {
    if (isNil(this.instance)) {
      this.instance = new UnitConvertServiceImpl();
    }

    return this.instance;
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is not implemented
   * @memberof UnitConvertServiceImpl
   * @throws NotImplementedException
   *
   */
  public create(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('UnitConvertServiceImpl.create'),
    );
  }

  /**
   *
   * @param gridInstance
   * @param unitUuid
   * @returns
   * @description This method is used to create a unit convert
   * @memberof UnitConvertServiceImpl
   * @throws ZeroHandlingDataException
   * @example
   * UnitConvertServiceImpl.getInstance().createWithUuid(gridInstance, unitUuid);
   *
   */
  public createWithUuid(gridInstance: GridInstance, unitUuid: string) {
    const unitConverts = gridInstance.getData<UnitConvertCreateRequestEntity>();

    if (isEmpty(unitConverts)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.UNIT_CONVERT_CREATABLE_NOT_FOUND),
      );
    }

    try {
      const unitConvertDTOList = unitConverts.map(unitConvert =>
        UnitConvertCreateRequestDTO.of({
          ...unitConvert,
          unit_uuid: unitUuid,
        }),
      );

      return RepositoryModule.unitConvert().create(unitConvertDTOList);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to update a unit convert
   * @memberof UnitConvertServiceImpl
   * @throws ZeroHandlingDataException
   * @example
   * UnitConvertServiceImpl.getInstance().update(gridInstance);
   *
   */
  public update(gridInstance: GridInstance) {
    const { updatedRows } =
      gridInstance.getModifiedRows<UnitConvertGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.UNIT_CONVERT_UPDATABLE_NOT_FOUND),
      );
    }

    try {
      const unitConvertDTOList = updatedRows.map(unitConvert =>
        UnitConvertUpdateRequestDTO.of(unitConvert),
      );

      return RepositoryModule.unitConvert().update(unitConvertDTOList);
    } catch (error: unknown) {
      return Promise.reject(error);
    }
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to delete a unit convert
   * @memberof UnitConvertServiceImpl
   * @throws ZeroHandlingDataException
   * @example
   * UnitConvertServiceImpl.getInstance().delete(gridInstance);
   *
   */
  public delete(gridInstance: GridInstance) {
    const deletedUnitConverts =
      gridInstance.getCheckedRows<UnitConvertGetResponseEntity>();

    if (isEmpty(deletedUnitConverts)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.UNIT_CONVERT_DELETABLE_NOT_FOUND),
      );
    }

    const unitConvertDTOList = deletedUnitConverts.map(
      UnitConvertDeleteRequestDTO.of,
    );

    return RepositoryModule.unitConvert().delete(unitConvertDTOList);
  }
}
