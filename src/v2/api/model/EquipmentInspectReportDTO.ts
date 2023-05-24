import { isEmpty, isNil, isString } from '~/helper/common';
import { MESEntity } from './MESEntity';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { MESSAGE } from '~/v2/core/Message';

export interface EquipmentInspectReportGetResponseEntity extends MESEntity {
  apply_date: string;
  apply_fg: boolean;
  apply_state: string;
  contents: string;
  created_at: string;
  created_nm: string;
  equip_cd: string;
  equip_nm: string;
  equip_type_cd: string;
  equip_type_nm: string;
  equip_type_uuid: string;
  equip_uuid: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  insp_no: string;
  insp_uuid: string;
  reg_date: string;
  remark: string;
  updated_at: string;
  updated_nm: string;
  uuid: string;
}

export interface EquipmentInspectReportDetailGetResponseEntity
  extends MESEntity {
  base_date: string;
  created_at: string;
  created_nm: string;
  cycle: string;
  cycle_unit_cd: string;
  cycle_unit_nm: string;
  cycle_unit_uuid: string;
  daily_insp_cycle_cd: string;
  daily_insp_cycle_nm: string;
  daily_insp_cycle_uuid: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  insp_detail_uuid: string;
  insp_item_cd: string;
  insp_item_desc: string;
  insp_item_nm: string;
  insp_item_type_cd: string;
  insp_item_type_nm: string;
  insp_item_type_uuid: string;
  insp_item_uuid: string;
  insp_method_cd: string;
  insp_method_nm: string;
  insp_method_uuid: string;
  insp_no: string;
  insp_no_sub: string;
  insp_tool_cd: string;
  insp_tool_nm: string;
  insp_tool_uuid: string;
  insp_uuid: string;
  periodicity_fg: false;
  remark: string;
  sortby: number;
  spec_max: string;
  spec_min: string;
  spec_std: string;
  updated_at: string;
  updated_nm: string;
}

export interface EquipmentInspectReportResponseEntity extends MESEntity {
  header: {
    insp_id: number;
    factory_id: number;
    insp_no: string;
    equip_id: number;
    reg_date: string;
    apply_date: string;
    apply_fg: boolean;
    contents: string;
    remark: string;
    created_at: string;
    created_uid: number;
    updated_at: string;
    updated_uid: number;
    uuid: string;
  };
  details: {
    insp_detail_id: number;
    insp_id: number;
    seq: number;
    factory_id: number;
    insp_item_id: number;
    insp_item_desc: string;
    periodicity_fg: boolean;
    spec_std: string;
    spec_min: string;
    spec_max: string;
    insp_tool_id: number;
    insp_method_id: number;
    daily_insp_cycle_id: number;
    base_date: string;
    cycle_unit_id: number;
    cycle: number;
    sortby: number;
    remark: string;
    created_at: string;
    created_uid: number;
    updated_at: string;
    updated_uid: number;
    uuid: string;
  }[];
}

export class EquipmentInspectReportDTO {
  private readonly uuid: string;
  private readonly insp_no: string;
  private readonly reg_date: string;
  private readonly contents: string;
  private readonly remark: string;

  private constructor(entity: EquipmentInspectReportGetResponseEntity) {
    this.uuid = entity.insp_uuid;
    this.insp_no = entity.insp_no;
    this.reg_date = entity.reg_date;
    this.contents = entity.contents;
    this.remark = entity.remark;
  }

  public static of(entity: EquipmentInspectReportGetResponseEntity) {
    return new EquipmentInspectReportDTO(entity);
  }

  public toString() {
    return `EquipmentInspectReportDTO {
        uuid: ${this.uuid},
        insp_no: ${this.insp_no},
        reg_date: ${this.reg_date},
        contents: ${this.contents},
        remark: ${this.remark}
    }`;
  }
}

