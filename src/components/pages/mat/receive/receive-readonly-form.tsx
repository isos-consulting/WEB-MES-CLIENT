import { Formik } from 'formik';
import { Form, Input } from 'formik-antd';
import React from 'react';
import styled from 'styled-components';
import { Container, Label } from '~/components/UI';
import Fonts from '~styles/font.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import MatReceiveReadOnlyFormStyleModule from './receive-readonly-form.module.css';

export const TextBox = styled(Input)`
  height: ${Sizes.height_datePicker_default};
  font-size: ${Fonts.fontSize_datePicker};
`;

export const MatReceiveReadOnlyForm = ({ formValues, fieldClassName }) => {
  return (
    <Formik
      initialValues={formValues}
      enableReinitialize={true}
      onSubmit={values => {}}
    >
      <Form>
        <Container>
          <div
            className={MatReceiveReadOnlyFormStyleModule.flexibleFormContainer}
          >
            <div
              className={[
                MatReceiveReadOnlyFormStyleModule.textBoxArea,
                fieldClassName,
              ].join(' ')}
            >
              <Label text="전표번호" />
              <TextBox
                className={MatReceiveReadOnlyFormStyleModule.textBox}
                name="stmt_no"
                disabled={true}
              />
            </div>
            <div
              className={[
                MatReceiveReadOnlyFormStyleModule.textBoxArea,
                fieldClassName,
              ].join(' ')}
            >
              <Label text="입하일" />
              <TextBox
                className={MatReceiveReadOnlyFormStyleModule.textBox}
                name="reg_date"
                disabled={true}
              />
            </div>
            <div
              className={[
                MatReceiveReadOnlyFormStyleModule.textBoxArea,
                fieldClassName,
              ].join(' ')}
            >
              <Label text="거래처" />
              <TextBox
                className={MatReceiveReadOnlyFormStyleModule.textBox}
                name="partner_nm"
                disabled={true}
              />
            </div>
            <div
              className={[
                MatReceiveReadOnlyFormStyleModule.textBoxArea,
                fieldClassName,
              ].join(' ')}
            >
              <Label text="공급처" />
              <TextBox
                className={MatReceiveReadOnlyFormStyleModule.textBox}
                name="supplier_nm"
                disabled={true}
              />
            </div>
            <div
              className={[
                MatReceiveReadOnlyFormStyleModule.textBoxArea,
                fieldClassName,
              ].join(' ')}
            >
              <Label text="합계수량" />
              <TextBox
                className={MatReceiveReadOnlyFormStyleModule.textBox}
                name="total_qty"
                disabled={true}
              />
            </div>
            <div
              className={[
                MatReceiveReadOnlyFormStyleModule.textBoxArea,
                fieldClassName,
              ].join(' ')}
            >
              <Label text="합계금액" />
              <TextBox
                className={MatReceiveReadOnlyFormStyleModule.textBox}
                name="total_price"
                disabled={true}
              />
            </div>
            <div
              className={[
                MatReceiveReadOnlyFormStyleModule.textBoxArea,
                fieldClassName,
              ].join(' ')}
            >
              <Label text="비고" />
              <TextBox
                className={MatReceiveReadOnlyFormStyleModule.textBox}
                name="remark"
                disabled={true}
              />
            </div>
          </div>
        </Container>
      </Form>
    </Formik>
  );
};
