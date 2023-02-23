import { message } from 'antd';
import dayjs from 'dayjs';
import { Moment } from 'moment';
import { useRef, useState } from 'react';
import { boolean, date, number, object, string } from 'yup';
import { OrderRemoteStore } from '~/apis/mat/order';
import { ReceiveHeader, ReceiveRemoteStore } from '~/apis/mat/receive';
import { VendorPriceRemoteStore } from '~/apis/std/vendor-price';
import { IGridColumn, TApiSettings } from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_STD } from '~/enums';
import { getToday, getUserFactoryUuid } from '~/functions';
import { isEmpty, isNil } from '~/helper/common';
import { arrayToEntities, objectToEntity } from '~/helper/entity';
import {
  MatReceiveDetailDto,
  MatReceiveHeaderDto,
} from '~/models/mat/ReceiveDTO';

const modalClassNames = {
  column: {
    receive_detail_uuid: ['create'],
    receive_uuid: ['create'],
    order_detail_uuid: ['create'],
    income_uuid: ['create'],
    prod_uuid: ['create'],
    item_type_nm: ['create'],
    prod_type_nm: ['create'],
    prod_no: ['create'],
    prod_nm: ['create'],
    model_nm: ['create'],
    rev: ['create'],
    prod_std: ['create'],
    safe_stock: ['create'],
    unit_uuid: ['create', 'editor', 'popup'],
    unit_nm: ['create'],
    lot_no: ['create', 'editor'],
    money_unit_uuid: ['create', 'editor', 'popup'],
    money_unit_nm: ['create'],
    price: ['create', 'editor'],
    exchange: ['create', 'editor'],
    qty: ['create', 'editor'],
    insp_fg: ['create'],
    carry_fg: ['create', 'editor'],
    to_store_uuid: ['create', 'editor', 'popup'],
    to_store_nm: ['create', 'editor', 'popup'],
    to_location_uuid: ['create', 'editor', 'popup'],
    to_location_nm: ['create', 'editor', 'popup'],
    unit_qty: ['create', 'editor'],
    remark: ['create', 'editor'],
    created_at: ['create'],
    created_nm: ['create'],
    updated_at: ['create'],
    updated_nm: ['create'],
  },
};

const vendorPriceColumns = [
  {
    header: '품목UUID',
    name: 'prod_uuid',
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '품목 유형UUID',
    name: 'item_type_uuid',
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '품목 유형코드',
    name: 'item_type_cd',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '품목 유형명',
    name: 'item_type_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
    format: 'text',
  },
  {
    header: '제품 유형UUID',
    name: 'prod_type_uuid',
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '제품 유형코드',
    name: 'prod_type_cd',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '제품 유형명',
    name: 'prod_type_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
    format: 'text',
  },
  {
    header: '품번',
    name: 'prod_no',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
  },
  {
    header: '품명',
    name: 'prod_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
    format: 'text',
  },
  {
    header: '모델UUID',
    name: 'model_uuid',
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '모델코드',
    name: 'model_cd',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '모델명',
    name: 'model_nm',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
  },
  {
    header: 'Rev',
    name: 'rev',
    width: ENUM_WIDTH.S,
    filter: 'text',
    format: 'text',
  },
  {
    header: '규격',
    name: 'prod_std',
    width: ENUM_WIDTH.L,
    filter: 'text',
    format: 'text',
  },
  {
    header: '안전재고',
    name: 'safe_stock',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
  },
  {
    header: '단위수량',
    name: 'unit_qty',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STCOK,
  },
  {
    header: '단위UUID',
    name: 'unit_uuid',
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '단위코드',
    name: 'unit_cd',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '단위명',
    name: 'unit_nm',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
  },
  {
    header: '화폐단위UUID',
    name: 'money_unit_uuid',
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '화폐단위코드',
    name: 'money_unit_cd',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '화폐단위명',
    name: 'money_unit_nm',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
  },
  {
    header: '단가유형UUID',
    name: 'price_type_uuid',
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '단가유형코드',
    name: 'price_type_cd',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
    hidden: true,
  },
  {
    header: '단가유형명',
    name: 'price_type_nm',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'text',
  },
  {
    header: '단가',
    name: 'price',
    width: ENUM_WIDTH.S,
    filter: 'text',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
  },
  {
    header: '소급단가',
    name: 'retroactive_price',
    width: ENUM_WIDTH.S,
    filter: 'text',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
    hidden: true,
  },
  {
    header: '배분율',
    name: 'division',
    width: ENUM_WIDTH.S,
    filter: 'text',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_NOMAL,
    hidden: true,
  },
  {
    header: '수입검사',
    width: ENUM_WIDTH.S,
    name: 'qms_receive_insp_fg',
    format: 'check',
  },
  {
    header: '입고창고UUID',
    name: 'to_store_uuid',
    hidden: true,
    filter: 'text',
    format: 'text',
  },
  {
    header: '입고창고코드',
    width: ENUM_WIDTH.M,
    name: 'to_store_cd',
    filter: 'text',
    format: 'text',
  },
  {
    header: '입고창고명',
    width: ENUM_WIDTH.M,
    name: 'to_store_nm',
    filter: 'text',
    format: 'text',
  },
  {
    header: '입고위치UUID',
    name: 'to_location_uuid',
    hidden: true,
    filter: 'text',
    format: 'text',
  },
  {
    header: '입고위치코드',
    width: ENUM_WIDTH.M,
    name: 'to_location_cd',
    filter: 'text',
    format: 'text',
  },
  {
    header: '입고위치명',
    width: ENUM_WIDTH.M,
    name: 'to_location_nm',
    filter: 'text',
    format: 'text',
  },
  {
    header: '비고',
    name: 'remark',
    width: ENUM_WIDTH.XL,
    format: 'text',
  },
];

