import { isEmpty, isNil } from '~/helper/common';
import { RepositoryModule } from '../api/RepositoryModule';
import {
  RoutingCreateRequestDTO,
  RoutingCreateRequestEntity,
  RoutingDeleteRequestDTO,
  RoutingGetResponseEntity,
  RoutingUpdateRequestDTO,
} from '../api/model/RoutingDTO';
import { MESSAGE } from '../core/Message';
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';

export class RoutingService {
  private static instance: RoutingService;
  private constructor() {}

  /**
   *
   * @description This method is used to get a instance of RoutingService
   * @returns {RoutingService}
   * @memberof RoutingService
   * @example
   * RoutingService.getInstance();
   *
   */
  public static getInstance() {
    if (isNil(this.instance)) {
      this.instance = new RoutingService();
    }

    return this.instance;
  }

  public createRouting(gridInstance: GridInstance, prodUuid: string) {
    const routings = gridInstance.getData<RoutingCreateRequestEntity>();

    if (isEmpty(routings)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.ROUTING_CREATABLE_NOT_FOUND),
      );
    }

    try {
      const routingDTOList = routings.map(routing =>
        RoutingCreateRequestDTO.of({
          ...routing,
          prod_uuid: prodUuid,
        }),
      );

      return RepositoryModule.routing().create(routingDTOList);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public updateRouting(gridInstance: GridInstance) {
    const { updatedRows } =
      gridInstance.getModifiedRows<RoutingGetResponseEntity>();

    if (isEmpty(updatedRows)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.ROUTING_UPDATABLE_NOT_FOUND),
      );
    }

    try {
      const routingDTOList = updatedRows.map(RoutingUpdateRequestDTO.of);

      return RepositoryModule.routing().update(routingDTOList);
    } catch (error: unknown) {
      return Promise.reject(error);
    }
  }

  public deleteRouting(gridInstance: GridInstance) {
    const deletedRoutings =
      gridInstance.getCheckedRows<RoutingGetResponseEntity>();

    if (isEmpty(deletedRoutings)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.ROUTING_DELETABLE_NOT_FOUND),
      );
    }

    const routingDTOList = deletedRoutings.map(RoutingDeleteRequestDTO.of);

    return RepositoryModule.routing().delete(routingDTOList);
  }
}
