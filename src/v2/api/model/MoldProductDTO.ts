import { isNil } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { MESEntity } from './MESEntity';

export interface MoldProductGetResponseEntity extends MESEntity {
  created_at: string;
  created_nm: string;
  factory_cd: string;
  factory_nm: string;
  factory_uuid: string;
  item_type_cd: string;
  item_type_nm: string;
  item_type_uuid: string;
  model_cd: string;
  model_nm: string;
  model_uuid: string;
  mold_cd: string;
  mold_nm: string;
  mold_no: string;
  mold_uuid: string;
  prod_mold_uuid: string;
  prod_nm: string;
  prod_no: string;
  prod_std: string;
  prod_type_cd: string;
  prod_type_nm: string;
  prod_type_uuid: string;
  prod_uuid: string;
  rev: string;
  unit_cd: string;
  unit_nm: string;
  unit_uuid: string;
  updated_at: string;
  updated_nm: string;
}

export interface MoldProductCreateRequestEntity extends MESEntity {
  prod_uuid: string;
  mold_uuid: string;
  mold_cd: string;
  mold_nm: string;
}

export interface MoldCreateResponseEntity extends MESEntity {
  created_at: string;
  created_uid: number;
  factory_id: number;
  mold_id: number;
  prod_id: number;
  prod_mold_id: number;
  updated_at: string;
  updated_uid: number;
  uuid: string;
}

export class MoldProductCreateRequestDTO {
  private readonly prod_uuid: string;
  private readonly mold_uuid: string;

  private constructor(entity: MoldProductCreateRequestEntity) {
    if (isNil(entity.prod_uuid)) {
      throw new RequiredFieldException(MESSAGE.PROD_UUID_IS_REQUIRED);
    } else if (isNil(entity.mold_uuid)) {
      throw new RequiredFieldException(MESSAGE.MOLD_UUID_IS_REQUIRED);
    }
    this.prod_uuid = entity.prod_uuid;
    this.mold_uuid = entity.mold_uuid;
  }

  /**
   * Creates an instance of MoldProductCreateRequestDTO.
   * @param {MoldProductCreateRequestEntity} entity
   * @memberof MoldProductCreateRequestDTO
   * @example
   * MoldProductCreateRequestDTO.of(entity);
   */
  public static of(entity: MoldProductCreateRequestEntity) {
    return new MoldProductCreateRequestDTO(entity);
  }

  public toString() {
    return `MoldProductCreateRequestDTO {
        prod_uuid: ${this.prod_uuid},
        mold_uuid: ${this.mold_uuid},
    }`;
  }
}

export class MoldProductRequestDTO {
  private readonly uuid: string;
  private readonly prod_uuid: string;
  private readonly mold_uuid: string;

  private constructor(entity: MoldProductGetResponseEntity) {
    if (isNil(entity.prod_mold_uuid)) {
      throw new RequiredFieldException(MESSAGE.PROD_MOLD_UUID_IS_REQUIRED);
    } else if (isNil(entity.prod_uuid)) {
      throw new RequiredFieldException(MESSAGE.PROD_UUID_IS_REQUIRED);
    } else if (isNil(entity.mold_uuid)) {
      throw new RequiredFieldException(MESSAGE.MOLD_UUID_IS_REQUIRED);
    }
    this.uuid = entity.prod_mold_uuid;
    this.prod_uuid = entity.prod_uuid;
    this.mold_uuid = entity.mold_uuid;
  }

  /**
   *
   * @param entity
   * @returns
   */
  public static of(entity: MoldProductGetResponseEntity) {
    return new MoldProductRequestDTO(entity);
  }

  /**
   *
   * @returns
   */
  public toString() {
    return `MoldProductRequestDTO {
        uuid: ${this.uuid},
        prod_uuid: ${this.prod_uuid},
        mold_uuid: ${this.mold_uuid},
    }`;
  }
}

export class MoldProductDeleteRequestDTO {
  private readonly uuid: string;

  private constructor(entity: MoldProductGetResponseEntity) {
    if (isNil(entity.prod_mold_uuid)) {
      throw new RequiredFieldException(MESSAGE.PROD_MOLD_UUID_IS_REQUIRED);
    }

    this.uuid = entity.prod_mold_uuid;
  }

  /**
   *
   * @param entity
   * @returns
   */
  public static of(entity: MoldProductGetResponseEntity) {
    return new MoldProductDeleteRequestDTO(entity);
  }

  /**
   *
   * @returns
   */
  public toString() {
    return `MoldProductDeleteRequestDTO {
        uuid: ${this.uuid},
    }`;
  }
}
