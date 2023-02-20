import { Formik } from 'formik';
import { DatePicker as AntdDatePicker, Form } from 'formik-antd';
import React from 'react';
import { getPopupForm, Label, PopupButton } from '~/components/UI';
import { TextBox } from './receive-readonly-form';
import styled from 'styled-components';
import { URL_PATH_STD } from '~/enums';
import { message } from 'antd';
import Fonts from '~styles/font.style.module.scss';
import Sizes from '~styles/size.style.module.scss';

const DatePicker = styled(AntdDatePicker)`
  width: 221px;
  height: ${Sizes.height_datepicker_default};
  font-size: ${Fonts.fontSize_datepicker};

  .ant-picker-input > input {
    font-size: ${Fonts.fontSize_datepicker};
    letter-spacing: ${Sizes.letterSpacing_common};
  }
`;

const FieldArea = styled.div`
  width: 380px;
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MatReceiveEditableForm = ({ service }) => {
  return (
    <Formik
      initialValues={service.formValues}
      enableReinitialize={true}
      onSubmit={() => {}}
    >
      <Form>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0px 10px' }}>
          <FieldArea>
            <Label text="전표번호" />
            <TextBox
              name="stmt_no"
              disabled={true}
              placeholder="전표번호는 자동으로 생성됩니다"
            />
          </FieldArea>
          <FieldArea>
            <Label text="입하일" important={true} />
            <DatePicker name="reg_date" />
          </FieldArea>
          <FieldArea>
            <Label text="거래처" important={true} />
            <TextBox
              name="partner_nm"
              disabled={true}
              placeholder="버튼을 눌러 거래처를 선택해주세요"
            />
            <div style={{ marginLeft: '-145px' }}>
              <PopupButton
                popupKey="거래처관리"
                popupKeys={['partner_uuid', 'partner_nm']}
                params={{ partner_fg: 1 }}
                handleChange={({ partner_uuid, partner_nm }) => {
                  service.setFormValues({
                    ...service.formValues,
                    partner_uuid,
                    partner_nm,
                  });
                }}
              />
            </div>
          </FieldArea>
          <FieldArea>
            <Label text="공급처" />
            <TextBox
              name="supplier_nm"
              disabled={true}
              placeholder="버튼을 눌러 공급처를 선택해주세요"
            />
            <div style={{ marginLeft: '-150px' }}>
              <PopupButton
                popupKeys={['supplier_uuid', 'supplier_nm']}
                datagridSettings={{
                  gridId: null,
                  columns: getPopupForm('공급처관리').datagridProps.columns,
                }}
                dataApiSettings={el => {
                  return {
                    uriPath: URL_PATH_STD.SUPPLIER.GET.SUPPLIERS,
                    params: {
                      partner_uuid: service.formValues.partner_uuid,
                    },
                    onInterlock: () => {
                      if (service.formValues.partner_uuid) {
                        return true;
                      } else {
                        message.warning('거래처를 먼저 선택해주세요.');
                        return false;
                      }
                    },
                  };
                }}
                modalSettings={{ title: '공급처 조회' }}
                handleChange={({ supplier_uuid, supplier_nm }) => {
                  service.setFormValues({
                    ...service.formValues,
                    supplier_uuid,
                    supplier_nm,
                  });
                }}
              />
            </div>
          </FieldArea>
          <FieldArea>
            <Label text="합계수량" />
            <TextBox
              name="total_qty"
              disabled={true}
              placeholder="합계 수량은 자동으로 계산됩니다"
            />
          </FieldArea>
          <FieldArea>
            <Label text="합계금액" />
            <TextBox
              name="total_price"
              disabled={true}
              placeholder="합계 금액은 자동으로 계산됩니다"
            />
          </FieldArea>
          <FieldArea>
            <Label text="비고" />
            <TextBox name="remark" placeholder="비고 값을 입력해주세요" />
          </FieldArea>
        </div>
      </Form>
    </Formik>
  );
};
