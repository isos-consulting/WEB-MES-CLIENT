import { getToday } from '~/functions';
import { isEmpty } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { LotNumberGenerator } from '~/v2/util/LotNumberGenerator';
import { MESEntity } from './MESEntity';

export interface ProductionWorkStartRequestEntity extends MESEntity {
  readonly factory_uuid: string;
  readonly reg_date: string;
  readonly order_uuid: string;
  readonly order_date: string;
  readonly workings_uuid: string;
  readonly prod_uuid: string;
  readonly shift_uuid: string;
  readonly to_store_uuid: string;
  readonly to_location_uuid: string;
  readonly remark: string;
}

export interface ProductionWorkStartResponseEntity extends MESEntity {
  order: {
    complete_date: string;
    complete_fg: boolean;
    created_at: string;
    created_uid: number;
    end_date: string;
    factory_id: number;
    order_id: number;
    order_no: string;
    plan_daily_id: number;
    plan_qty: number;
    priority: number;
    prod_id: number;
    qty: string;
    reg_date: string;
    remark: string;
    sal_order_detail_id: number;
    seq: number;
    shift_id: number;
    start_date: string;
    updated_at: string;
    updated_uid: number;
    uuid: string;
    work_fg: boolean;
    worker_group_id: number;
    workings_id: number;
  }[];
  routing: {
    complete_fg: boolean;
    created_at: string;
    created_uid: number;
    end_date: string;
    equip_id: number;
    factory_id: number;
    mold_cavity: number;
    mold_id: number;
    ongoing_fg: boolean;
    prd_signal_cnt: number;
    proc_id: number;
    proc_no: number;
    qty: number;
    remark: string;
    start_date: string;
    start_signal_val: number;
    updated_at: string;
    updated_uid: number;
    uuid: string;
    work_id: number;
    work_routing_id: number;
    work_routing_origin_id: number;
    work_time: string;
    workings_id: number;
  }[];
  routing_origin: {
    created_at: string;
    created_uid: number;
    equip_id: number;
    factory_id: number;
    mold_cavity: number;
    mold_id: number;
    prd_signal_cnt: number;
    proc_id: number;
    proc_no: number;
    remark: string;
    updated_at: string;
    updated_uid: number;
    uuid: string;
    work_id: number;
    work_routing_origin_id: number;
    workings_id: number;
  }[];
  work: {
    complete_fg: boolean;
    created_at: string;
    created_uid: number;
    factory_id: number;
    lot_no: string;
    order_id: number;
    prod_id: number;
    qty: string;
    reg_date: string;
    reject_qty: string;
    remark: string;
    seq: number;
    shift_id: number;
    to_location_id: number;
    to_store_id: number;
    updated_at: string;
    updated_uid: number;
    uuid: string;
    work_id: number;
    workings_id: number;
  };
}

export interface ProductionWorkFinishRequestEntity extends MESEntity {
  readonly factory_uuid: string;
  readonly order_uuid: string;
  readonly complete_fg: boolean;
}

export interface ProductionWorkFinishResponseEntity extends MESEntity {
  complete_date: string;
  complete_fg: boolean;
  created_at: string;
  created_uid: number;
  end_date: string;
  factory_id: number;
  order_id: number;
  order_no: string;
  plan_daily_id: number;
  plan_qty: number;
  priority: number;
  prod_id: number;
  qty: string;
  reg_date: string;
  remark: string;
  sal_order_detail_id: number;
  seq: number;
  shift_id: number;
  start_date: string;
  updated_at: string;
  updated_uid: number;
  uuid: string;
  work_fg: boolean;
  worker_group_id: number;
  workings_id: number;
}

export class ProductionWorkStartRequestDTO {
  private readonly factory_uuid: string;
  private readonly reg_date: string;
  private readonly order_uuid: string;
  private readonly order_date: string;
  private readonly workings_uuid: string;
  private readonly prod_uuid: string;
  private readonly lot_no: string;
  private readonly shift_uuid: string;
  private readonly to_store_uuid: string;
  private readonly to_location_uuid: string;
  private readonly remark: string;

  private constructor(entity: ProductionWorkStartRequestEntity) {
    if (isEmpty(entity.reg_date)) {
      throw new RequiredFieldException(
        MESSAGE.PRODUCTION_WORK_REG_DATE_IS_REQUIRED,
      );
    } else if (isEmpty(entity.workings_uuid)) {
      throw new RequiredFieldException(
        MESSAGE.PRODUCTION_WORK_WORKINGS_UUID_IS_REQUIRED,
      );
    } else if (isEmpty(entity.shift_uuid)) {
      throw new RequiredFieldException(
        MESSAGE.PRODUCTION_WORK_SHIFT_UUID_IS_REQUIRED,
      );
    } else if (isEmpty(entity.to_store_uuid)) {
      throw new RequiredFieldException(
        MESSAGE.PRODUCTION_WORK_TO_STORE_UUID_IS_REQUIRED,
      );
    }

    this.factory_uuid = entity.factory_uuid;
    this.reg_date = entity.reg_date;
    this.order_uuid = entity.order_uuid;
    this.order_date = entity.order_date;
    this.workings_uuid = entity.workings_uuid;
    this.prod_uuid = entity.prod_uuid;
    this.lot_no = LotNumberGenerator.workday(entity.reg_date).generate();
    this.shift_uuid = entity.shift_uuid;
    this.to_store_uuid = entity.to_store_uuid;
    this.to_location_uuid = entity.to_location_uuid;
    this.remark = entity.remark;
  }

  /**
   *
   * @param entity
   * @returns
   * @throws {RequiredFieldException}
   * @example
   * const dto = ProductionWorkStartRequestDTO.of({ factory_uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', reg_date: '2021-01-01', order_uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', order_date: '2021-01-01', workings_uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', prod_uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', shift_uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', to_store_uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', to_location_uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', remark: 'remark' });
   *
   */
  public static of(entity: ProductionWorkStartRequestEntity) {
    return new ProductionWorkStartRequestDTO(entity);
  }

  public toString() {
    return {
      factory_uuid: this.factory_uuid,
      reg_date: this.reg_date,
      order_uuid: this.order_uuid,
      order_date: this.order_date,
      workings_uuid: this.workings_uuid,
      prod_uuid: this.prod_uuid,
      lot_no: this.lot_no,
      shift_uuid: this.shift_uuid,
      to_store_uuid: this.to_store_uuid,
      to_location_uuid: this.to_location_uuid,
      remark: this.remark,
    };
  }
}

export class ProductionWorkFinishRequestDTO {
  private readonly factory_uuid: string;
  private readonly uuid: string;
  private readonly complete_fg: boolean;
  private readonly complete_date: string;

  private constructor(entity: ProductionWorkFinishRequestEntity) {
    this.factory_uuid = entity.factory_uuid;
    this.uuid = entity.order_uuid;
    this.complete_fg = entity.complete_fg;
    this.complete_date = getToday();
  }

  /**
   * @param entity
   * @returns
   * @throws {RequiredFieldException}
   * @example
   * const dto = ProductionWorkFinishRequestDTO.of({ factory_uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', complete_fg: true });
   *
   */
  public static of(entity: ProductionWorkFinishRequestEntity) {
    return new ProductionWorkFinishRequestDTO(entity);
  }

  public toString() {
    return {
      factory_uuid: this.factory_uuid,
      uuid: this.uuid,
      complete_fg: this.complete_fg,
      complete_date: this.complete_date,
    };
  }
}
