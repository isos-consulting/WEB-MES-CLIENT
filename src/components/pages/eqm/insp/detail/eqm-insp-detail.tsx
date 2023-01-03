import Grid from '@toast-ui/react-grid';
import React from 'react';
import { Container, Datagrid, IGridColumn } from '~/components/UI';
import {
  IInputGroupboxProps,
  InputGroupbox,
} from '~/components/UI/input-groupbox';

type EqmInspDetailProps = {
  inputProps: IInputGroupboxProps;
  gridRef: React.MutableRefObject<Grid>;
  columns: IGridColumn[];
  data: any[];
  gridMode: string;
  onAfterClick: (ev: any) => void;
};

export const EqmInspDetail = ({
  inputProps,
  gridRef,
  columns,
  data,
  gridMode,
  onAfterClick,
}: EqmInspDetailProps) => {
  return (
    <>
      <div style={{ display: 'none' }}>
        <InputGroupbox {...inputProps} />
      </div>
      <Container>
        <Datagrid
          ref={gridRef}
          columns={columns}
          data={data}
          gridMode={gridMode}
          onAfterClick={onAfterClick}
        />
      </Container>
    </>
  );
};
