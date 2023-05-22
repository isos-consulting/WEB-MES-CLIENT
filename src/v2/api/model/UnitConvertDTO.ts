import { isEmpty, isNil } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { MESEntity } from './MESEntity';

export interface UnitConvertGetResponseEntity extends MESEntity {
  readonly convert_value: string;
  readonly unit_convert_uuid: string;
  readonly from_unit_uuid: string;
  readonly from_value: string;
  readonly prod_uuid: string;
  readonly remark: string;
  readonly to_unit_uuid: string;
  readonly to_value: string;
  readonly create_at: string;
  readonly create_nm: string;
  readonly updated_at: number;
  readonly updated_nm: string;
}

export interface UnitConvertCreateRequestEntity extends MESEntity {
  readonly unit_uuid: string;
  readonly to_unit_uuid: string;
  readonly from_value: number;
  readonly to_value: number;
  readonly convert_value: number;
  readonly prod_uuid: string;
  readonly remark: string;
}

export interface UnitConvertCreateResponseEntity extends MESEntity {
  convert_value: string;
  created_at: string;
  created_uid: number;
  from_unit_id: number;
  from_value: string;
  prod_id: string;
  remark: string;
  to_unit_id: number;
  to_value: string;
  unit_convert_id: number;
  updated_at: string;
  updated_uid: number;
  uuid: string;
}

export class UnitConvertCreateRequestDTO {
  private readonly from_unit_uuid: string;
  private readonly to_unit_uuid: string;
  private readonly from_value: number;
  private readonly to_value: number;
  private readonly convert_value: number;
  private readonly prod_uuid: string;
  private readonly remark: string;

  private constructor(entity: UnitConvertCreateRequestEntity) {
    if (isNil(entity.unit_uuid)) {
      throw new RequiredFieldException('unit_uuid');
    } else if (isNil(entity.to_unit_uuid)) {
      throw new RequiredFieldException(
        MESSAGE.UNIT_CONVERT_TO_UNIT_UUID_IS_REQUIRED,
      );
    } else if (isEmpty(String(entity.from_value))) {
      throw new RequiredFieldException(
        MESSAGE.UNIT_CONVERT_FROM_VALUE_IS_REQUIRED,
      );
    } else if (isEmpty(String(entity.to_value))) {
      throw new RequiredFieldException(
        MESSAGE.UNIT_CONVERT_TO_VALUE_IS_REQUIRED,
      );
    } else if (isEmpty(String(entity.convert_value))) {
      throw new RequiredFieldException(
        MESSAGE.UNIT_CONVERT_CONVERT_VALUE_IS_REQUIRED,
      );
    }

    this.from_unit_uuid = entity.unit_uuid;
    this.to_unit_uuid = entity.to_unit_uuid;
    this.from_value = entity.from_value;
    this.to_value = entity.to_value;
    this.convert_value = entity.convert_value;

    if (isEmpty(entity.prod_uuid)) {
      this.prod_uuid = null;
    } else {
      this.prod_uuid = entity.prod_uuid;
    }

    this.remark = entity.remark;
  }

  public static of(entity: UnitConvertCreateRequestEntity) {
    return new UnitConvertCreateRequestDTO(entity);
  }

  public toString() {
    return `UnitConvertCreateRequestDTO {
        from_unit_uuid: "${this.from_unit_uuid}",
        to_unit_uuid: "${this.to_unit_uuid}",
        from_value: "${this.from_value}",
        to_value: "${this.to_value}",
        convert_value: "${this.convert_value}",
        prod_uuid: "${this.prod_uuid}",
        remark: "${this.remark}"
    }`;
  }
}

export class UnitConvertUpdateRequestDTO {
  private readonly uuid: string;
  private readonly from_value: number;
  private readonly to_value: number;
  private readonly convert_value: number;
  private readonly remark: string;

  private constructor(entity: UnitConvertGetResponseEntity) {
    if (isNil(entity.unit_convert_uuid)) {
      throw new RequiredFieldException(MESSAGE.UNIT_CONVERT_UUID_IS_REQUIRED);
    } else if (isEmpty(String(entity.from_value))) {
      throw new RequiredFieldException(
        MESSAGE.UNIT_CONVERT_FROM_VALUE_IS_REQUIRED,
      );
    } else if (isEmpty(String(entity.to_value))) {
      throw new RequiredFieldException(
        MESSAGE.UNIT_CONVERT_TO_VALUE_IS_REQUIRED,
      );
    } else if (isEmpty(String(entity.convert_value))) {
      throw new RequiredFieldException(
        MESSAGE.UNIT_CONVERT_CONVERT_VALUE_IS_REQUIRED,
      );
    }

    this.uuid = entity.unit_convert_uuid;
    this.from_value = Number(entity.from_value);
    this.to_value = Number(entity.to_value);
    this.convert_value = Number(entity.convert_value);
    this.remark = entity.remark;
  }

  public static of(entity: UnitConvertGetResponseEntity) {
    return new UnitConvertUpdateRequestDTO(entity);
  }

  public toString() {
    return `UnitConvertupdateRequestDTO {
        uuid: "${this.uuid}",
        from_value: "${this.from_value}",
        to_value: "${this.to_value}",
        convert_value: "${this.convert_value}",
        remark: "${this.remark}"
    }`;
  }
}

export class UnitConvertDeleteRequestDTO {
  private readonly uuid: string;

  private constructor(entity: UnitConvertGetResponseEntity) {
    if (isNil(entity.unit_convert_uuid)) {
      throw new RequiredFieldException(MESSAGE.UNIT_CONVERT_UUID_IS_REQUIRED);
    }

    this.uuid = entity.unit_convert_uuid;
  }

  public static of(entity: UnitConvertGetResponseEntity) {
    return new UnitConvertDeleteRequestDTO(entity);
  }

  public toString() {
    return `UnitConvertDeleteRequestDTO {
        uuid: "${this.uuid}"
    }`;
  }
}
