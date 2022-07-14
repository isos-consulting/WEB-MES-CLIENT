//#region 🔷 INV Types

//#region 🔶 Store Type

type TranType =
  | 'all'
  | 'matIncome'
  | 'matReturn'
  | 'matRelease'
  | 'prdReturn'
  | 'prdOutput'
  | 'prdInput'
  | 'prdReject'
  | 'salIncome'
  | 'salRelease'
  | 'salOutgo'
  | 'salReturn'
  | 'outIncome'
  | 'outRelease'
  | 'inventory'
  | 'invMove'
  | 'invReject'
  | 'qmsReceiveInspReject'
  | 'qmsFinalInspIncome'
  | 'qmsFinalInspReject'
  | 'qmsRework'
  | 'qmsDisposal'
  | 'qmsReturn'
  | 'qmsDisassemble'
  | 'qmsDisassembleIncome'
  | 'qmsDisassembleReturn'
  | 'etcIncome'
  | 'etcRelease';

type TGetInvStoresTotalHistoryParams = {
  stock_type: 'all' | 'available' | 'reject' | 'return' | 'outgo' | 'finalIsnp';
  grouped_type: 'all' | 'factory' | 'store' | 'lotNo' | 'location';
  start_date: string;
  end_date: string;
  reject_fg: boolean;
  factory_uuid: string;
  store_uuid?: string;
};

type TGetInvStoresTotalHistory = {
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  lot_no?: string;
  qty?: number;
  store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  basic_stock?: number;
  in_qty?: number;
  out_qty?: number;
  update_qty?: number;
  final_stock?: number;
};

type TGetInvStoresIndividualHistoryParams = {
  start_date: string;
  end_date: string;
  factory_uuid: string;
  store_uuid: string;
};

type TGetInvStoresIndividualHistory = {
  reg_date?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  lot_no?: string;
  store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  tran_cd?: string;
  tran_nm?: string;
  basic_stock?: number;
  in_qty?: number;
  out_qty?: number;
  update_qty?: number;
  final_stock?: number;
};

type TGetInvStoresTypeHistoryParams = {
  grouped_type: 'all' | 'factory' | 'store' | 'lotNo' | 'location';
  start_date: string;
  end_date: string;
  reject_fg: boolean;
  factory_uuid: string;
  store_uuid?: string;
};

type TGetInvStoresTypeHistory = {
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  lot_no?: string;
  store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  tran_type_cd_in_qty?: number;
  tran_type_cd_out_qty?: number;
};

type TGetInvStoresHistoryByTransactionParams = {
  tran_type: TranType;
  start_date: string;
  end_date: string;
  factory_uuid: string;
  store_uuid?: string;
  location_uuid?: string;
};

type TGetInvStoresHistoryByTransaction = {
  tran_uuid?: string;
  inout_state?: string;
  tran_cd?: string;
  tran_nm?: string;
  reg_date?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  lot_no?: string;
  qty?: number;
  stock?: number;
  store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
};

type TGetInvStoresStocksReturnParams = {
  exclude_zero_fg?: boolean;
  exclude_minus_fg?: boolean;
  reg_date: string;
  factory_uuid: string;
  partner_uuid: string;
  store_uuid?: string;
  location_uuid?: string;
};

type TGetInvStoresStocksReturn = {
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  lot_no?: string;
  qty?: number;
  store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  price?: number;
  exchange?: string;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  price_type_uuid?: string;
  price_type_cd?: string;
  price_type_nm?: string;
  unit_uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
  price_unit_uuid?: string;
  price_unit_cd?: string;
  price_unit_nm?: string;
  convert_value?: number;
  return_qty?: number;
};

type TGetInvStoresStockParams = {
  stock_type: 'all' | 'available' | 'reject' | 'return' | 'outgo' | 'finalIsnp';
  grouped_type: 'all' | 'factory' | 'store' | 'lotNo' | 'location';
  price_type: 'all' | 'purchase' | 'sales';
  exclude_zero_fg?: boolean;
  exclude_minus_fg?: boolean;
  reg_date: string;
  factory_uuid: string;
  partner_uuid?: string;
  store_uuid?: string;
  location_uuid?: string;
  prod_uuid?: string;
  reject_uuid?: string;
  lot_no?: string;
};

type TGetInvStoresStock = {
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  lot_no?: string;
  qty?: number;
  store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  price_type_uuid?: string;
  price_type_cd?: string;
  price_type_nm?: string;
  exchange?: string;
};

type TGetInvStoreParams = {
  uuid?: string;
};

type TGetInvStoresParams = {
  factory_uuid?: string;
  store_uuid?: string;
  prod_uuid?: string;
  tran_type: TranType;
  start_date: string;
  end_date: string;
};

type TGetInvStore = {
  inv_store_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  lot_no?: string;
  qty?: number;
  inout_state?: string;
  store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  remark?: string;
};

type TPostInvStore = {
  factory_uuid?: string;
  reg_date?: string;
  prod_uuid?: string;
  lot_no?: string;
  qty?: number;
  store_uuid?: string;
  location_uuid?: string;
  reject_uuid?: string;
  remark?: string;
};

type TPutInvStore = {
  uuid?: string;
  remark?: string;
};

type TDeleteInvStore = {
  uuid?: string;
};

//#endregion

//#region 🔶 StockReject Type

type TGetInvStockRejectParams = {
  factory_uuid?: string;
  from_store_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetInvStockRejectsParams = {
  uuid?: string;
};

type TGetInvStockReject = {
  stock_reject_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  lot_no?: string;
  qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
  barcode?: string;
};

type TPostInvStockReject = {
  factory_uuid?: string;
  reg_date?: string;
  prod_uuid?: string;
  reject_uuid?: string;
  lot_no?: string;
  qty?: number;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
};

type TPutInvStockReject = {
  uuid?: string;
  qty?: number;
  remark?: string;
};

type TDeleteInvStockReject = {
  uuid?: string;
};

//#endregion

//#region 🔶 Move Type

type TGetInvMoveParams = {
  uuid?: string;
};

type TGetInvMovesParams = {
  factory_uuid?: string;
  from_store_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetInvMove = {
  move_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
};

type TPostInvMove = {
  factory_uuid?: string;
  reg_date?: string;
  prod_uuid?: string;
  lot_no?: string;
  qty?: number;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
};

type TPutInvMove = {
  uuid?: string;
  qty?: number;
  remark?: string;
};

type TDeleteInvMove = {
  uuid?: string;
};

//#endregion

//#endregion

//#region 🔷 MAT Types

//#region 🔶 Release Type

type TGetMatReleasesreportParams = {
  factory_uuid?: string;
  sort_type: 'store' | 'prod' | 'date';
  start_date?: string;
  end_date?: string;
};

type TGetMatReleasesreport = {
  release_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  demand_qty?: number;
  lot_no?: string;
  qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  proc_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
  equip_uuid?: string;
  equip_cd?: string;
  equip_nm?: string;
  dept_uuid?: string;
  dept_cd?: string;
  dept_nm?: string;
  remark?: string;
};

type TGetMatReleaseparams = {
  uuid?: string;
};

type TGetMatReleasesparams = {
  factory_uuid?: string;
  start_date?: string;
  end_date?: string;
};

type TGetMatRelease = {
  release_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  qty?: number;
  demand_uuid?: string;
  demand_type_cd?: string;
  demand_type_nm?: string;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
  barcode?: string;
};

type TPostMatRelease = {
  factory_uuid?: string;
  reg_date?: string;
  prod_uuid?: string;
  lot_no?: string;
  qty?: number;
  demand_uuid?: string;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
  barcode?: string;
};

type TPutMatRelease = {
  uuid: string;
  qty?: number;
  remark?: string;
};

type TDeleteMatRelease = {
  uuid: string;
};

//#endregion

//#region 🔶 Return Type

type TGetMatReturnsreportParams = {
  factory_uuid?: string;
  sort_type: 'store' | 'prod' | 'date';
  start_date?: string;
  end_date?: string;
};

type TGetMatReturnsreport = {
  return_detail_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  reg_date?: string;
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
  qty?: number;
  convert_value?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  supply_price?: number;
  tax?: number;
  total_price?: number;
  receive_qty?: number;
  remark?: string;
};

type TGetMatReturnsParams = {
  factory_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetMatReturnParams = {
  uuid?: string;
};

type TGetMatReturn = {
  return_detail_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  supplier_uuid?: string;
  supplier_cd?: string;
  supplier_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  receive_stmt_no?: string;
  receive_date?: string;
  receive_total_price?: number;
  receive_total_qty?: number;
  remark?: string;
};

type TGetMatReturnDetailsParams = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetMatReturnDetailParams = {
  uuid?: string;
};

type TGetMatReturnDetail = {
  return_detail_uuid?: string;
  return_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  receive_detail_uuid?: string;
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
  receive_qty?: number;
  qty?: number;
  convert_value?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  remark?: string;
  barcode?: string;
};

type TGetMatReturnIncludeDetailsParams = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetMatReturnIncludeDetail = {
  header?: TGetMatReturnIncludeDetailHeader;
  details?: TGetMatReturnIncludeDetailsDetail[];
};

type TGetMatReturnIncludeDetailHeader = {
  return_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  supplier_uuid?: string;
  supplier_cd?: string;
  supplier_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  receive_stmt_no?: string;
  receive_date?: string;
  receive_total_price?: number;
  receive_total_qty?: number;
  remark?: string;
};

type TGetMatReturnIncludeDetailsDetail = {
  return_detail_uuid?: string;
  return_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  receive_detail_uuid?: string;
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
  receive_qty?: number;
  qty?: number;
  convert_value?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  remark?: string;
  barcode?: string;
};

type TPostMatReturn = {
  header?: TPostMatReturnHeader;
  details?: TPostMatReturnDetail[];
};

type TPostMatReturnHeader = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
  supplier_uuid?: string;
  stmt_no?: string;
  reg_date?: string;
  receive_uuid?: string;
  remark?: string;
};

type TPostMatReturnDetail = {
  return_uuid?: string;
  factory_uuid?: string;
  prod_uuid?: string;
  unit_uuid?: string;
  lot_no?: string;
  qty?: number;
  convert_value?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  receive_detail_uuid?: string;
  from_store_uuid?: string;
  from_location_uuid?: string;
  remark?: string;
  barcode?: string;
};

type TPutMatReturn = {
  header?: TPutMatReturnHeader;
  details?: TPutMatReturnDetail[];
};

type TPutMatReturnHeader = {
  uuid?: string;
  supplier_uuid?: string;
  stmt_no?: string;
  remark?: string;
};

type TPutMatReturnDetail = {
  uuid?: string;
  qty?: number;
  convert_value?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  remark?: string;
};

type TDeleteMatReturn = {
  header?: TDeleteMatReturnHeader;
  details?: TDeleteMatReturnDetail[];
};

type TDeleteMatReturnHeader = {
  uuid?: string;
};

type TDeleteMatReturnDetail = {
  uuid?: string;
};

//#endregion

//#region 🔶 Order Type

type TGetMatOrdersReportParams = {
  factory_uuid?: string;
  complete_state: 'all' | 'complete' | 'incomplete';
  sort_type: 'partner' | 'prod' | 'date';
  start_reg_date?: string;
  end_reg_date?: string;
  start_due_date?: string;
  end_due_date?: string;
};

type TGetMatOrdersReport = {
  order_detail_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  reg_date?: string;
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
  due_date?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  supply_price?: number;
  tax?: number;
  total_price?: number;
  receive_qty?: number;
  balance?: number;
  complete_state?: string;
  remark?: string;
};

type TGetMatOrderParams = {
  uuid: string;
};

type TGetMatOrdersParams = {
  factory_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetMatOrder = {
  order_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  remark?: string;
};

type TGetMatOrderDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
  complete_state: 'all' | 'complete' | 'incomplete';
  start_due_date?: string;
  end_due_date?: string;
};

type TGetMatOrderDetail = {
  order_detail_uuid?: string;
  order_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  qty?: number;
  balance?: number;
  complete_state?: string;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  unit_qty?: number;
  due_date?: string;
  remark?: string;
};

type TGetMatOrderIncludeDetailsParams = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
  complete_state: 'all' | 'complete' | 'incomplete';
  start_due_date?: string;
  end_due_date?: string;
};

type TGetMatOrderIncludeDetail = {
  header?: TGetMatOrderIncludeDetailsHeader;
  details?: TGetMatOrderIncludeDetailsDetail[];
};

type TGetMatOrderIncludeDetailsHeader = {
  order_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  remark?: string;
};

type TGetMatOrderIncludeDetailsDetail = {
  order_detail_uuid?: string;
  order_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  qty?: number;
  balance?: number;
  complete_state?: string;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  unit_qty?: number;
  due_date?: string;
  remark?: string;
};

type TPostMatOrder = {
  header?: TPostMatOrdersHeader;
  details?: TPostMatOrdersDetail[];
};

type TPostMatOrdersHeader = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
  stmt_no?: string;
  reg_date?: string;
  remark?: string;
};

type TPostMatOrdersDetail = {
  order_uuid?: string;
  factory_uuid?: string;
  prod_uuid?: string;
  unit_uuid?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  due_date?: string;
  complete_fg?: boolean;
  remark?: string;
};

type TPutMatOrder = {
  header?: TPutMatOrdersHeader;
  details?: TPutMatOrdersDetail[];
};

type TPutMatOrdersHeader = {
  uuid?: string;
  stmt_no?: string;
  remark?: string;
};

type TPutMatOrdersDetail = {
  uuid?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  due_date?: string;
  complete_fg?: boolean;
  remark?: string;
};

type TDeleteMatOrder = {
  header?: TDeleteMatOrdersHeader;
  details?: TDeleteMatOrdersDetail[];
};

type TDeleteMatOrdersHeader = {
  uuid?: string;
};

type TDeleteMatOrdersDetail = {
  uuid?: string;
};

type TPutMatOrderDetailsComplete = {
  uuid: string;
  complete_fg: boolean;
};

//#endregion

//#region 🔶 Receive Type

