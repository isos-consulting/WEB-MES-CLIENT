import { Col } from 'antd';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { DatePicker, Form, SubmitButton } from 'formik-antd';
import React from 'react';
import styled from 'styled-components';
import { Container, Datagrid, Label } from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { getToday } from '~/functions';
import Colors from '~styles/color.style.module.scss';
import Fonts from '~styles/font.style.module.scss';
import Sizes from '~styles/size.style.module.scss';

const RangePicker = styled(DatePicker.RangePicker)`
  width: 'auto';
  height: ${Sizes.height_datepicker_default};
  border-radius: ${Sizes.borderRadius_common};
  border-color: ${Colors.bg_datepicker_border};

  .ant-picker-input > input {
    font-size: ${Fonts.fontSize_datepicker};
    letter-spacing: ${Sizes.letterSpacing_common};
  }
`;

export const MatReceiveAside = ({
  gridRef,
  onGridClick,
  gridData,
  setGridData,
  remoteStore,
}) => {
  const columns = [
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

  const handleSearch = async ({ receive_date }) => {
    const receiveHeader = await remoteStore.getHeader(
      receive_date[0].format('YYYY-MM-DD'),
      receive_date[1].format('YYYY-MM-DD'),
    );

    setGridData(receiveHeader);
  };

  return (
    <Col span={8} style={{ paddingLeft: '8px', paddingRight: '8px' }}>
      <Formik
        initialValues={{
          receive_date: [
            dayjs(getToday(-7), 'YYYY-MM-DD'),
            dayjs(getToday(), 'YYYY-MM-DD'),
          ],
          end_date: getToday(),
        }}
        onSubmit={handleSearch}
      >
        <Form>
          <Container>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Label text="입하일"></Label>
              <RangePicker name="receive_date" allowClear={false} />
              <SubmitButton>조회</SubmitButton>
            </div>
          </Container>
        </Form>
      </Formik>
      <Container>
        <Datagrid
          ref={gridRef}
          data={gridData}
          columns={columns}
          height={700}
          onClick={onGridClick}
        />
      </Container>
    </Col>
  );
};
