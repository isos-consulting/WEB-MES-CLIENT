import Grid from '@toast-ui/react-grid'
import { Space, Modal, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import { Button, Container, Datagrid, GridPopup, IDatagridProps, IGridPopupProps, TGridPopupInfos } from '~/components/UI';
import { getData, getModifiedRows, getPageName, getPermissions, saveGridData } from '~/functions';
import { onErrorMessage, TAB_CODE } from './order.page.util';


/** 작업지시 - 공정순서 */
export const orderRoute = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);
  
  const [modal, contextHolder] = Modal.useModal();

  const [saveOptionParams, setSaveOptionParams] = useState({});

  
  //#region 🔶 메인 그리드 관련
  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  const gridPopupInfo:TGridPopupInfos = [
    {
      columnNames: [
        {original:'equip_uuid', popup:'equip_uuid'},
        {original:'equip_cd', popup:'equip_cd'},
        {original:'equip_nm', popup:'equip_nm'},
      ],
      // popupKey:'',
      dataApiSettings: {
        uriPath:'/std/routing-resources',
        params: {
          resource_type:'equip',
        }
      },
      columns: [
        {header: '생산자원UUID', name:'routing_resource_uuid', width:150, format:'text', hidden:true},
        {header: '라우팅UUID', name:'routing_uuid', alias:'uuid', width:150, format:'text', hidden:true},
        {header: '자원유형', name:'resource_type', width:100, format:'text', align:'center'},
        {header: '설비UUID', name:'equip_uuid', width:150, format:'text', hidden:true},
        {header: '설비코드', name:'equip_cd', width:150, format:'text', hidden:true},
        {header: '설비명', name:'equip_nm', width:150, format:'text'}, 
        {header: 'C/T', name:'cycle_time', width:80, format:'number'},
      ],
      gridMode:'multi-select'
    }
  ];

  /** 메인 그리드 속성 */
  const gridInfo:IDatagridProps = {
    /** 그리드 아이디 */
    gridId: TAB_CODE.공정순서+'_GRID',
    /** 참조 */
    ref: gridRef,
    /** 그리드 높이 */
    height: 300,
    /** 그리드 모드 */
    gridMode: 'delete',
    /** 저장 END POINT */
    saveUriPath: '/prd/order-routings',
    /** 조회 END POINT */
    searchUriPath: '/prd/order-routings',
    saveOptionParams: saveOptionParams,
    /** 컬럼 */
    columns: [
      {header:'공정순서UUID', name:'order_routing_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
      {header:'공정순서', name:'proc_no', width:80, hidden:false, format:'text', align:'center'},
      {header:'작업지시UUID', name:'order_uuid', width:200, hidden:true, format:'text'},
      {header:'지시번호', name:'order_no', width:200, hidden:true, format:'text'},
      {header:'공정UUID', name:'proc_uuid', width:200, hidden:true, format:'text'},
      {header:'공정코드', name:'proc_cd', width:200, hidden:true, format:'text'},
      {header:'공정명', name:'proc_nm', width:150, hidden:false, format:'text'},
      {header:'작업장UUID', name:'workings_uuid', width:200, hidden:true, format:'text'},
      {header:'작업장코드', name:'workings_cd', width:200, hidden:true, format:'text'},
      {header:'작업장명', name:'workings_nm', width:200, hidden:true, format:'text'},
      {header:'설비UUID', name:'equip_uuid', width:200, hidden:true, format:'text'},
      {header:'설비코드', name:'equip_cd', width:200, hidden:true, format:'text'},
      {header:'설비명', name:'equip_nm', width:150, hidden:false, editable:true, format:'popup'},
      {header:'비고', name:'remark', width:200, hidden:false, editable:true, format:'text'},
    ],
    /** 그리드 데이터 */
    data: data,
    /** 행추가팝업 */
    rowAddPopupInfo: gridPopupInfo[0],
    /** 수정팝업 */
    gridPopupInfo: gridPopupInfo,
    gridComboInfo: null,
  };
  //#endregion


  //#region 🔶수정 팝업 관련
  const editPopupGridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  /** 항목 수정 팝업 속성 */
  const editGridPopupInfo:IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.공정순서+'_EDIT_POPUP_GRID',
    ref: editPopupGridRef,
    gridMode: 'update',
    defaultData: data,
    data: null,
    height: null,
    onAfterClick: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.공정순서+'_EDIT_POPUP',
    /** 팝업 제목 */
    title: '비가동 항목 수정',
    /** 포지티브 버튼 글자 */
    okText: '수정하기',
    onOk: () => {
      saveGridData(
        getModifiedRows(editPopupGridRef, editGridPopupInfo.columns, editGridPopupInfo.data),
        editGridPopupInfo.columns,
        editGridPopupInfo.saveUriPath,
        editGridPopupInfo.saveOptionParams,
      ).then(({success}) => {
        if (!success) return;
        onSearch();
        setEditPopupVisible(false);
      });
    },
    /** 네거티브 버튼 글자 */
    cancelText: '취소',
    onCancel: () => {
      setEditPopupVisible(false);
    },
    /** 부모 참조 */
    parentGridRef: gridRef,
    /** 저장 유형 */
    saveType: 'basic',
    /** 저장 END POINT */
    saveUriPath: gridInfo.saveUriPath,
    /** 조회 END POINT */
    searchUriPath: gridInfo.searchUriPath,
    /** 추가 저장 값 */
    saveOptionParams: saveOptionParams,
    /** 최초 visible 상태 */
    defaultVisible: false,
    /** visible 상태값 */
    visible: editPopupVisible,
    onAfterOk: (isSuccess, savedData) => { 
      if (!isSuccess) return;
      onSearch();
      setEditPopupVisible(false);
    },
  };
  //#endregion
  
  const onSearch = () => {
    getData(
      saveOptionParams,
      gridInfo.searchUriPath,
    ).then((res) => {
      setData(res);
    });
  }
  
  const onEdit = (ev) => {
    if (saveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setEditPopupVisible(true);
  }

  const element = (
    !permissions ?
      <Spin spinning={true} tip='권한 정보를 가져오고 있습니다.' />
    :
    <>
      <Container>
        <div style={{width:'100%', display:'inline-block'}}>
          <Space size={[6,0]} style={{float:'right'}}>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={onEdit} disabled={!permissions?.update_fg}>수정</Button>
          </Space>
        </div>
        {/* <p/> */}
        <Datagrid {...gridInfo} gridMode={!permissions?.delete_fg ? 'view' : gridInfo.gridMode} />
      </Container>

      <GridPopup {...editGridPopupInfo} />

      {contextHolder}
    </>
  );
  
  return {
    element,
    setData: setData,
    saveOptionParams,
    setSaveOptionParams: setSaveOptionParams,
    searchUriPath: gridInfo.searchUriPath,
    onSearch,
  };
}