import { isNil, isString } from '~/helper/common';
import { MESEntity } from './MESEntity';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { isEmpty } from 'lodash';

export interface MaterialOrderDetailGetResponseEntity extends MESEntity {
  balance: string;
  complete_fg: boolean;
  complete_state: string;
  created_at: string;
  created_nm: string;
  due_date: string;
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
}

export interface MaterialOrderGetResponseEntity extends MESEntity {
  created_at: string;
  created_nm: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  order_uuid: string;
  partner_cd: string;
  partner_nm: string;
  partner_uuid: string;
  reg_date: string;
  remark: string;
  stmt_no: string;
  total_price: string;
  total_qty: string;
  updated_at: string;
  updated_nm: string;
}

export interface MaterialOrderResponseEntity extends MESEntity {
  header: {
    uuid: string;
    stmt_no: string;
    remark: string;
    factory_uuid: string;
  };
  details: {
    uuid: string;
    qty: number;
    price: number;
    money_unit_uuid: string;
    exchange: string;
    unit_qty: number;
    due_date: string;
    complete_fg: boolean;
    remark: string;
    factory_uuid: string;
  }[];
}

export class MaterialOrderDetailRequestDTO {
  private readonly uuid: string;
  private readonly qty: number;
  private readonly price: number;
  private readonly money_unit_uuid: string;
  private readonly exchange: string;
  private readonly unit_qty: number;
  private readonly due_date: string;
  private readonly complete_fg: boolean;
  private readonly remark: string;

  private constructor(entity: MaterialOrderDetailGetResponseEntity) {
    if (isNil(entity.order_detail_uuid)) {
      throw new RequiredFieldException('order_detail_uuid');
    } else if (isNil(entity.qty)) {
      throw new RequiredFieldException('qty');
    } else if (isNil(entity.price)) {
      throw new RequiredFieldException('price');
    } else if (isNil(entity.exchange)) {
      throw new RequiredFieldException('exchange');
    } else if (isNil(entity.complete_fg)) {
      throw new RequiredFieldException('complete_fg');
    }

    this.uuid = entity.order_detail_uuid;
    this.qty = Number(entity.qty);
    this.price = Number(entity.price);
    this.money_unit_uuid = entity.money_unit_uuid;
    this.exchange = entity.exchange;

    if (isString(entity.unit_qty) && isEmpty(entity.unit_qty)) {
      this.unit_qty = null;
    } else {
      this.unit_qty = Number(entity.unit_qty);
    }

    this.due_date = entity.due_date;
    this.complete_fg = entity.complete_fg;
    this.remark = entity.remark;
  }

  public static of(entity: MaterialOrderDetailGetResponseEntity) {
    return new MaterialOrderDetailRequestDTO(entity);
  }

  public toString() {
    return `MaterialOrderDetailRequestDTO {
        uuid: ${this.uuid},
        qty: ${this.qty},
        price: ${this.price},
        money_unit_uuid: ${this.money_unit_uuid},
        exchange: ${this.exchange},
        unit_qty: ${this.unit_qty},
        due_date: ${this.due_date},
        complete_fg: ${this.complete_fg},
        remark: ${this.remark}
    }`;
  }
}

export class MaterialOrderRequestDTO {
  private readonly uuid: string;
  private readonly stmt_no: string;
  private readonly remark: string;

  private constructor(entity: MaterialOrderGetResponseEntity) {
    this.uuid = entity.order_uuid;
    this.stmt_no = entity.stmt_no;
    this.remark = entity.remark;
  }

  public static of(entity: MaterialOrderGetResponseEntity) {
    return new MaterialOrderRequestDTO(entity);
  }

  public toString() {
    return `MaterialOrderRequestDTO {
        uuid: ${this.uuid},
        stmt_no: ${this.stmt_no},
        remark: ${this.remark}
    }`;
  }
}
