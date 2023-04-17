import { isEmpty } from 'lodash';
import { isNil } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { MESEntity } from './MESEntity';

export interface RoutingGetResponseEntity extends MESEntity {
  auto_work_fg: boolean;
  created_at: string;
  created_nm: string;
  cycle_time: number;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  item_type_cd: string;
  item_type_nm: string;
  item_type_uuid: string;
  model_cd: string;
  model_nm: string;
  model_uuid: string;
  prd_signal_cnt: number;
  proc_cd: string;
  proc_nm: string;
  proc_no: number;
  proc_uuid: string;
  prod_nm: string;
  prod_no: string;
  prod_std: string;
  prod_type_cd: string;
  prod_type_nm: string;
  prod_type_uuid: string;
  prod_uuid: string;
  rev: string;
  routing_uuid: string;
  unit_cd: string;
  unit_nm: string;
  unit_uuid: string;
  updated_at: string;
  updated_nm: string;
  uph: number;
}

export interface RoutingCreateRequestEntity extends MESEntity {
  prod_uuid: string;
  proc_uuid: string;
  proc_no: number;
  auto_work_fg: boolean;
  cycle_time: number;
  prd_signal_cnt: number;
  uph: number;
}

export interface RoutingCreateResponseEntity extends MESEntity {
  auto_work_fg: boolean;
  created_at: string;
  created_uid: number;
  cycle_time: number;
  prd_signal_cnt: number;
  proc_id: number;
  proc_no: number;
  prod_id: number;
  routing_id: number;
  updated_at: string;
  updated_uid: number;
  uph: number;
  uuid: string;
}

export interface RoutingResponseEntity extends MESEntity {
  auto_work_fg: boolean;
  created_at: string;
  cycle_time: number;
  prd_signal_cnt: number;
  proc_id: number;
  proc_no: number;
  prod_id: number;
  routing_id: number;
  updated_at: string;
  uph: number;
  uuid: string;
}

export class RoutingCreateRequestDTO {
  private readonly prod_uuid: string;
  private readonly proc_uuid: string;
  private readonly proc_no: number;
  private readonly prd_signal_cnt: number;
  private readonly auto_work_fg: boolean;
  private readonly cycle_time: number;
  private readonly uph: number;

  private constructor(entity: RoutingCreateRequestEntity) {
    if (isNil(entity.proc_uuid)) {
      throw new RequiredFieldException(MESSAGE.PROC_UUID_IS_REQUIRED);
    } else if (isNil(entity.proc_no) || isEmpty(String(entity.proc_no))) {
      throw new RequiredFieldException(MESSAGE.PROC_NO_IS_REQUIRED);
    } else if (isNil(entity.auto_work_fg)) {
      throw new RequiredFieldException(MESSAGE.AUTO_WORK_FG_IS_REQUIRED);
    }

    this.prod_uuid = entity.prod_uuid;
    this.proc_uuid = entity.proc_uuid;
    this.proc_no = entity.proc_no;
    this.prd_signal_cnt = entity.prd_signal_cnt;
    this.auto_work_fg = entity.auto_work_fg;
    this.cycle_time = entity.cycle_time;
    this.uph = entity.uph;
  }

  /**
   * Creates an instance of RoutingCreateRequestDTO.
   * @param {RoutingCreateRequestEntity} entity
   * @returns {RoutingCreateRequestDTO}
   * @memberof RoutingCreateRequestDTO
   * @throws {RequiredFieldException}
   * @example
   * RoutingCreateRequestDTO.of({ prod_uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', proc_uuid: '4410858e-330d-4fe3-b119-e6e312ba3bd1', proc_no: 1, auto_work_fg: true, cycle_time: 1, prd_signal_cnt: 1, uph: 1 });
   *
   */
  public static of(
    entity: RoutingCreateRequestEntity,
  ): RoutingCreateRequestDTO {
    return new RoutingCreateRequestDTO(entity);
  }

