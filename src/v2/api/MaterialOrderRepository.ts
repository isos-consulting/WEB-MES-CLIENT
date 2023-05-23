import { mesRequest } from '~/apis/request-factory';
import {
  MaterialOrderDetailRequestDTO,
  MaterialOrderRequestDTO,
  MaterialOrderResponseEntity,
} from './model/MaterialOrderDTO';

export class MaterialOrderRepository {
  public update(
    header: MaterialOrderRequestDTO,
    detailList: MaterialOrderDetailRequestDTO[],
  ) {
    return mesRequest.put<unknown, MaterialOrderResponseEntity[]>(
      'mat/orders',
      {
        header,
        details: detailList,
      },
    );
  }
}
