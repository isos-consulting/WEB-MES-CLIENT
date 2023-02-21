import React from 'react';
import { Datagrid, Modal } from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { MatReceiveModalService } from '~/service/mat/ReceiveService';
import { MatReceiveEditableForm } from './receive-editable-form';
import { MatReceiveGridInterfaceButtonGroup } from './receive-grid-button-group';

const columns = [
  {
    header: '세부입하UUID',
    name: 'receive_detail_uuid',
    alias: 'uuid',
    hidden: true,
  },
  {
    header: '입하UUID',
    name: 'receive_uuid',
    hidden: true,
  },
  {
    header: '발주UUID',
    name: 'order_detail_uuid',
    hidden: true,
  },
  {
    header: '입고UUID',
    name: 'income_uuid',
    hidden: true,
  },
  {
    header: '품목UUID',
    name: 'prod_uuid',
    hidden: true,
    requiredField: true,
  },
  {
    header: '품목유형',
    width: ENUM_WIDTH.M,
    name: 'item_type_nm',
    filter: 'text',
    format: 'popup',
    editable: true,
    align: 'center',
  },
  {
    header: '제품유형',
    width: ENUM_WIDTH.M,
    name: 'prod_type_nm',
    filter: 'text',
    format: 'popup',
    editable: true,
    align: 'center',
  },
  {
    header: '품번',
    width: ENUM_WIDTH.M,
    name: 'prod_no',
    filter: 'text',
    format: 'popup',
    editable: true,
    requiredField: true,
  },
  {
    header: '품명',
    width: ENUM_WIDTH.L,
    name: 'prod_nm',
    filter: 'text',
    format: 'popup',
    editable: true,
    requiredField: true,
  },
  {
    header: '모델',
    width: ENUM_WIDTH.M,
    name: 'model_nm',
    filter: 'text',
    format: 'popup',
    editable: true,
  },
  {
    header: 'Rev',
    width: ENUM_WIDTH.S,
    name: 'rev',
    filter: 'text',
    format: 'popup',
    editable: true,
  },
  {
    header: '규격',
    width: ENUM_WIDTH.L,
    name: 'prod_std',
    filter: 'text',
    format: 'popup',
    editable: true,
  },
  {
    header: '안전재고',
    width: ENUM_WIDTH.S,
    name: 'safe_stock',
    format: 'popup',
    editable: true,
  },
  {
    header: '단위UUID',
    name: 'unit_uuid',
    format: 'popup',
    editable: true,
    hidden: true,
    requiredField: true,
  },
  {
    header: '단위',
    width: ENUM_WIDTH.XS,
    name: 'unit_nm',
    filter: 'text',
    format: 'popup',
    editable: true,
    requiredField: true,
  },
  {
    header: 'LOT NO',
    width: ENUM_WIDTH.M,
    name: 'lot_no',
    filter: 'text',
    editable: true,
    requiredField: true,
  },
  {
    header: '화폐단위UUID',
    name: 'money_unit_uuid',
    hidden: true,
    format: 'popup',
    editable: true,
    requiredField: true,
  },
  {
    header: '화폐단위',
    width: ENUM_WIDTH.M,
    name: 'money_unit_nm',
    filter: 'text',
    format: 'popup',
    editable: true,
    requiredField: true,
  },
  {
    header: '단가',
    width: ENUM_WIDTH.S,
    name: 'price',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
    editable: true,
    requiredField: true,
  },
  {
    header: '환율',
    width: ENUM_WIDTH.S,
    name: 'exchange',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
    editable: true,
    requiredField: true,
  },
  {
    header: '발주량',
    width: ENUM_WIDTH.S,
    name: 'order_qty',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
    editable: false,
  },
  {
    header: '수량',
    width: ENUM_WIDTH.S,
    name: 'qty',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STCOK,
    editable: true,
    requiredField: true,
  },
  {
    header: '금액',
    width: ENUM_WIDTH.S,
    name: 'total_price',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
    editable: false,
  },
  {
    header: '수입검사',
    width: ENUM_WIDTH.S,
    name: 'insp_fg',
    format: 'check',
    editable: false,
    hiddenCondition: props => ['view', 'delete'].includes(props?.gridMode),
    requiredField: true,
  },
  {
    header: '수입검사',
    width: ENUM_WIDTH.M,
    name: 'insp_result',
    filter: 'text',
    format: 'tag',
    options: {
      conditions: [
        { value: '완료', text: '완료', color: 'blue' },
        { value: '미완료', text: '미완료', color: 'red' },
        { value: '무검사', text: '무검사', color: 'block' },
      ],
    },
    editable: false,
  },
  {
    header: '이월',
    width: ENUM_WIDTH.S,
    name: 'carry_fg',
    format: 'check',
    editable: true,
    requiredField: true,
  },
  {
    header: '입고창고UUID',
    name: 'to_store_uuid',
    hidden: true,
    format: 'popup',
    editable: true,
    requiredField: true,
  },
  {
    header: '입고창고',
    width: ENUM_WIDTH.M,
    name: 'to_store_nm',
    filter: 'text',
    format: 'popup',
    editable: true,
    requiredField: true,
  },
  {
    header: '입고위치UUID',
    name: 'to_location_uuid',
    hidden: true,
    format: 'popup',
    editable: true,
  },
  {
    header: '입고위치',
    width: ENUM_WIDTH.M,
    name: 'to_location_nm',
    filter: 'text',
    format: 'popup',
    editable: true,
  },
  {
    header: '단위수량',
    width: ENUM_WIDTH.M,
    name: 'unit_qty',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_STCOK,
    editable: true,
  },
  {
    header: '비고',
    width: ENUM_WIDTH.XL,
    name: 'remark',
    editable: true,
  },
];

export const MatReceiveModal = ({
  modalService,
}: {
  modalService: MatReceiveModalService;
}) => {
  return (
    <Modal
      title={modalService.title}
      visible={modalService.modalVisible}
      okText="저장하기"
      onCancel={() => {
        modalService.close();
      }}
    >
      <MatReceiveEditableForm service={modalService} />
      <MatReceiveGridInterfaceButtonGroup service={modalService} />
      <Datagrid columns={columns} />
      <Modal
        title="다중 선택"
        visible={modalService.subModalVisible}
        okText="선택"
        onCancel={modalService.subModalToggle}
      >
        <Datagrid columns={[]} />
      </Modal>
    </Modal>
  );
};