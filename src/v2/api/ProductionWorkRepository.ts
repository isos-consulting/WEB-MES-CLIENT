import { mesRequest } from '~/apis/request-factory';
import {
  ProductionWorkFinishRequestDTO,
  ProductionWorkFinishResponseEntity,
  ProductionWorkStartRequestDTO,
  ProductionWorkStartResponseEntity,
} from './model/ProductionWorkDTO';
import { NotImplementedException } from '../core/NotImplementedException';

export class ProductionWorkRepository {
  /**
   *
   * @param productionWorkDTOList
   * @returns
   * @description This method is used to create a production work
   * @memberof ProductionWorkRepository
   * @throws MesServerException
   * @example
   * new ProductionWorkRepository().create(productionWorkDTOList);
   *
   */
  public create(productionWorkDTOList: ProductionWorkStartRequestDTO[]) {
    return mesRequest.post<unknown, ProductionWorkStartResponseEntity[]>(
      'prd/works',
      productionWorkDTOList,
    );
  }

  /**
   *
   * @param productionWorkDTOList
   * @returns
   * @description This method is used to update a production work
   * @memberof ProductionWorkRepository
   * @throws MesServerException
   * @example
   * new ProductionWorkRepository().update(productionWorkDTOList);
   *
   */
  public update(productionWorkDTOList: ProductionWorkFinishRequestDTO[]) {
    return mesRequest.put<unknown, ProductionWorkFinishResponseEntity[]>(
      'prd/orders/complete',
      productionWorkDTOList,
    );
  }

  /**
   *
   * @returns
   * @description This method is not implemented
   * @memberof ProductionWorkRepository
   * @throws NotImplementedException
   *
   */
  public delete() {
    return Promise.reject(
      new NotImplementedException('ProductionWorkRepository.delete()'),
    );
  }
}
