import { isNil } from '~/helper/common';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';
import { MESEntity } from './MESEntity';

export interface PartnerTypeGetResponseEntity extends MESEntity {
  readonly partner_type_uuid: string;
  readonly partner_type_cd: string;
  readonly partner_type_nm: string;
  readonly created_at: string;
  readonly created_nm: string;
  readonly updated_at: string;
  readonly updated_nm: string;
}

export interface PartnerTypeCreateRequestEntity extends MESEntity {
  readonly partner_type_cd: string;
  readonly partner_type_nm: string;
}

export interface PartnerTypeResponseEntity extends MESEntity {
  readonly uuid: string;
  readonly partner_type_cd: string;
  readonly partner_type_nm: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export class PartnerTypeCreateRequestDTO {
  private readonly partner_type_cd: string;
  private readonly partner_type_nm: string;

  private constructor(entity: PartnerTypeCreateRequestEntity) {
    if (isNil(entity.partner_type_cd)) {
      throw new RequiredFieldException('partner_type_cd');
    } else if (isNil(entity.partner_type_nm)) {
      throw new RequiredFieldException('partner_type_nm');
    }

    this.partner_type_cd = entity.partner_type_cd;
    this.partner_type_nm = entity.partner_type_nm;
  }

  /**
   *
   * @param entity
   * @returns
   * @throws RequiredFieldException
   * @example
   * PartnerTypeCreateRequestDTO.from({ partner_type_cd: '01', partner_type_nm: 'Customer' });
   */
  public static from(entity: PartnerTypeCreateRequestEntity) {
    return new PartnerTypeCreateRequestDTO(entity);
  }

  /**
   *
   * @returns
   * @example
   * PartnerTypeCreateRequestDTO.from({ partner_type_cd: '01', partner_type_nm: 'Customer' }).toString();
   *
   */
  public toString() {
    return `PartnerTypeCreateRequestDTO {
        partner_type_cd: "${this.partner_type_cd}",
        partner_type_nm: "${this.partner_type_nm}"
    }`;
  }
}

export class PartnerTypeCreateResponseDTO {
  private readonly partner_type_uuid: string;
  private readonly partner_type_cd: string;
  private readonly partner_type_nm: string;
  private readonly created_at: string;
  private readonly updated_at: string;

  private constructor(entity: PartnerTypeResponseEntity) {
    this.partner_type_uuid = entity.uuid;
    this.partner_type_cd = entity.partner_type_cd;
    this.partner_type_nm = entity.partner_type_nm;
    this.created_at = entity.created_at;
    this.updated_at = entity.updated_at;
  }

  /**
   *
   * @param entity
   * @returns
   * @example
   * PartnerTypeCreateResponseDTO.from({ uuid: 'uuid', partner_type_cd: '01', partner_type_nm: 'Customer', created_at: '2023-04-14 00:00:00', updated_at: '2023-04-14 00:00:00' });
   *
   */
  public static from(entity: PartnerTypeResponseEntity) {
    return new PartnerTypeCreateResponseDTO(entity);
  }

  /**
   * @returns
   * @example
   * PartnerTypeCreateResponseDTO.from({ uuid: 'uuid', partner_type_cd: '01', partner_type_nm: 'Customer', created_at: '2023-04-14 00:00:00', updated_at: '2023-04-14 00:00:00' }).toString();
   */
  public toString() {
    return `PartnerTypeCreateResponseDTO {
        partner_type_uuid: "${this.partner_type_uuid}",
        partner_type_cd: "${this.partner_type_cd}",
        partner_type_nm: "${this.partner_type_nm}",
        created_at: "${this.created_at}",
        updated_at: "${this.updated_at}"
    }`;
  }
}

export class PartnerTypeUpdateRequestDTO {
  private readonly uuid: string;
  private readonly partner_type_cd: string;
  private readonly partner_type_nm: string;

  private constructor(entity: PartnerTypeGetResponseEntity) {
    if (isNil(entity.partner_type_uuid)) {
      throw new RequiredFieldException('partner_type_uuid');
    } else if (isNil(entity.partner_type_cd)) {
      throw new RequiredFieldException('partner_type_cd');
    } else if (isNil(entity.partner_type_nm)) {
      throw new RequiredFieldException('partner_type_nm');
    }

    this.uuid = entity.partner_type_uuid;
    this.partner_type_cd = entity.partner_type_cd;
    this.partner_type_nm = entity.partner_type_nm;
  }

  /**
   *
   * @param entity
   * @returns
   * @throws RequiredFieldException
   * @example
   * PartnerTypeUpdateRequestDTO.from({ partner_type_uuid: 'uuid', partner_type_cd: '01', partner_type_nm: 'Customer' });
   *
   */
  public static from(entity: PartnerTypeGetResponseEntity) {
    return new PartnerTypeUpdateRequestDTO(entity);
  }

  /**
   *
   * @returns
   * @example
   * PartnerTypeUpdateRequestDTO.from({ partner_type_uuid: 'uuid', partner_type_cd: '01', partner_type_nm: 'Customer' }).toString();
   *
   */
  public toString() {
    return `PartnerTypeUpdateRequestDTO {
        uuid: "${this.uuid}",
        partner_type_cd: "${this.partner_type_cd}",
        partner_type_nm: "${this.partner_type_nm}",
    }`;
  }
}

export class PartnerTypeDeleteRequestDTO {
  private readonly uuid: string;

  private constructor(entity: PartnerTypeGetResponseEntity) {
    if (isNil(entity.partner_type_uuid)) {
      throw new RequiredFieldException('partner_type_uuid');
    }

    this.uuid = entity.partner_type_uuid;
  }

  /**
   *
   * @param entity
   * @returns
   * @throws RequiredFieldException
   * @example
   * PartnerTypeDeleteRequestDTO.from({ partner_type_uuid: 'uuid' });
   */
  public static from(entity: PartnerTypeGetResponseEntity) {
    return new PartnerTypeDeleteRequestDTO(entity);
  }

  /**
   *
   * @returns
   * @example
   * PartnerTypeDeleteRequestDTO.from({ partner_type_uuid: 'uuid' }).toString();
   */
  public toString() {
    return `PartnerTypeDeleteRequestDTO {
        uuid: "${this.uuid}",
    }`;
  }
}
