import { mesRequest } from '~/apis/request-factory';
import {
  EquipmentInspectReportDTO,
  EquipmentInspectReportDeleteRequestDTO,
  EquipmentInspectReportDetailDeleteRequestDTO,
  EquipmentInspectReportResponseEntity,
  equipmentInspectReportDetailDTO,
} from './model/EquipmentInspectReportDTO';

export class EquipmentInspectReportRepository {
  public update(
    header: EquipmentInspectReportDTO,
    detailList: equipmentInspectReportDetailDTO[],
  ) {
    return mesRequest.put<unknown, EquipmentInspectReportResponseEntity[]>(
      'eqm/insps',
      {
        header,
        details: detailList,
      },
    );
  }

  public delete(
    header: EquipmentInspectReportDeleteRequestDTO,
    detailList: EquipmentInspectReportDetailDeleteRequestDTO[],
  ) {
    return mesRequest.delete<unknown, EquipmentInspectReportResponseEntity[]>(
      'eqm/insps',
      {
        data: {
          header,
          details: detailList,
        },
      },
    );
  }
}
