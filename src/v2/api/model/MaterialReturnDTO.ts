import { isNil } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { MESEntity } from './MESEntity';

export interface MaterialReturnGetResponseEntity extends MESEntity {
  created_at: string;
  created_nm: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  partner_cd: string;
  partner_nm: string;
  partner_uuid: string;
  receive_date: string;
  receive_stmt_no: string;
  receive_total_price: string;
  receive_total_qty: string;
  receive_uuid: string;
  reg_date: string;
  remark: string;
  return_uuid: string;
  stmt_no: string;
  supplier_cd: string;
  supplier_nm: string;
  supplier_uuid: string;
  total_price: string;
  total_qty: string;
  updated_at: string;
  updated_nm: string;
}

export interface MaterialReturnDetailGetResponseEntity extends MESEntity {
  barcode: string;
  convert_value: string;
  created_at: string;
  created_nm: string;
  exchange: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  from_location_cd: string;
  from_location_nm: string;
  from_location_uuid: string;
  from_store_cd: string;
  from_store_nm: string;
  from_store_uuid: string;
  item_type_cd: string;
  item_type_nm: string;
  item_type_uuid: string;
  lot_no: string;
  model_cd: string;
  model_nm: string;
  model_uuid: string;
  money_unit_cd: string;
  money_unit_nm: string;
  money_unit_uuid: string;
  price: string;
  prod_nm: string;
  prod_no: string;
  prod_std: string;
  prod_type_cd: string;
  prod_type_nm: string;
  prod_type_uuid: string;
  prod_uuid: string;
  qty: string;
  receive_detail_uuid: string;
  receive_qty: string;
  remark: string;
  return_detail_uuid: string;
  return_qty: string;
  return_unit_cd: string;
  return_unit_nm: string;
  return_unit_uuid: string;
  return_uuid: string;
  rev: string;
  safe_stock: string;
  stmt_no: string;
  stmt_no_sub: string;
  total_price: string;
  unit_cd: string;
  unit_nm: string;
  unit_uuid: string;
  updated_at: string;
  updated_nm: string;
}

export interface MaterialReturnResponseEntity
  extends MaterialReturnGetResponseEntity {
  header: {
    return_id: number;
    factory_id: number;
    partner_id: number;
    supplier_id: string;
    stmt_no: string;
    reg_date: string;
    total_price: string;
    total_qty: string;
    receive_id: string;
    remark: string;
    created_at: string;
    created_uid: number;
    updated_at: string;
    updated_uid: number;
    uuid: string;
  };
  details: [
    {
      return_detail_id: number;
      return_id: number;
      seq: number;
      factory_id: number;
      prod_id: number;
      unit_id: number;
      lot_no: string;
      qty: string;
      convert_value: string;
      price: string;
      money_unit_id: number;
      exchange: string;
      total_price: string;
      receive_detail_id: string;
      from_store_id: number;
      from_location_id: string;
      remark: string;
      barcode: string;
      created_at: string;
      created_uid: number;
      updated_at: string;
      updated_uid: number;
      uuid: string;
    },
  ];
  store: [
    {
      tran_id: number;
      inout_fg: boolean;
      tran_type_id: number;
      factory_id: number;
      reg_date: string;
      store_id: number;
      location_id: string;
      prod_id: number;
      reject_id: string;
      partner_id: string;
      lot_no: string;
      qty: string;
      remark: string;
      created_at: string;
      created_uid: number;
      updated_at: string;
      updated_uid: number;
      uuid: string;
    },
  ];
}

export class MaterialReturnRequestDTO {
  private readonly uuid: string;
  private readonly supplier_uuid: string;
  private readonly stmt_no: string;
  private readonly remark: string;

  private constructor(entity: MaterialReturnGetResponseEntity) {
    if (isNil(entity.return_uuid)) {
      throw new RequiredFieldException(MESSAGE.RETURN_UUID_IS_REQUIRED);
    } else if (isNil(entity.stmt_no)) {
      throw new RequiredFieldException(MESSAGE.STMT_NO_IS_REQUIRED);
    }

    this.uuid = entity.return_uuid;
    this.supplier_uuid = entity.supplier_uuid;
    this.stmt_no = entity.stmt_no;
    this.remark = entity.remark;
  }

  public static of(entity: MaterialReturnGetResponseEntity) {
    return new MaterialReturnRequestDTO(entity);
  }

  public toString() {
    return `MaterialReturnRequestDTO {
        uuid: ${this.uuid},
        supplier_uuid: ${this.supplier_uuid},
        stmt_no: ${this.stmt_no},
        remark: ${this.remark},
    }`;
  }
}

export class MaterialReturnDetailRequestDTO {
  private readonly uuid: string;
  private readonly qty: number;
  private readonly convert_value: number;
  private readonly price: number;
  private readonly money_unit_uuid: string;
  private readonly exchange: string;
  private readonly remark: string;

  private constructor(entity: MaterialReturnDetailGetResponseEntity) {
    if (isNil(entity.return_detail_uuid)) {
      throw new RequiredFieldException(MESSAGE.RETURN_DETAIL_UUID_IS_REQUIRED);
    } else if (isNil(entity.qty)) {
      throw new RequiredFieldException(MESSAGE.QTY_IS_REQUIRED);
    } else if (isNil(entity.convert_value)) {
      throw new RequiredFieldException(MESSAGE.CONVERT_VALUE_IS_REQUIRED);
    } else if (isNil(entity.price)) {
      throw new RequiredFieldException(MESSAGE.PRICE_IS_REQUIRED);
    } else if (isNil(entity.money_unit_uuid)) {
      throw new RequiredFieldException(MESSAGE.MONEY_UNIT_UUID_IS_REQUIRED);
    } else if (isNil(entity.exchange)) {
      throw new RequiredFieldException(MESSAGE.EXCHANGE_IS_REQUIRED);
    }

    this.uuid = entity.return_detail_uuid;
    this.qty = Number(entity.qty);
    this.convert_value = Number(entity.convert_value);
    this.price = Number(entity.price);
    this.money_unit_uuid = entity.money_unit_uuid;
    this.exchange = entity.exchange;
    this.remark = entity.remark;
  }

  public static of(entity: MaterialReturnDetailGetResponseEntity) {
    return new MaterialReturnDetailRequestDTO(entity);
  }

  public toString() {
    return `MaterialReturnDetailRequestDTO {
        uuid: ${this.uuid},
        qty: ${this.qty},
        convert_value: ${this.convert_value},
        price: ${this.price},
        money_unit_uuid: ${this.money_unit_uuid},
        exchange: ${this.exchange},
        remark: ${this.remark},
    }`;
  }
}