type TGetMatReceiveLotTrackingParams = {
  factory_uuid: string;
  prod_uuid: string;
  lot_no: string;
};

type TGetMatReceiveLotTracking = {
  proc_cd?: string;
  proc_nm?: string;
  equip_cd?: string;
  equip_nm?: string;
  input_prod_no?: string;
  input_item_type_cd?: string;
  input_item_type_nm?: string;
  input_lot_no?: string;
  work_date?: string;
  work_prod_no?: string;
  work_item_type_cd?: string;
  work_item_type_nm?: string;
  work_lot_no?: string;
  partner_cd?: string;
  partner_nm?: string;
  outgo_date?: string;
  outgo_qty?: number;
  sortby?: string;
  level?: string;
};

type TGetMatReceiveReportParams = {
  factory_uuid?: string;
  sort_type: 'partner' | 'prod' | 'date';
  start_date?: string;
  end_date?: string;
};

type TGetMatReceiveReport = {
  receive_detail_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  reg_date?: string;
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
  order_qty?: number;
  lot_no?: string;
  manufactured_lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  supply_price?: number;
  tax?: number;
  total_price?: number;
  income_qty?: number;
  insp_state?: string;
  insp_result_state?: string;
  reject_qty?: number;
  remark?: string;
};

type TGetMatReceiveParams = {
  uuid: string;
};

type TGetMatReceivesParams = {
  factory_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetMatReceive = {
  receive_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  supplier_uuid?: string;
  supplier_cd?: string;
  supplier_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  order_stmt_no?: string;
  order_date?: string;
  order_total_price?: number;
  order_total_qty?: number;
  remark?: string;
};

type TGetMatReceiveDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetMatReceiveDetail = {
  receive_detail_uuid?: string;
  receive_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
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
  manufactured_lot_no?: string;
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
  income_uuid?: string;
};

type TGetMatReceiveIncludeDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetMatReceiveIncludeDetail = {
  header?: TGetMatOrderIncludeDetailsHeader;
  details?: TGetMatOrderIncludeDetailsDetail[];
};

type TGetMatReceiveIncludeDetailsHeader = {
  receive_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  supplier_uuid?: string;
  supplier_cd?: string;
  supplier_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  order_stmt_no?: string;
  order_date?: string;
  order_total_price?: number;
  order_total_qty?: number;
  remark?: string;
};

type TGetMatReceiveIncludeDetailsDetail = {
  receive_detail_uuid?: string;
  receive_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
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
  manufactured_lot_no?: string;
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
  income_uuid?: string;
};

type TPostMatReceive = {
  header?: TPostMatReceivesHeader;
  details?: TPostMatReceivesDetail[];
};

type TPostMatReceivesHeader = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
  supplier_uuid?: string;
  order_uuid?: string;
  stmt_no?: string;
  reg_date?: string;
  remark?: string;
};

type TPostMatReceivesDetail = {
  receive_uuid?: string;
  factory_uuid?: string;
  prod_uuid?: string;
  unit_uuid?: string;
  lot_no?: string;
  manufactured_lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  insp_fg?: boolean;
  carry_fg: boolean;
  order_detail_uuid: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
  barcode?: string;
};

type TPutMatReceive = {
  header?: TPutMatReceivesHeader;
  details?: TPutMatReceivesDetail[];
};

type TPutMatReceivesHeader = {
  uuid?: string;
  supplier_uuid?: string;
  stmt_no?: string;
  remark?: string;
};

type TPutMatReceivesDetail = {
  uuid?: string;
  manufactured_lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  carry_fg?: boolean;
  remark?: string;
};

type TDeleteMatReceive = {
  header?: TDeleteMatReceivesHeader;
  details?: TDeleteMatReceivesDetail[];
};

type TDeleteMatReceivesHeader = {
  uuid?: string;
};

type TDeleteMatReceivesDetail = {
  uuid?: string;
};

//#endregion

//#endregion

//#region 🔷 OUT Types

//#region 🔶 Receive Type

type TGetOutReceivesreportParams = {
  factory_uuid?: string;
  sort_type: 'partner' | 'prod' | 'date' | 'none';
  start_reg_date?: string;
  end_reg_date?: string;
  start_due_date?: string;
  end_due_date?: string;
};

type TGetOutReceivesreport = {
  receive_detail_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  reg_date?: string;
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
  order_qty?: number;
  lot_no?: string;
  manufactured_lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid: string;
  money_unit_cd: string;
  money_unit_nm: string;
  exchange: string;
  supply_price: number;
  tax: number;
  total_price: number;
  income_qty: number;
  insp_state: string;
  insp_result_state: string;
  reject_qty: number;
  remark: string;
};

type TGetOutReceiveParams = {
  uuid: string;
};

type TGetOutReceivesParams = {
  factory_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetOutReceive = {
  receive_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  supplier_uuid?: string;
  supplier_cd?: string;
  supplier_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  remark?: string;
};

type TGetOutReceiveDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetOutReceiveDetailParams = {
  uuid: string;
};

type TGetOutReceiveDetail = {
  receive_detail_uuid?: string;
  receive_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
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
  manufactured_lot_no?: string;
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
  income_uuid?: string;
};

type TGetOutReceiveIncludeDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetOutReceiveIncludeDetail = {
  header?: TGetMatOrderIncludeDetailsHeader;
  details?: TGetMatOrderIncludeDetailsDetail[];
};

type TGetOutReceiveIncludeDetailsHeader = {
  receive_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  supplier_uuid?: string;
  supplier_cd?: string;
  supplier_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  remark?: string;
};

type TGetOutReceiveIncludeDetailsDetail = {
  receive_detail_uuid?: string;
  receive_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
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
  manufactured_lot_no?: string;
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
  income_uuid?: string;
};

type TPostOutReceive = {
  header?: TPostOutReceivesHeader;
  details?: TPostOutReceivesDetail[];
};

type TPostOutReceivesHeader = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
  supplier_uuid?: string;
  order_uuid?: string;
  stmt_no?: string;
  reg_date?: string;
  remark?: string;
};

type TPostOutReceivesDetail = {
  receive_uuid?: string;
  factory_uuid?: string;
  prod_uuid?: string;
  unit_uuid?: string;
  lot_no?: string;
  manufactured_lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  insp_fg?: boolean;
  carry_fg: boolean;
  order_detail_uuid: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
  barcode?: string;
};

type TPutOutReceive = {
  header?: TPutOutReceivesHeader;
  details?: TPutOutReceivesDetail[];
};

type TPutOutReceivesHeader = {
  uuid?: string;
  supplier_uuid?: string;
  stmt_no?: string;
  remark?: string;
};

type TPutOutReceivesDetail = {
  uuid?: string;
  manufactured_lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  carry_fg?: boolean;
  remark?: string;
};

type TDeleteOutReceive = {
  header?: TDeleteOutReceivesHeader;
  details?: TDeleteOutReceivesDetail[];
};

type TDeleteOutReceivesHeader = {
  uuid?: string;
};

type TDeleteOutReceivesDetail = {
  uuid?: string;
};

//#endregion

//#region 🔶 Release Type

type TGetOutReleasesreportParams = {
  factory_uuid?: string;
  sort_type: 'partner' | 'prod' | 'date' | 'none';
  start_reg_date?: string;
  end_reg_date?: string;
  start_due_date?: string;
  end_due_date?: string;
};

type TGetOutReleasesreport = {
  order_detail_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  reg_date?: string;
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
  order_qty?: number;
  lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  supply_price?: number;
  tax?: number;
  total_price?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  remark?: string;
};

type TGetOutReleaseparams = {
  uuid: string;
};

type TGetOutReleasesparams = {
  factory_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetOutRelease = {
  release_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  delivery_uuid?: string;
  delivery_cd?: string;
  delivery_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  remark?: string;
};

type TGetOutReleaseDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetOutReleaseDetailParams = {
  uuid: string;
};

type TGetOutReleaseDetail = {
  release_detail_uuid?: string;
  release_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
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
  from_store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  from_location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  remark?: string;
  barcode?: string;
};

type TGetOutReleaseIncludeDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetOutReleaseIncludeDetail = {
  header?: TGetOutReleaseIncludeDetailsHeader;
  details?: TGetOutReleaseIncludeDetailsDetail[];
};

type TGetOutReleaseIncludeDetailsHeader = {
  release_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  delivery_uuid?: string;
  delivery_cd?: string;
  delivery_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  remark?: string;
};

type TGetOutReleaseIncludeDetailsDetail = {
  release_detail_uuid?: string;
  release_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
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
  from_store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  from_location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  remark?: string;
  barcode?: string;
};

type TPostOutRelease = {
  header?: TPostOutReleasesHeader;
  details?: TPostOutReleasesDetail[];
};

type TPostOutReleasesHeader = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
  supplier_uuid?: string;
  stmt_no?: string;
  reg_date?: string;
  remark?: string;
};

type TPostOutReleasesDetail = {
  release_uuid?: string;
  factory_uuid?: string;
  prod_uuid?: string;
  unit_uuid?: string;
  lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  order_detail_uuid: string;
  from_store_uuid?: string;
  from_location_uuid?: string;
  remark?: string;
  barcode?: string;
};

type TPutOutRelease = {
  header?: TPutOutReleasesHeader;
  details?: TPutOutReleasesDetail[];
};

type TPutOutReleasesHeader = {
  uuid?: string;
  delivery_uuid?: string;
  stmt_no?: string;
  remark?: string;
};

type TPutOutReleasesDetail = {
  uuid?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  remark?: string;
};

type TDeleteOutRelease = {
  header?: TDeleteOutReleasesHeader;
  details?: TDeleteOutReleasesDetail[];
};

type TDeleteOutReleasesHeader = {
  uuid?: string;
};

type TDeleteOutReleasesDetail = {
  uuid?: string;
};

//#endregion

//#endregion

//#region 🔷 PRD Types

//#region 🔶 Work Types

type TPutPrdWorksCancelComplete = {
  uuid?: string;
};

type TPutPrdWorksComplete = {
  uuid?: string;
  end_date?: string;
};

type TGetPrdWorksReportParams = {
  factory_uuid?: string;
  sort_type: 'proc' | 'prod' | 'date';
  start_date?: string;
  end_date?: string;
};

type TGetPrdWorksReport = {
  work_uuid?: string;
  order_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  shift_uuid?: string;
  shift_nm?: string;
  reg_date?: string;
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
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
};

type TGetPrdWorkParams = {
  uuid: string;
};

type TGetPrdWorksParams = {
  factory_uuid?: string;
  order_uuid?: string;
  complete_fg?: boolean;
  start_date?: string;
  end_date?: string;
};

type TGetPrdWork = {
  work_uuid: string;
  factory_uuid: string;
  factory_cd: string;
  factory_nm: string;
  reg_date: string;
  order_uuid: string;
  order_no: string;
  seq: number;
  proc_uuid: string;
  proc_cd: string;
  proc_nm: string;
  workings_uuid: string;
  workings_cd: string;
  workings_nm: string;
  equip_uuid: string;
  equip_cd: string;
  equip_nm: string;
  prod_uuid: string;
  prod_no: string;
  prod_nm: string;
  item_type_uuid: string;
  item_type_cd: string;
  item_type_nm: string;
  prod_type_uuid: string;
  prod_type_cd: string;
  prod_type_nm: string;
  model_uuid: string;
  model_cd: string;
  model_nm: string;
  rev: string;
  prod_std: string;
  unit_uuid: string;
  unit_cd: string;
  unit_nm: string;
  lot_no: string;
  order_qty: number;
  total_qty: number;
  qty: number;
  reject_qty: number;
  start_date: string;
  end_date: string;
  work_time: number;
  shift_uuid: string;
  shift_nm: string;
  worker_cnt: number;
  worker_nm: string;
  complete_state: string;
  complete_fg: boolean;
  to_store_uuid: string;
  to_store_cd: string;
  to_store_nm: string;
  to_location_uuid: string;
  to_location_cd: string;
  to_location_nm: string;
  order_remark: string;
  remark: string;
};

type TPostPrdWork = {
  factory_uuid?: string;
  reg_date?: string;
  order_uuid?: string;
  proc_uuid?: string;
  workings_uuid?: string;
  equip_uuid?: string;
  prod_uuid?: string;
  lot_no?: string;
  qty?: number;
  reject_qty?: number;
  start_date?: string;
  shift_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
};

type TPutPrdWork = {
  uuid?: string;
  qty?: number;
  start_date?: string;
  end_date?: string;
  remark?: string;
};

type TDeletePrdWork = {
  uuid?: string;
};

//#endregion

//#region 🔶 WorkReject Types

type TGetPrdWorkRejectsReportParams = {
  factory_uuid?: string;
  sort_type: 'proc' | 'prod' | 'reject';
  start_date?: string;
  end_date?: string;
};

type TGetPrdWorkRejectsReport = {
  work_reject_uuid?: string;
  work_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  total_qty?: number;
  qty?: number;
  reject_qty?: number;
  start_date?: string;
  end_date?: string;
  reject_proc_uuid?: string;
  reject_proc_cd?: string;
  reject_proc_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  reject_detail_qty: number;
  remark: string;
};

type TGetPrdWorkRejectParams = {
  uuid: string;
};

type TGetPrdWorkRejectsParams = {
  factory_uuid?: string;
  work_uuid?: string;
  rekect_uuid?: string;
  reject_type_uuid?: string;
};

type TGetPrdWorkReject = {
  work_reject_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  work_uuid?: string;
  proc_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  qty?: number;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
};

type TPostPrdWorkReject = {
  factory_uuid?: string;
  work_uuid?: string;
  proc_uuid?: string;
  reject_uuid?: string;
  qty?: number;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
};

type TPutPrdWorkReject = {
  uuid: string;
  qty?: number;
  remark?: string;
};

type TDeletePrdWorkReject = {
  uuid: string;
};

//#endregion

//#region 🔶 WorkDowntime Types

type TGetPrdWorkDowntimesReportParams = {
  factory_uuid?: string;
  sort_type: 'proc' | 'equip' | 'downtime';
  work_start_date?: string;
  work_end_date?: string;
  downtime_start_date?: string;
  downtime_end_date?: string;
};

