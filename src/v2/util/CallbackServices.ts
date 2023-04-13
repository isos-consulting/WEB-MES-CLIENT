import { GridInstance, GridRef } from '../core/ToastGrid';

export const ServiceUtil = class {
  private constructor() {}

  /**
   * @description This method is used to call a method from a service
   * @param {Function} methodRef
   * @param {GridRef} gridRef
   * @returns {Promise<boolean>}
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
   * @returns {Promise<void>}
   * @memberof ServiceUtil
   * @example
   * const serviceUtil = ServiceUtil.getInstance();
   * serviceUtil.callMethod(PartnerTypeService.getInstance().createPartner, gridRef);
   *
   */
  public async callMethod<E>(
    methodRef: (gridInstance: GridInstance) => Promise<E>,
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
