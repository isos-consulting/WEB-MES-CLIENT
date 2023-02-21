import React from 'react';
import { Button, Div, Flexbox } from '~/components/UI';
import { MatReceiveModalService } from '~/service/mat/ReceiveService';

export const MatReceiveHeader = ({
  modalService,
}: {
  modalService: MatReceiveModalService;
}) => {
  return (
    <Div>
      <Flexbox width="100%" justifyContent="space-between">
        <Button
          ImageType="add"
          btnType="buttonFill"
          colorType="blue"
          fontSize="small"
          heightSize="small"
          widthSize="large"
          onClick={modalService.openCreateReceive}
        >
          신규 항목 추가
        </Button>
        <div
          style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}
        >
          <Button>삭제</Button>
          <Button>수정</Button>
          <Button>세부 항목 추가</Button>
        </div>
      </Flexbox>
    </Div>
  );
};
