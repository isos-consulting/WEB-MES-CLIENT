import {
  InspectionDataGridChange,
  InspectionDataGrid,
  InspectionInputForm,
} from '~/functions/qms/InspectionReportViewController';

export type InspectionDataGridOnChangeEvent = {
  changes: InspectionDataGridChange[];
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

export type TGetPrdWork = {
  work_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
  order_uuid?: string;
  order_no?: string;
  seq?: number;
  proc_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
  workings_uuid?: string;
  workings_cd?: string;
  workings_nm?: string;
  equip_uuid?: string;
  equip_cd?: string;
  equip_nm?: string;
  prod_uuid?: string;
  prod_no?: string;
  prod_nm?: string;
  item_type_uuid?: string;
  item_type_cd?: string;
  item_type_nm?: string;
  prod_type_uuid?: string;
  prod_type_cd?: string;
  prod_type_nm?: string;
  model_uuid?: string;
  model_cd?: string;
  model_nm?: string;
  rev?: string;
  prod_std?: string;
  unit_uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
  lot_no?: string;
  order_qty?: number;
  total_qty?: number;
  qty?: number;
  reject_qty?: number;
  start_date?: string;
  end_date?: string;
  work_time?: number;
  shift_uuid?: string;
  shift_nm?: string;
  worker_cnt?: number;
  worker_nm?: string;
  complete_state?: string;
  complete_fg?: boolean;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  order_remark?: string;
  remark?: string;
};

export type TGetQmsProcInspIncludeDetailsHeader = {
  insp_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_uuid?: string;
  insp_type_nm?: string;
  insp_no?: string;
  prod_uuid?: string;
  prod_no?: string;
  prod_nm?: string;
  item_type_uuid?: string;
  item_type_cd?: string;
  item_type_nm?: string;
  prod_type_uuid?: string;
  prod_type_cd?: string;
  prod_type_nm?: string;
  model_uuid?: string;
  model_cd?: string;
  model_nm?: string;
  rev?: string;
  prod_std?: string;
  unit_uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
  reg_date?: string;
  apply_date?: string;
  apply_fg?: boolean;
  apply_state?: string;
  contents?: string;
  max_sample_cnt?: number;
  remark?: string;
};

export type TGetQmsProcInspIncludeDetailsDetail = {
  insp_detail_uuid?: string;
  insp_uuid?: string;
  seq?: number;
  insp_no?: string;
  insp_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_item_uuid?: string;
  insp_item_cd?: string;
  insp_item_nm?: string;
  insp_item_type_uuid?: string;
  insp_item_type_cd?: string;
  insp_item_type_nm?: string;
  insp_item_desc?: string;
  spec_std?: string;
  spec_min?: number;
  spec_max?: number;
  insp_method_uuid?: string;
  insp_method_cd?: string;
  insp_method_nm?: string;
  insp_tool_uuid?: string;
  insp_tool_cd?: string;
  insp_tool_nm?: string;
  sortby?: number;
  position_no?: number;
  special_property?: string;
  sample_cnt?: number;
  insp_cycle?: string;
  remark?: string;
};

export type TGetQmsProcInspIncludeDetails = {
  header?: TGetQmsProcInspIncludeDetailsHeader;
  details?: TGetQmsProcInspIncludeDetailsDetail[];
};

export type TGetQmsProcInspResult = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_uuid?: string;
  insp_type_nm?: string;
  insp_detail_type_uuid?: string;
  insp_detail_type_nm?: string;
  work_uuid?: string;
  seq?: number;
  insp_uuid?: string;
  insp_no?: string;
  prod_uuid?: string;
  prod_no?: string;
  prod_nm?: string;
  item_type_uuid?: string;
  item_type_cd?: string;
  item_type_nm?: string;
  prod_type_uuid?: string;
  prod_type_cd?: string;
  prod_type_nm?: string;
  model_uuid?: string;
  model_cd?: string;
  model_nm?: string;
  rev?: string;
  prod_std?: string;
  unit_uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
  lot_no?: string;
  emp_uuid?: string;
  emp_cd?: string;
  emp_nm?: string;
  reg_date?: string;
  insp_result_fg?: boolean;
  insp_result_state?: string;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  remark?: string;
};

export type TGetQmsProcInspResultIncludeDetailsHeader = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_uuid?: string;
  insp_type_nm?: string;
  insp_detail_type_uuid?: string;
  insp_detail_type_nm?: string;
  work_uuid?: string;
  seq?: number;
  insp_uuid?: string;
  insp_no?: string;
  prod_uuid?: string;
  prod_no?: string;
  prod_nm?: string;
  item_type_uuid?: string;
  item_type_cd?: string;
  item_type_nm?: string;
  prod_type_uuid?: string;
  prod_type_cd?: string;
  prod_type_nm?: string;
  model_uuid?: string;
  model_cd?: string;
  model_nm?: string;
  rev?: string;
  prod_std?: string;
  unit_uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
  lot_no?: string;
  emp_uuid?: string;
  emp_cd?: string;
  emp_nm?: string;
  reg_date?: string;
  insp_result_fg?: boolean;
  insp_result_state?: string;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  max_sample_cnt?: number;
  remark?: string;
};

export type TGetQmsProcInspResultIncludeDetailsDetail = {
  insp_result_detail_info_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_result_uuid?: string;
  insp_detail_uuid?: string;
  insp_item_type_uuid?: string;
  insp_item_type_cd?: string;
  insp_item_type_nm?: string;
  insp_item_uuid?: string;
  insp_item_cd?: string;
  insp_item_nm?: string;
  insp_item_desc?: string;
  spec_std?: string;
  spec_min?: number;
  spec_max?: number;
  insp_method_uuid?: string;
  insp_method_cd?: string;
  insp_method_nm?: string;
  insp_tool_uuid?: string;
  insp_tool_cd?: string;
  insp_tool_nm?: string;
  sample_cnt?: number;
  insp_cycle?: string;
  sortby?: number;
  insp_result_fg?: boolean;
  insp_result_state?: string;
  remark?: string;
  xn_insp_result_detail_value_uuid?: string;
  xn_sample_no?: number;
  xn_insp_value?: number;
  xn_insp_result_fg?: boolean;
  xn_insp_result_state?: string;
};

export type TGetQmsProcInspResultIncludeDetails = {
  header?: TGetQmsProcInspResultIncludeDetailsHeader;
  details?: TGetQmsProcInspResultIncludeDetailsDetail[];
};

export type TPutQmsProcInspResultsHeader = {
  uuid: string;
  emp_uuid: string;
  insp_result_fg: boolean;
  insp_qty: number;
  pass_qty: number;
  reject_qty: number;
  remark: string;
};

export type TPutQmsProcInspResultsDetailValue = {
  uuid: string;
  delete_fg: boolean;
  sample_no: number;
  insp_result_fg: boolean;
  insp_value: number;
};

export type TPutQmsProcInspDeleteResultsDetailValue = {
  uuid: string;
  delete_fg: boolean;
  sample_no: number;
};

export type TPutQmsProcInspResultsDetail = {
  values?:
    | TPutQmsProcInspResultsDetailValue[]
    | TPutQmsProcInspDeleteResultsDetailValue[];
  factory_uuid?: string;
  uuid: string;
  insp_result_fg: boolean;
  remark: string;
};

export type TPutQmsFinalInspResult = {
  header?: TPutQmsProcInspResultsHeader;
  details?: TPutQmsProcInspResultsDetail[];
};
