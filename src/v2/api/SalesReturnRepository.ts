import { mesRequest } from '~/apis/request-factory';
import {
  SalesReturnDetailRequestDTO,
  SalesReturnRequestDTO,
  SalesReturnResponseEntity,
} from './model/SalesReturnDTO';

export class SalesReturnRepository {
  public update(
    header: SalesReturnRequestDTO,
    detailList: SalesReturnDetailRequestDTO[],
  ) {
    return mesRequest.put<unknown, SalesReturnResponseEntity[]>('sal/returns', {
      header,
      details: detailList,
    });
  }
}
