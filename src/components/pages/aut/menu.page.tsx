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
  detailModalProps.afterClose = () => {inputGroups.ref.current.setValues("")} // Popup unmount 시 input 초기화

  detailModalProps.onOk = async _ => {

    const record = inputGroups.ref.current.values;
    let restAPIType = null   
    let msg = ""
    
    const editChk = () => {      
      if (record.uuid == null || record.uuid == "") {    // [메뉴 이름] 없으면 신규 메뉴 생성으로 판단    
        restAPIType = 'post' //생성
        msg = "생성"
        if (record.parent_uuid == null || record.parent_uuid == ""){
          alert("메뉴를 " + msg + "하시려면 [상위메뉴 이름] 을 입력하세요!")
          return false
        }else if (record.menu_nm == null || record.menu_nm == "") {
          alert("메뉴를 " + msg + "하시려면 [신규메뉴 이름] 을 입력하세요!")
          return false
        }else if (record.sortby == null || record.sortby == "") {
          alert("메뉴를 " + msg + "하시려면 [정렬순서] 값을 입력하세요!")
          return false
        }else if (record.use_fg == null || record.use_fg == "") {
          alert("메뉴를 " + msg + "하시려면 [사용유무] 값 [True/False] 를 입력하세요!")
          return false
        }
      }else if ((record.parent_uuid == null || record.parent_uuid == "") && 
                (record.sortby == null || record.sortby == "")) { // [상위메뉴 이름] 과 [정렬순서] 없으면 삭제로 판단
        restAPIType = 'delete' //삭제
        msg = "삭제"
      }else{ // 나머지 경우 모두 수정으로 판단
        restAPIType = 'put' //수정
        msg = "수정"
        if (record.parent_uuid == null || record.parent_uuid == ""){
          alert("메뉴를 " + msg + "하시려면 [상위메뉴 이름] 을 입력하세요!")
          return false
        }else if (record.sortby == null || record.sortby == ""){
          alert("메뉴를 " + msg + "하시려면 [정렬순서] 값을 입력하세요!")
          return false
        }
        record.menu_nm = record.menu_nm_edit     
      }

      if (confirm("메뉴를 [" + msg + "] 하시겠습니까?") == true){        
      }else{
        return false
      }
    }
    if (editChk() != false) {
      await executeData([record], URL_PATH_AUT.MENU.PUT.MENUS, restAPIType);
      alert("메뉴 적용은 재시작이 필요합니다.")
    }
  };

  detailModalButtonProps.onClick = menuService.openMenuModal; // 메뉴 관리 클릭
  menuSearchButtonProps.onClick = menuService.searchMenuList; //조회 버튼 클릭

  return (
    <>
      <Button {...menuSearchButtonProps}>조회</Button>
      <Button {...detailModalButtonProps}>메뉴 관리</Button>
      <Container height={800}>
        <Datagrid height={750}{...gridProps} />
      </Container>
      <Modal {...detailModalProps}>
        <InputGroupbox {...inputGroups.props} />
      </Modal>      
    </>
  );
};