const orderDetailColumns = [
  {
    header: '세부발주UUID',
    name: 'order_detail_uuid',
    alias: 'uuid',
    hidden: true,
  },
  { header: '발주UUID', name: 'order_uuid', hidden: true },
  { header: '품목UUID', name: 'prod_uuid', hidden: true },
  {
    header: '품목유형',
    width: ENUM_WIDTH.M,
    name: 'item_type_nm',
    filter: 'text',
    align: 'center',
  },
  {
    header: '제품유형',
    width: ENUM_WIDTH.M,
    name: 'prod_type_nm',
    filter: 'text',
    align: 'center',
  },
  {
    header: '품번',
    width: ENUM_WIDTH.M,
    name: 'prod_no',
    filter: 'text',
  },
  {
    header: '품명',
    width: ENUM_WIDTH.L,
    name: 'prod_nm',
    filter: 'text',
  },
  {
    header: '모델',
    width: ENUM_WIDTH.M,
    name: 'model_nm',
    filter: 'text',
  },
  {
    header: 'Rev',
    width: ENUM_WIDTH.S,
    name: 'rev',
  },
  {
    header: '규격',
    width: ENUM_WIDTH.L,
    name: 'prod_std',
  },
  {
    header: '안전재고',
    width: ENUM_WIDTH.S,
    name: 'safe_stock',
  },
  {
    header: '단위UUID',
    name: 'unit_uuid',
    hidden: true,
  },
  {
    header: '단위',
    width: ENUM_WIDTH.XS,
    name: 'unit_nm',
  },
  {
    header: '화폐단위UUID',
    name: 'money_unit_uuid',
    hidden: true,
  },
  {
    header: '화폐단위',
    width: ENUM_WIDTH.M,
    name: 'money_unit_nm',
  },
  {
    header: '단가',
    width: ENUM_WIDTH.S,
    name: 'price',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
  },
  {
    header: '환율',
    width: ENUM_WIDTH.S,
    name: 'exchange',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
  },
  {
    header: '미납수량',
    width: ENUM_WIDTH.S,
    name: 'balance',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STCOK,
  },
  {
    header: '금액',
    width: ENUM_WIDTH.S,
    name: 'total_price',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
  },
  {
    header: '단위수량',
    width: ENUM_WIDTH.M,
    name: 'unit_qty',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STCOK,
  },
  {
    header: '납기일',
    width: ENUM_WIDTH.M,
    name: 'due_date',
    format: 'date',
  },
  {
    header: '비고',
    width: ENUM_WIDTH.XL,
    name: 'remark',
  },
];

const getEmptyReceiveHeader = (): ReceiveHeader => ({
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
});

