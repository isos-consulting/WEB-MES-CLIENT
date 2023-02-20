import { Formik } from 'formik';
import { Form, Input } from 'formik-antd';
import React from 'react';
import styled from 'styled-components';
import { Container, Label } from '~/components/UI';

const TextBox = styled(Input)`
  width: 221px;
  height: 26px;
  font-size: 12px;
`;

export const MatReceiveReadOnlyForm = ({ formValues }) => {
  return (
    <Formik
      initialValues={formValues}
      enableReinitialize={true}
      onSubmit={values => {}}
    >
      <Form>
        <Container>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 10px' }}>
            <div
              style={{
                width: '380px',
                height: '36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Label text="전표번호" />
              <TextBox name="stmt_no" disabled={true} />
            </div>
            <div
              style={{
                width: '380px',
                height: '36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Label text="입하일" />
              <TextBox name="reg_date" disabled={true} />
            </div>
            <div
              style={{
                width: '380px',
                height: '36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Label text="거래처" />
              <TextBox name="partner_nm" disabled={true} />
            </div>
            <div
              style={{
                width: '380px',
                height: '36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Label text="공급처" />
              <TextBox name="supplier_nm" disabled={true} />
            </div>
            <div
              style={{
                width: '380px',
                height: '36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Label text="합계수량" />
              <TextBox name="total_qty" disabled={true} />
            </div>
            <div
              style={{
                width: '380px',
                height: '36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Label text="합계금액" />
              <TextBox name="total_price" disabled={true} />
            </div>
            <div
              style={{
                width: '380px',
                height: '36px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Label text="비고" />
              <TextBox name="remark" disabled={true} />
            </div>
          </div>
        </Container>
      </Form>
    </Formik>
  );
};
