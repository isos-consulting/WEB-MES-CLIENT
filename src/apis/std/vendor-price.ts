import { mesRequest } from '../request-factory';

type VendorPriceResponse = {
  created_at: string;
  created_nm: string;
  division: null | string;
  end_date: string;
  item_type_cd: string;
  item_type_nm: string;
  item_type_uuid: string;
  mat_order_min_qty: null | string;
  model_cd: string;
  model_nm: string;
  model_uuid: string;
  money_unit_cd: string;
  money_unit_nm: string;
  money_unit_uuid: string;
  partner_cd: string;
  partner_nm: string;
  partner_uuid: string;
  price: string;
  price_type_cd: string;
  price_type_nm: string;
  price_type_uuid: string;
  prod_nm: string;
  prod_no: string;
  prod_std: string;
  prod_type_cd: string;
  prod_type_nm: string;
  prod_type_uuid: string;
  prod_uuid: string;
  qms_receive_insp_fg: true;
  remark: null | string;
  retroactive_price: null | string;
  rev: string;
  start_date: string;
  to_location_cd: null | string;
  to_location_nm: null | string;
  to_location_uuid: null | string;
  to_store_cd: null | string;
  to_store_nm: null | string;
  to_store_uuid: null | string;
  unit_cd: string;
  unit_nm: string;
  unit_qty: null | string;
  unit_uuid: string;
  updated_at: string;
  updated_nm: string;
  vendor_price_uuid: string;
}[];

export const VendorPriceRemoteStore = class {
  static get(date, partner_uuid) {
    return mesRequest.get<unknown, VendorPriceResponse>('std/vendor-prices', {
      params: {
        date,
        partner_uuid,
      },
    });
  }
};
