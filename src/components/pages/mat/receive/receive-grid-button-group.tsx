import { message } from 'antd';
import React from 'react';
import { Button } from '~/components/UI';
import { isNil } from '~/helper/common';

export const MatReceiveGridInterfaceButtonGroup = ({ service }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Button
        ImageType="plus"
        btnType="buttonFill"
        colorType="blue"
        fontSize="small"
        heightSize="small"
        widthSize="large"
        onClick={() => console.log('hello')}
      >
        발주 불러오기
      </Button>
      <div>
        <Button
          ImageType="plus"
          btnType="buttonFill"
          colorType="blue"
          fontSize="small"
          heightSize="small"
          widthSize="medium"
          onClick={() => {
            if (isNil(service.formValues.partner_uuid)) {
              message.warn('거래처를 선택해주세요.');
              return;
            } else if (!isNil(service.formValues.partner_uuid)) {
              service.subModalToggle();
            }
          }}
        >
          행추가
        </Button>
        <Button
          ImageType="cancel"
          btnType="buttonFill"
          colorType="blue"
          fontSize="small"
          heightSize="small"
          widthSize="medium"
          onClick={() => console.log('hello')}
        >
          행취소
        </Button>
      </div>
    </div>
  );
};
