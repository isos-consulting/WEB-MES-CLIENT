import { mesRequest } from '../request-factory';

export type ReceiveHeader = {
  order_date: null | string;
  order_stmt_no: null | string;
  order_total_price: null | string;
  order_total_qty: null | string;
  partner_cd: string;
  partner_nm: string;
  partner_uuid: string;
  receive_uuid: string;
  reg_date: string;
  remark: null | string;
  stmt_no: string;
  supplier_cd: null | string;
  supplier_nm: null | string;
  supplier_uuid: null | string;
  total_price: string;
  total_qty: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  created_at: string;
  created_nm: string;
  updated_at: string;
  updated_nm: string;
};

type ReceiveResponse = ReceiveHeader[];

type ReceiveDetailResponse = {
  header: ReceiveHeader;
  details: {
    seq: number;
    barcode: null | string;
    carry_fg: boolean;
    exchange: string;
    factory_cd: string;
    factory_nm: string;
    factory_uuid: string;
    income_uuid: null | string;
    insp_fg: boolean;
    insp_result: string;
    inv_safe_qty: null | string;
    item_type_cd: string;
    item_type_nm: string;
    item_type_uuid: string;
    lot_no: string;
    manufactured_lot_no: null | string;
    model_cd: null | string;
    model_nm: null | string;
    model_uuid: null | string;
    money_unit_cd: string;
    money_unit_nm: string;
    money_unit_uuid: string;
    order_detail_uuid: string;
    order_qty: string;
    price: string;
    prod_nm: string;
    prod_no: string;
    prod_std: null | string;
    prod_type_cd: null | string;
    prod_type_nm: null | string;
    prod_type_uuid: null | string;
    prod_uuid: string;
    qty: string;
    receive_detail_uuid: string;
    receive_uuid: string;
    remark: null | string;
    rev: string;
    stmt_no: string;
    stmt_no_sub: string;
    to_location_cd: null | string;
    to_location_nm: null | string;
    to_location_uuid: null | string;
    to_store_cd: string;
    to_store_nm: string;
    to_store_uuid: string;
    total_price: string;
    unit_cd: string;
    unit_nm: string;
    unit_qty: null | string;
    unit_uuid: string;
    created_at: string;
    created_nm: string;
    created_uid: number;
    updated_at: string;
    updated_nm: string;
    updated_uid: number;
  }[];
}[];

export interface ReceiveRemoteStore {
  getHeader(start_date: string, end_date: string): Promise<ReceiveResponse>;
  getDetail(receive_uuid: string): Promise<ReceiveDetailResponse>;
}

export const ReceiveRemoteStoreInstance = class implements ReceiveRemoteStore {
  getHeader(start_date: string, end_date: string) {
    return mesRequest.get<unknown, ReceiveResponse>('mat/receives', {
      params: { start_date, end_date },
    });
  }

  getDetail(receive_uuid: string) {
    return mesRequest.get<unknown, ReceiveDetailResponse>(
      `mat/receive/${receive_uuid}/include-details`,
    );
  }
};
