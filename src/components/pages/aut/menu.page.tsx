import React, { useState } from "react";
import { Button, Container, Datagrid, Modal, useGrid } from "~/components/UI";
import { InputGroupbox, useInputGroup } from "~/components/UI/input-groupbox";
import { URL_PATH_AUT } from "~/enums";
import {
  detailModalButtonProps,
  detailModalProps,
  menuGridColumns,
  menuGridOptions,
  menuInputGroupBoxs,
  menuSearchButtonProps,
} from "./menu/constant/constant";
import MenuService from "./menu/MenuService";

export const PgAutMenu = () => {
  const [menuModalVisible, setMenuModalVisible] = useState<boolean>(false);
  const grid = useGrid("GRID", menuGridColumns, menuGridOptions);
  const inputGroups = useInputGroup("MENU_INPUTBOX", menuInputGroupBoxs);
  const menuService = new MenuService(URL_PATH_AUT.MENU.GET.MENUS, grid, setMenuModalVisible);

  const gridProps = menuService.getGridProps();

  detailModalProps.visible = menuModalVisible;
  detailModalProps.onCancel = menuService.afterCloseMenuModal;
  detailModalProps.onOk = _ => {
    console.log(inputGroups);
  }

  detailModalButtonProps.onClick = menuService.openMenuModal;
  menuSearchButtonProps.onClick = menuService.searchMenuList;

  return (
    <>
      <Button {...menuSearchButtonProps}>조회</Button>
      <Button {...detailModalButtonProps}>메뉴 상세 정보</Button>
      <Container>
        <Datagrid {...gridProps} />
      </Container>
      <Modal {...detailModalProps}>
        <InputGroupbox {...inputGroups.props} />
      </Modal>
    </>
  );
};
