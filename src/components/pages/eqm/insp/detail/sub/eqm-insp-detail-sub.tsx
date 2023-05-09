import Grid from '@toast-ui/react-grid';
import React from 'react';
import {
  Button,
  Container,
  Datagrid,
  IGridColumn,
  TGridMode,
} from '~/components/UI';
import {
  IInputGroupboxProps,
  InputGroupbox,
} from '~/components/UI/input-groupbox';

type EqmInspDetailSubProps = {
  inputProps: IInputGroupboxProps;
  gridRef: React.MutableRefObject<Grid>;
  columns: IGridColumn[];
  data: any[];
  gridMode: TGridMode;
  onCreateDetail: () => void;
  onUpdate: () => void;
  onDelete: () => void;
};

export const EqmInspDetailSub = ({
  inputProps,
  gridRef,
  columns,
  data,
  gridMode,
  onCreateDetail,
  onUpdate,
  onDelete,
}: EqmInspDetailSubProps) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'inline-flex', gap: '0px 5px' }}>
          <Button
            btnType="buttonFill"
            widthSize="medium"
            heightSize="small"
            fontSize="small"
            ImageType="delete"
            colorType="delete"
            onClick={onDelete}
          >
            삭제
          </Button>
          <Button
            btnType="buttonFill"
            widthSize="medium"
            heightSize="small"
            fontSize="small"
            ImageType="edit"
            colorType="blue"
            onClick={onUpdate}
          >
            수정
          </Button>
          <Button
            btnType="buttonFill"
            widthSize="large"
            heightSize="small"
            fontSize="small"
            ImageType="add"
            colorType="blue"
            onClick={onCreateDetail}
          >
            세부 항목 추가
          </Button>
        </div>
      </div>
      <InputGroupbox {...inputProps} />
      <Container>
        <Datagrid
          gridId="eqm-insp-detail-sub"
          ref={gridRef}
          columns={columns}
          data={data}
          gridMode={gridMode}
          height={document.getElementById('main-body')?.clientHeight - 201}
        />
      </Container>
    </>
  );
};
