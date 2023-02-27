import { Col } from 'antd';
import React from 'react';
import { Datagrid } from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { MatReceiveService } from '~/service/mat/ReceiveService';
import MatReceiveContentStyleModule from './receive-content.module.css';
import { MatReceiveReadOnlyForm } from './receive-readonly-form';

type MatReceiveContentProps = {
  service: MatReceiveService;
};

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
  },
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
    filter: 'text',
  },
  {
    header: '규격',
    width: ENUM_WIDTH.L,
    name: 'prod_std',
    filter: 'text',
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
    filter: 'text',
  },
  {
    header: 'LOT NO',
    width: ENUM_WIDTH.M,
    name: 'lot_no',
    filter: 'text',
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
    filter: 'text',
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
    header: '발주량',
    width: ENUM_WIDTH.S,
    name: 'order_qty',
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
  },
  {
    header: '수량',
    width: ENUM_WIDTH.S,
    name: 'qty',
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
    header: '수입검사',
    width: ENUM_WIDTH.S,
    name: 'insp_fg',
    format: 'check',
    hidden: true,
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
  },
  {
    header: '이월',
    width: ENUM_WIDTH.S,
    name: 'carry_fg',
    format: 'check',
  },
  {
    header: '입고창고UUID',
    name: 'to_store_uuid',
    hidden: true,
  },
  {
    header: '입고창고',
    width: ENUM_WIDTH.M,
    name: 'to_store_nm',
    filter: 'text',
  },
  {
    header: '입고위치UUID',
    name: 'to_location_uuid',
    hidden: true,
  },
  {
    header: '입고위치',
    width: ENUM_WIDTH.M,
    name: 'to_location_nm',
    filter: 'text',
  },
  {
    header: '단위수량',
    width: ENUM_WIDTH.M,
    name: 'unit_qty',
    decimal: ENUM_DECIMAL.DEC_STCOK,
  },
  {
    header: '비고',
    width: ENUM_WIDTH.XL,
    name: 'remark',
  },
];

export const MatReceiveContent = ({ service }: MatReceiveContentProps) => {
  return (
    <Col span={16} style={{ paddingLeft: '8px', paddingRight: '8px' }}>
      <MatReceiveReadOnlyForm
        fieldClassName={MatReceiveContentStyleModule.fieldResizable}
        formValues={service.getContentFormValues()}
      />
      <div className={MatReceiveContentStyleModule.reactiveHeight}>
        <Datagrid
          ref={service.contentGridRef}
          data={service.receiveContentGridData}
          columns={columns}
          height="fitToParent"
          gridMode="multi-select"
        />
      </div>
    </Col>
  );
};
