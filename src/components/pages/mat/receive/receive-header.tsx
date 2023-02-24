import React from 'react';
import { Button, Div, Flexbox } from '~/components/UI';
import {
  MatReceiveModalService,
  MatReceiveService,
} from '~/service/mat/ReceiveService';

export const MatReceiveHeader = ({
  service,
  modalService,
}: {
  service: MatReceiveService;
  modalService: MatReceiveModalService;
}) => {
  return (
    <Div>
      <Flexbox width="100%" justifyContent="space-between">
        <Button
          ImageType="add"
          btnType="buttonFill"
          children="신규 항목 추가"
          colorType="blue"
          fontSize="small"
          heightSize="small"
          widthSize="large"
          onClick={modalService.openCreateReceive}
        />
        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
        >
          <Button
            ImageType="delete"
            btnType="buttonFill"
            children="삭제"
            colorType="delete"
            disabled={false}
            fontSize="small"
            heightSize="small"
            onClick={() => {
              service.deleteReceiveContent();
            }}
            widthSize="medium"
          />
          <Button>수정</Button>
          <Button>세부 항목 추가</Button>
        </div>
      </Flexbox>
    </Div>
  );
};
