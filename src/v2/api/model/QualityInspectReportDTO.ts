import { isEmpty, isNil, isString } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { MESEntity } from './MESEntity';

export interface QualityInspectReportGetResponseEntity extends MESEntity {
  apply_date: string;
  apply_fg: boolean;
  apply_state: string;
  contents: string;
  created_at: string;
  created_nm: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  insp_no: string;
  insp_type: string;
  insp_type_cd: string;
  insp_type_nm: string;
  insp_type_uuid: string;
  insp_uuid: string;
  item_type_cd: string;
  item_type_nm: string;
  item_type_uuid: string;
  model_cd: string;
  model_nm: string;
  model_uuid: string;
  prod_nm: string;
  prod_no: string;
  prod_std: string;
  prod_type_cd: string;
  prod_type_nm: string;
  prod_type_uuid: string;
  prod_uuid: string;
  reg_date: string;
  remark: string;
  rev: string;
  unit_cd: string;
  unit_nm: string;
  unit_uuid: string;
  updated_at: string;
  updated_nm: string;
}

export interface QualityInspectReportDetailGetResponseEntity extends MESEntity {
  created_at: string;
  created_nm: string;
  delete_row: boolean;
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
  inspector_insp_cycle: string;
  inspector_sample_cnt: string;
  position_no: number;
  remark: string;
  sortby: number;
  spec_max: string;
  spec_min: string;
  spec_std: string;
  special_property: string;
  updated_at: string;
  updated_nm: string;
  worker_insp_cycle: string;
  worker_sample_cnt: string;
}

export interface QualityInspectReportResponseEntity extends MESEntity {
  header: {
    insp_id: number;
    factory_id: number;
    insp_type_id: number;
    insp_no: string;
    prod_id: number;
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
    spec_std: string;
    spec_min: string;
    spec_max: string;
    insp_tool_id: number;
    insp_method_id: number;
    sortby: number;
    position_no: number;
    special_property: string;
    worker_sample_cnt: number;
    worker_insp_cycle: string;
    inspector_sample_cnt: number;
    inspector_insp_cycle: string;
    remark: string;
    created_at: string;
    created_uid: number;
    updated_at: string;
    updated_uid: number;
    uuid: string;
  }[];
}

export class QualityInspectReportUpdateRequestDTO {
  private readonly uuid: string;
  private readonly insp_no: string;
  private readonly apply_fg: boolean;
  private readonly apply_date: string;
  private readonly contents: string;
  private readonly remark: string;

  private constructor(entity: QualityInspectReportGetResponseEntity) {
    this.uuid = entity.insp_uuid;
    this.insp_no = entity.insp_no;
    this.apply_fg = entity.apply_fg;
    this.apply_date = entity.apply_date;
    this.contents = entity.contents;
    this.remark = entity.remark;
  }

  public static from(entity: QualityInspectReportGetResponseEntity) {
    return new QualityInspectReportUpdateRequestDTO(entity);
  }

  public toString() {
    return `QualityInspectReportUpdateRequestDTO {
        uuid: ${this.uuid},
        insp_no: ${this.insp_no},
        apply_fg: ${this.apply_fg},
        apply_date: ${this.apply_date},
        contents: ${this.contents},
        remark: ${this.remark}
    }`;
  }
}

export class QualityInspectReportDetailUpdateRequestDTO {
  private readonly uuid: string;
  private readonly insp_item_desc: string;
  private readonly spec_std: string;
  private readonly spec_min: number;
  private readonly spec_max: number;
  private readonly insp_method_uuid: string;
  private readonly insp_tool_uuid: string;
  private readonly sortby: number;
  private readonly position_no: number;
  private readonly special_property: string;
  private readonly worker_sample_cnt: number;
  private readonly worker_insp_cycle: string;
  private readonly inspector_sample_cnt: number;
  private readonly inspector_insp_cycle: string;
  private readonly remark: string;

