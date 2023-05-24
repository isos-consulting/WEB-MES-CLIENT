import { isEmpty } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import {
  QualityInspectReportAmendRequestDTO,
  QualityInspectReportDetailAmendRequestDTO,
  QualityInspectReportDetailGetResponseEntity,
  QualityInspectReportDetailUpdateRequestDTO,
  QualityInspectReportGetResponseEntity,
  QualityInspectReportUpdateRequestDTO,
} from '../api/model/QualityInspectReportDTO';
import { MESSAGE } from '../core/Message';
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';
import {
  InspectReportService,
  MESService,
  MESWithHeaderDetailService,
} from './MesService';

export class QualityInspectReportService
  implements MESService, MESWithHeaderDetailService, InspectReportService
{
  private static instance: QualityInspectReportService;

  private constructor() {}

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new QualityInspectReportService();
    }

    return this.instance;
  }

  create(gridInstance: GridInstance) {
    return Promise.reject(new Error('QualityInspectReportService.create'));
  }

  update(gridInstance: GridInstance) {
    return Promise.reject(new Error('QualityInspectReportService.update'));
  }

  updateWithHeaderDetail(
    gridInstance: GridInstance,
    header: QualityInspectReportGetResponseEntity,
  ) {
    const { updatedRows } =
      gridInstance.getModifiedRows<QualityInspectReportDetailGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      return Promise.reject(
        new ZeroHandlingDataException(
          MESSAGE.QUALITY_INSPECT_REPORT_UPDATABLE_NOT_FOUND,
        ),
      );
    }

    try {
      const datas =
        gridInstance.getData<QualityInspectReportDetailGetResponseEntity>();

      const qualityInspectReportDTO =
        QualityInspectReportUpdateRequestDTO.of(header);

      const qualityInspectReportDetailList = datas.map(
        QualityInspectReportDetailUpdateRequestDTO.of,
      );

      return RepositoryModule.qualityInspectReport().update(
        qualityInspectReportDTO,
        qualityInspectReportDetailList,
      );
    } catch (error: unknown) {
      return Promise.reject(error);
    }
  }

  amend(
    gridInstance: GridInstance,
    header: QualityInspectReportGetResponseEntity,
  ) {
    const { createdRows, updatedRows } =
      gridInstance.getModifiedRows<QualityInspectReportDetailGetResponseEntity>();

    if (isEmpty(createdRows) && isEmpty(updatedRows)) {
      return Promise.reject(
        new ZeroHandlingDataException(
          MESSAGE.QUALITY_INSPECT_REPORT_AMENDABLE_NOT_FOUND,
        ),
      );
    }

    try {
      const datas =
        gridInstance.getData<QualityInspectReportDetailGetResponseEntity>();

      const qualityInspectReportDTO =
        QualityInspectReportAmendRequestDTO.of(header);

      const qualityInspectReportDetailList = datas
        .filter(({ delete_row }) => delete_row !== true)
        .map(QualityInspectReportDetailAmendRequestDTO.of);

      return RepositoryModule.qualityInspectReport().create(
        qualityInspectReportDTO,
        qualityInspectReportDetailList,
      );
    } catch (error: unknown) {
      return Promise.reject(error);
    }
  }

  delete(gridInstance: GridInstance) {
    return Promise.reject(new Error('QualityInspectReportService.delete'));
  }

  deleteWithHeaderDetail(
    gridInstance: GridInstance,
    header: QualityInspectReportGetResponseEntity,
  ) {
    return Promise.reject(
      new Error('QualityInspectReportService.deleteWithHeaderDetail'),
    );
  }
}
