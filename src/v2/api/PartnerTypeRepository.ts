import { mesRequest } from '~/apis/request-factory';
import {
  PartnerTypeCreateRequestDTO,
  PartnerTypeResponseEntity,
  PartnerTypeDeleteRequestDTO,
  PartnerTypeUpdateRequestDTO,
} from './model/PartnerTypeDTO';

export class PartnerTypeRepository {
  /**
   *
   * @param partnerTypeDTOList
   * @returns
   * @description This method is used to create a partner type
   * @memberof PartnerTypeRepository
   * @example
   * new PartnerTypeRepository().create(partnerTypeDTOList);
   *
   */
  public create(partnerTypeDTOList: PartnerTypeCreateRequestDTO[]) {
    return mesRequest.post<unknown, PartnerTypeResponseEntity[]>(
      'std/partner-types',
      partnerTypeDTOList,
    );
  }

  public update(partnerTypeDTOList: PartnerTypeUpdateRequestDTO[]) {
    return mesRequest.put<unknown, PartnerTypeResponseEntity[]>(
      'std/partner-types',
      partnerTypeDTOList,
    );
  }

  public delete(partnerTypeDTOList: PartnerTypeDeleteRequestDTO[]) {
    return mesRequest.delete<unknown, PartnerTypeResponseEntity[]>(
      'std/partner-types',
      { data: partnerTypeDTOList },
    );
  }
}
