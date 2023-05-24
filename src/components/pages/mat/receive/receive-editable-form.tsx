import { Formik } from 'formik';
import { DatePicker as AntdDatePicker, Form } from 'formik-antd';
import React from 'react';
import styled from 'styled-components';
import { getPopupForm, Label, PopupButton } from '~/components/UI';
import { MatReceiveModalService } from '~/service/mat/ReceiveService';
import Fonts from '~styles/font.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import { TextBox } from './receive-readonly-form';
import MatReceiveEditableFormStyleModule from './receive-editable-form.module.css';

const DatePicker = styled(AntdDatePicker)`
  width: 221px;
  height: ${Sizes.height_datePicker_default};
  font-size: ${Fonts.fontSize_datePicker};

  .ant-picker-input > input {
    font-size: ${Fonts.fontSize_datePicker};
    letter-spacing: ${Sizes.letterSpacing_common};
  }
`;

interface FieldAreaProps {
  className?: string;
  children?: React.ReactNode;
}

const FieldArea = ({ className, children }: FieldAreaProps) => (
  <div className={className}>{children}</div>
);

export const MatReceiveEditableForm = ({
  service,
}: {
  service: MatReceiveModalService;
}) => {
  return (
    <Formik
      initialValues={service.formValues}
      enableReinitialize={true}
      onSubmit={() => {}}
    >
      <Form>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0px 10px' }}>
          <FieldArea className={MatReceiveEditableFormStyleModule.fieldArea}>
            <Label text="전표번호" />
            <TextBox
              className={MatReceiveEditableFormStyleModule.textBox}
              name="stmt_no"
              disabled={true}
              placeholder="전표번호는 자동으로 생성됩니다"
            />
          </FieldArea>
          <FieldArea className={MatReceiveEditableFormStyleModule.fieldArea}>
            <Label text="입하일" important={true} />
            <DatePicker
              name="reg_date"
              allowClear={false}
              onChange={service.setRegDate}
            />
          </FieldArea>
          <FieldArea className={MatReceiveEditableFormStyleModule.fieldArea}>
            <Label text="거래처" important={true} />
            <TextBox
              className={MatReceiveEditableFormStyleModule.textBox}
              name="partner_nm"
              disabled={true}
              placeholder="버튼을 눌러 거래처를 선택해주세요"
            />
            <div style={{ marginLeft: '-145px' }}>
              <PopupButton
                popupKey="거래처관리"
                popupKeys={['partner_uuid', 'partner_nm']}
                params={{ partner_fg: 1 }}
                handleChange={service.setPartner}
              />
            </div>
          </FieldArea>
          <FieldArea className={MatReceiveEditableFormStyleModule.fieldArea}>
            <Label text="공급처" />
            <TextBox
              className={MatReceiveEditableFormStyleModule.textBox}
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
                dataApiSettings={service.interlockSupplier}
                modalSettings={{ title: '공급처 조회' }}
                handleChange={service.setSupplier}
              />
            </div>
          </FieldArea>
          <FieldArea className={MatReceiveEditableFormStyleModule.fieldArea}>
            <Label text="합계수량" />
            <TextBox
              className={MatReceiveEditableFormStyleModule.textBox}
              name="total_qty"
              disabled={true}
              placeholder="수량은 데이터 저장 시 자동으로 계산됩니다"
            />
          </FieldArea>
          <FieldArea className={MatReceiveEditableFormStyleModule.fieldArea}>
            <Label text="합계금액" />
            <TextBox
              className={MatReceiveEditableFormStyleModule.textBox}
              name="total_price"
              disabled={true}
              placeholder="금액은 데이터 저장 시 자동으로 계산됩니다"
            />
          </FieldArea>
          <FieldArea className={MatReceiveEditableFormStyleModule.fieldArea}>
            <Label text="비고" />
            <TextBox
              className={MatReceiveEditableFormStyleModule.textBox}
              name="remark"
              placeholder="비고 값을 입력해주세요"
            />
          </FieldArea>
        </div>
      </Form>
    </Formik>
  );
};
