import { isEmpty } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import {
  EquipmentInspectReportDTO,
  EquipmentInspectReportDeleteRequestDTO,
  EquipmentInspectReportDetailDeleteRequestDTO,
  EquipmentInspectReportDetailGetResponseEntity,
  EquipmentInspectReportGetResponseEntity,
  equipmentInspectReportDetailDTO,
} from '../api/model/EquipmentInspectReportDTO';
import { MESSAGE } from '../core/Message';
import { NotImplementedException } from '../core/NotImplementedException';
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';
import {
  InspectReportService,
  MESService,
  MESWithHeaderDetailService,
} from './MesService';
import { MESEntity } from '../api/model/MESEntity';

export class EquipmentInspectReportService
  implements MESService, MESWithHeaderDetailService, InspectReportService
{
  private static instance: EquipmentInspectReportService;

  private constructor() {}

  public static getInstance(): EquipmentInspectReportService {
    if (!EquipmentInspectReportService.instance) {
      EquipmentInspectReportService.instance =
        new EquipmentInspectReportService();
    }

    return EquipmentInspectReportService.instance;
  }

  public create(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('EquipmentInspectReportService.create'),
    );
  }

  public update(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('EquipmentInspectReportService.update'),
    );
  }

  public updateWithHeaderDetail(
    gridInstance: GridInstance,
    header: EquipmentInspectReportGetResponseEntity,
  ) {
    const { updatedRows } =
      gridInstance.getModifiedRows<EquipmentInspectReportDetailGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      return Promise.reject(
        new ZeroHandlingDataException(
          MESSAGE.EQUIPMENT_INSPECT_REPORT_UPDATABLE_NOT_FOUND,
        ),
      );
    }

    try {
      const equipmentInspectReportDTO = EquipmentInspectReportDTO.from(header);

      const equipmentInspectReportDetailList = updatedRows.map(
        equipmentInspectReportDetailDTO.from,
      );

      return RepositoryModule.equipmentInspectReport().update(
        equipmentInspectReportDTO,
        equipmentInspectReportDetailList,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public delete(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('EquipmentInspectReportService.delete'),
    );
  }

  public deleteWithHeaderDetail(
    gridInstance: GridInstance,
    header: EquipmentInspectReportGetResponseEntity,
  ) {
    const deletedEquipmentInspectItems =
      gridInstance.getCheckedRows<EquipmentInspectReportDetailGetResponseEntity>();

    if (isEmpty(deletedEquipmentInspectItems)) {
      return Promise.reject(
        new ZeroHandlingDataException(
          MESSAGE.EQUIPMENT_INSPECT_REPORT_DELETABLE_NOT_FOUND,
        ),
      );
    }

    try {
      const equipmentInspectReportDeleteRequestDTO =
        EquipmentInspectReportDeleteRequestDTO.from(header);

      const equipmentInspectReportDetailUuidList =
        deletedEquipmentInspectItems.map(
          EquipmentInspectReportDetailDeleteRequestDTO.from,
        );

      return RepositoryModule.equipmentInspectReport().delete(
        equipmentInspectReportDeleteRequestDTO,
        equipmentInspectReportDetailUuidList,
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public amend(gridInstance: GridInstance, header: MESEntity) {
    return Promise.reject(
      new NotImplementedException('EquipmentInspectReportService.amend'),
    );
  }
}
