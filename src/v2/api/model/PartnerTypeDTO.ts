import { isNil } from '~/helper/common';
import { RequiredFieldException } from '~/v2/core/RequiredFieldException';

export type PartnerTypeGetResponseEntity = {
  readonly partner_type_uuid: string;
  readonly partner_type_cd: string;
  readonly partner_type_nm: string;
  readonly created_at: string;
  readonly created_nm: string;
  readonly updated_at: string;
  readonly updated_nm: string;
};

export type PartnerTypeCreateRequestEntity = {
  readonly partner_type_cd: string;
  readonly partner_type_nm: string;
};

export type PartnerTypeResponseEntity = {
  readonly uuid: string;
  readonly partner_type_cd: string;
  readonly partner_type_nm: string;
  readonly created_at: string;
  readonly updated_at: string;
};

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

  public static of(entity: PartnerTypeCreateRequestEntity) {
    return new PartnerTypeCreateRequestDTO(entity);
  }

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

  public static of(entity: PartnerTypeResponseEntity) {
    return new PartnerTypeCreateResponseDTO(entity);
  }

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

  public static of(entity: PartnerTypeGetResponseEntity) {
    return new PartnerTypeUpdateRequestDTO(entity);
  }

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

  public static of(entity: PartnerTypeGetResponseEntity) {
    return new PartnerTypeDeleteRequestDTO(entity);
  }

  public toString() {
    return `PartnerTypeDeleteRequestDTO {
        uuid: "${this.uuid}",
    }`;
  }
}
