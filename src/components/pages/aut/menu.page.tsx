import React from "react";
import { Button, Container, Datagrid, IDatagridProps, useGrid } from "~/components/UI";
import {
  detailModalButtonProps,
  menuGridColumns,
  menuGridOptions,
  menuSearchButtonProps,
} from "./menu/constant/constant";

export const PgAutMenu = () => {
  const grid = useGrid("GRID", menuGridColumns, menuGridOptions);
  const gridProps:IDatagridProps = {
    ref: grid.gridRef,
    ...grid.gridInfo
  };
  
  return (
    <>
      <Button {...menuSearchButtonProps}>조회</Button>
      <Button {...detailModalButtonProps}>메뉴 상세 정보</Button>
      <Container>
        <Datagrid {...gridProps} />
      </Container>
    </>
  );
};
