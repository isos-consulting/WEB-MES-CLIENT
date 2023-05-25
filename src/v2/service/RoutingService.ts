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
import { NotImplementedException } from '../core/NotImplementedException';
import { GridInstance } from '../core/ToastGrid';
import { ZeroHandlingDataException } from '../core/ZeroHandlingDataException';
import { MESWithUuidService, MESService } from './MesService';

export class RoutingServiceImpl implements MESService, MESWithUuidService {
  private static instance: RoutingServiceImpl;
  private constructor() {}

  /**
   *
   * @description This method is used to get a instance of RoutingServiceImpl
   * @returns {RoutingServiceImpl}
   * @memberof RoutingServiceImpl
   * @example
   * RoutingServiceImpl.getInstance();
   *
   */
  public static getInstance() {
    if (isNil(this.instance)) {
      this.instance = new RoutingServiceImpl();
    }

    return this.instance;
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is not implemented
   * @memberof RoutingServiceImpl
   * @throws NotImplementedException
   *
   */
  public create(gridInstance: GridInstance) {
    return Promise.reject(
      new NotImplementedException('RoutingServiceImpl.create'),
    );
  }

  /**
   *
   * @param gridInstance
   * @param prodUuid
   * @returns
   * @description This method is used to create a routing
   * @memberof RoutingServiceImpl
   * @throws ZeroHandlingDataException
   * @example
   * RoutingServiceImpl.getInstance().createWithUuid(gridInstance, prodUuid);
   */
  public createWithUuid(gridInstance: GridInstance, prodUuid: string) {
    const routings = gridInstance.getData<RoutingCreateRequestEntity>();

    if (isEmpty(routings)) {
      return Promise.reject(
        new ZeroHandlingDataException(MESSAGE.ROUTING_CREATABLE_NOT_FOUND),
      );
    }

    try {
      const routingDTOList = routings.map(routing =>
        RoutingCreateRequestDTO.from({
          ...routing,
          prod_uuid: prodUuid,
        }),
      );

      return RepositoryModule.routing().create(routingDTOList);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   *
   * @param gridInstance
   * @returns
   * @description This method is used to update a routing
   * @memberof RoutingServiceImpl
   * @throws ZeroHandlingDataException
   * @example
   * RoutingServiceImpl.getInstance().update(gridInstance);
   *
   */
  public update(gridInstance: GridInstance) {
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

  /**
   * @description This method is used to delete a routing
   * @param gridInstance
   * @returns
   * @memberof RoutingServiceImpl
   * @throws ZeroHandlingDataException
   * @example
   * RoutingServiceImpl.getInstance().delete(gridInstance);
   *
   */
  public delete(gridInstance: GridInstance) {
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
