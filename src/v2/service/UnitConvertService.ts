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
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';

export class UnitConvertService {
  private static instance: UnitConvertService;
  private constructor() {}

  /**
   * @description This method is used to get a instance of UnitConvertService
   * @returns {UnitConvertService}
   * @memberof UnitConvertService
   * @example
   * UnitConvertService.getInstance();
   *
   */
  public static getInstance() {
    if (isNil(this.instance)) {
      this.instance = new UnitConvertService();
    }

    return this.instance;
  }

  /**
   *
   * @param gridInstance
   * @param unitUuid
   * @returns
   * @description This method is used to create a unit convert
   * @memberof UnitConvertService
   * @throws ZeroHandlingDataException
   * @example
   * UnitConvertService.getInstance().createUnitConvert(gridInstance, unitUuid);
   *
   */
  public createUnitConvert(gridInstance: GridInstance, unitUuid: string) {
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
   * @memberof UnitConvertService
   * @throws ZeroHandlingDataException
   * @example
   * UnitConvertService.getInstance().updateUnitConvert(gridInstance);
   *
   */
  public updateUnitConvert(gridInstance: GridInstance) {
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
   * @memberof UnitConvertService
   * @throws ZeroHandlingDataException
   * @example
   * UnitConvertService.getInstance().deleteUnitConvert(gridInstance);
   *
   */
  public deleteUnitConvert(gridInstance: GridInstance) {
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
