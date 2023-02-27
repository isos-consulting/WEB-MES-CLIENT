import { date, number, object, string } from 'yup';
import { SalOutgoOrderRemoteStore } from '~/apis/sal/outgo-order';
import { arrayToEntities, objectToEntity } from '~/helper/entity';
import {
  SalOutgoOrderHeaderDto,
  SalOutgoOrderItemDto,
} from '~/models/sal/OutgoOrderDTO';

export const OutgoOrderService = class {
  constructor() {}

  private validateOutgoOrderHeader(header: any) {
    const schema = object({
      partner_uuid: string().required('거래처를 입력해주세요').uuid(),
      delivery_uuid: string().required('납품처를 입력해주세요').uuid(),
      reg_date: date().required('출하지시일을 입력해주세요'),
      remark: string().nullable(),
    });

    try {
      schema.validateSync(header, { abortEarly: false });
    } catch (err) {
      throw new Error(err.errors[0]);
    }
  }

  private validateOutgoOrderItems(items: any) {
    const schema = object({
      prod_uuid: string().required('품목을 입력해주세요').uuid(),
      qty: number()
        .required('수량을 입력해주세요')
        .typeError('수량을 입력해주세요'),
      order_detail_uuid: string().nullable().uuid(),
      remark: string().nullable(),
    });

    if (items.length === 0) {
      throw new Error('출하지시 품목을 입력해주세요');
    } else {
      for (const item of items) {
        schema.validateSync(item, { abortEarly: false });
      }
    }
  }

  async addOutgoOrder(header: any, items: any) {
    const remoteStore = new SalOutgoOrderRemoteStore();
    const salOutgoOrderHeader = objectToEntity(header, SalOutgoOrderHeaderDto);
    const salOutgoOrderItems = arrayToEntities(items, SalOutgoOrderItemDto);
    try {
      this.validateOutgoOrderHeader(salOutgoOrderHeader);
      this.validateOutgoOrderItems(salOutgoOrderItems);
      return remoteStore.add(salOutgoOrderHeader, salOutgoOrderItems);
    } catch (err) {
      throw new Error(err.message);
    }
  }
};
