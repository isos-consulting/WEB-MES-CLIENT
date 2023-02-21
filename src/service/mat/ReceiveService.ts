import { useState } from 'react';
import dayjs from 'dayjs';
import { ReceiveHeader, ReceiveRemoteStore } from '~/apis/mat/receive';
import { isEmpty, isNil } from '~/helper/common';
import { getToday } from '~/functions';
import { URL_PATH_STD } from '~/enums';
import { message } from 'antd';
import { TApiSettings } from '~/components/UI';

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

  const asideGridClick = async (e: {
    rowKey: null | number;
    instance: { getRow: (idx: number) => ReceiveHeader };
  }) => {
    if (!isNil(e.rowKey)) {
      const selectedRow = e.instance.getRow(e.rowKey);
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

export interface MatReceiveModalService {
  title: string;
  modalVisible: boolean;
  subModalVisible: boolean;
  formValues: ReceiveHeader;
  openCreateReceive: () => void;
  setPartner: (partner: Partner) => void; // (partner: { partner_uuid: string; partner_nm: string }
  setSupplier: (supplier: Supplier) => void;
  interlockSupplier: (ev: any) => TApiSettings;
  subModalToggle: () => void;
  setFormValues: () => void;
  close: () => void;
}

export const useMatReceiveModalServiceImpl = (): MatReceiveModalService => {
  const [title, setTitle] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [subModalVisible, setSubModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<ReceiveHeader>(
    getEmptyReceiveHeader(),
  );

  const openCreateReceive = () => {
    setTitle('입하 신규 항목 추가');
    setFormValues({ ...getEmptyReceiveHeader(), reg_date: getToday() });
    setModalVisible(true);
  };

  const setPartner = ({ partner_uuid, partner_nm }: Partner) => {
    setFormValues({ ...formValues, partner_uuid, partner_nm });
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

  const subModalToggle = () => {
    setSubModalVisible(!subModalVisible);
  };

  const close = () => {
    setModalVisible(false);
  };

  return {
    title,
    modalVisible,
    subModalVisible,
    openCreateReceive,
    setPartner,
    setSupplier,
    interlockSupplier,
    subModalToggle,
    formValues,
    setFormValues,
    close,
  };
};
