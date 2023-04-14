import { mesRequest } from '~/apis/request-factory';
import {
  UnitConvertCreateRequestDTO,
  UnitConvertCreateResponseEntity,
  UnitConvertDeleteRequestDTO,
  UnitConvertUpdateRequestDTO,
} from './model/UnitConvertDTO';

export class UnitConvertRepository {
  create(unitConvertDTOList: UnitConvertCreateRequestDTO[]) {
    return mesRequest.post<unknown, UnitConvertCreateResponseEntity[]>(
      'std/unit-converts',
      unitConvertDTOList,
    );
  }

  update(unitConvertDTOList: UnitConvertUpdateRequestDTO[]) {
    return mesRequest.put<unknown, unknown[]>(
      'std/unit-converts',
      unitConvertDTOList,
    );
  }

  delete(unitConvertDTOList: UnitConvertDeleteRequestDTO[]) {
    return mesRequest.delete<unknown, unknown[]>('std/unit-converts', {
      data: unitConvertDTOList,
    });
  }
}
