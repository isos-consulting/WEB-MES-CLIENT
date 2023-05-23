import { mesRequest } from '~/apis/request-factory';
import {
  OutReceiveDetailRequestDTO,
  OutReceiveRequestDTO,
  OutReceiveResponseEntity,
} from './model/OutReceiveDTO';

export class OutReceiveRepository {
  update(
    header: OutReceiveRequestDTO,
    detailList: OutReceiveDetailRequestDTO[],
  ) {
    return mesRequest.put<unknown, OutReceiveResponseEntity[]>('out/receives', {
      header,
      details: detailList,
    });
  }
}