type TuiGridSelectionRange = {
  start: number[];
  end: number[];
};

type TuiFocusedCell = {
  columnName: null | string;
  rowKey: null | number;
  value: null | string;
};

type TuiGridProtoType = {
  getRow: <T>(idx: number) => T;
  check: (idx: number) => void;
  uncheck: (idx: number) => void;
  getCheckedRowKeys: () => number[];
  getData: <T>() => T[];
  appendRows: <T>(data: T[]) => void;
  getSelectionRange: () => null | TuiGridSelectionRange;
  getFocusedCell: () => TuiFocusedCell;
  removeRow: (rowKey: number) => void;
  refreshLayout: () => void;
  resetData: <T>(data: T[], options?: {}) => void;
};

type gridClickEvent<T> = {
  columnName: string;
  rowKey: null | number;
  instance: TuiGridProtoType;
};

export const useMatReceiveService = (
  matReceiveRemoteStore: ReceiveRemoteStore,
) => {
  const [receiveHeaderGridData, setHeaderGridData] = useState<ReceiveHeader[]>(
    [],
  );
  const [receiveContentFormData, setContentFormData] = useState<ReceiveHeader>(
    getEmptyReceiveHeader(),
  );
  const [receiveContentGridData, setContentGridData] = useState<
    ReceiveHeader[]
  >([]);

  const asideGridClick = async (e: gridClickEvent<ReceiveHeader>) => {
    if (!isNil(e.rowKey)) {
      const selectedRow = e.instance.getRow<ReceiveHeader>(e.rowKey);
      const receiveContents = await matReceiveRemoteStore.getDetail(
        selectedRow.receive_uuid,
      );

      if (receiveContents.length > 0) {
        setContentFormData(receiveContents[0].header);
        setContentGridData(receiveContents[0].details);
      }
    }
  };

  const getContentFormValues = (): ReceiveHeader => {
    if (isEmpty(receiveContentFormData.stmt_no)) {
      return getEmptyReceiveHeader();
    }

    return {
      ...receiveContentFormData,
      reg_date: dayjs(receiveContentFormData.reg_date).format('YYYY-MM-DD'),
      total_qty: Number(receiveContentFormData.total_qty).toFixed(0),
      total_price: Number(receiveContentFormData.total_price).toFixed(0),
    };
  };

  const searchReceiveHeader = async ({ date_range }) => {
    const header = await matReceiveRemoteStore.getHeader(
      date_range[0].format('YYYY-MM-DD'),
      date_range[1].format('YYYY-MM-DD'),
    );

    setHeaderGridData(header);
    setContentFormData(getEmptyReceiveHeader());
    setContentGridData([]);
  };

  return {
    receiveHeaderGridData,
    receiveContentGridData,
    getContentFormValues,
    searchReceiveHeader,
    asideGridClick,
  };
};

type Partner = { partner_uuid: string; partner_nm: string };
type Supplier = { supplier_uuid: string; supplier_nm: string };
type TuiGridInstance = {
  getInstance: () => TuiGridProtoType;
};
type showModalDatagridRef = { current: undefined | TuiGridInstance };

export interface MatReceiveModalService {
  modalTitle: string;
  modalVisible: boolean;
  formValues: ReceiveHeader;
  modalDatagridRef: showModalDatagridRef;
  subModalTitle: string;
  subModalVisible: boolean;
  subModalDatagridColumns: IGridColumn[];
  subModalDatagridDatas: unknown[];
  subModalDatagridRef: showModalDatagridRef;
  openCreateReceive: () => void;
  setRegDate: (moment: Moment, reg_date: string) => void;
  setPartner: (partner: Partner) => void;
  setSupplier: (supplier: Supplier) => void;
  interlockSupplier: (ev: any) => TApiSettings;
  setFormValues: () => void;
  openVendorPrice: () => void;
  close: () => void;
  closeSubModal: () => void;
  selectSubModal: () => void;
  deleteReceiveRow: () => void;
  save: () => void;
  openOrderDetail: () => void;
}

