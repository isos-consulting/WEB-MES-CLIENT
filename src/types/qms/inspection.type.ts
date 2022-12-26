import {
  InsepctionDataGridChange,
  InspectionDataGrid,
  InspectionInputForm,
} from '~/functions/qms/InspectionReportViewController';

export type InsepctionDataGridOnChangeEvent = {
  changes: InsepctionDataGridChange[];
  instance: InspectionDataGrid;
};

export type InspectionSampleComponentInstances = {
  gridInstance: any;
  inputInstance: InspectionInputForm;
};

export type GetMaxSampleCntParams = {
  insp_detail_type_uuid: string;
  work_uuid: string;
};
export type GetMaxSampleCntResponse = {
  datas: any;
  header: any;
  details: any;
  maxSampleCnt: number;
};

export type HeaderSaveOptionParams = {
  work_uuid?: string;
  prod_uuid?: string;
  lot_no?: string;
};
