import dayjs from 'dayjs';
import { ReceiveHeader } from '~/apis/mat/receive';
import { isEmpty } from '~/helper/common';

export const MatReceiveService = class {
  constructor() {}

  empty(): ReceiveHeader {
    return {
      order_date: null,
      order_stmt_no: null,
      order_total_price: null,
      order_total_qty: null,
      partner_cd: '',
      partner_nm: '',
      partner_uuid: '',
      receive_uuid: '',
      reg_date: '',
      remark: null,
      stmt_no: '',
      supplier_cd: null,
      supplier_nm: null,
      supplier_uuid: null,
      total_price: '',
      total_qty: '',
      factory_cd: '',
      factory_nm: '',
      factory_uuid: '',
      created_at: '',
      created_nm: '',
      updated_at: '',
      updated_nm: '',
    };
  }

  getHeader(header: ReceiveHeader): ReceiveHeader {
    if (isEmpty(header.stmt_no)) {
      return this.empty();
    }

    return {
      ...header,
      reg_date: dayjs(header.reg_date).format('YYYY-MM-DD'),
      total_qty: Number(header.total_qty).toFixed(0),
      total_price: Number(header.total_price).toFixed(0),
    };
  }
};
