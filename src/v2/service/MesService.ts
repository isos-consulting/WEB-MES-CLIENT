import { MESEntity } from '../api/model/MESEntity';
import { GridInstance } from '../core/ToastGrid';

export interface MESService {
  create(gridInstance: GridInstance): Promise<MESEntity[]>;
  update(gridInstance: GridInstance): Promise<MESEntity[]>;
  delete(gridInstance: GridInstance): Promise<MESEntity[]>;
}

export interface MESWithUuidService {
  createWithUuid(
    gridInstance: GridInstance,
    uuid: string,
  ): Promise<MESEntity[]>;
}

export interface MESWithHeaderDetailService {
  updateWithHeaderDetail(
    gridInstance: GridInstance,
    header: MESEntity,
  ): Promise<MESEntity[]>;

  deleteWithHeaderDetail(
    gridInstance: GridInstance,
    header: MESEntity,
  ): Promise<MESEntity[]>;
}

export interface InspectReportService {
  amend(gridInstance: GridInstance, header: MESEntity): Promise<MESEntity[]>;
}