  private constructor(entity: QualityInspectReportDetailGetResponseEntity) {
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

    if (isNil(entity.sortby)) {
      this.sortby = entity.sortby;
    } else {
      this.sortby = Number(entity.sortby);
    }

    if (
      isString(entity.worker_sample_cnt) &&
      isEmpty(entity.worker_sample_cnt)
    ) {
      this.worker_sample_cnt = null;
    } else if (isNil(entity.worker_sample_cnt)) {
      this.worker_sample_cnt = entity.worker_sample_cnt;
    } else {
      this.worker_sample_cnt = Number(entity.worker_sample_cnt);
    }

    if (
      isString(entity.inspector_sample_cnt) &&
      isEmpty(entity.inspector_sample_cnt)
    ) {
      this.inspector_sample_cnt = null;
    } else if (isNil(entity.inspector_sample_cnt)) {
      this.inspector_sample_cnt = entity.inspector_sample_cnt;
    } else {
      this.inspector_sample_cnt = Number(entity.inspector_sample_cnt);
    }

    if (isString(entity.position_no) && isEmpty(entity.position_no)) {
      this.position_no = null;
    } else if (isNil(entity.position_no)) {
      this.position_no = entity.position_no;
    } else {
      this.position_no = entity.position_no;
    }

    this.uuid = entity.insp_detail_uuid;
    this.insp_item_desc = entity.insp_item_desc;
    this.worker_insp_cycle = entity.worker_insp_cycle;
    this.special_property = entity.special_property;
    this.insp_method_uuid = entity.insp_method_uuid;
    this.insp_tool_uuid = entity.insp_tool_uuid;
    this.spec_std = entity.spec_std;
    this.inspector_insp_cycle = entity.inspector_insp_cycle;
    this.remark = entity.remark;
  }

  public static from(entity: QualityInspectReportDetailGetResponseEntity) {
    return new QualityInspectReportDetailUpdateRequestDTO(entity);
  }

  public toString() {
    return `QualityInspectReportDetailUpdateRequestDTO {
        uuid: ${this.uuid},
        insp_item_desc: ${this.insp_item_desc},
        spec_std: ${this.spec_std},
        spec_min: ${this.spec_min},
        spec_max: ${this.spec_max},
        insp_method_uuid: ${this.insp_method_uuid},
        insp_tool_uuid: ${this.insp_tool_uuid},
        sortby: ${this.sortby},
        position_no: ${this.position_no},
        special_property: ${this.special_property},
        worker_sample_cnt: ${this.worker_sample_cnt},
        worker_insp_cycle: ${this.worker_insp_cycle},
        inspector_sample_cnt: ${this.inspector_sample_cnt},
        inspector_insp_cycle: ${this.inspector_insp_cycle},
        remark: ${this.remark}
    }`;
  }
}

export class QualityInspectReportAmendRequestDTO {
  private readonly insp_type_uuid: string;
  private readonly insp_type_cd: string;
  private readonly insp_no: string;
  private readonly prod_uuid: string;
  private readonly reg_date: string;
  private readonly apply_fg: boolean;
  private readonly apply_date: string;
  private readonly contents: string;
  private readonly remark: string;

  private constructor(entity: QualityInspectReportGetResponseEntity) {
    this.insp_type_uuid = entity.insp_type_uuid;
    this.insp_type_cd = entity.insp_type_cd;
    this.insp_no = entity.insp_no;
    this.prod_uuid = entity.prod_uuid;
    this.reg_date = entity.reg_date;
    this.apply_fg = true;
    this.apply_date = entity.apply_date;
    this.contents = entity.contents;
    this.remark = entity.remark;
  }

  public static from(entity: QualityInspectReportGetResponseEntity) {
    return new QualityInspectReportAmendRequestDTO(entity);
  }