type TGetPrdWorkDowntimesReport = {
  work_downtime_uuid?: string;
  work_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  total_qty?: number;
  qty?: number;
  reject_qty?: number;
  work_start_date?: string;
  work_end_date?: string;
  downtime_type_uuid?: string;
  downtime_type_cd?: string;
  downtime_type_nm?: string;
  downtime_uuid?: string;
  downtime_cd?: string;
  downtime_nm?: string;
  downtime_start_date?: string;
  downtime_end_date?: string;
  downtime?: number;
  remark: string;
};

type TGetPrdWorkDowntimeParams = {
  uuid: string;
};

type TGetPrdWorkDowntimesParams = {
  factory_uuid?: string;
  work_uuid?: string;
  downtime_uuid?: string;
  downtime_type_uuid?: string;
};

type TGetPrdWorkDowntime = {
  work_downtime_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  work_uuid?: string;
  proc_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
  equip_uuid?: string;
  equip_cd?: string;
  equip_nm?: string;
  downtime_uuid?: string;
  downtime_cd?: string;
  downtime_nm?: string;
  downtime_type_uuid?: string;
  downtime_type_cd?: string;
  downtime_type_nm?: string;
  start_date?: string;
  end_date?: string;
  downtime?: number;
  remark?: string;
};

type TPostPrdWorkDowntime = {
  factory_uuid?: string;
  work_uuid?: string;
  proc_uuid?: string;
  equip_uuid?: string;
  downtime_uuid?: string;
  start_date?: string;
  end_date?: string;
  downtime?: number;
  remark?: string;
};

type TPutPrdWorkDowntime = {
  uuid: string;
  start_date?: string;
  end_date?: string;
  downtime?: number;
  remark?: string;
};

type TDeletePrdWorkDowntime = {
  uuid: string;
};

//#endregion

//#region 🔶 WorkInput Types

type TGetPrdWorkInputsOngoingParams = {
  work_uuid: string;
};

type TGetPrdWorkInputsOngoing = {
  work_input_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  work_uuid?: string;
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
  qty?: number;
  c_usage?: number;
  required_order_qty?: number;
  required_work_qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  remark?: string;
};

type TGetPrdWorkInputsOngoingGroupParams = {
  work_uuid: string;
};

type TGetPrdWorkInputsOngoingGroup = {
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  qty?: number;
  c_usage?: number;
  required_order_qty?: number;
  required_work_qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
};

type TGetPrdWorkInputParams = {
  uuid: string;
};

type TGetPrdWorkInputsParams = {
  factory_uuid?: string;
  work_uuid?: string;
};

type TGetPrdWorkInput = {
  work_input_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  work_uuid?: string;
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
  qty?: number;
  c_usage?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  remark?: string;
};

type TPostPrdWorkInput = {
  factory_uuid: string;
  work_uuid: string;
  prod_uuid: string;
  lot_no: string;
  qty: number;
  c_usage: number;
  unit_uuid: string;
  from_store_uuid: string;
  from_location_uuid?: string;
  remark?: string;
};

type TPutPrdWorkInput = {
  uuid: string;
  lot_no?: string;
  qty?: number;
  remark?: string;
};

type TDeletePrdWorkInput = {
  uuid: string;
};

type TDeletePrdWorkInputByWork = {
  work_uuid: string;
};
//#endregion

//#region 🔶 WorkWorker Types

type TGetPrdWorkWorkerParams = {
  uuid: string;
};

type TGetPrdWorkWorkersParams = {
  factory_uuid?: string;
  work_uuid?: string;
};

type TGetPrdWorkWorker = {
  work_worker_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  work_uuid?: string;
  worker_uuid?: string;
  worker_nm?: string;
  start_date?: string;
  end_date?: string;
  work_time?: number;
};

type TPostPrdWorkWorker = {
  factory_uuid: string;
  work_uuid: string;
  worker_uuid: string;
  start_date?: string;
  end_date?: string;
  work_time?: number;
};

type TPutPrdWorkWorker = {
  uuid: string;
  worker_uuid?: string;
  start_date?: string;
  end_date?: string;
  work_time?: number;
};

type TDeletePrdWorkWorker = {
  uuid: string;
};

//#endregion

//#region 🔶 WorkRouting Types

type TGetPrdWorkRoutingParams = {
  uuid: string;
};

type TGetPrdWorkRoutingsParams = {
  factory_uuid?: string;
  work_uuid?: string;
};

type TGetPrdWorkRouting = {
  work_routing_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  work_uuid?: string;
  proc_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
  proc_no?: number;
  workings_uuid?: string;
  workings_cd?: string;
  workings_nm?: string;
  equip_uuid?: string;
  equip_cd?: string;
  equip_nm?: string;
  qty?: number;
  start_date?: string;
  end_date?: string;
  work_time?: number;
  remark?: string;
};

type TPutPrdWorkRouting = {
  uuid: string;
  workings_uuid?: string;
  equip_uuid?: string;
  qty?: number;
  start_date?: string;
  end_date?: string;
  remark?: string;
};

//#endregion

//#region 🔶 Return Types

type TGetPrdReturnsReportParams = {
  factory_uuid?: string;
  sort_type: 'store' | 'prod' | 'date';
  start_date?: string;
  end_date?: string;
};

type TGetPrdReturnsReport = {
  return_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
};

type TGetPrdReturnParams = {
  uuid: string;
};

type TGetPrdReturnsParams = {
  factory_uuid?: string;
  from_store_uuid?: string;
  start_date: string;
  end_date?: string;
};

type TGetPrdReturn = {
  return_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
};

type TPostPrdReturn = {
  factory_uuid?: string;
  reg_date?: string;
  prod_uuid?: string;
  lot_no?: string;
  qty?: number;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
};

type TPutPrdReturn = {
  uuid: string;
  qty?: number;
  remark?: string;
};

type TDeletePrdReturn = {
  uuid: string;
};

//#endregion

//#region 🔶 Demand Types

type TPutPrdDemandsComplete = {
  uuid: string;
  complete_fg: boolean;
};

type TGetPrdDemandParams = {
  uuid: string;
};

type TGetPrdDemandsParams = {
  factory_uuid?: string;
  order_uuid?: string;
  to_store_uuid?: string;
  complete_state: 'all' | 'complete' | 'incomplete';
  start_date: string;
  end_date: string;
};

type TGetPrdDemand = {
  demand_uuid: string;
  factory_uuid: string;
  factory_cd: string;
  factory_nm: string;
  order_uuid: string;
  reg_date: string;
  demand_type_cd: string;
  demand_type_nm: string;
  proc_uuid: string;
  proc_cd: string;
  proc_nm: string;
  equip_uuid: string;
  equip_cd: string;
  equip_nm: string;
  prod_uuid: string;
  prod_no: string;
  prod_nm: string;
  item_type_uuid: string;
  item_type_cd: string;
  item_type_nm: string;
  prod_type_uuid: string;
  prod_type_cd: string;
  prod_type_nm: string;
  model_uuid: string;
  model_cd: string;
  model_nm: string;
  rev: string;
  prod_std: string;
  unit_uuid: string;
  unit_cd: string;
  unit_nm: string;
  qty: number;
  balance: number;
  complete_fg: boolean;
  complete_state: string;
  dept_uuid: string;
  dept_cd: string;
  dept_nm: string;
  due_date: string;
  to_store_uuid: string;
  to_store_cd: string;
  to_store_nm: string;
  to_location_uuid: string;
  to_location_cd: string;
  to_location_nm: string;
  remark: string;
};

type TPostPrdDemand = {
  factory_uuid?: string;
  order_uuid?: string;
  reg_date?: string;
  demand_type_cd?: string;
  proc_uuid?: string;
  equip_uuid?: string;
  prod_uuid?: string;
  qty?: number;
  dept_uuid?: string;
  due_date?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
};

type TPutPrdDemand = {
  uuid: string;
  qty?: number;
  due_date?: string;
  remark?: string;
};

type TDeletePrdDemand = {
  uuid: string;
};

//#endregion

//#region 🔶 Order Types

type TPutPrdOrdersComplete = {
  uuid: string;
  complete_fg: boolean;
  complete_date?: string;
};

type TPutPrdOrdersWorkerGroup = {
  uuid: string;
  worker_group_uuid: string;
};

type TGetPrdOrderParams = {
  uuid: string;
};

type TGetPrdOrdersParams = {
  factory_uuid?: string;
  sal_order_detail_uuid?: string;
  order_state: 'all' | 'notProgressing' | 'wait' | 'ongoing' | 'complete';
  start_date?: string;
  end_date?: string;
};

type TGetPrdOrder = {
  order_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
  order_no?: string;
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
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  plan_qty?: number;
  qty?: number;
  seq?: number;
  shift_uuid?: string;
  shift_nm?: string;
  start_date?: string;
  end_date?: string;
  worker_group_uuid?: string;
  worker_group_cd?: string;
  worker_group_nm?: string;
  worker_cnt?: number;
  sal_order_uuid?: string;
  sal_order_detail_uuid?: string;
  work_fg?: boolean;
  complete_fg?: boolean;
  order_state?: string;
  complete_date?: string;
  remark?: string;
};

type TPostPrdOrder = {
  factory_uuid?: string;
  reg_date?: string;
  order_no?: string;
  proc_uuid?: string;
  workings_uuid?: string;
  equip_uuid?: string;
  prod_uuid?: string;
  plan_qty?: number;
  qty?: number;
  seq?: number;
  shift_uuid?: string;
  worker_group_uuid?: string;
  start_date?: string;
  end_date?: string;
  sal_order_detail_uuid?: string;
  remark?: string;
};

type TPutPrdOrder = {
  uuid?: string;
  order_no?: string;
  workings_uuid?: string;
  equip_uuid?: string;
  qty?: number;
  seq?: number;
  shift_uuid?: string;
  start_date?: string;
  end_date?: string;
  remark?: string;
};

type TDeletePrdOrder = {
  uuid?: string;
};

//#endregion

//#region 🔶 OrderRouting Types

type TGetPrdOrderRoutingParams = {
  uuid: string;
};

type TGetPrdOrderRoutingsParams = {
  factory_uuid?: string;
  order_uuid?: string;
};

type TGetPrdOrderRouting = {
  order_routing_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  order_uuid?: string;
  order_no?: string;
  proc_id?: number;
  proc_cd?: string;
  proc_nm?: string;
  proc_no?: number;
  workings_id?: number;
  workings_cd?: string;
  workings_nm?: string;
  equip_id?: number;
  equip_cd?: string;
  equip_nm?: string;
  remark?: string;
};

type TPutPrdOrderRouting = {
  uuid: string;
  workings_uuid?: string;
  equip_uuid?: string;
  remark?: string;
};

//#endregion

//#region 🔶 OrderInput Types

type TGetPrdOrderInputParams = {
  uuid: string;
};

type TGetPrdOrderInputsParams = {
  factory_uuid?: string;
  order_uuid?: string;
};

type TGetPrdOrderInput = {
  order_input_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  order_uuid?: string;
  order_no?: string;
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
  c_usage?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  remark?: string;
};

type TPostPrdOrderInput = {
  factory_uuid?: string;
  order_uuid?: string;
  prod_uuid?: string;
  c_usage?: number;
  unit_uuid?: string;
  from_store_uuid?: string;
  from_location_uuid?: string;
  remark?: string;
};

type TPutPrdOrderInput = {
  uuid: string;
  c_usage?: number;
  unit_uuid?: string;
  from_store_uuid?: string;
  from_location_uuid?: string;
  remark?: string;
};

type TDeletePrdOrderInput = {
  uuid: string;
};

//#endregion

//#region 🔶 OrderWorker Types

type TGetPrdOrderWorkerParams = {
  uuid: string;
};

type TGetPrdOrderWorkersParams = {
  factory_uuid?: string;
  order_uuid?: string;
};

type TGetPrdOrderWorker = {
  order_worker_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  order_uuid?: string;
  worker_uuid?: string;
  worker_nm?: string;
};

type TPostPrdOrderWorker = {
  factory_uuid?: string;
  order_uuid?: string;
  worker_uuid?: string;
};

type TPutPrdOrderWorker = {
  uuid: string;
  worker_uuid?: string;
};

type TDeletePrdOrderWorker = {
  uuid: string;
};

//#endregion

//#endregion

//#region 🔷 SAL Types

//#region 🔶 Return Type

type TGetSalReturnsreportParams = {
  factory_uuid?: string;
  sort_type: 'partner' | 'prod' | 'date';
  start_date?: string;
  end_date?: string;
};

type TGetSalReturnsreport = {
  return_detail_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  reg_date?: string;
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
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  supply_price?: number;
  tax?: number;
  total_price?: number;
  outgo_qty?: number;
  remark?: string;
};

type TGetSalReturnsParams = {
  factory_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetSalReturnParams = {
  uuid?: string;
};

type TGetSalReturn = {
  return_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  delivery_uuid?: string;
  delivery_cd?: string;
  delivery_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  outgo_stmt_no?: string;
  outgo_date?: string;
  outgo_total_price?: number;
  outgo_total_qty?: number;
  remark?: string;
};

type TGetSalReturnDetailsParams = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetSalReturnDetailParams = {
  uuid?: string;
};

type TGetSalReturnDetail = {
  return_detail_uuid?: string;
  return_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  outgo_detail_uuid?: string;
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
  outgo_qty?: number;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  to_store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  to_location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  remark?: string;
  barcode?: string;
};

type TGetSalReturnIncludeDetailsParams = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetSalReturnIncludeDetail = {
  header?: TGetSalReturnIncludeDetailHeader;
  details?: TGetSalReturnIncludeDetailsDetail[];
};

type TGetSalReturnIncludeDetailHeader = {
  return_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  delivery_uuid?: string;
  delivery_cd?: string;
  delivery_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  outgo_stmt_no?: string;
  outgo_date?: string;
  outgo_total_price?: number;
  outgo_total_qty?: number;
  remark?: string;
};

type TGetSalReturnIncludeDetailsDetail = {
  return_detail_uuid?: string;
  return_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  outgo_detail_uuid?: string;
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
  outgo_qty?: number;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  to_store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  to_location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  remark?: string;
  barcode?: string;
};

type TPostSalReturn = {
  header?: TPostSalReturnHeader;
  details?: TPostSalReturnDetail[];
};

type TPostSalReturnHeader = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
  delivery_uuid?: string;
  stmt_no?: string;
  reg_date?: string;
  outgo_uuid?: string;
  remark?: string;
};