  /**
   *
   * @returns
   * @memberof RoutingCreateRequestDTO
   * @example
   * RoutingCreateRequestDTO.of({ prod_uuid: '6620f4b8-84a6-440a-b0a1-db8246de57a7', proc_uuid: '4410858e-330d-4fe3-b119-e6e312ba3bd1', proc_no: 1, auto_work_fg: true, cycle_time: 1, prd_signal_cnt: 1, uph: 1 }).toString();
   */
  public toString() {
    return `RoutingCreateRequestDTO {
      prod_uuid: ${this.prod_uuid},
      proc_uuid: ${this.proc_uuid},
      proc_no: ${this.proc_no},
      prd_signal_cnt: ${this.prd_signal_cnt},
      auto_work_fg: ${this.auto_work_fg},
      cycle_time: ${this.cycle_time},
      uph: ${this.uph},
    }`;
  }
}

export class RoutingUpdateRequestDTO {
  private readonly uuid: string;
  private readonly proc_no: number;
  private readonly prd_signal_cnt: number;
  private readonly auto_work_fg: boolean;
  private readonly cycle_time: number;
  private readonly uph: number;

  private constructor(entity: RoutingGetResponseEntity) {
    if (isNil(entity.routing_uuid)) {
      throw new RequiredFieldException(MESSAGE.ROUTING_UUID_IS_REQUIRED);
    } else if (isNil(entity.proc_no) || isEmpty(String(entity.proc_no))) {
      throw new RequiredFieldException(MESSAGE.PROC_NO_IS_REQUIRED);
    } else if (isNil(entity.auto_work_fg)) {
      throw new RequiredFieldException(MESSAGE.AUTO_WORK_FG_IS_REQUIRED);
    }

    this.uuid = entity.routing_uuid;
    this.proc_no = entity.proc_no;
    this.prd_signal_cnt = entity.prd_signal_cnt;
    this.auto_work_fg = entity.auto_work_fg;
    this.cycle_time = entity.cycle_time;
    this.uph = entity.uph;
  }

  /**
   *
   * @param {RoutingGetResponseEntity} entity
   * @returns {RoutingUpdateRequestDTO}
   * @memberof RoutingUpdateRequestDTO
   * @throws {RequiredFieldException}
   * @example
   * RoutingUpdateRequestDTO.of({ routing_uuid: '91c56239-4677-4cb7-9048-8e9ff7fce051', proc_no: 1, auto_work_fg: true, cycle_time: 1, prd_signal_cnt: 1, uph: 1 });
   */
  public static of(entity: RoutingGetResponseEntity) {
    return new RoutingUpdateRequestDTO(entity);
  }

  /**
   *
   * @returns
   * @example
   * RoutingUpdateRequestDTO.of({ routing_uuid: '91c56239-4677-4cb7-9048-8e9ff7fce051', proc_no: 1, auto_work_fg: true, cycle_time: 1, prd_signal_cnt: 1, uph: 1 }).toString();
   */
  public toString() {
    return `RoutingUpdateRequestDTO {
        uuid: "${this.uuid}",
        proc_no: ${this.proc_no},
        prd_signal_cnt: ${this.prd_signal_cnt},
        auto_work_fg: ${this.auto_work_fg},
        cycle_time: ${this.cycle_time},
        uph: ${this.uph},
    }`;
  }
}

export class RoutingDeleteRequestDTO {
  private readonly uuid: string;

  private constructor(entity: RoutingGetResponseEntity) {
    if (isNil(entity.routing_uuid)) {
      throw new RequiredFieldException(MESSAGE.ROUTING_UUID_IS_REQUIRED);
    }

    this.uuid = entity.routing_uuid;
  }

  /**
   *
   * @param {RoutingGetResponseEntity} entity
   * @returns {RoutingDeleteRequestDTO}
   * @memberof RoutingDeleteRequestDTO
   * @throws {RequiredFieldException}
   * @example
   * RoutingDeleteRequestDTO.of({ routing_uuid: '91c56239-4677-4cb7-9048-8e9ff7fce051' });
   */
  public static of(entity: RoutingGetResponseEntity) {
    return new RoutingDeleteRequestDTO(entity);
  }

  /**
   *
   * @returns
   * @example
   * RoutingDeleteRequestDTO.of({ routing_uuid: '91c56239-4677-4cb7-9048-8e9ff7fce051' }).toString();
   */
  public toString() {
    return `RoutingDeleteRequestDTO {
        uuid: "${this.uuid}"
    }`;
  }
}
