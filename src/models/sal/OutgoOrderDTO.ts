import { isEmpty } from '~/helper/common';

export class SalOutgoOrderHeaderDto {
  partner_uuid: string;
  delivery_uuid: string;
  reg_date: string;
  remark: string;

  constructor(header: any) {
    this.partner_uuid = header.partner_uuid;
    this.delivery_uuid = header.delivery_uuid;
    this.reg_date = header.reg_date;
    this.remark = header.remark;
  }
}

export class SalOutgoOrderItemDto {
  prod_uuid: string;
  order_detail_uuid: string;
  remark: string;
  qty: number;

  constructor(item: any) {
    this.prod_uuid = item.prod_uuid;
    this.order_detail_uuid = item.order_detail_uuid;
    this.remark = item.remark;
    if (isEmpty(item.qty)) {
      this.qty = NaN;
    } else {
      this.qty = Number(item.qty);
    }
  }
}