type TPostSalReturnDetail = {
  return_uuid?: string;
  factory_uuid?: string;
  prod_uuid?: string;
  lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  outgo_detail_uuid?: string;
  reject_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
  barcode?: string;
};

type TPutSalReturn = {
  header?: TPutSalReturnHeader;
  details?: TPutSalReturnDetail[];
};

type TPutSalReturnHeader = {
  uuid?: string;
  delivery_uuid?: string;
  stmt_no?: string;
  remark?: string;
};

type TPutSalReturnDetail = {
  uuid?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  remark?: string;
};

type TDeleteSalReturn = {
  header?: TDeleteSalReturnHeader;
  details?: TDeleteSalReturnDetail[];
};

type TDeleteSalReturnHeader = {
  uuid?: string;
};

type TDeleteSalReturnDetail = {
  uuid?: string;
};

//#endregion

//#region 🔶 Order Type

type TGetSalOrdersReportParams = {
  factory_uuid?: string;
  complete_state: 'all' | 'complete' | 'incomplete';
  sort_type: 'partner' | 'prod' | 'date';
  start_reg_date?: string;
  end_reg_date?: string;
  start_due_date?: string;
  end_due_date?: string;
};

type TGetSalOrdersReport = {
  order_detail_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  reg_date?: string;
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
  due_date?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  supply_price?: number;
  tax?: number;
  total_price?: number;
  outgo_qty?: number;
  balance?: number;
  complete_state?: string;
  remark?: string;
};

type TGetSalOrderParams = {
  uuid: string;
};

type TGetSalOrdersParams = {
  factory_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetSalOrder = {
  order_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  remark?: string;
};

type TGetSalOrderDetailParams = {
  uuid: string;
};

type TGetSalOrderDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
  complete_state: 'all' | 'complete' | 'incomplete';
  start_due_date?: string;
  end_due_date?: string;
};

type TGetSalOrderDetail = {
  order_detail_uuid?: string;
  order_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  qty?: number;
  balance?: number;
  complete_state?: string;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  unit_qty?: number;
  due_date?: string;
  remark?: string;
};

type TGetSalOrderIncludeDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
  complete_state: 'all' | 'complete' | 'incomplete';
  start_due_date?: string;
  end_due_date?: string;
};

type TGetSalOrderIncludeDetail = {
  header?: TGetSalOrderIncludeDetailsHeader;
  details?: TGetSalOrderIncludeDetailsDetail[];
};

type TGetSalOrderIncludeDetailsHeader = {
  order_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  remark?: string;
};

type TGetSalOrderIncludeDetailsDetail = {
  order_detail_uuid?: string;
  order_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  qty?: number;
  balance?: number;
  complete_state?: string;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  unit_qty?: number;
  due_date?: string;
  remark?: string;
};

type TPostSalOrder = {
  header?: TPostSalOrdersHeader;
  details?: TPostSalOrdersDetail[];
};

type TPostSalOrdersHeader = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
  stmt_no?: string;
  reg_date?: string;
  remark?: string;
};

type TPostSalOrdersDetail = {
  order_uuid?: string;
  factory_uuid?: string;
  prod_uuid?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  due_date?: string;
  complete_fg?: boolean;
  remark?: string;
};

type TPutSalOrder = {
  header?: TPutSalOrdersHeader;
  details?: TPutSalOrdersDetail[];
};

type TPutSalOrdersHeader = {
  uuid?: string;
  stmt_no?: string;
  remark?: string;
};

type TPutSalOrdersDetail = {
  uuid?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  due_date?: string;
  complete_fg?: boolean;
  remark?: string;
};

type TDeleteSalOrder = {
  header?: TDeleteSalOrdersHeader;
  details?: TDeleteSalOrdersDetail[];
};

type TDeleteSalOrdersHeader = {
  uuid?: string;
};

type TDeleteSalOrdersDetail = {
  uuid?: string;
};

type TPutSalOrderDetailsComplete = {
  uuid: string;
  complete_fg: boolean;
};

//#endregion

//#region 🔶 Income Type

type TGetSalIncomesReportParams = {
  factory_uuid?: string;
  sort_type: 'partner' | 'prod' | 'date';
  start_date?: string;
  end_date?: string;
};

type TGetSalIncomeParams = {
  uuid: string;
};

type TGetSalIncomesParams = {
  factory_uuid?: string;
  from_store_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetSalIncomesReport = {
  income_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  order_qty?: number;
  lot_no?: string;
  qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
};

type TPostSalIncome = {
  factory_uuid?: string;
  reg_date?: string;
  prod_uuid?: string;
  lot_no?: string;
  qty?: number;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
};

type TPutSalIncome = {
  uuid?: string;
  qty?: number;
  remark?: string;
};

type TDeleteSalIncome = {
  uuid?: string;
};

//#endregion

//#region 🔶 Release Type

type TGetSalReleasesReportParams = {
  factory_uuid?: string;
  sort_type: 'store' | 'prod' | 'date';
  start_date?: string;
  end_date?: string;
};

type TGetSalReleaseReport = {
  release_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
};

type TGetSalReleaseParams = {
  uuid: string;
};

type TGetSalReleasesParams = {
  factory_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetSalRelease = {
  release_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  qty?: number;
  order_detail_uuid?: string;
  order_qty?: number;
  outgo_order_detail_uuid?: string;
  outgo_order_qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
  barcode?: string;
};

type TPostSalRelease = {
  factory_uuid?: string;
  reg_date?: string;
  prod_uuid?: string;
  lot_no?: string;
  qty?: number;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
};

type TPutSalRelease = {
  uuid?: string;
  qty?: number;
  remark?: string;
};

type TDeleteSalRelease = {
  uuid?: string;
};

//#endregion

//#region 🔶 OutgoOrder Type

type TGetSalOutgoOrderParams = {
  uuid: string;
};

type TGetSalOutgoOrdersParams = {
  factory_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetSalOutgoOrder = {
  outgo_order_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  delivery_uuid?: string;
  delivery_cd?: string;
  delivery_nm?: string;
  reg_date?: string;
  total_qty?: number;
  order_uuid?: string;
  order_stmt_no?: string;
  order_total_qty?: number;
  remark?: string;
};

type TGetSalOutgoOrderDetailParams = {
  uuid: string;
};

type TGetSalOutgoOrderDetailsParams = {
  uuid: string;
  complete_state: 'all' | 'complete' | 'incomplete';
};

type TGetSalOutgoOrderDetail = {
  outgo_order_uuid?: string;
  outgo_order_detail_uuid?: string;
  seq?: number;
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
  order_qty?: number;
  qty?: number;
  balance?: number;
  complete_state?: string;
  remark?: string;
};

type TGetSalOutgoOrderIncludeDetailsParams = {
  uuid: string;
  complete_state: 'all' | 'complete' | 'incomplete';
};

type TGetSalOutgoOrderIncludeDetail = {
  header?: TGetSalOutgoOrderIncludeDetailsHeader;
  details?: TGetSalOutgoOrderIncludeDetailsDetail[];
};

type TGetSalOutgoOrderIncludeDetailsHeader = {
  outgo_order_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  delivery_uuid: string;
  delivery_cd: string;
  delivery_nm: string;
  reg_date: string;
  total_qty: number;
  order_uuid: string;
  order_stmt_no: string;
  order_total_qty: number;
  remark: string;
};

type TGetSalOutgoOrderIncludeDetailsDetail = {
  outgo_order_uuid?: string;
  outgo_order_detail_uuid?: string;
  seq?: number;
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
  order_qty?: number;
  qty?: number;
  balance?: number;
  complete_state?: string;
  remark?: string;
};

type TPostSalOutgoOrder = {
  header?: TPostSalOutgoOrdersHeader;
  details?: TPostSalOutgoOrdersDetail[];
};

type TPostSalOutgoOrdersHeader = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
  delivery_uuid?: string;
  reg_date?: string;
  order_uuid?: string;
  remark?: string;
};

type TPostSalOutgoOrdersDetail = {
  outgo_order_uuid?: string;
  factory_uuid?: string;
  prod_uuid?: string;
  qty?: number;
  order_detail_uuid?: string;
  remark?: string;
};

type TPutSalOutgoOrder = {
  header?: TPutSalOutgoOrdersHeader;
  details?: TPutSalOutgoOrdersDetail[];
};

type TPutSalOutgoOrdersHeader = {
  uuid?: string;
  delivery_uuid?: string;
  remark?: string;
};

type TPutSalOutgoOrdersDetail = {
  uuid?: string;
  qty?: number;
  remark?: string;
};

type TDeleteSalOutgoOrder = {
  header?: TDeleteSalOrdersHeader;
  details?: TDeleteSalOrdersDetail[];
};

type TDeleteSalOutgoOrdersHeader = {
  uuid?: string;
};

type TDeleteSalOutgoOrdersDetail = {
  uuid?: string;
};

type TPutSalOutgoOrderDetailsComplete = {
  uuid: string;
  complete_fg: boolean;
};

//#endregion

//#region 🔶 Outgo Type

type TGetSalOutgosLotTrackingParams = {
  factory_uuid: string;
  prod_uuid: string;
  lot_no: string;
};

type TGetSalOutgosLotTracking = {
  proc_cd?: string;
  proc_nm?: string;
  equip_cd?: string;
  equip_nm?: string;
  work_prod_no?: string;
  work_item_type_cd?: string;
  work_item_type_nm?: string;
  work_lot_no?: string;
  work_date?: string;
  input_prod_no?: string;
  input_item_type_cd?: string;
  input_item_type_nm?: string;
  input_lot_no?: string;
  partner_cd?: string;
  partner_nm?: string;
  receive_date?: string;
  receive_qty?: number;
  sortby?: string;
  level?: string;
};

type TGetSalOutgosReportParams = {
  factory_uuid?: string;
  sort_type: 'partner' | 'prod' | 'date';
  start_date?: string;
  end_date?: string;
};

type TGetSalOutgosReport = {
  outgo_detail_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
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
  order_qty?: number;
  outgo_order_qty?: number;
  lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  supply_price?: number;
  tax?: number;
  total_price?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  remark?: string;
};

type TGetSalOutgoParams = {
  uuid: string;
};

type TGetSalOutgosParams = {
  factory_uuid?: string;
  start_date: string;
  end_date: string;
};

type TGetSalOutgo = {
  outgo_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  delivery_uuid?: string;
  delivery_cd?: string;
  delivery_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  order_uuid?: string;
  order_stmt_no?: string;
  order_date?: string;
  order_total_price?: number;
  order_total_qty?: number;
  outgo_order_uuid?: string;
  outgo_order_date?: string;
  outgo_order_total_qty?: number;
  remark?: string;
};

type TGetSalOutgoDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetSalOutgoDetailParams = {
  uuid: string;
};

type TGetSalOutgoDetail = {
  outgo_detail_uuid?: string;
  outgo_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  order_detail_uuid?: string;
  outgo_order_detail_uuid?: string;
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
  qty?: number;
  order_qty?: number;
  outgo_order_qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  unit_qty?: number;
  carry_fg?: boolean;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  remark?: string;
  barcode?: string;
};

type TGetSalOutgoIncludeDetailsParams = {
  uuid: string;
  factory_uuid?: string;
  partner_uuid?: string;
};

type TGetSalOutgoIncludeDetail = {
  header?: TGetSalOutgoIncludeDetailsHeader;
  details?: TGetSalOutgoIncludeDetailsDetail[];
};

type TGetSalOutgoIncludeDetailsHeader = {
  outgo_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  delivery_uuid?: string;
  delivery_cd?: string;
  delivery_nm?: string;
  stmt_no?: string;
  reg_date?: string;
  total_price?: number;
  total_qty?: number;
  order_uuid?: string;
  order_stmt_no?: string;
  order_date?: string;
  order_total_price?: number;
  order_total_qty?: number;
  outgo_order_uuid?: string;
  outgo_order_date?: string;
  outgo_order_total_qty?: number;
  remark?: string;
};

type TGetSalOutgoIncludeDetailsDetail = {
  outgo_detail_uuid?: string;
  outgo_uuid?: string;
  seq?: number;
  stmt_no?: string;
  stmt_no_sub?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  order_detail_uuid?: string;
  outgo_order_detail_uuid?: string;
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
  qty?: number;
  order_qty?: number;
  outgo_order_qty?: number;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  exchange?: string;
  total_price?: number;
  unit_qty?: number;
  carry_fg?: boolean;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  remark?: string;
  barcode?: string;
  income_uuid?: string;
};

type TPostSalOutgo = {
  header?: TPostSalOutgosHeader;
  details?: TPostSalOutgosDetail[];
};

type TPostSalOutgosHeader = {
  uuid?: string;
  factory_uuid?: string;
  partner_uuid?: string;
  delivery_uuid?: string;
  stmt_no?: string;
  reg_date?: string;
  order_uuid?: string;
  outgo_order_uuid?: string;
  remark?: string;
};

type TPostSalOutgosDetail = {
  outgo_uuid?: string;
  factory_uuid?: string;
  prod_uuid?: string;
  lot_no?: string;
  manufactured_lot_no?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  carry_fg?: boolean;
  order_detail_uuid?: string;
  outgo_order_detail_uuid?: string;
  from_store_uuid?: string;
  from_location_uuid?: string;
  remark?: string;
  barcode?: string;
};

type TPutSalOutgo = {
  header?: TPutSalOutgosHeader;
  details?: TPutSalOutgosDetail[];
};

type TPutSalOutgosHeader = {
  uuid?: string;
  delivery_uuid?: string;
  stmt_no?: string;
  remark?: string;
};

type TPutSalOutgosDetail = {
  uuid?: string;
  qty?: number;
  price?: number;
  money_unit_uuid?: string;
  exchange?: string;
  unit_qty?: number;
  carry_fg?: boolean;
  remark?: string;
};

type TDeleteSalOutgo = {
  header?: TDeleteSalOutgosHeader;
  details?: TDeleteSalOutgosDetail[];
};

type TDeleteSalOutgosHeader = {
  uuid?: string;
};

type TDeleteSalOutgosDetail = {
  uuid?: string;
};

//#endregion

//#endregion

//#region 🔷 STD Types

//#region 🔶 BOM Types
type TGetStdBomsTree = {
  lv?: number;
  main_prod_uuid?: string;
  p_prod_uuid?: string;
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
  c_usage?: number;
  t_usage?: number;
  unit_uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
  from_store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  from_location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  remark?: string;
};

type TGetStdBom = {
  bom_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  p_prod_uuid?: string;
  p_prod_no?: string;
  p_prod_nm?: string;
  p_item_type_uuid?: string;
  p_item_type_cd?: string;
  p_item_type_nm?: string;
  p_prod_type_uuid?: string;
  p_prod_type_cd?: string;
  p_prod_type_nm?: string;
  p_model_uuid?: string;
  p_model_cd?: string;
  p_model_nm?: string;
  p_rev?: string;
  p_prod_std?: string;
  p_unit_uuid?: string;
  p_unit_cd?: string;
  p_unit_nm?: string;
  c_prod_uuid?: string;
  c_prod_no?: string;
  c_prod_nm?: string;
  c_item_type_uuid?: string;
  c_item_type_cd?: string;
  c_item_type_nm?: string;
  c_prod_type_uuid?: string;
  c_prod_type_cd?: string;
  c_prod_type_nm?: string;
  c_model_uuid?: string;
  c_model_cd?: string;
  c_model_nm?: string;
  c_rev?: string;
  c_prod_std?: string;
  c_unit_uuid?: string;
  c_unit_cd?: string;
  c_unit_nm?: string;
  c_usage?: number;
  sortby?: number;
  from_store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  from_location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  remark?: string;
};

type TPostStdBom = {
  factory_uuid?: string;
  p_prod_uuid?: string;
  c_prod_uuid?: string;
  c_usage?: number;
  unit_uuid?: string;
  sortby?: number;
  from_store_uuid?: string;
  from_location_uuid?: string;
  remark?: string;
};

type TPutStdBom = {
  uuid?: string;
  c_usage?: number;
  unit_uuid?: string;
  sortby?: number;
  from_store_uuid?: string;
  from_location_uuid?: string;
  remark?: string;
};

type TDeleteStdBom = {
  uuid?: string;
};
//#endregion

//#region 🔶 PartnerType Types

type TPostStdPartnerTypesExcelUpload = {
  uuid?: string;
  partner_type_cd?: string;
  partner_type_nm?: string;
};

type TGetStdPartnerType = {
  partner_type_uuid?: string;
  partner_type_cd?: string;
  partner_type_nm?: string;
};

type TPostStdPartnerType = {
  partner_type_cd?: string;
  partner_type_nm?: string;
};

type TPutStdPartnerType = {
  uuid?: string;
  partner_type_cd?: string;
  partner_type_nm?: string;
};

type TPatchStdPartnerType = {
  uuid?: string;
  partner_type_cd?: string;
  partner_type_nm?: string;
};

type TDeleteStdPartnerType = {
  uuid?: string;
};
//#endregion

//#region 🔶 Partner Types
type TPostStdPartner = {
  uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  partner_type_cd?: string;
  partner_no?: string;
  boss_nm?: string;
  manager?: string;
  email?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
  use_fg?: boolean;
  vendor_fg?: boolean;
  customer_fg?: boolean;
  remark?: string;
};

type TGetStdPartner = {
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  partner_type_uuid?: string;
  partner_type_cd?: string;
  partner_type_nm?: string;
  partner_no?: string;
  boss_nm?: string;
  manager?: string;
  email?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
  use_fg?: boolean;
  vendor_fg?: boolean;
  customer_fg?: boolean;
  remark?: string;
};

type TPutStdPartner = {
  partner_cd?: string;
  partner_nm?: string;
  partner_type_uuid?: string;
  partner_no?: string;
  boss_nm?: string;
  manager?: string;
  email?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
  use_fg?: boolean;
  vendor_fg?: boolean;
  customer_fg?: boolean;
  remark?: string;
};
type TDeleteStdPartner = {
  uuid?: string;
};
//#endregion

//#region 🔶 PartnerProd Types
type TPostStdPartnerProdsExcelUpload = {
  partner_cd?: string;
  prod_no?: string;
  rev?: string;
  partner_prod_no?: string;
  remark?: string;
};

type TGetStdPartnerProd = {
  partner_prod_uuid?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  partner_type_uuid?: string;
  partner_type_cd?: string;
  partner_type_nm?: string;
  prod_uuid?: string;
  prod_no?: string;
  partner_prod_no?: string;
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
  remark?: string;
};
type TPostStdPartnerProd = {
  partner_uuid?: string;
  prod_uuid?: string;
  partner_prod_no?: string;
  remark?: string;
};
type TPutStdPartnerProd = {
  uuid?: string;
  partner_prod_no?: string;
  remark?: string;
};
type TDeleteStdPartnerProd = {
  uuid?: string;
};
//#endregion

//#region 🔶 InspTool Type
type TPostStdInspToolsExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  insp_tool_cd?: string;
  insp_tool_nm?: string;
};

type TGetStdInspTool = {
  insp_tool_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_tool_cd?: string;
  insp_tool_nm?: string;
};

type TPostStdInspTool = {
  factory_uuid?: string;
  insp_tool_cd?: string;
  insp_tool_nm?: string;
};

type TPatchStdInspTool = {
  uuid?: string;
  insp_tool_cd?: string;
  insp_tool_nm?: string;
};

type TDeleteStdInspTool = {
  uuid: string;
};
//#endregion

//#region 🔶 InspMethod Type
type TPostStdInspMethodsExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  insp_method_cd?: string;
  insp_method_nm?: string;
};

