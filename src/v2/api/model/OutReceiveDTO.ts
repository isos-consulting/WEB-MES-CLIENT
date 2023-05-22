import { isEmpty, isNil } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { MESEntity } from './MESEntity';

export interface OutReceiveGetResponseEntity extends MESEntity {
  created_at: string;
  created_nm: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  partner_cd: string;
  partner_nm: string;
  partner_uuid: string;
  receive_uuid: string;
  reg_date: string;
  remark: string;
  stmt_no: string;
  supplier_cd: string;
  supplier_nm: string;
  supplier_uuid: string;
  total_price: string;
  total_qty: string;
  updated_at: string;
  updated_nm: string;
}

export interface OutReceiveDetailGetResponseEntity extends MESEntity {
  barcode: string;
  carry_fg: boolean;
  created_at: string;
  created_nm: string;
  created_uid: number;
  exchange: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  income_uuid: string;
  insp_fg: boolean;
  insp_result: string;
  inv_safe_qty: number;
  item_type_cd: string;
  item_type_nm: string;
  item_type_uuid: string;
  lot_no: string;
  manufactured_lot_no: string;
  model_cd: string;
  model_nm: string;
  model_uuid: string;
  money_unit_cd: string;
  money_unit_nm: string;
  money_unit_uuid: string;
  order_detail_uuid: string;
  order_qty: string;
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
  receive_uuid: string;
  remark: string;
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
  unit_qty: string;
  unit_uuid: string;
  updated_at: string;
  updated_nm: string;
  updated_uid: number;
}

export interface OutReceiveResponseEntity extends MESEntity {
  header: {
    receive_id: number;
    factory_id: number;
    partner_id: number;
    supplier_id: string;
    stmt_no: string;
    reg_date: string;
    total_price: string;
    total_qty: string;
    remark: string;
    created_at: string;
    created_uid: number;
    updated_at: string;
    updated_uid: number;
    uuid: string;
  };
  details: [
    {
      receive_detail_id: number;
      receive_id: number;
      seq: number;
      factory_id: number;
      prod_id: number;
      unit_id: number;
      lot_no: string;
      manufactured_lot_no: string;
      qty: string;
      price: string;
      money_unit_id: number;
      exchange: string;
      total_price: string;
      unit_qty: string;
      insp_fg: boolean;
      carry_fg: boolean;
      order_detail_id: string;
      to_store_id: number;
      to_location_id: number;
      remark: string;
      barcode: string;
      created_at: string;
      created_uid: number;
      updated_at: string;
      updated_uid: number;
      uuid: string;
    },
  ];
  income: [
    {
      created_at: string;
      updated_at: string;
      uuid: string;
      income_id: number;
      factory_id: number;
      prod_id: number;
      reg_date: string;
      lot_no: string;
      qty: string;
      receive_detail_id: number;
      to_store_id: number;
      to_location_id: number;
      remark: string;
      barcode: string;
      created_uid: number;
      updated_uid: number;
    },
  ];
  input: [
    {
      created_at: string;
      updated_at: string;
      uuid: string;
      work_input_id: number;
      factory_id: number;
      receive_detail_id: number;
      prod_id: number;
      lot_no: string;
      qty: string;
      c_usage: string;
      from_store_id: number;
      from_location_id: string;
      created_uid: number;
      updated_uid: number;
    },
  ];
  fromStore: [
    {
      created_at: string;
      updated_at: string;
      uuid: string;
      factory_id: number;
      tran_id: number;
      inout_fg: boolean;
      tran_type_id: number;
      reg_date: string;
      store_id: number;
      location_id: string;
      prod_id: number;
      reject_id: string;
      partner_id: string;
      lot_no: string;
      qty: string;
      remark: string;
      created_uid: number;
      updated_uid: number;
    },
  ];
  toStore: [
    {
      created_at: string;
      updated_at: string;
      uuid: string;
      factory_id: number;
      tran_id: number;
      inout_fg: boolean;
      tran_type_id: number;
      reg_date: string;
      store_id: number;
      location_id: number;
      prod_id: number;
      reject_id: string;
      partner_id: string;
      lot_no: string;
      qty: string;
      remark: string;
      created_uid: number;
      updated_uid: number;
    },
  ];
}

export class OutReceiveRequestDTO {
  private readonly uuid: string;
  private readonly supplier_uuid: string;
  private readonly stmt_no: string;
  private readonly remark: string;

  private constructor(entity: OutReceiveGetResponseEntity) {
    if (isNil(entity.receive_uuid)) {
      throw new RequiredFieldException(MESSAGE.OUT_RECEIVE_UUID_IS_REQUIRED);
    } else if (isNil(entity.stmt_no)) {
      throw new RequiredFieldException(MESSAGE.STMT_NO_IS_REQUIRED);
    }

    this.uuid = entity.receive_uuid;
    this.supplier_uuid = entity.supplier_uuid;
    this.stmt_no = entity.stmt_no;
    this.remark = entity.remark;
  }

  public static of(entity: OutReceiveGetResponseEntity) {
    return new OutReceiveRequestDTO(entity);
  }

  public toString() {
    return `OutReceiveRequestDTO {
        uuid: ${this.uuid},
        supplier_uuid: ${this.supplier_uuid},
        stmt_no: ${this.stmt_no},
        remark: ${this.remark}
    }`;
  }
}

export class OutReceiveDetailRequestDTO {
  private readonly uuid: string;
  private readonly manufactured_lot_no: string;
  private readonly qty: number;
  private readonly price: number;
  private readonly money_unit_uuid: string;
  private readonly exchange: string;
  private readonly unit_qty: number;
  private readonly carry_fg: boolean;
  private readonly remark: string;

  private constructor(entity: OutReceiveDetailGetResponseEntity) {
    if (isNil(entity.receive_detail_uuid)) {
      throw new RequiredFieldException(
        MESSAGE.OUT_RECEIVE_DETAIL_UUID_IS_REQUIRED,
      );
    } else if (isEmpty(entity.qty)) {
      throw new RequiredFieldException(MESSAGE.QTY_IS_REQUIRED);
    } else if (isEmpty(entity.price)) {
      throw new RequiredFieldException(MESSAGE.PRICE_IS_REQUIRED);
    } else if (isNil(entity.exchange)) {
      throw new RequiredFieldException(MESSAGE.EXCHANGE_IS_REQUIRED);
    } else if (isNil(entity.carry_fg)) {
      throw new RequiredFieldException(MESSAGE.CARRY_FG_IS_REQUIRED);
    }

    this.uuid = entity.receive_detail_uuid;
    this.manufactured_lot_no = entity.manufactured_lot_no;
    this.qty = Number(entity.qty);
    this.price = Number(entity.price);
    this.money_unit_uuid = entity.money_unit_uuid;
    this.exchange = entity.exchange;
    this.unit_qty = Number(entity.unit_qty);
    this.carry_fg = entity.carry_fg;
    this.remark = entity.remark;
  }

  public static of(entity: OutReceiveDetailGetResponseEntity) {
    return new OutReceiveDetailRequestDTO(entity);
  }

  public toString() {
    return `OutReceiveDetailRequestDTO {
        uuid: ${this.uuid},
        manufactured_lot_no: ${this.manufactured_lot_no},
        qty: ${this.qty},
        price: ${this.price},
        money_unit_uuid: ${this.money_unit_uuid},
        exchange: ${this.exchange},
        unit_qty: ${this.unit_qty},
        carry_fg: ${this.carry_fg},
        remark: ${this.remark}
    }`;
  }
}
