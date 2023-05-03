export type TReceiveInspHeader = {
  insp_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_cd?: string;
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
  contents?: string;
  max_sample_cnt?: number;
  remark?: string;
};
export type TReceiveInspDetail = {
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
export type TReceiveDetail = {
  insp_detail_type_uuid?: string;
  receive_detail_uuid?: string;
  receive_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  reg_date?: string;
  insp_detail_type_cd?: string;
  insp_detail_type_nm?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  order_detail_uuid?: string;
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
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  unit_qty?: number;
  insp_fg?: boolean;
  insp_result?: string;
  carry_fg?: boolean;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
  barcode?: string;
};
export interface InspectionHandlingTypeCodeSet<T> {
  code: string;
  text: string;
  set: T;
}
export interface InspectionHandlingTypeUuidSet {
  insp_handling_type_uuid: string;
  insp_handling_type_cd: string;
}

export interface InspectionPostPayloadHeader {
  factory_uuid: string;
  receive_detail_uuid: string;
  insp_type_uuid: string;
  insp_detail_type_uuid: string;
  insp_handling_type_uuid: string;
  insp_uuid: string;
  unit_uuid: string;
  prod_uuid: string;
  lot_no: string;
  emp_uuid: string;
  reg_date: string;
  insp_result_fg: boolean;
  insp_qty: number;
  pass_qty: number;
  reject_qty: number;
  reject_uuid: string;
  to_store_uuid: string;
  to_location_uuid: string;
  reject_store_uuid: string;
  reject_location_uuid: string;
  remark: string;
}

export interface InspectionSample {
  sample_no: number;
  insp_result_fg: boolean;
  insp_value: number;
}
export interface InspectionPostPayloadDetails {
  factory_uuid: string;
  insp_detail_uuid: string;
  insp_result_fg: boolean;
  remark: string;
  values: InspectionSample[];
}

export interface InspectionPostAPIPayload {
  header: InspectionPostPayloadHeader;
  details: InspectionPostPayloadDetails[];
}
