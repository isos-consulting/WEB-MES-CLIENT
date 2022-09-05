import dayjs from 'dayjs';

export type WorkPerformanceAction =
  | { type: 'CHANGE_ORDER_INFO'; name: string; value: any }
  | { type: 'CHANGE_WORK_INFO'; name: string; value: any }
  | { type: 'CHANGE_ROUTING_INFO'; name: string; value: any }
  | { type: 'CHANGE_ALL'; name?: string; value?: any }
  | { type: 'CHANGE_ALL_ORDER'; name?: string; value?: any }
  | { type: 'CHANGE_ALL_WORK'; name?: string; value?: any }
  | { type: 'CHANGE_ALL_ROUTING'; name?: string; value?: any }
  | { type: 'CLEAR_ORDER_INFO'; name?: string; value?: any }
  | { type: 'CLEAR_WORK_INFO'; name?: string; value?: any }
  | { type: 'CLEAR_ROUTING_INFO'; name?: string; value?: any }
  | { type: 'CLEAR_ALL'; name?: string; value?: any };

export type WorkPerformanceState = {
  orderInfo: {
    prod_uuid: string;
    prod_no: string;
    prod_nm: string;
    item_type_uuid: string;
    item_type_nm: string;
    prod_type_uuid: string;
    prod_type_nm: string;
    model_uuid: string;
    model_nm: string;
    rev: string;
    prod_std: string;
    unit_uuid: string;
    unit_nm: string;
    equip_uuid: string;
    equip_nm: string;
    proc_uuid: string;
    proc_nm: string;
    shift_uuid: string;
    shift_nm: string;
    workings_uuid: string;
    workings_nm: string;
    order_remark: string;
  };
  workInfo: {
    work_uuid: string;
    complete_fg: string;
    start_date: string;
    end_date: string;
    _start_date: dayjs.Dayjs;
    _end_date: dayjs.Dayjs;
    _start_time: dayjs.Dayjs;
    _end_time: dayjs.Dayjs;
    to_store_uuid: string;
    to_store_nm: string;
    to_location_uuid: string;
    to_location_nm: string;
    order_qty: string | number;
    total_qty: string | number;
    qty: string | number;
    reject_qty: string | number;
    lot_no: string;
    remark: string;
  };
  routingInfo: {
    work_routing_uuid: string;
    factory_uuid: string;
    factory_cd: string;
    factory_nm: string;
    work_uuid: string;
    proc_uuid: string;
    proc_cd: string;
    proc_nm: string;
    proc_no: string | number;
    workings_uuid: string;
    workings_cd: string;
    workings_nm: string;
    equip_uuid: string;
    equip_cd: string;
    equip_nm: string;
    mold_uuid: string;
    mold_cd: string;
    mold_nm: string;
    mold_cavity: string | number;
    qty: string | number;
    start_date: string;
    end_date: string;
    _start_date: dayjs.Dayjs;
    _end_date: dayjs.Dayjs;
    _start_time: dayjs.Dayjs;
    _end_time: dayjs.Dayjs;
    work_time: string | number;
    ongoing_fg: boolean;
    remark: string;
  };
};
