import { isEmpty, isNil } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { MESEntity } from './MESEntity';

export interface SalesReturnGetResponseEntity extends MESEntity {
  created_at: string;
  created_nm: string;
  delivery_cd: string;
  delivery_nm: string;
  delivery_uuid: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  outgo_date: string;
  outgo_stmt_no: string;
  outgo_total_price: string;
  outgo_total_qty: string;
  outgo_uuid: string;
  partner_cd: string;
  partner_nm: string;
  partner_uuid: string;
  reg_date: string;
  remark: string;
  return_uuid: string;
  stmt_no: string;
  total_price: string;
  total_qty: string;
  updated_at: string;
  updated_nm: string;
}

export interface SalesReturnResponseEntity
  extends SalesReturnGetResponseEntity {}

export interface SalesReturnDetailGetResponseEntity extends MESEntity {
  barcode: string;
  created_at: string;
  created_nm: string;
  exchange: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
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
  outgo_detail_uuid: string;
  outgo_qty: string;
  price: string;
  prod_nm: string;
  prod_no: string;
  prod_std: string;
  prod_type_cd: string;
  prod_type_nm: string;
  prod_type_uuid: string;
  prod_uuid: string;
  qty: string;
  reject_cd: string;
  reject_nm: string;
  reject_type_cd: string;
  reject_type_nm: string;
  reject_type_uuid: string;
  reject_uuid: string;
  remark: string;
  return_detail_uuid: string;
  return_uuid: string;
  rev: string;
  seq: number;
  stmt_no: string;
  stmt_no_sub: string;
  to_location_cd: string;
  to_location_nm: string;
  to_location_uuid: string;
  to_store_cd: string;
  to_store_nm: string;
  to_store_uuid: string;
  total_price: string;
  unit_cd: string;
  unit_nm: string;
  unit_uuid: string;
  updated_at: string;
  updated_nm: string;
}

export class SalesReturnRequestDTO {
  private readonly uuid: string;
  private readonly delivery_uuid: string;
  private readonly stmt_no: string;
  private readonly remark: string;

  private constructor(entity: SalesReturnGetResponseEntity) {
    if (isNil(entity.return_uuid)) {
      throw new RequiredFieldException(MESSAGE.SALES_RETURN_UUID_IS_REQUIRED);
    } else if (isNil(entity.stmt_no)) {
      throw new RequiredFieldException(MESSAGE.STMT_NO_IS_REQUIRED);
    }

    this.uuid = entity.return_uuid;
    this.delivery_uuid = entity.delivery_uuid;
    this.stmt_no = entity.stmt_no;
    this.remark = entity.remark;
  }

  public static from(entity: SalesReturnGetResponseEntity) {
    return new SalesReturnRequestDTO(entity);
  }

  public toString() {
    return `SalesReturnRequestDTO{
        uuid: ${this.uuid},
        delivery_uuid: ${this.delivery_uuid},
        stmt_no: ${this.stmt_no},
        remark: ${this.remark}
    }`;
  }
}

export class SalesReturnDetailRequestDTO {
  private readonly uuid: string;
  private readonly qty: number;
  private readonly price: number;
  private readonly money_unit_uuid: string;
  private readonly exchange: string;
  private readonly remark: string;

  private constructor(entity: SalesReturnDetailGetResponseEntity) {
    if (isNil(entity.return_detail_uuid)) {
      throw new RequiredFieldException(
        MESSAGE.SALES_RETURN_DETAIL_UUID_IS_REQUIRED,
      );
    } else if (isEmpty(entity.qty)) {
      throw new RequiredFieldException(MESSAGE.QTY_IS_REQUIRED);
    } else if (isEmpty(entity.price)) {
      throw new RequiredFieldException(MESSAGE.PRICE_IS_REQUIRED);
    } else if (isNil(entity.exchange)) {
      throw new RequiredFieldException(MESSAGE.EXCHANGE_IS_REQUIRED);
    }

    this.uuid = entity.return_detail_uuid;
    this.qty = Number(entity.qty);
    this.price = Number(entity.price);
    this.money_unit_uuid = entity.money_unit_uuid;
    this.exchange = entity.exchange;
    this.remark = entity.remark;
  }

  public static from(entity: SalesReturnDetailGetResponseEntity) {
    return new SalesReturnDetailRequestDTO(entity);
  }

  public toString() {
    return `SalesReturnDetailRequestDTO{
        uuid: ${this.uuid},
        qty: ${this.qty},
        price: ${this.price},
        money_unit_uuid: ${this.money_unit_uuid},
        exchange: ${this.exchange},
        remark: ${this.remark}
    }`;
  }
}