  public toString() {
    return `QualityInspectReportAmendRequestDTO {
        insp_type_uuid: ${this.insp_type_uuid},
        insp_type_cd: ${this.insp_type_cd},
        insp_no: ${this.insp_no},
        prod_uuid: ${this.prod_uuid},
        reg_date: ${this.reg_date},
        apply_fg: ${this.apply_fg},
        apply_date: ${this.apply_date},
        contents: ${this.contents},
        remark: ${this.remark}
    }`;
  }
}

export class QualityInspectReportDetailAmendRequestDTO {
  private readonly insp_item_uuid: string;
  private readonly insp_item_desc: string;
  private readonly spec_std: string;
  private readonly spec_min: number;
  private readonly spec_max: number;
  private readonly insp_method_uuid: string;
  private readonly insp_tool_uuid: string;
  private readonly sortby: number;
  private readonly position_no: number;
  private readonly special_property: string;
  private readonly worker_sample_cnt: number;
  private readonly worker_insp_cycle: string;
  private readonly inspector_sample_cnt: number;
  private readonly inspector_insp_cycle: string;
  private readonly remark: string;

  private constructor(entity: QualityInspectReportDetailGetResponseEntity) {
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

    if (isNil(entity.sortby)) {
      this.sortby = entity.sortby;
    } else {
      this.sortby = Number(entity.sortby);
    }

    if (
      isString(entity.worker_sample_cnt) &&
      isEmpty(entity.worker_sample_cnt)
    ) {
      this.worker_sample_cnt = null;
    } else if (isNil(entity.worker_sample_cnt)) {
      this.worker_sample_cnt = entity.worker_sample_cnt;
    } else {
      this.worker_sample_cnt = Number(entity.worker_sample_cnt);
    }

    if (
      isString(entity.inspector_sample_cnt) &&
      isEmpty(entity.inspector_sample_cnt)
    ) {
      this.inspector_sample_cnt = null;
    } else if (isNil(entity.inspector_sample_cnt)) {
      this.inspector_sample_cnt = entity.inspector_sample_cnt;
    } else {
      this.inspector_sample_cnt = Number(entity.inspector_sample_cnt);
    }

    if (isString(entity.position_no) && isEmpty(entity.position_no)) {
      this.position_no = null;
    } else if (isNil(entity.position_no)) {
      this.position_no = entity.position_no;
    } else {
      this.position_no = entity.position_no;
    }

    this.insp_item_uuid = entity.insp_item_uuid;
    this.insp_item_desc = entity.insp_item_desc;
    this.worker_insp_cycle = entity.worker_insp_cycle;
    this.special_property = entity.special_property;
    this.insp_method_uuid = entity.insp_method_uuid;
    this.insp_tool_uuid = entity.insp_tool_uuid;
    this.spec_std = entity.spec_std;
    this.inspector_insp_cycle = entity.inspector_insp_cycle;
    this.remark = entity.remark;
  }

  public static from(entity: QualityInspectReportDetailGetResponseEntity) {
    return new QualityInspectReportDetailAmendRequestDTO(entity);
  }

  public toString() {
    return `QualityInspectReportDetailAmendRequestDTO {
        insp_item_uuid: ${this.insp_item_uuid},
        insp_item_desc: ${this.insp_item_desc},
        spec_std: ${this.spec_std},
        spec_min: ${this.spec_min},
        spec_max: ${this.spec_max},
        insp_method_uuid: ${this.insp_method_uuid},
        insp_tool_uuid: ${this.insp_tool_uuid},
        sortby: ${this.sortby},
        position_no: ${this.position_no},
        special_property: ${this.special_property},
        worker_sample_cnt: ${this.worker_sample_cnt},
        worker_insp_cycle: ${this.worker_insp_cycle},
        inspector_sample_cnt: ${this.inspector_sample_cnt},
        inspector_insp_cycle: ${this.inspector_insp_cycle},
        remark: ${this.remark}
    }`;
  }
}
