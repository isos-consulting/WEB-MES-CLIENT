import React, { useState } from 'react';
import { Button, Container, Datagrid, Modal, useGrid } from '~/components/UI';
import { InputGroupbox, useInputGroup } from '~/components/UI/input-groupbox';
import { URL_PATH_AUT } from '~/enums';
import { executeData } from '~/functions';
import {
  detailModalButtonProps,
  detailModalProps,
  menuGridColumns,
  menuGridOptions,
  menuInputGroupBoxs,
  menuSearchButtonProps,
  messages,
} from './menu/constant/constant';
import MenuService from './menu/MenuService';

export const PgAutMenu = () => {
  const [menuModalVisible, setMenuModalVisible] = useState<boolean>(false);
  const grid = useGrid('GRID', menuGridColumns, menuGridOptions);
  const inputGroups = useInputGroup('MENU_INPUTBOX', menuInputGroupBoxs);
  const menuService = new MenuService(
    URL_PATH_AUT.MENU.GET.MENUS,
    grid,
    setMenuModalVisible,
  );

  const gridProps = menuService.getGridProps();

  detailModalProps.visible = menuModalVisible;
  detailModalProps.onCancel = menuService.afterCloseMenuModal;
  detailModalProps.afterClose = () => {
    inputGroups.ref.current.setValues('');
  };

  detailModalProps.onOk = async () => {
    const record = inputGroups.ref.current.values;
    const type = menuService.isNewReocrd(record)
      ? 'post'
      : menuService.isDeleteReocrd(record)
      ? 'delete'
      : 'put';
    const isValid = menuService.isNewReocrd(record)
      ? menuService.newRecordValid(record, messages.wargning[type])
      : menuService.isDeleteReocrd(record)
      ? menuService.deleteRecordValid(record)
      : menuService.updateRecordValid(record, messages.wargning[type]);

    if (
      isValid
        ? confirm(`메뉴를 ${messages.confirm[type]} 하시겠습니까?`)
        : false
    ) {
      return (await executeData(
        [record].map(({ menu_type_uuid, ...menu }) => ({
          ...menu,
          menu_type_uuid: menu_type_uuid === '' ? null : menu_type_uuid,
        })),
        URL_PATH_AUT.MENU.PUT.MENUS,
        type,
      ))
        ? alert(messages.complete)
        : console.trace(
            '%cmenu 정보 저장 API 요청 결과 실패함',
            'color: red; font-size: 15px;',
          );
    }
  };

  detailModalButtonProps.onClick = menuService.openMenuModal;
  menuSearchButtonProps.onClick = menuService.searchMenuList;

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Button {...menuSearchButtonProps}>조회</Button>
        <Button {...detailModalButtonProps}>메뉴 관리</Button>
      </div>
      <Container height={800}>
        <Datagrid height={750} {...gridProps} />
      </Container>
      <Modal {...detailModalProps}>
        <InputGroupbox {...inputGroups.props} />
      </Modal>
    </>
  );
};
