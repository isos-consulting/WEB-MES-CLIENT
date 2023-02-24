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
          children="입하 전표 추가"
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
            onClick={service.deleteReceiveContent}
            widthSize="medium"
          />
          <Button
            ImageType="edit"
            btnType="buttonFill"
            children="수정"
            colorType="blue"
            disabled={false}
            fontSize="small"
            heightSize="small"
            onClick={modalService.openUpdateReceiveDetail}
            widthSize="medium"
          />
          <Button
            btnType="buttonFill"
            children="입하 전표 항목 추가"
            colorType="blue"
            fontSize="small"
            heightSize="small"
            widthSize="large"
            onClick={modalService.openCreateReceiveDetail}
          ></Button>
        </div>
      </Flexbox>
    </Div>
  );
};