type TGetStdInspMethod = {
  insp_method_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_method_cd?: string;
  insp_method_nm?: string;
};

type TPostStdInspMethod = {
  factory_uuid?: string;
  insp_method_cd?: string;
  insp_method_nm?: string;
};

type TPutStdInspMethod = {
  uuid?: string;
  insp_method_cd?: string;
  insp_method_nm?: string;
};

type TDeleteStdInspMethod = {
  uuid: string;
};
//#endregion

//#region 🔶 InspItemType Type
type TPostStdInspItemTypesExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  insp_item_type_cd?: string;
  insp_item_type_nm?: string;
};

type TGetStdInspItemType = {
  insp_item_type_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_item_type_cd?: string;
  insp_item_type_nm?: string;
};

type TPostStdInspItemType = {
  factory_uuid?: string;
  insp_item_type_cd?: string;
  insp_item_type_nm?: string;
};

type TPutStdInspItemType = {
  uuid: string;
  insp_item_type_cd: string;
  insp_item_type_nm: string;
};

type TDeleteStdInspItemType = {
  uuid?: string;
};
//#endregion

//#region 🔶 InspItem Type
type TPostStdInspItemsExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  insp_item_type_cd?: string;
  insp_item_cd?: string;
  insp_item_nm?: string;
  insp_tool_cd?: string;
  insp_method_cd?: string;
};

type TGetStdInspItem = {
  insp_item_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_item_type_uuid?: string;
  insp_item_type_cd?: string;
  insp_item_type_nm?: string;
  insp_item_cd?: string;
  insp_item_nm?: string;
  insp_tool_uuid?: string;
  insp_tool_cd?: string;
  insp_tool_nm?: string;
  insp_method_uuid?: string;
  insp_method_cd?: string;
  insp_method_nm?: string;
};

type TPostStdInspItem = {
  factory_uuid?: string;
  insp_item_type_uuid?: string;
  insp_item_cd?: string;
  insp_item_nm?: string;
  insp_tool_uuid?: string;
  insp_method_uuid?: string;
};

type TPutStdInspItem = {
  uuid?: string;
  insp_item_type_uuid?: string;
  insp_item_cd?: string;
  insp_item_nm?: string;
  insp_tool_uuid?: string;
  insp_method_uuid?: string;
};

type TDeleteStdInspItem = {
  uuid?: string;
};
//#endregion

//#region 🔶 CustomerPrice Type
type TPostStdCustomerPricesExcelUpload = {
  uuid?: string;
  partner_cd?: string;
  prod_no?: string;
  rev?: string;
  price?: number;
  money_unit_cd?: string;
  price_type_cd?: string;
  start_date?: string;
  retroactive_price?: number;
  division?: number;
  remark?: string;
};

type TGetStdCustomerPrice = {
  customer_price_uuid?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
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
  unit_cd?: string;
  unit_nm?: string;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  price_type_uuid?: string;
  price_type_cd?: string;
  price_type_nm?: string;
  price?: number;
  start_date?: string;
  end_date?: string;
  retroactive_price?: number;
  division?: number;
  unit_qty?: number;
  remark?: string;
};

type TPostStdCustomerPrice = {
  partner_uuid?: string;
  prod_uuid?: string;
  price?: number;
  money_unit_uuid?: string;
  price_type_uuid?: string;
  start_date?: string;
  retroactive_price?: number;
  division?: number;
  remark?: string;
};

type TPutStdCustomerPrice = {
  uuid?: string;
  price?: number;
  money_unit_uuid?: string;
  price_type_uuid?: string;
  start_date?: string;
  retroactive_price?: number;
  division?: number;
  remark?: string;
};

type TDeleteStdCustomerPrice = {
  uuid?: string;
};
//#endregion

//#region 🔶 Supplier Type
type TPostStdSuppliersExcelUpload = {
  uuid?: string;
  supplier_cd?: string;
  supplier_nm?: string;
  partner_cd?: string;
  manager?: string;
  email?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
  use_fg?: boolean;
  remark?: string;
};

type TGetStdSupplier = {
  supplier_uuid?: string;
  supplier_cd?: string;
  supplier_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  manager?: string;
  email?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
  use_fg?: boolean;
  remark?: string;
};

type TPostStdSupplier = {
  supplier_cd?: string;
  supplier_nm?: string;
  partner_uuid?: string;
  manager?: string;
  email?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
  use_fg?: boolean;
  remark?: string;
};

type TDeleteStdSupplier = {
  uuid?: string;
};
//#endregion

//#region 🔶 Factory Type

type TPostStdFactoriesExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
};

type TGetStdFactoriesSingIn = {
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
};

type TGetStdFactory = {
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
};

type TPostStdFactory = {
  factory_cd?: string;
  factory_nm?: string;
};

//#endregion

//#region 🔶 Proc Type
type TPostStdProcsExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  proc_cd?: string;
  proc_nm?: string;
};

type TGetStdProc = {
  proc_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  proc_cd?: string;
  proc_nm?: string;
};

type TPostStdProc = {
  factory_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
};

type TPutStdProc = {
  uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
};

type TDeleteStdProc = {
  uuid?: string;
};
//#endregion

//#region 🔶 ProcInsp Type
type TPostStdProcRejectsExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  proc_cd?: string;
  reject_cd?: string;
  remark?: string;
};

type TGetStdProcReject = {
  proc_reject_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  proc_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  remark?: string;
};

type TPostStdProcReject = {
  factory_uuid?: string;
  proc_uuid?: string;
  reject_uuid?: string;
  remark?: string;
};

type TPutStdProcReject = {
  uuid?: string;
  proc_uuid?: string;
  reject_uuid?: string;
  remark?: string;
};

type TDeleteStdProcReject = {
  uuid?: string;
};
//#endregion

//#region 🔶 Delivery Type
type TPostStdDeliveriesExcelUpload = {
  uuid?: string;
  delivery_cd?: string;
  delivery_nm?: string;
  partner_cd?: string;
  manager?: string;
  email?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
  use_fg?: boolean;
  remark?: string;
};

type TGetStdDelivery = {
  delivery_uuid?: string;
  delivery_cd?: string;
  delivery_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  manager?: string;
  email?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
  use_fg?: boolean;
  remark?: string;
};

type TPostStdDelivery = {
  delivery_cd?: string;
  delivery_nm?: string;
  partner_uuid?: string;
  manager?: string;
  email?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
  use_fg?: boolean;
  remark?: string;
};

type TPutStdDelivery = {
  uuid?: string;
};
//#endregion

//#region 🔶 PriceType Type
type TPostStdPriceTypesExcelUpload = {
  uuid?: string;
  price_type_cd?: string;
  price_type_nm?: string;
};

type TGetStdPriceType = {
  price_type_uuid?: string;
  price_type_cd?: string;
  price_type_nm?: string;
};

type TPostStdPriceType = {
  price_type_cd?: string;
  price_type_nm?: string;
};

type TDeleteStdPriceType = {
  uuid?: string;
};
//#endregion

//#region 🔶 Unit Type
type TPostStdUnitsExcelUpload = {
  uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
};

type TGetStdUnit = {
  unit_uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
};

type TPostStdUnit = {
  unit_cd?: string;
  unit_nm?: string;
};

type TPatchStdUnit = {
  uuid?: string;
};
//#endregion

//#region 🔶 UnitConvert Type
type TPostStdUnitConvertsExcelUpload = {
  uuid?: string;
  from_unit_cd?: string;
  to_unit_cd?: string;
  from_value?: number;
  to_value?: number;
  convert_value?: number;
  prod_no?: string;
  rev?: string;
  remark?: string;
};

type TGetStdUnitConvert = {
  unit_convert_uuid?: string;
  from_unit_uuid?: string;
  from_unit_cd?: string;
  from_unit_nm?: string;
  to_unit_uuid?: string;
  to_unit_cd?: string;
  to_unit_nm?: string;
  from_value?: number;
  to_value?: number;
  convert_value?: number;
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
  remark?: string;
};

type TPostStdUnitConvert = {
  from_unit_uuid?: string;
  to_unit_uuid?: string;
  from_value?: number;
  to_value?: number;
  convert_value?: number;
  prod_uuid?: string;
  remark?: string;
};

