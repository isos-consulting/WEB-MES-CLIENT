import React from 'react';
import { Button } from '~/components/UI';

export const MatReceiveGridInterfaceButtonGroup = ({ service }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        position: 'absolute',
        width: '98%',
        backgroundColor: '#fff',
        zIndex: '100',
      }}
    >
      <Button
        ImageType="plus"
        btnType="buttonFill"
        colorType="blue"
        fontSize="small"
        heightSize="small"
        widthSize="large"
        onClick={service.openOrderDetail}
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
          onClick={service.openVendorPrice}
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
          onClick={service.deleteReceiveRow}
        >
          행취소
        </Button>
      </div>
    </div>
  );
};