export const useMatReceiveModalServiceImpl = (
  matReceiveRemoteStore: ReceiveRemoteStore,
): MatReceiveModalService => {
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<ReceiveHeader>(
    getEmptyReceiveHeader(),
  );
  const modalDatagridRef: showModalDatagridRef = useRef();

  const [subModalTitle, setSubModalTitle] = useState<string>('');
  const [subModalVisible, setSubModalVisible] = useState<boolean>(false);
  const [subModalDatagridColumns, setSubModalDatagridColumns] = useState<
    IGridColumn[]
  >([]);
  const [subModalDatagridDatas, setSubModalDatagridDatas] = useState<unknown[]>(
    [],
  );
  const subModalDatagridRef: showModalDatagridRef = useRef();

  const openCreateReceive = () => {
    setModalTitle('입하 신규 항목 추가');
    setFormValues({ ...getEmptyReceiveHeader(), reg_date: getToday() });
    setModalVisible(true);
  };

  const setRegDate = (_moment, reg_date) => {
    setFormValues({ ...formValues, reg_date });
  };

  const setPartner = ({ partner_uuid, partner_nm }: Partner) => {
    setFormValues({ ...formValues, partner_uuid, partner_nm });
    console.log(modalDatagridRef.current.getInstance().resetData([]));
  };

  const setSupplier = ({ supplier_uuid, supplier_nm }: Supplier) => {
    setFormValues({ ...formValues, supplier_uuid, supplier_nm });
  };

  const interlockSupplier = (_ev: any): TApiSettings => {
    return {
      uriPath: URL_PATH_STD.SUPPLIER.GET.SUPPLIERS,
      params: {
        partner_uuid: formValues.partner_uuid,
      },
      onInterlock: () => {
        if (formValues.partner_uuid) {
          return true;
        } else {
          message.warning('거래처를 먼저 선택해주세요.');
          return false;
        }
      },
    };
  };

  const openVendorPrice = async () => {
    if (isEmpty(formValues.partner_uuid)) {
      message.warn('거래처를 선택해주세요.');
    } else if (!isEmpty(formValues.partner_uuid)) {
      setSubModalTitle('구매단가 - 다중 선택');
      setSubModalVisible(true);
      setSubModalDatagridColumns(vendorPriceColumns);

      const vendorPrice = await VendorPriceRemoteStore.get(
        formValues.reg_date,
        formValues.partner_uuid,
      );
      setSubModalDatagridDatas(vendorPrice);
    }
  };

  const close = () => {
    if (subModalVisible === false) {
      setModalTitle('');
      setModalVisible(false);
    }
  };

  const closeSubModal = () => {
    setSubModalTitle('');
    setSubModalVisible(false);
    setSubModalDatagridColumns([]);
    setSubModalDatagridDatas([]);
  };

  const selectSubModal = () => {
    const checkedRowIndecies = subModalDatagridRef.current
      .getInstance()
      .getCheckedRowKeys();

    if (isEmpty(checkedRowIndecies)) {
      message.warn('선택된 항목이 없습니다.');
    } else if (!isEmpty(checkedRowIndecies)) {
      const checkedRows = checkedRowIndecies.map((index: number) => ({
        ...subModalDatagridDatas[index],
        lot_no: dayjs(formValues.reg_date).format('YYYYMMDD'),
        insp_fg: subModalDatagridDatas[index].qms_receive_insp_fg,
        qty: subModalDatagridDatas[index].balance ?? 0,
        _edit: 'C',
        _attributes: {
          className: modalClassNames,
        },
      }));

      modalDatagridRef.current.getInstance().appendRows(checkedRows);
      modalDatagridRef.current.getInstance().refreshLayout();
    }
    closeSubModal();
  };

  const deleteReceiveRow = () => {
    const instance = modalDatagridRef.current.getInstance();
    const { rowKey } = instance.getFocusedCell();
    const selectionRange = instance.getSelectionRange();

    if (!isNil(selectionRange)) {
      const receiveData = instance.getData<{ rowKey: number }>();
      const { start, end } = selectionRange;
      const rowKeys = new Array(end[0] - start[0] + 1)
        .fill(start[0])
        .map((dataIndex, idx) => receiveData[dataIndex + idx].rowKey);

      for (const rowKey of rowKeys) {
        instance.removeRow(rowKey);
      }
    } else if (!isNil(rowKey)) {
      instance.removeRow(rowKey);
    }
  };

  const validateHeader = (receiveHeader: MatReceiveHeaderDto) => {
    const headerSchema = object({
      factory_uuid: string().required('공장 정보를 입력해주세요').uuid(),
      partner_uuid: string().required('거래처를 입력해주세요').uuid(),
      partner_nm: string().required('거래처를 입력해주세요'),
      reg_date: date().required('입하일을 입력해주세요'),
      supplier_uuid: string().uuid().nullable(),
      stmt_no: string().nullable(),
      remark: string().nullable(),
    });

    try {
      headerSchema.validateSync(receiveHeader, { abortEarly: false });
      return true;
    } catch (err) {
      throw new Error(err.errors[0]);
    }
  };

  const validateDetail = (receiveDetails: MatReceiveDetailDto[]) => {
    const detailSchema = object({
      receive_uuid: string().nullable().uuid(),
      factory_uuid: string().required('공장 정보를 입력해주세요').uuid(),
      prod_uuid: string().required('품목을 입력해주세요').uuid(),
      unit_uuid: string().required('단위를 입력해주세요').uuid(),
      lot_no: string().required('LOT NO를 입력해주세요'),
      manufactured_lot_no: string().nullable(),
      money_unit_uuid: string().required('화폐단위를 입력해주세요').uuid(),
      order_detail_uuid: string().nullable().uuid(),
      to_store_uuid: string().required('입고창고를 입력해주세요').uuid(),
      to_location_uuid: string().nullable().uuid(),
      remark: string().nullable(),
      barcode: string().nullable(),
      qty: number().required('수량을 입력해주세요'),
      price: number().required('단가를 입력해주세요'),
      unit_qty: number().nullable(),
      exchange: number().required('환율을 입력해주세요'),
      insp_fg: boolean().required('수입검사 여부를 입력해주세요'),
      carry_fg: boolean().required('이월 여부를 입력해주세요'),
    });

    if (receiveDetails.length === 0) {
      throw new Error('입하 품목을 추가해주세요.');
    } else if (receiveDetails.length > 0) {
      for (const detail of receiveDetails) {
        detailSchema.validateSync(detail, { abortEarly: false });
      }
    }
  };

  const save = async () => {
    const receiveHeader = objectToEntity(
      { ...formValues, factory_uuid: getUserFactoryUuid() },
      MatReceiveHeaderDto,
    );
    const receiveDetails = arrayToEntities(
      modalDatagridRef.current
        .getInstance()
        .getData<{ [key: string]: any }>()
        .map(detail => ({
          ...detail,
          factory_uuid: getUserFactoryUuid(),
          carry_fg: detail.carry_fg ?? false,
        })),
      MatReceiveDetailDto,
    );

    try {
      validateHeader(receiveHeader);
      validateDetail(receiveDetails);
      matReceiveRemoteStore.add(receiveHeader, receiveDetails);
      message.success('입하 등록이 완료되었습니다.');
      close();
    } catch (error) {
      console.log({ error });
      if (isEmpty(error.errors)) {
        message.warn(error.message);
      } else if (!isEmpty(error.errors)) {
        message.warn(error.errors[0]);
      }
    }
  };

  const openOrderDetail = async () => {
    if (isEmpty(formValues.partner_uuid)) {
      message.warn('거래처를 선택해주세요.');
    } else if (!isEmpty(formValues.partner_uuid)) {
      setSubModalTitle('발주 품목 - 다중선택');
      setSubModalVisible(true);
      setSubModalDatagridColumns(orderDetailColumns);

      const orderDetail = await OrderRemoteStore.getDetail(
        formValues.partner_uuid,
      );

      setSubModalDatagridDatas(orderDetail);
    }
  };

  return {
    modalTitle,
    modalVisible,
    formValues,
    modalDatagridRef,
    subModalTitle,
    subModalVisible,
    subModalDatagridColumns,
    subModalDatagridDatas,
    subModalDatagridRef,
    openCreateReceive,
    setRegDate,
    setPartner,
    setSupplier,
    interlockSupplier,
    setFormValues,
    openVendorPrice,
    close,
    closeSubModal,
    selectSubModal,
    deleteReceiveRow,
    save,
    openOrderDetail,
  };
};