type TPutStdUnitConvert = {
  from_value: number;
  to_value: number;
  convert_value: number;
  remark: string;
};

type TDeleteStdUnitConvert = {
  uuid?: string;
};

//#endregion

//#region 🔶 Routing Type
type TGetStdRoutingsActivedProd = {
  routing_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  proc_no?: number;
  proc_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
  workings_uuid?: string;
  workings_cd?: string;
  workings_nm?: string;
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
  auto_work_fg?: boolean;
};

type TGetStdRouting = {
  routing_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  proc_no?: number;
  proc_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
  auto_work_fg?: boolean;
  cycle_time?: number;
  uph?: number;
};

type TPostStdRouting = {
  factory_uuid?: string;
  prod_uuid?: string;
  proc_uuid?: string;
  proc_no?: number;
  auto_work_fg?: boolean;
  cycle_time?: number;
  uph?: number;
};

type TPutStdRouting = {
  uuid?: string;
  proc_no?: number;
  auto_work_fg?: boolean;
  cycle_time?: number;
  uph?: number;
};
type TDeleteStdRouting = {
  uuid?: string;
};
//#endregion

//#region 🔶 Model Type
type TPostStdModelsExcelUpload = {
  uuid?: string;
  model_cd?: string;
  model_nm?: string;
};

type TGetStdModel = {
  model_uuid?: string;
  model_cd?: string;
  model_nm?: string;
};

type TPostStdModel = {
  model_cd?: string;
  model_nm?: string;
};

type TPutStdModel = {
  uuid?: string;
  model_cd?: string;
  model_nm?: string;
};

type TDeleteStdModel = {
  uuid?: string;
};
//#endregion

//#region 🔶 ept Type
type TPostStdDeptsExcelUpload = {
  uuid?: string;
  dept_cd?: string;
  dept_nm?: string;
};

type TGetStdDept = {
  dept_uuid?: string;
  dept_cd?: string;
  dept_nm?: string;
};

type TPostStdDept = {
  dept_cd?: string;
  dept_nm?: string;
};

type TDeleteStdDept = {
  uuid?: string;
};
//#endregion

//#region 🔶 RejectType Type
type TPostStdRejectTypesExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
};

type TGetStdRejectType = {
  reject_type_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
};

type TPostStdRejectType = {
  factory_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
};

type TPutStdRejectType = {
  uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
};

type TDeleteStdRejectType = {
  uuid?: string;
};
//#endregion

//#region 🔶 Reject Type
type TPostStdRejectsExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  reject_type_cd?: string;
  reject_cd?: string;
  reject_nm?: string;
};

type TGetStdReject = {
  reject_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  reject_cd?: string;
  reject_nm?: string;
};

type TPostStdReject = {
  factory_uuid?: string;
  reject_type_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
};

type TPutStdReject = {
  uuid?: string;
  reject_type_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
};

type TPatchStdReject = {
  uuid: string;
};
//#endregion

//#region 🔶 DowntimeType Type
type TPostStdDowntimeTypesExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  downtime_type_cd?: string;
  downtime_type_nm?: string;
};

type TGetStdDowntimeType = {
  downtime_type_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  downtime_type_cd?: string;
  downtime_type_nm?: string;
};

type TPostStdDowntimeType = {
  factory_uuid?: string;
  downtime_type_cd?: string;
  downtime_type_nm?: string;
};

type TPutStdDowntimeType = {
  uuid?: string;
  downtime_type_cd?: string;
  downtime_type_nm?: string;
};

type TDeleteStdDowntimeType = {
  uuid?: string;
};
//#endregion

//#region 🔶 Downtime Type
type TPostStdDowntimesExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  downtime_type_cd?: string;
  downtime_cd?: string;
  downtime_nm?: string;
};

type TGetStdDowntime = {
  downtime_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  downtime_type_uuid?: string;
  downtime_type_cd?: string;
  downtime_type_nm?: string;
  downtime_cd?: string;
  downtime_nm?: string;
};

type TPostStdDowntime = {
  factory_uuid?: string;
  downtime_type_uuid?: string;
  downtime_cd?: string;
  downtime_nm?: string;
};

type TPutStdDowntime = {
  uuid?: string;
  downtime_type_uuid?: string;
  downtime_cd?: string;
  downtime_nm?: string;
};

type TDeleteStdDowntime = {
  uuid?: string;
};
//#endregion

//#region 🔶 Emp Type
type TPostStdEmpsExcelUpload = {
  uuid?: string;
  emp_cd?: string;
  emp_nm?: string;
  id?: string;
  dept_cd?: string;
  grade_cd?: string;
  birthday?: string;
  addr?: string;
  addr_detail?: string;
  post?: string;
  hp?: string;
  enter_date?: string;
  leave_date?: string;
  remark?: string;
};

type TGetStdEmp = {
  emp_uuid?: string;
  emp_cd?: string;
  emp_nm?: string;
  user_uuid?: string;
  id?: string;
  dept_uuid?: string;
  dept_cd?: string;
  dept_nm?: string;
  grade_uuid?: string;
  grade_cd?: string;
  grade_nm?: string;
  birthday?: string;
  addr?: string;
  addr_detail?: string;
  post?: string;
  hp?: string;
  enter_date?: string;
  leave_date?: string;
  remark?: string;
};

type TPostStdEmp = {
  emp_cd?: string;
  emp_nm?: string;
  user_uuid?: string;
  dept_uuid?: string;
  grade_uuid?: string;
  birthday?: string;
  addr?: string;
  addr_detail?: string;
  post?: string;
  hp?: string;
  enter_date?: string;
  leave_date?: string;
  remark?: string;
};

type TPutStdEmp = {
  uuid?: string;
  emp_cd?: string;
  emp_nm?: string;
  user_uuid?: string;
  dept_uuid?: string;
  grade_uuid?: string;
  birthday?: string;
  addr?: string;
  addr_detail?: string;
  post?: string;
  hp?: string;
  enter_date?: string;
  leave_date?: string;
  remark?: string;
};

type TDeleteStdEmp = {
  uuid?: string;
};
//#endregion

//#region 🔶 RoutingResource Type
type TGetStdRoutingResource = {
  routing_resource_uuid?: string;
  factory_uuid?: string;
  routing_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  resource_type?: string;
  equip_uuid?: string;
  equip_cd?: string;
  equip_nm?: string;
  emp_cnt?: number;
  cycle_time?: number;
  uph?: number;
};

type TPostStdRoutingResource = {
  factory_uuid?: string;
  routing_uuid?: string;
  resource_type?: string;
  equip_uuid?: string;
  emp_cnt?: number;
  cycle_time?: number;
  uph?: number;
};

type TPatchStdRoutingResource = {
  uuid?: string;
  resource_type?: string;
  equip_uuid?: string;
  emp_cnt?: number;
  cycle_time?: number;
  uph?: number;
};

type TDeleteStdRoutingResource = {
  uuid?: string;
};

//#endregion

//#region 🔶 EquipType Type
type TPostStdEquipTypesExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  equip_type_cd?: string;
  equip_type_nm?: string;
};

type TGetStdEquipType = {
  equip_type_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  equip_type_cd?: string;
  equip_type_nm?: string;
};

type TPostStdEquipType = {
  factory_uuid?: string;
  equip_type_cd?: string;
  equip_type_nm?: string;
};

type TPutStdEquipType = {
  uuid?: string;
  equip_type_cd?: string;
  equip_type_nm?: string;
};

type TPatchStdEquipType = {
  uuid?: string;
};
//#endregion

//#region 🔶 Equip Type
type TPostStdEquipsExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  equip_type_cd?: string;
  equip_cd?: string;
  equip_nm?: string;
  use_fg?: boolean;
  remark?: string;
};

type TGetStdEquip = {
  equip_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  equip_type_uuid?: string;
  equip_type_cd?: string;
  equip_type_nm?: string;
  equip_cd?: string;
  equip_nm?: string;
  use_fg?: boolean;
  remark?: string;
};

type TGetStdEquips = {
  equip_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  equip_type_uuid?: string;
  equip_type_cd?: string;
  equip_type_nm?: string;
  equip_cd?: string;
  equip_nm?: string;
  use_fg?: boolean;
  remark?: string;
};

type TPostStdEquips = {
  factory_uuid?: string;
  equip_type_uuid?: string;
  equip_cd?: string;
  equip_nm?: string;
  use_fg?: boolean;
  remark?: string;
};

type TPutStdEquips = {
  uuid?: string;
  equip_type_uuid?: string;
  equip_cd?: string;
  equip_nm?: string;
  use_fg?: boolean;
  remark?: string;
};

type TPatchStdEquips = {
  uuid?: string;
  equip_type_uuid?: string;
  equip_cd?: string;
  equip_nm?: string;
  use_fg?: boolean;
  remark?: string;
};

type TDeleteStdEquips = {
  uuid?: string;
};
//#endregion

//#region 🔶 Location Type
type TPostStdLocationsExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  store_cd?: string;
  location_cd?: string;
  location_nm?: string;
};

type TGetStdLocation = {
  location_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  location_cd?: string;
  location_nm?: string;
  store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
};

type TPostStdLocation = {
  factory_uuid?: string;
  store_uuid?: string;
  location_cd?: string;
  location_nm?: string;
};

type TPutStdLocation = {
  uuid?: string;
  store_uuid?: string;
  location_cd?: string;
  location_nm?: string;
};

type TDeleteStdLocation = {
  uuid?: string;
};
//#endregion

//#region 🔶 Shift Type
type TPostStdshiftsExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  shift_cd?: string;
  shift_nm?: string;
};

type TGetStdshift = {
  shift_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  shift_cd?: string;
  shift_nm?: string;
  start_time?: string;
  end_time?: string;
};

type TPostStdshift = {
  factory_uuid?: string;
  shift_cd?: string;
  shift_nm?: string;
  start_time?: string;
  end_time?: string;
};

type TPatchStdshift = {
  uuid?: string;
  shift_cd?: string;
  shift_nm?: string;
  start_time?: string;
  end_time?: string;
};

type TDeleteStdshift = {
  uuid?: string;
};
//#endregion

//#region 🔶 Worker Type
type TPostStdWorkerExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  proc_cd?: string;
  workings_cd?: string;
  emp_cd?: string;
  worker_cd?: string;
  worker_nm?: string;
};

type TGetStdWorker = {
  worker_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  proc_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
  workings_uuid?: string;
  workings_cd?: string;
  workings_nm?: string;
  emp_uuid?: string;
  emp_cd?: string;
  emp_nm?: string;
  worker_cd?: string;
  worker_nm?: string;
};

type TPostStdWorker = {
  factory_uuid?: string;
  proc_uuid?: string;
  workings_uuid?: string;
  emp_uuid?: string;
  worker_cd?: string;
  worker_nm?: string;
};

type TPutStdWorker = {
  uuid?: string;
  proc_uuid?: string;
  workings_uuid?: string;
  emp_uuid?: string;
  worker_cd?: string;
  worker_nm?: string;
};

type TDeleteStdWorker = {
  uuid?: string;
};
//#endregion

//#region 🔶 Workings Type
type TPostStdWorkingsesExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  workings_cd?: string;
  workings_nm?: string;
};

type TGetStdWorkings = {
  workings_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  workings_cd?: string;
  workings_nm?: string;
};

type TPostStdWorkingses = {
  factory_uuid?: string;
  workings_cd?: string;
  workings_nm?: string;
};

type TPutStdWorkingses = {
  uuid?: string;
  workings_cd?: string;
  workings_nm?: string;
};

type TDeleteStdWorkingses = {
  uuid?: string;
};
//#endregion

//#region 🔶 WorkerGroup Type
type TPostStdWorkerGroupsExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  worker_group_cd?: string;
  worker_group_nm?: string;
};

type TGetStdWorkerGroup = {
  worker_group_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  worker_group_cd?: string;
  worker_group_nm?: string;
};

type TPostStdWorkerGroup = {
  factory_uuid?: string;
  worker_group_cd?: string;
  worker_group_nm?: string;
};

type TPutStdWorkerGroup = {
  uuid?: string;
  worker_group_cd?: string;
  worker_group_nm?: string;
};

type TPatchStdWorkerGroup = {
  uuid?: string;
  worker_group_cd?: string;
  worker_group_nm?: string;
};
type TDeleteStdWorkerGroup = {
  uuid?: string;
};
//#endregion

//#region 🔶 WorkerGroupWorker Type
type TPostStdWorkerGroupWorkerExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  worker_group_cd?: string;
  worker_cd?: string;
  worker_id?: string;
};
type TGetStdWorkerGroupWorker = {
  worker_group_worker_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  worker_group_uuid?: string;
  worker_group_cd?: string;
  worker_group_nm?: string;
  worker_uuid?: string;
  worker_nm?: string;
  worker_id?: string;
};

type TPostStdWorkerGroupWorkers = {
  factory_uuid?: string;
  worker_group_uuid?: string;
  worker_uuid?: string;
  worker_id?: string;
};

type TPatchStdWorkerGroupWorkers = {
  uuid?: string;
  worker_id?: string;
};
type TDeleteStdWorkerGroupWorkers = {
  uuid?: string;
};
//#endregion

//#region 🔶 ProdType Type
type TPostStdProdTypesExcelUpload = {
  uuid?: string;
  prod_type_cd?: string;
  prod_type_nm?: string;
};
type TGetStdProdType = {
  prod_type_uuid?: string;
  prod_type_cd?: string;
  prod_type_nm?: string;
};
type TPostStdProdType = {
  prod_type_cd?: string;
  prod_type_nm?: string;
};

type TDeleteStdProdType = {
  uuid?: string;
};
//#endregion

//#region 🔶 Grade Type
type TPostStdGradesExcelUpload = {
  uuid?: string;
  grade_cd?: string;
  grade_nm?: string;
};

type TGetStdGrade = {
  grade_uuid?: string;
  grade_cd?: string;
  grade_nm?: string;
};

