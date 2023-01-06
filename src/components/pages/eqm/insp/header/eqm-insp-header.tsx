import Grid from '@toast-ui/react-grid';
import React from 'react';
import { Button, Container, Datagrid, IGridColumn } from '~/components/UI';

type EqmInspHeaderProps = {
  gridRef: React.MutableRefObject<Grid>;
  columns: IGridColumn[];
  data: any[];
  gridMode: string;
  onAfterClick: (ev: any) => void;
  onSearch: () => void;
  onCreate: () => void;
  onRevise: () => void;
};

export const EqmInspHeader = ({
  gridRef,
  columns,
  data,
  gridMode,
  onAfterClick,
  onSearch,
  onCreate,
  onRevise,
}: EqmInspHeaderProps) => {
  return (
    <>
      <div>
        <div style={{ display: 'inline-flex', gap: '0px 5px' }}>
          <Button
            btnType="buttonFill"
            widthSize="medium"
            heightSize="small"
            fontSize="small"
            ImageType="search"
            colorType="blue"
            onClick={onSearch}
          >
            조회
          </Button>
          <Button
            btnType="buttonFill"
            widthSize="large"
            heightSize="small"
            fontSize="small"
            ImageType="add"
            colorType="blue"
            onClick={onCreate}
          >
            신규 기준서 등록
          </Button>
          <Button
            btnType="buttonFill"
            widthSize="medium"
            heightSize="small"
            fontSize="small"
            ImageType="edit"
            colorType="blue"
            onClick={onRevise}
          >
            개정
          </Button>
        </div>
      </div>

      <Container>
        <Datagrid
          ref={gridRef}
          columns={columns}
          data={data}
          gridMode={gridMode}
          height={220}
          onAfterClick={onAfterClick}
        />
      </Container>
    </>
  );
};
