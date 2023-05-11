import Grid from '@toast-ui/react-grid';
import { GridInstance } from '../core/ToastGrid';

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
   * @param {React.MutableRefObject<Grid>} gridRef
   * @returns {Promise<R>}
   * @memberof ServiceUtil
   * @example
   * const serviceUtil = ServiceUtil.getInstance();
   * serviceUtil.callMethod(PartnerTypeServiceImpl.getInstance().create, gridRef);
   *
   */
  public async callMethod<R>(
    methodRef: (gridInstance: GridInstance) => Promise<R>,
    gridRef: React.MutableRefObject<Grid>,
  ) {
    try {
      return methodRef(gridRef.current.getInstance() as GridInstance);
    } catch (error: unknown) {
      console.error(error);

      throw error;
    }
  }
};
