import {
  MatReceiveDetailDto,
  MatReceiveHeaderDto,
} from '~/models/mat/ReceiveDTO';
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

type ReceivePostResponseHeader = {
  remark: null | string;
  order_id: null | number;
  supplier_id: null | number;
  created_at: string;
  reg_date: string;
  stmt_no: string;
  total_price: string;
  total_qty: string;
  updated_at: string;
  uuid: string;
  created_uid: number;
  factory_id: number;
  partner_id: number;
  receive_id: number;
  updated_uid: number;
};

type ReceivePostResponseDetail = {
  barcode: null | string;
  manufactured_lot_no: null | string;
  order_detail_id: null | number;
  remark: null | string;
  to_location_id: null | number;
  unit_qty: null | number;
  created_at: string;
  exchange: string;
  lot_no: string;
  price: string;
  qty: string;
  total_price: string;
  updated_at: string;
  uuid: string;
  created_uid: number;
  factory_id: number;
  money_unit_id: number;
  prod_id: number;
  receive_detail_id: number;
  receive_id: number;
  seq: number;
  to_store_id: number;
  unit_id: number;
  updated_uid: number;
  insp_fg: boolean;
  carry_fg: boolean;
};

type ReceivePostResponse = {
  header: ReceivePostResponseHeader;
  details: ReceivePostResponseDetail[];
  income: unknown[];
  store: unknown[];
};

export interface ReceiveRemoteStore {
  getHeader(start_date: string, end_date: string): Promise<ReceiveResponse>;
  getDetail(receive_uuid: string): Promise<ReceiveDetailResponse>;
  add: (
    header: MatReceiveHeaderDto,
    details: MatReceiveDetailDto[],
  ) => Promise<unknown>;
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

  add(header, details) {
    return mesRequest.post<unknown, ReceivePostResponse>('mat/receives', {
      header,
      details,
    });
  }
};
