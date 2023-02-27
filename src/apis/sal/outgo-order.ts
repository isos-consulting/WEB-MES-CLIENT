import {
  SalOutgoOrderHeaderDto,
  SalOutgoOrderItemDto,
} from '~/models/sal/OutgoOrderDTO';
import { mesRequest } from '../request-factory';

export const SalOutgoOrderRemoteStore = class {
  add(header: SalOutgoOrderHeaderDto, details: SalOutgoOrderItemDto[]) {
    return mesRequest.post<unknown, unknown>('sal/outgo-orders', {
      header,
      details,
    });
  }
};
