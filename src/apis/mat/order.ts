import { mesRequest } from '../request-factory';

type OrderDetailResponse = {
  balance: string;
  complete_fg: boolean;
  complete_state: string;
  created_at: string;
  created_nm: string;
  due_date: null | string;
  exchange: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  item_type_cd: string;
  item_type_nm: string;
  item_type_uuid: string;
  model_cd: string;
  model_nm: string;
  model_uuid: string;
  money_unit_cd: string;
  money_unit_nm: string;
  money_unit_uuid: string;
  order_detail_uuid: string;
  order_uuid: string;
  price: string;
  prod_nm: string;
  prod_no: string;
  prod_std: string;
  prod_type_cd: string;
  prod_type_nm: string;
  prod_type_uuid: string;
  prod_uuid: string;
  qms_receive_insp_fg: boolean;
  qty: string;
  remark: null | string;
  rev: string;
  seq: number;
  stmt_no: string;
  stmt_no_sub: string;
  to_location_cd: null | string;
  to_location_nm: null | string;
  to_location_uuid: null | string;
  to_store_cd: null | string;
  to_store_nm: null | string;
  to_store_uuid: null | string;
  total_price: string;
  unit_cd: string;
  unit_nm: string;
  unit_qty: null | string;
  unit_uuid: string;
  updated_at: string;
  updated_nm: string;
};

export const OrderRemoteStore = class {
  static getDetail(partner_uuid) {
    return mesRequest.get<unknown, OrderDetailResponse>(`mat/order-details`, {
      params: {
        complete_state: 'incomplete',
        partner_uuid,
      },
    });
  }
};
