import { isEmpty } from 'lodash';
import { ReceiveDetail, ReceiveHeader } from '~/apis/mat/receive';

export class MatReceiveCreateHeaderDto {
  readonly uuid: string;
  readonly partner_uuid: string;
  readonly partner_nm: string;
  readonly reg_date: string;
  readonly supplier_uuid: string;
  readonly stmt_no: string;
  readonly remark: string;

  constructor(target: ReceiveHeader) {
    if (!isEmpty(target.receive_uuid)) {
      this.uuid = target.receive_uuid;
    }

    this.partner_uuid = target.partner_uuid;
    this.partner_nm = target.partner_nm;
    this.reg_date = target.reg_date;
    this.supplier_uuid = target.supplier_uuid;
    this.stmt_no = target.stmt_no;
    this.remark = target.remark;
  }
}

export class MatReceiveCreateDetailDto {
  readonly prod_uuid: string;
  readonly unit_uuid: string;
  readonly lot_no: string;
  readonly manufactured_lot_no: string;
  readonly money_unit_uuid: string;
  readonly order_detail_uuid: string;
  readonly to_store_uuid: string;
  readonly to_location_uuid: string;
  readonly remark: string;
  readonly barcode: string;
  readonly qty: number;
  readonly price: number;
  readonly unit_qty: number;
  readonly exchange: number;
  readonly insp_fg: boolean;
  readonly carry_fg: boolean;

  constructor(target: ReceiveDetail) {
    this.prod_uuid = target.prod_uuid;
    this.unit_uuid = target.unit_uuid;
    this.lot_no = target.lot_no;
    this.manufactured_lot_no = target.manufactured_lot_no;
    this.money_unit_uuid = target.money_unit_uuid;
    this.order_detail_uuid = target.order_detail_uuid;
    this.to_store_uuid = target.to_store_uuid;
    this.to_location_uuid = target.to_location_uuid;
    this.remark = target.remark;
    this.barcode = target.barcode;
    this.price = Number(target.price);
    this.unit_qty = Number(target.unit_qty);
    this.insp_fg = target.insp_fg;
    this.carry_fg = target.carry_fg;
    if (isEmpty(target.qty)) {
      this.qty = NaN;
    } else {
      this.qty = Number(target.qty);
    }
    if (isEmpty(target.exchange)) {
      this.exchange = NaN;
    } else {
      this.exchange = Number(target.exchange);
    }
  }
}

export class MatReceiveUpdateHeaderDto {
  readonly uuid: string;
  readonly partner_uuid: string;
  readonly partner_nm: string;
  readonly reg_date: string;
  readonly supplier_uuid: string;
  readonly stmt_no: string;
  readonly remark: string;

  constructor(target: ReceiveHeader) {
    this.uuid = target.receive_uuid;
    this.partner_uuid = target.partner_uuid;
    this.partner_nm = target.partner_nm;
    this.reg_date = target.reg_date;
    this.supplier_uuid = target.supplier_uuid;
    this.stmt_no = target.stmt_no;
    this.remark = target.remark;
  }
}

export class MatReceiveUpdateDetailDto {
  readonly uuid: string;
  readonly prod_uuid: string;
  readonly unit_uuid: string;
  readonly lot_no: string;
  readonly manufactured_lot_no: string;
  readonly money_unit_uuid: string;
  readonly order_detail_uuid: string;
  readonly to_store_uuid: string;
  readonly to_location_uuid: string;
  readonly remark: string;
  readonly barcode: string;
  readonly qty: number;
  readonly price: number;
  readonly unit_qty: number;
  readonly exchange: number;
  readonly insp_fg: boolean;
  readonly carry_fg: boolean;

  constructor(target: ReceiveDetail) {
    this.uuid = target.receive_detail_uuid;
    this.prod_uuid = target.prod_uuid;
    this.unit_uuid = target.unit_uuid;
    this.lot_no = target.lot_no;
    this.manufactured_lot_no = target.manufactured_lot_no;
    this.money_unit_uuid = target.money_unit_uuid;
    this.order_detail_uuid = target.order_detail_uuid;
    this.to_store_uuid = target.to_store_uuid;
    this.to_location_uuid = target.to_location_uuid;
    this.remark = target.remark;
    this.barcode = target.barcode;
    this.qty = Number(target.qty);
    this.price = Number(target.price);
    this.unit_qty = Number(target.unit_qty);
    this.exchange = Number(target.exchange);
    this.insp_fg = target.insp_fg;
    this.carry_fg = target.carry_fg;
  }
}

export class MatReceiveDeleteHeaderDto {
  readonly uuid: string;

  constructor(target: ReceiveHeader) {
    this.uuid = target.receive_uuid;
  }
}

export class MatReceiveDeleteDetailDto {
  readonly uuid: string;

  constructor(target: ReceiveDetail) {
    this.uuid = target.receive_detail_uuid;
  }
}
