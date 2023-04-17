import { GridInstance, GridRef } from '../core/ToastGrid';

export const ServiceUtil = class {
  private constructor() {}

  /**
   * @description This method is used to call a method from a service
   * @param {Function} methodRef
   * @param {GridRef} gridRef
   * @returns {Promise<ServiceUtil>}
   * @memberof ServiceUtil
   * @example
   * const serviceUtil = ServiceUtil.getInstance();
   *
   */
  public static getInstance() {
    return new ServiceUtil();
  }

  /**
   *
   * @memberof ServiceUtil
   * @description This method is used to call a method from a service
   * @param {Function} methodRef
   * @param {GridRef} gridRef
   * @returns {Promise<R>}
   * @memberof ServiceUtil
   * @example
   * const serviceUtil = ServiceUtil.getInstance();
   * serviceUtil.callMethod(PartnerTypeServiceImpl.getInstance().create, gridRef);
   *
   */
  public async callMethod<R>(
    methodRef: (gridInstance: GridInstance) => Promise<R>,
    gridRef: GridRef,
  ) {
    try {
      return methodRef(gridRef.current.getInstance());
    } catch (error: unknown) {
      console.error(error);

      throw error;
    }
  }
};