type TPostStdGrade = {
  grade_cd?: string;
  grade_nm?: string;
};
type TPutStdGrade = {
  uuid?: string;
  grade_cd?: string;
  grade_nm?: string;
};
type TDeleteStdGrade = {
  uuid?: string;
};
//#endregion

//#region 🔶 Store Type
type TPostStdStoresExcelUpload = {
  uuid?: string;
  factory_cd?: string;
  store_cd?: string;
  store_nm?: string;
  reject_store_fg?: boolean;
  return_store_fg?: boolean;
  outgo_store_fg?: boolean;
  final_insp_store_fg?: boolean;
  available_store_fg?: boolean;
};

type TGetStdStore = {
  store_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  store_cd?: string;
  store_nm?: string;
  reject_store_fg?: boolean;
  return_store_fg?: boolean;
  outgo_store_fg?: boolean;
  final_insp_store_fg?: boolean;
  available_store_fg?: boolean;
};

type TPostStdStore = {
  factory_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  reject_store_fg?: boolean;
  return_store_fg?: boolean;
  outgo_store_fg?: boolean;
  final_insp_store_fg?: boolean;
  available_store_fg?: boolean;
};
type TPutStdStore = {
  uuid?: string;
  store_cd?: string;
  store_nm?: string;
  reject_store_fg?: boolean;
  return_store_fg?: boolean;
  outgo_store_fg?: boolean;
  final_insp_store_fg?: boolean;
  available_store_fg?: boolean;
};

type TDeleteStdStore = {
  uuid?: string;
};
//#endregion

//#region 🔶 RoutingWorkings Type
type TGetStdRoutingWorkings = {
  routing_workings_uuid?: string;
  prod_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  workings_uuid?: string;
  workings_cd?: string;
  workings_nm?: string;
};

type TPostStdRoutingWorkings = {
  factory_uuid?: string;
  prod_uuid?: string;
  workings_uuid?: string;
};

type TPutStdRoutingWorkings = {
  uuid?: string;
  workings_uuid?: string;
};
type TDeleteStdRoutingWorkings = {
  uuid?: string;
};
//#endregion

//#region 🔶 ItemType Type
type TPostStdItemTypesExcelUpload = {
  uuid?: string;
  item_type_cd?: string;
  item_type_nm?: string;
};

type TGetStdItemType = {
  item_type_uuid?: string;
  item_type_cd?: string;
  item_type_nm?: string;
};

type TPostStdItemType = {
  item_type_cd?: string;
  item_type_nm?: string;
};
type TDeleteStdItemType = {
  uuid?: string;
};
//#endregion

//#region 🔶 Prod Type
type TPostStdProdsExcelUpload = {
  factory_cd?: string;
  prod_no?: string;
  prod_nm?: string;
  item_type_cd?: string;
  prod_type_cd?: string;
  model_cd?: string;
  unit_cd?: string;
  rev?: string;
  prod_std?: string;
  lot_fg?: boolean;
  use_fg?: boolean;
  active_fg?: boolean;
  bom_type_cd?: string;
  width?: number;
  length?: number;
  height?: number;
  material?: string;
  color?: string;
  weight?: number;
  thickness?: number;
  mat_order_fg?: boolean;
  mat_unit_cd?: string;
  mat_order_min_qty?: number;
  mat_supply_days?: number;
  sal_order_fg?: boolean;
  inv_use_fg?: boolean;
  inv_unit_qty?: number;
  inv_safe_qty?: number;
  inv_to_store_cd?: string;
  inv_to_location_cd?: string;
  qms_receive_insp_fg?: boolean;
  qms_proc_insp_fg?: boolean;
  qms_final_insp_fg?: boolean;
  prd_active_fg?: boolean;
  prd_plan_type_cd?: string;
  prd_min?: number;
  prd_max?: number;
};
type TGetStdProd = {
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
  lot_fg?: boolean;
  use_fg?: boolean;
  active_fg?: boolean;
  bom_type_cd?: string;
  bom_type_nm?: string;
  width?: number;
  length?: number;
  height?: number;
  material?: string;
  color?: string;
  weight?: number;
  thickness?: number;
  mat_order_fg?: boolean;
  mat_unit_uuid?: string;
  mat_unit_cd?: string;
  mat_unit_nm?: string;
  mat_order_min_qty?: number;
  mat_supply_days?: number;
  sal_order_fg?: boolean;
  inv_use_fg?: boolean;
  inv_unit_qty?: number;
  inv_safe_qty?: number;
  inv_to_store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  inv_to_location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  qms_receive_insp_fg?: boolean;
  qms_proc_insp_fg?: boolean;
  qms_final_insp_fg?: boolean;
  prd_active_fg?: boolean;
  prd_plan_type_cd?: string;
  prd_plan_type_nm?: string;
  prd_min?: number;
  prd_max?: number;
};

type TPostStdProd = {
  prod_no?: string;
  prod_nm?: string;
  item_type_uuid?: string;
  prod_type_uuid?: string;
  model_uuid?: string;
  unit_uuid?: string;
  rev?: string;
  prod_std?: string;
  lot_fg?: boolean;
  use_fg?: boolean;
  active_fg?: boolean;
  bom_type_cd?: string;
  width?: number;
  length?: number;
  height?: number;
  material?: string;
  color?: string;
  weight?: number;
  thickness?: number;
  mat_order_fg?: boolean;
  mat_unit_uuid?: string;
  mat_order_min_qty?: number;
  mat_supply_days?: number;
  sal_order_fg?: boolean;
  inv_use_fg?: boolean;
  inv_unit_qty?: number;
  inv_safe_qty?: number;
  inv_to_store_uuid?: string;
  inv_to_location_uuid?: string;
  qms_receive_insp_fg?: boolean;
  qms_proc_insp_fg?: boolean;
  qms_final_insp_fg?: boolean;
  prd_active_fg?: boolean;
  prd_plan_type_cd?: string;
  prd_min?: number;
  prd_max?: number;
};

type TPutStdProd = {
  uuid?: string;
  prod_no?: string;
  prod_nm?: string;
  item_type_uuid?: string;
  prod_type_uuid?: string;
  model_uuid?: string;
  unit_uuid?: string;
  rev?: string;
  prod_std?: string;
  lot_fg?: boolean;
  use_fg?: boolean;
  active_fg?: boolean;
  bom_type_cd?: string;
  width?: number;
  length?: number;
  height?: number;
  material?: string;
  color?: string;
  weight?: number;
  thickness?: number;
  mat_order_fg?: boolean;
  mat_unit_uuid?: string;
  mat_order_min_qty?: number;
  mat_supply_days?: number;
  sal_order_fg?: boolean;
  inv_use_fg?: boolean;
  inv_unit_qty?: number;
  inv_safe_qty?: number;
  inv_to_store_uuid?: string;
  inv_to_location_uuid?: string;
  qms_receive_insp_fg?: boolean;
  qms_proc_insp_fg?: boolean;
  qms_final_insp_fg?: boolean;
  prd_active_fg?: boolean;
  prd_plan_type_cd?: string;
  prd_min?: number;
  prd_max?: number;
};

type TDeleteStdProd = {
  uuid?: string;
};
//#endregion

//#region 🔶 VendorPrice Type
type TPostStdVendorPricesExcelUpload = {
  uuid?: string;
  partner_cd?: string;
  prod_no?: string;
  rev?: string;
  unit_cd?: string;
  price?: number;
  money_unit_cd?: string;
  price_type_cd?: string;
  start_date?: string;
  retroactive_price?: number;
  division?: number;
  remark?: string;
};

type TGetStdVendorPrice = {
  vendor_price_uuid?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
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
  mat_order_min_qty?: number;
  qms_receive_insp_fg?: boolean;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  price_type_uuid?: string;
  price_type_cd?: string;
  price_type_nm?: string;
  price?: number;
  start_date?: string;
  end_date?: string;
  retroactive_price?: number;
  division?: number;
  unit_qty?: number;
  remark?: string;
};

type TPostStdVendorPrice = {
  partner_uuid?: string;
  prod_uuid?: string;
  unit_uuid?: string;
  price?: number;
  money_unit_uuid?: string;
  price_type_uuid?: string;
  start_date?: string;
  retroactive_price?: number;
  division?: number;
  remark?: string;
};

type TPutStdVendorPrice = {
  uuid?: string;
  price?: number;
  money_unit_uuid?: string;
  price_type_uuid?: string;
  start_date?: string;
  retroactive_price?: number;
  division?: number;
  remark?: string;
};

type TDeleteStdVendorPrice = {
  uuid?: string;
};
//#endregion

//#region 🔶 MoneyUnit Type
type TPostStdMoneyUnitsExcelUpload = {
  uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
};

type TGetStdMoneyUnit = {
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
};

type TPostStdMoneyUnit = {
  money_unit_cd?: string;
  money_unit_nm?: string;
};

type TDeleteStdMoneyUnit = {
  uuid?: string;
};
//#endregion

//#region 🔶 Company Type
type TPostStdCompaniesExcelUpload = {
  uuid?: string;
  company_nm?: string;
  company_no?: string;
  boss_nm?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
};

type TGetStdCompany = {
  company_uuid?: string;
  company_nm?: string;
  company_no?: string;
  boss_nm?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
};

type TPostStdCompany = {
  company_nm?: string;
  company_no?: string;
  boss_nm?: string;
  tel?: string;
  fax?: string;
  post?: string;
  addr?: string;
  addr_detail?: string;
};
type TDeleteStdCompany = {
  uuid?: string;
};
//#endregion

//#endregion

//#region 🔷 QMS Types

//#region 🔶 Insp Type
type TPutQmsInspsApply = {
  uuid?: string;
};

type TGetQmsInsp = {
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
  apply_state?: string;
  contents?: string;
  remark?: string;
};

type TGetQmsInspDetail = {
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
  worker_sample_cnt?: number;
  worker_insp_cycle?: string;
  inspector_sample_cnt?: number;
  inspector_insp_cycle?: string;
  remark?: string;
};

