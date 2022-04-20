import React from "react";
import { Button, Container, Datagrid, useGrid } from "~/components/UI";
import { URL_PATH_AUT } from "~/enums";
import {
  detailModalButtonProps,
  menuGridColumns,
  menuGridOptions,
  menuSearchButtonProps,
} from "./menu/constant/constant";
import MenuService from "./menu/MenuService";

export const PgAutMenu = () => {
  const grid = useGrid("GRID", menuGridColumns, menuGridOptions);
  const menuService = new MenuService(URL_PATH_AUT.MENU.GET.MENUS, grid);

  const gridProps = menuService.getGridProps();

  const handleDetailModalButtonClick = () => {

  };

  detailModalButtonProps.onClick = handleDetailModalButtonClick;
  menuSearchButtonProps.onClick = menuService.searchMenuList;

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
