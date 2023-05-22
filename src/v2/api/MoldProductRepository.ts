import { mesRequest } from '~/apis/request-factory';
import {
  MoldCreateResponseEntity,
  MoldProductCreateRequestDTO,
  MoldProductDeleteRequestDTO,
  MoldProductRequestDTO,
} from './model/MoldProductDTO';

export class MoldProductRepository {
  public create(moldProductDTOList: MoldProductCreateRequestDTO[]) {
    return mesRequest.post<unknown, MoldCreateResponseEntity[]>(
      'mld/prod-molds',
      moldProductDTOList,
    );
  }

  public update(moldProductDTOList: MoldProductRequestDTO[]) {
    return mesRequest.put<unknown, MoldCreateResponseEntity[]>(
      'mld/prod-molds',
      moldProductDTOList,
    );
  }

  public delete(moldProductDTOList: MoldProductDeleteRequestDTO[]) {
    return mesRequest.delete<unknown, MoldCreateResponseEntity[]>(
      'mld/prod-molds',
      {
        data: moldProductDTOList,
      },
    );
  }
}
