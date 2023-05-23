import { mesRequest } from '~/apis/request-factory';
import {
  QualityInspectReportUpdateRequestDTO,
  QualityInspectReportDetailUpdateRequestDTO,
  QualityInspectReportResponseEntity,
  QualityInspectReportAmendRequestDTO,
  QualityInspectReportDetailAmendRequestDTO,
} from './model/QualityInspectReportDTO';

export class QualityInspectReportRepository {
  public create(
    header: QualityInspectReportAmendRequestDTO,
    detailList: QualityInspectReportDetailAmendRequestDTO[],
  ) {
    return mesRequest.post<unknown, QualityInspectReportResponseEntity[]>(
      'qms/insps',
      { header, details: detailList },
    );
  }

  public update(
    header: QualityInspectReportUpdateRequestDTO,
    detailList: QualityInspectReportDetailUpdateRequestDTO[],
  ) {
    return mesRequest.put<unknown, QualityInspectReportResponseEntity[]>(
      'qms/insps',
      {
        header,
        details: detailList,
      },
    );
  }
}