export class equipmentInspectReportDetailDTO {
  private readonly uuid: string;
  private readonly insp_item_desc: string;
  private readonly periodicity_fg: boolean;
  private readonly spec_std: string;
  private readonly spec_min: number;
  private readonly spec_max: number;
  private readonly insp_method_uuid: string;
  private readonly insp_tool_uuid: string;
  private readonly daily_insp_cycle_uuid: string;
  private readonly base_date: string;
  private readonly cycle_unit_uuid: string;
  private readonly cycle: number;
  private readonly sortby: number;
  private readonly remark: string;

  private constructor(entity: EquipmentInspectReportDetailGetResponseEntity) {
    if (isEmpty(entity.spec_std)) {
      throw new RequiredFieldException(MESSAGE.SPEC_STD_IS_REQUIRED);
    }

    if (isString(entity.spec_min) && isEmpty(entity.spec_min)) {
      this.spec_min = null;
    } else if (isNil(entity.spec_min)) {
      this.spec_min = entity.spec_min;
    } else {
      this.spec_min = Number(entity.spec_min);
    }

    if (isString(entity.spec_max) && isEmpty(entity.spec_max)) {
      this.spec_max = null;
    } else if (isNil(entity.spec_max)) {
      this.spec_max = entity.spec_max;
    } else {
      this.spec_max = Number(entity.spec_max);
    }

    if (isString(entity.cycle) && isEmpty(entity.cycle)) {
      this.cycle = null;
    } else if (isNil(entity.cycle)) {
      this.cycle = entity.cycle;
    } else {
      this.cycle = Number(entity.cycle);
    }

    this.uuid = entity.insp_detail_uuid;
    this.insp_item_desc = entity.insp_item_desc;
    this.periodicity_fg = entity.periodicity_fg;
    this.spec_std = entity.spec_std;
    this.insp_method_uuid = entity.insp_method_uuid;
    this.insp_tool_uuid = entity.insp_tool_uuid;
    this.daily_insp_cycle_uuid = entity.daily_insp_cycle_uuid;
    this.base_date = entity.base_date;
    this.cycle_unit_uuid = entity.cycle_unit_uuid;
    this.sortby = entity.sortby;
    this.remark = entity.remark;
  }

  public static of(entity: EquipmentInspectReportDetailGetResponseEntity) {
    return new equipmentInspectReportDetailDTO(entity);
  }

  public toString() {
    return `equipmentInspectReportDetailDTO {
        uuid: ${this.uuid},
        insp_item_desc: ${this.insp_item_desc},
        periodicity_fg: ${this.periodicity_fg},
        spec_std: ${this.spec_std},
        spec_min: ${this.spec_min},
        spec_max: ${this.spec_max},
        insp_method_uuid: ${this.insp_method_uuid},
        insp_tool_uuid: ${this.insp_tool_uuid},
        daily_insp_cycle_uuid: ${this.daily_insp_cycle_uuid},
        base_date: ${this.base_date},
        cycle_unit_uuid: ${this.cycle_unit_uuid},
        cycle: ${this.cycle},
        sortby: ${this.sortby},
        remark: ${this.remark}
    }`;
  }
}

export class EquipmentInspectReportDeleteRequestDTO {
  private readonly uuid: string;

  private constructor(entity: EquipmentInspectReportGetResponseEntity) {
    this.uuid = entity.insp_uuid;
  }

  public static of(entity: EquipmentInspectReportGetResponseEntity) {
    return new EquipmentInspectReportDeleteRequestDTO(entity);
  }

  public toString() {
    return `equipmentInspectReportDeleteRequestDTO {
        uuid: ${this.uuid}
    }`;
  }
}

export class EquipmentInspectReportDetailDeleteRequestDTO {
  private readonly uuid: string;

  private constructor(entity: EquipmentInspectReportDetailGetResponseEntity) {
    this.uuid = entity.insp_detail_uuid;
  }

  public static of(entity: EquipmentInspectReportDetailGetResponseEntity) {
    return new EquipmentInspectReportDetailDeleteRequestDTO(entity);
  }

  public toString() {
    return `equipmentInspectReportDetailDeleteRequestDTO {
        uuid: ${this.uuid}
    }`;
  }
}
