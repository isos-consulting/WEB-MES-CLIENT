import { mesRequest } from '~/apis/request-factory';
import {
  MaterialReturnDetailRequestDTO,
  MaterialReturnRequestDTO,
  MaterialReturnResponseEntity,
} from './model/MaterialReturnDTO';

export class MaterialReturnRepository {
  public update(
    header: MaterialReturnRequestDTO,
    detailList: MaterialReturnDetailRequestDTO[],
  ) {
    return mesRequest.put<unknown, MaterialReturnResponseEntity[]>(
      'mat/returns',
      {
        header,
        details: detailList,
      },
    );
  }
}
