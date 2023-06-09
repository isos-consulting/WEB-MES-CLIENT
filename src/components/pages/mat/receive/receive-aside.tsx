import { Col, message } from 'antd';
import { Formik } from 'formik';
import { DatePicker, Form, SubmitButton } from 'formik-antd';
import React from 'react';
import styled from 'styled-components';
import { Container, Datagrid, IGridColumn, Label } from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import Colors from '~styles/color.style.module.scss';
import Fonts from '~styles/font.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import MatReceiveAsideStyleModule from './receive-aside.module.css';
import { MatReceiveService } from '~/service/mat/ReceiveService';

const RangePicker = styled(DatePicker.RangePicker)`
  width: 'auto';
  height: ${Sizes.height_datePicker_default};
  border-radius: ${Sizes.borderRadius_common};
  border-color: ${Colors.bg_datePicker_border};

  .ant-picker-input > input {
    font-size: ${Fonts.fontSize_datePicker};
    letter-spacing: ${Sizes.letterSpacing_common};
  }
`;

const columns: IGridColumn[] = [
  {
    header: '입하UUID',
    name: 'receive_uuid',
    hidden: true,
  },
  {
    header: '전표번호',
    name: 'stmt_no',
    filter: 'text',
    width: ENUM_WIDTH.M,
  },
  {
    header: '입하일',
    name: 'reg_date',
    width: ENUM_WIDTH.M,
    filter: 'text',
    format: 'date',
  },
  {
    header: '거래처UUID',
    name: 'partner_uuid',
    hidden: true,
  },
  {
    header: '거래처명',
    name: 'partner_nm',
    filter: 'text',
    width: ENUM_WIDTH.M,
  },
  {
    header: '공급처UUID',
    name: 'supplier_uuid',
    hidden: true,
  },
  {
    header: '공급처명',
    name: 'supplier_nm',
    filter: 'text',
    width: ENUM_WIDTH.M,
  },
  {
    header: '합계금액',
    name: 'total_price',
    width: ENUM_WIDTH.M,
    format: 'number',
    decimal: ENUM_DECIMAL.DEC_PRICE,
  },
];

export const MatReceiveAside = ({
  service,
}: {
  service: MatReceiveService;
}) => {
  return (
    <Col span={8} style={{ paddingLeft: '8px', paddingRight: '8px' }}>
      <Formik
        initialValues={service.receiveAsideFormData}
        onSubmit={async () => {
          service.searchReceiveHeader().catch(error => {
            message.error(error.toString());
          });
        }}
      >
        <Form>
          <Container>
            <div className={MatReceiveAsideStyleModule.flexibleFormContainer}>
              <Label text="입하일"></Label>
              <RangePicker
                name="date_range"
                allowClear={false}
                onChange={service.setRegDate}
              />
              <SubmitButton>조회</SubmitButton>
            </div>
          </Container>
        </Form>
      </Formik>
      <div className={MatReceiveAsideStyleModule.reactiveHeight}>
        <Datagrid
          gridId="receiveHeaderGrid"
          data={service.receiveHeaderGridData}
          columns={columns}
          height="fitToParent"
          onClick={service.asideGridClick}
        />
      </div>
    </Col>
  );
};
