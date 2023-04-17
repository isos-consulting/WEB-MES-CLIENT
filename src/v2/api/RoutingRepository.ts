import { mesRequest } from '~/apis/request-factory';
import {
  RoutingCreateRequestDTO,
  RoutingCreateResponseEntity,
  RoutingDeleteRequestDTO,
  RoutingResponseEntity,
  RoutingUpdateRequestDTO,
} from './model/RoutingDTO';

export class RoutingRepository {
  /**
   *
   * @param routingDTOList
   * @returns
   * @description This method is used to create a routing
   * @memberof RoutingRepository
   * @throws MesServerException
   * @example
   * new RoutingRepository().create(routingDTOList);
   *
   */
  public create(routingDTOList: RoutingCreateRequestDTO[]) {
    return mesRequest.post<unknown, RoutingCreateResponseEntity[]>(
      'std/routings',
      routingDTOList,
    );
  }

  /**
   *
   * @param routingDTOList
   * @returns
   * @description This method is used to update a routing
   * @memberof RoutingRepository
   * @throws MesServerException
   * @example
   * new RoutingRepository().update(routingDTOList);
   *
   */
  public update(routingDTOList: RoutingUpdateRequestDTO[]) {
    return mesRequest.put<unknown, RoutingResponseEntity[]>(
      'std/routings',
      routingDTOList,
    );
  }

  /**
   *
   * @param routingDTOList
   * @returns
   * @description This method is used to delete a routing
   * @memberof RoutingRepository
   * @throws MesServerException
   * @example
   * new RoutingRepository().delete(routingDTOList);
   *
   */
  public delete(routingDTOList: RoutingDeleteRequestDTO[]) {
    return mesRequest.delete<unknown, RoutingResponseEntity[]>('std/routings', {
      data: routingDTOList,
    });
  }
}