type TGetQmsInspIncludeDetail = {
  header?: TGetQmsInspDetailsHeader;
  details?: TGetQmsInspDetailsDetail[];
};
type TGetQmsInspDetailsHeader = {
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
  apply_state?: string;
  contents?: string;
  max_sample_cnt?: number;
  remark?: string;
};
type TGetQmsInspDetailsDetail = {
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

type TGetQmsReceiveInspIncludeDetail = {
  header?: TGetQmsReceiveInspIncludeDetailsHeader;
  details?: TGetQmsReceiveInspIncludeDetailsDetail[];
};
type TGetQmsReceiveInspIncludeDetailsHeader = {
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
type TGetQmsReceiveInspIncludeDetailsDetail = {
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

type TGetQmsProcInspIncludeDetail = {
  header?: TGetQmsProcInspIncludeDetailsHeader;
  details?: TGetQmsProcInspIncludeDetailsDetail[];
};
type TGetQmsProcInspIncludeDetailsHeader = {
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
type TGetQmsProcInspIncludeDetailsDetail = {
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

type TPostQmsInsp = {
  header?: TPutQmsInspsHeader;
  details?: TPutQmsInspsDetail[];
};
type TPostQmsInspsHeader = {
  uuid?: string;
  factory_uuid?: string;
  insp_type_cd?: string;
  insp_no?: string;
  prod_uuid?: string;
  reg_date?: string;
  apply_fg?: boolean;
  apply_date?: string;
  contents?: string;
  remark?: string;
};
type TPostQmsInspsDetail = {
  factory_uuid?: string;
  insp_item_uuid?: string;
  insp_item_desc?: string;
  spec_std?: string;
  spec_min?: number;
  spec_max?: number;
  insp_method_uuid?: string;
  insp_tool_uuid?: string;
  sortby?: number;
  position_no?: number;
  special_property?: string;
  worker_sample_cnt?: number;
  worker_insp_cycle?: string;
  inspector_sample_cnt?: number;
  inspector_insp_cycle?: string;
  remark?: string;
};

type TPutQmsInsp = {
  header?: TPutQmsInspsHeader;
  details?: TPutQmsInspsDetail[];
};
type TPutQmsInspsHeader = {
  uuid?: string;
  insp_no?: string;
  apply_fg?: boolean;
  apply_date?: string;
  contents?: string;
  remark?: string;
};
type TPutQmsInspsDetail = {
  insp_item_desc?: string;
  spec_std?: string;
  spec_min?: number;
  spec_max?: number;
  insp_method_uuid?: string;
  insp_tool_uuid?: string;
  sortby?: number;
  position_no?: number;
  special_property?: string;
  worker_sample_cnt?: number;
  worker_insp_cycle?: string;
  inspector_sample_cnt?: number;
  inspector_insp_cycle?: string;
  remark?: string;
};

type TPatchQmsInsp = {
  header?: TPatchQmsInspsHeader;
  details?: TPatchQmsInspsDetail[];
};
type TPatchQmsInspsHeader = {
  uuid?: string;
  insp_no?: string;
  apply_fg?: boolean;
  apply_date?: string;
  contents?: string;
  remark?: string;
};
type TPatchQmsInspsDetail = {
  insp_item_desc?: string;
  spec_std?: string;
  spec_min?: number;
  spec_max?: number;
  insp_method_uuid?: string;
  insp_tool_uuid?: string;
  sortby?: number;
  position_no?: number;
  special_property?: string;
  worker_sample_cnt?: number;
  worker_insp_cycle?: string;
  inspector_sample_cnt?: number;
  inspector_insp_cycle?: string;
  remark?: string;
};

type TDeleteQmsInsp = {
  header?: TDeleteQmsInspsHeader;
  details?: TDeleteQmsInspsDetail[];
};
type TDeleteQmsInspsHeader = {
  uuid?: string;
};
type TDeleteQmsInspsDetail = {
  uuid?: string;
};
//#endregion

//#region 🔶 ProcInsp Type
type TGetQmsProcInspResultsReport = {
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

type TGetQmsProcInspResultIncludeDetail = {
  header?: TGetQmsProcInspResultIncludeDetailsHeader;
  details?: TGetQmsProcInspResultIncludeDetailsDetail[];
};
type TGetQmsProcInspResultIncludeDetailsHeader = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_cd?: string;
  insp_type_nm?: string;
  insp_detail_type_cd?: string;
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

type TGetQmsProcInspResultIncludeDetailsDetail = {
  insp_result_detail_info_uuid: string;
  factory_uuid: string;
  factory_cd: string;
  factory_nm: string;
  insp_result_uuid: string;
  insp_detail_uuid: string;
  insp_item_type_uuid: string;
  insp_item_type_cd: string;
  insp_item_type_nm: string;
  insp_item_uuid: string;
  insp_item_cd: string;
  insp_item_nm: string;
  insp_item_desc: string;
  spec_std: string;
  spec_min: number;
  spec_max: number;
  insp_method_uuid: string;
  insp_method_cd: string;
  insp_method_nm: string;
  insp_tool_uuid: string;
  insp_tool_cd: string;
  insp_tool_nm: string;
  sample_cnt: number;
  insp_cycle: string;
  sortby: number;
  insp_result_fg: boolean;
  insp_result_state: string;
  remark: string;
  xn_insp_result_detail_value_uuid: string;
  xn_sample_no: number;
  xn_insp_value: number;
  xn_insp_result_fg: boolean;
  xn_insp_result_state: string;
};

type TGetQmsProcInspResult = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_cd?: string;
  insp_type_nm?: string;
  insp_detail_type_cd?: string;
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

type TPostQmsProcInspResult = {
  header?: TPostQmsProcInspResultsHeader;
  details?: TPostQmsProcInspResultsDetail[];
};
type TPostQmsProcInspResultsDetailValue = {
  sample_no?: number;
  insp_result_fg?: boolean;
  insp_value?: number;
};
type TPostQmsProcInspResultsDetail = {
  values?: TPostQmsProcInspResultsDetailValue[];
  factory_uuid?: string;
  insp_detail_uuid?: string;
  insp_result_fg?: boolean;
  remark?: string;
};
type TPostQmsProcInspResultsHeader = {
  uuid?: string;
  factory_uuid?: string;
  work_uuid?: string;
  insp_detail_type_cd?: string;
  insp_uuid?: string;
  prod_uuid?: string;
  lot_no?: string;
  emp_uuid?: string;
  reg_date?: string;
  insp_result_fg?: boolean;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  remark?: string;
};

type TPutQmsProcInspResult = {
  header?: TPutQmsProcInspResultsHeader;
  details?: TPutQmsProcInspResultsDetail[];
};

type TPutQmsProcInspResultsDetailValue = {
  uuid?: string;
  delete_fg?: boolean;
  sample_no?: number;
  insp_result_fg?: boolean;
  insp_value?: number;
};

type TPutQmsProcInspResultsDetail = {
  values?: TPutQmsProcInspResultsDetailValue[];
  factory_uuid?: string;
  uuid?: string;
  insp_result_fg?: boolean;
  remark?: string;
};

type TPutQmsProcInspResultsHeader = {
  uuid?: string;
  emp_uuid?: string;
  insp_result_fg?: boolean;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  remark?: string;
};

type TDeleteQmsProcInspResult = {
  uuid?: string;
};
//#endregion

//#region 🔶 FinalInsp Type
type TGetQmsFinalInspResultIncludeDetail = {
  header?: TGetQmsFinalInspResultIncludeDetailHeader;
  details?: TGetQmsFinalInspResultIncludeDetailsDetail[];
};
type TGetQmsFinalInspResultIncludeDetailHeader = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_cd?: string;
  insp_type_nm?: string;
  insp_handling_type_cd?: string;
  insp_handling_type_nm?: string;
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
  insp_result_fg?: true;
  insp_result_state?: string;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  max_sample_cnt?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  reject_store_uuid?: string;
  reject_store_cd?: string;
  reject_store_nm?: string;
  reject_location_uuid?: string;
  reject_location_cd?: string;
  reject_location_nm?: string;
  remark?: string;
};
type TGetQmsFinalInspResultIncludeDetailsDetail = {
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

type TGetQmsFinalInspResults = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_cd?: string;
  insp_type_nm?: string;
  insp_handling_type_cd?: string;
  insp_handling_type_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  reject_store_uuid?: string;
  reject_store_cd?: string;
  reject_store_nm?: string;
  reject_location_uuid?: string;
  reject_location_cd?: string;
  reject_location_nm?: string;
  remark?: string;
};

type TPostQmsFinalInspResult = {
  header?: TPostQmsFinalInspResultsHeader;
  details?: TPostQmsFinalInspResultsDetail[];
};
type TPostQmsFinalInspResultsValue = {
  sample_no?: number;
  insp_result_fg?: boolean;
  insp_value?: number;
};
type TPostQmsFinalInspResultsDetail = {
  values?: TPostQmsFinalInspResultsValue[];
  factory_uuid?: string;
  insp_detail_uuid?: string;
  insp_result_fg?: boolean;
  remark?: string;
};
type TPostQmsFinalInspResultsHeader = {
  uuid?: string;
  factory_uuid?: string;
  insp_handling_type_cd?: string;
  insp_uuid?: string;
  prod_uuid?: string;
  lot_no?: string;
  emp_uuid?: string;
  reg_date?: string;
  insp_result_fg?: boolean;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  reject_uuid?: string;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  reject_store_uuid?: string;
  reject_location_uuid?: string;
  remark?: string;
};

type TPutQmsFinalInspResult = {
  header?: TPutQmsFinalInspResultsHeader;
  details?: TPutQmsFinalInspResultsDetail[];
};
type TPutQmsFinalInspResultsValue = {
  uuid: string;
  delete_fg: boolean;
  sample_no: number;
  insp_result_fg: boolean;
  insp_value: number;
};
type TPutQmsFinalInspResultsDetail = {
  values?: TPutQmsFinalInspResultsValue[];
  uuid?: string;
  insp_result_fg?: boolean;
  remark?: string;
};
type TPutQmsFinalInspResultsHeader = {
  uuid?: string;
  emp_uuid?: string;
  insp_result_fg?: boolean;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  reject_uuid?: string;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  reject_store_uuid?: string;
  reject_location_uuid?: string;
  remark?: string;
};

type TDeleteQmsFinalInspResult = {
  uuid?: string;
};
//#endregion

//#region 🔶 ReceiveInsp Type
type TGetQmsReceiveInspResultWaiting = {
  receive_detail_uuid: string;
  receive_uuid: string;
  seq: number;
  stmt_no: string;
  stmt_no_sub: string;
  reg_date: string;
  insp_detail_type_cd: string;
  insp_detail_type_nm: string;
  factory_uuid: string;
  factory_cd: string;
  factory_nm: string;
  order_detail_uuid: string;
  prod_uuid: string;
  prod_no: string;
  prod_nm: string;
  item_type_uuid: string;
  item_type_cd: string;
  item_type_nm: string;
  prod_type_uuid: string;
  prod_type_cd: string;
  prod_type_nm: string;
  model_uuid: string;
  model_cd: string;
  model_nm: string;
  rev: string;
  prod_std: string;
  unit_uuid: string;
  unit_cd: string;
  unit_nm: string;
  lot_no: string;
  order_qty: number;
  qty: number;
  price: number;
  money_unit_uuid: string;
  money_unit_cd: string;
  money_unit_nm: string;
  exchange: string;
  total_price: number;
  unit_qty: number;
  insp_fg: boolean;
  insp_result: string;
  carry_fg: boolean;
  to_store_uuid: string;
  to_store_cd: string;
  to_store_nm: string;
  to_location_uuid: string;
  to_location_cd: string;
  to_location_nm: string;
  remark: string;
  barcode: string;
};

type TGetQmsReceiveInspResultsIncludeDetail = {
  header?: TGetQmsReceiveInspResultIncludeDetailsHeader;
  details?: TGetQmsReceiveInspResultIncludeDetailsDetail[];
};
type TGetQmsReceiveInspResultIncludeDetailsHeader = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_cd?: string;
  insp_type_nm?: string;
  insp_detail_type_cd?: string;
  insp_detail_type_nm?: string;
  insp_handling_type_cd?: string;
  insp_handling_type_nm?: string;
  receive_detail_uuid?: string;
  stmt_no_sub?: string;
  receive_date?: string;
  partner_uuid?: string;
  partner_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  max_sample_cnt?: number;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  reject_store_uuid?: string;
  reject_store_cd?: string;
  reject_store_nm?: string;
  reject_location_uuid?: string;
  reject_location_cd?: string;
  reject_location_nm?: string;
  remark?: string;
};
type TGetQmsReceiveInspResultIncludeDetailsDetail = {
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
  sortby?: boolean;
  insp_result_fg?: boolean;
  insp_result_state?: string;
  remark?: string;
  xn_insp_result_detail_value_uuid?: string;
  xn_sample_no?: number;
  xn_insp_value?: number;
  xn_insp_result_fg?: boolean;
  xn_insp_result_state?: string;
};

type TGetQmsReceiveInspResult = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_cd?: string;
  insp_type_nm?: string;
  insp_detail_type_cd?: string;
  insp_detail_type_nm?: string;
  insp_handling_type_cd?: string;
  insp_handling_type_nm?: string;
  receive_detail_uuid?: string;
  receive_date?: string;
  partner_uuid?: string;
  partner_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  reject_store_uuid?: string;
  reject_store_cd?: string;
  reject_store_nm?: string;
  reject_location_uuid?: string;
  reject_location_cd?: string;
  reject_location_nm?: string;
  remark?: string;
};

type TPostQmsReceiveInspResult = {
  header?: TPostQmsReceiveInspResultsHeader;
  details?: TPostQmsReceiveInspResultsDetail[];
};
type TPostQmsReceiveInspResultsValue = {
  sample_no?: number;
  insp_result_fg?: boolean;
  insp_value?: number;
};
type TPostQmsReceiveInspResultsDetail = {
  values?: TPostQmsReceiveInspResultsValue[];
  factory_uuid?: string;
  insp_detail_uuid?: string;
  insp_result_fg?: boolean;
  remark?: string;
};
type TPostQmsReceiveInspResultsHeader = {
  uuid?: string;
  factory_uuid?: string;
  receive_detail_uuid?: string;
  insp_detail_type_cd?: string;
  insp_handling_type_cd?: string;
  insp_uuid?: string;
  prod_uuid?: string;
  unit_uuid?: string;
  lot_no?: string;
  emp_uuid?: string;
  reg_date?: string;
  insp_result_fg?: boolean;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  reject_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  reject_store_uuid?: string;
  reject_location_uuid?: string;
  remark?: string;
};

type TPutQmsReceiveInspResults = {
  header?: TPutQmsReceiveInspResultsHeader;
  details?: TPutQmsReceiveInspResultsDetail[];
};
type TPutQmsReceiveInspResultsValue = {
  uuid?: string;
  delete_fg?: boolean;
  sample_no?: number;
  insp_result_fg?: boolean;
  insp_value?: number;
};
type TPutQmsReceiveInspResultsDetail = {
  valuse?: TPutQmsReceiveInspResultsValue[];
  uuid?: string;
  insp_result_fg?: boolean;
  remark?: string;
};
type TPutQmsReceiveInspResultsHeader = {
  uuid?: string;
  insp_detail_type_cd?: string;
  emp_uuid?: string;
  unit_uuid?: string;
  insp_result_fg?: boolean;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  reject_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  reject_store_uuid?: string;
  reject_location_uuid?: string;
  remark?: string;
};

type TDeleteQmsReceiveInspResults = {
  uuid?: string;
  insp_detail_type_cd?: string;
};
//#endregion

//#region 🔶 Rework Type
type TGetQmsRework = {
  rework_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
  insp_type_nm?: string;
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
  rework_type_cd?: string;
  rework_type_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  qty?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  remark?: string;
};

type TPostQmsReworksDisassemble = {
  header?: TPostQmsReworksDisassemblesHeader;
  details?: TPostQmsReworksDisassemblesDetail[];
};
type TPostQmsReworksDisassemblesHeader = {
  factory_uuid?: string;
  reg_date?: string;
  prod_uuid?: string;
  lot_no?: string;
  reject_uuid?: string;
  qty?: number;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
};
type TPostQmsReworksDisassemblesDetail = {
  factory_uuid?: string;
  prod_uuid?: string;
  lot_no?: string;
  income_qty?: number;
  return_qty?: number;
  disposal_qty?: number;
  income_store_uuid?: string;
  income_location_uuid?: string;
  return_store_uuid?: string;
  return_location_uuid?: string;
  remark?: string;
};

type TPostQmsRework = {
  factory_uuid?: string;
  reg_date?: string;
  prod_uuid?: string;
  lot_no?: string;
  rework_type_cd?: string;
  reject_uuid?: string;
  qty?: number;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  remark?: string;
};

type TPutQmsRework = {
  uuid: string;
  remark: string;
};

type TPatchQmsRework = {
  uuid: string;
  remark: string;
};

type TDeleteQmsRework = {
  uuid: string;
};

//#endregion

//#region 🔶 ReworkDisassemble Type
type TGetQmsReworkDisassemble = {
  rework_disassemble_uuid: string;
  factory_uuid: string;
  factory_cd: string;
  factory_nm: string;
  rework_uuid: string;
  prod_uuid: string;
  prod_no: string;
  prod_nm: string;
  item_type_uuid: string;
  item_type_cd: string;
  item_type_nm: string;
  prod_type_uuid: string;
  prod_type_cd: string;
  prod_type_nm: string;
  model_uuid: string;
  model_cd: string;
  model_nm: string;
  rev: string;
  prod_std: string;
  unit_uuid: string;
  unit_cd: string;
  unit_nm: string;
  lot_no: string;
  income_qty: number;
  return_qty: number;
  disposal_qty: number;
  income_store_uuid: string;
  income_store_cd: string;
  income_store_nm: string;
  income_location_uuid: string;
  income_location_cd: string;
  income_location_nm: string;
  return_store_uuid: string;
  return_store_cd: string;
  return_store_nm: string;
  return_location_uuid: string;
  return_location_cd: string;
  return_location_nm: string;
  remark: string;
};
//#endregion

//#endregion

export interface CloudTenant {
  uuid: string;
}
