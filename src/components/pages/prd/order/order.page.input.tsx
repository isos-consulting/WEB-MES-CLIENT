import Grid from '@toast-ui/react-grid'
import { Space, Modal, Spin, message } from 'antd';
import React, { useRef, useState } from 'react';
import { Button, Container, Datagrid, getPopupForm, GridPopup, IDatagridProps, IGridPopupProps, TGridPopupInfos } from '~/components/UI';
import { getData, getModifiedRows, getPageName, getPermissions, saveGridData } from '~/functions';
import { onDefaultGridSave, onErrorMessage, TAB_CODE } from './order.page.util';


/** 작업지시 - 자재투입 */
export const orderInput = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  const [modal, contextHolder] = Modal.useModal();

  const [saveOptionParams, setSaveOptionParams] = useState({});

  
  //#region 🔶메인 그리드 관련
  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  const gridPopupInfo:TGridPopupInfos = [
    {
      columnNames: [
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'prod_type_uuid', popup:'prod_type_uuid'},
        {original:'item_type_cd', popup:'item_type_cd'},
        {original:'item_type_nm', popup:'item_type_nm'},
        {original:'model_uuid', popup:'model_uuid'},
        {original:'model_cd', popup:'model_cd'},
        {original:'model_nm', popup:'model_nm'},
        {original:'rev', popup:'rev'},
        {original:'prod_std', popup:'prod_std'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_cd', popup:'unit_cd'},
        {original:'unit_nm', popup:'unit_nm'},
      ],
      popupKey:'품목관리',
      dataApiSettings: {
        uriPath:'/std/prods',
        params: {
          use_fg:true
        }
      },
      columns: [
        {header: '품목아이디', name:'prod_uuid', width:150, filter:'text', hidden:true},
        {header: '품번', name:'prod_no', width:150, filter:'text'},
        {header: '품목명', name:'prod_nm', width:150, filter:'text'},
        {header: '품목 유형아이디', name:'item_type_uuid', width:150, filter:'text', hidden:true },
        {header: '품목 유형코드', name:'item_type_cd', width:150, filter:'text', hidden:true},
        {header: '품목 유형명', name:'item_type_nm', width:100, align:'center', filter:'text' },
        {header: '제품 유형아이디', name:'prod_type_uuid', width:150, filter:'text', hidden:true},
        {header: '제품 유형코드', name:'prod_type_cd', width:150, filter:'text', hidden:true},
        {header: '제품 유형명', name:'prod_type_nm', width:150, filter:'text'},
        {header: '모델아이디', name:'model_uuid', width:150, filter:'text', hidden:true},
        {header: '모델코드', name:'model_cd', width:150, filter:'text', hidden:true},
        {header: '모델명', name:'model_nm', width:150, filter:'text'},
        {header: '리비전', name:'rev', width:100, filter:'text'},
        {header: '규격', name:'prod_std', width:150, filter:'text'},
        {header: '단위아최소 단위수량', name:'mat_order_min_qty', width:150, filter:'text', format:'number'},
        {header: '발주 소요일', name:'mat_supply_days', width:150, filter:'text', format:'date'},
        {header: '수주 사용유무', name:'sal_order_fg', width:120, filter:'text', format:'check'},
        {header: '창고 사용유무', name:'inv_use_fg', width:120, filter:'text', format:'check'},
        {header: '단위수량', name:'inv_package_qty', width:100, filter:'text', format:'number'},
        {header: '안전 재고수량', name:'inv_safe_qty', width:150, filter:'text', format:'number'},
        {header: '입고 창고아이디', name:'inv_to_store_uuid', width:150, filter:'text', hidden:true},
        {header: '위치 아이디', name:'inv_to_location_uuid', width:150, filter:'text', editable:true, hidden:true},
        {header: '위치코드', name:'inv_to_location_cd', width:150, filter:'text', editable:true, hidden:true},
        {header: '위치명', name:'inv_to_location_nm', width:100, align:'center', filter:'text', editable:true},
        {header: '창고코드', name:'inv_to_store_cd', width:150, filter:'text', hidden:true},
        {header: '창고명', name:'inv_to_store_nm', width:100, align:'center', filter:'text'},
        {header: '수입검사유무', name:'qms_recv_insp_fg', width:120, filter:'text', format:'check'},
        {header: '공정검사유무', name:'qms_proc_insp_fg', width:120, filter:'text', format:'check'},
        {header: '출하검사유무', name:'qms_outgo_insp_fg', width:120, filter:'text', format:'check'},
        {header: '생산품유무', name:'prd_active_fg', width:100, filter:'text', format:'check'},
        {header: '계획유형코드 (MPS/MRP)', name:'prd_plan_type_uuid', width:180, align:'center', filter:'text'},
        {header: '최소값', name:'prd_min', width:150, filter:'text', format:'number'},
        {header: '최대값', name:'prd_max', width:150, filter:'text', format:'number'},
        {header: '등록일자', name:'updated_at', width:100, filter:'text', format:'date'},
        {header: '등록자이디', name:'unit_uuid', width:150, filter:'text', hidden:true},
        {header: '단위코드', name:'unit_cd', width:150, filter:'text', hidden:true},
        {header: '단위명', name:'unit_nm', width:150, filter:'text'},
        {header: 'LOT 사용유무', name:'lot_fg', width:120, filter:'text', format:'check'},
        {header: '사용유무', name:'use_fg', width:100, filter:'text', format:'check'},
        {header: '품목 활성 상태', name:'active_fg', width:120, filter:'text', format:'check'},
        {header: 'BOM 유형 코드', name:'bom_type_uuid', width:150, align:'center', filter:'text'},
        {header: '폭', name:'width', width:100, filter:'text', format:'number'},
        {header: '길이', name:'length', width:100, filter:'text', format:'number'},
        {header: '높이', name:'height', width:100, filter:'text', format:'number'},
        {header: '재질', name:'material', width:100, filter:'text'},
        {header: '색상', name:'color', width:100, filter:'text'},
        {header: '중량', name:'weight', width:100, filter:'text', format:'number'},
        {header: '두께', name:'thickness', width:100, filter:'text', format:'number'},
        {header: '발주 사용유무', name:'mat_order_fg', width:120, filter:'text', format:'check'},
        {header: '발주 ', name:'updated_nm', width:100, align:'center', filter:'text'},
      ],
      gridMode:'multi-select'
    },
    { // 창고 팝업
      columnNames: [
        {original:'from_store_uuid', popup:'store_uuid'},
        {original:'from_store_nm', popup:'store_nm'},
      ],
      columns: getPopupForm('창고관리').datagridProps?.columns,
      dataApiSettings: (el: any) => {
        const {rowKey, instance} = el;
        const {rawData} = instance.store.data;
        
        return {
          uriPath: getPopupForm('창고관리').uriPath,
          params: { store_type: 'available' },
          onAfterOk: () => {
            rawData[rowKey].from_location_uuid = '';
            rawData[rowKey].from_location_nm = '';
          }
        }
      },
      gridMode: 'select',
    },
    { // 위치 팝업
      columnNames: [
        {original:'from_location_uuid', popup:'location_uuid'},
        {original:'from_location_nm', popup:'location_nm'},
      ],
      columns: getPopupForm('위치관리').datagridProps?.columns,
      dataApiSettings:(el: any) => {
        const {rowKey, instance} = el;
        const {rawData} = instance.store.data;

        const storeUuid = rawData[rowKey]?.from_store_uuid;

        return {
          uriPath: getPopupForm('위치관리').uriPath,
          params: {
            store_uuid: storeUuid,
          },
          onInterlock: ()=> {
            if(storeUuid) {
              return true;
            } else {
              message.warning('창고를 먼저 선택해주세요.')
              return false;
            }
          }
        }
      },
      gridMode: 'select',
    },
    { // BOM 투입유형 팝업
      columnNames: [
        {original:'bom_input_type_uuid', popup:'bom_input_type_uuid'},
        {original:'bom_input_type_cd', popup:'bom_input_type_cd'},
        {original:'bom_input_type_nm', popup:'bom_input_type_nm'},
      ],
      columns: getPopupForm('BOM투입유형관리').datagridProps?.columns,
      dataApiSettings: {
        uriPath: getPopupForm('BOM투입유형관리').uriPath,
        params: {},
      },
      gridMode: 'select',
    },
  ];

  /** 메인 그리드 속성 */
  const gridInfo:IDatagridProps = {
    /** 그리드 아이디 */
    gridId: TAB_CODE.투입품목관리+'_GRID',
    /** 참조 */
    ref: gridRef,
    /** 그리드 높이 */
    height: 300,
    /** 그리드 모드 */
    gridMode: 'delete',
    /** 저장 END POINT */
    saveUriPath: '/prd/order-inputs',
    /** 조회 END POINT */
    searchUriPath: '/prd/order-inputs',
    saveOptionParams: saveOptionParams,
    /** 컬럼 */
    columns: [
      {header:'투입이력UUID', name:'order_input_uuid', alias:'uuid', width:200, hidden:true},
      {header:'작업지시UUID', name:'order_uuid', width:200, hidden:true},
      {header:'지시번호', name:'order_no', width:200, hidden:true, noSave:true},
      {header:'품목UUID', name:'prod_uuid', width:200, hidden:true},
      {header:'품번', name:'prod_no', width:120, hidden:false, format:'popup', noSave:true},
      {header:'품목', name:'prod_nm', width:120, hidden:false, format:'popup', requiredField:true, noSave:true},
      {header:'제품 유형UUID', name:'prod_type_uuid', width:200, hidden:true},
      {header:'제품 유형', name:'prod_type_nm', width:120, hidden:false, format:'popup', noSave:true},
      {header:'품목 유형UUID', name:'item_type_uuid', width:200, hidden:true},
      {header:'품목 유형', name:'item_type_nm', width:120, hidden:false, format:'popup', noSave:true},
      {header:'모델UUID', name:'model_uuid', width:200, hidden:true},
      {header:'모델', name:'model_nm', width:120, hidden:false, format:'popup', noSave:true},
      {header:'Rev', name:'rev', width:80, hidden:false, format:'popup', noSave:true},
      {header:'규격', name:'prod_std', width:100, hidden:false, format:'popup', noSave:true},
      {header:'단위UUID', name:'unit_uuid', width:200, hidden:true},
      {header:'투입단위', name:'unit_nm', width:80, hidden:false, editable:true, format:'combo', requiredField:true, noSave:true},
      {header:'투입 유형UUID', name:'bom_input_type_uuid', width:200, hidden:true},
      {header:'투입 유형', name:'bom_input_type_nm', width:120, hidden:false, editable:true, format:'popup', requiredField:true, noSave:true},
      {header:'소요량', name:'c_usage', width:80, hidden:false, editable:true, format:'number', requiredField:true},
      {header:'출고 창고UUID', name:'from_store_uuid', width:200, hidden:true},
      {header:'출고 창고', name:'from_store_nm', width:150, hidden:false, editable:true, format:'popup', align:'center', requiredField:true, noSave:true},
      {header:'출고 위치UUID', name:'from_location_uuid', width:200, hidden:true},
      {header:'출고 위치', name:'from_location_nm', width:150, hidden:false, editable:true, format:'popup', align:'center', noSave:true},
      {header:'비고', name:'remark', width:150, hidden:false, editable:true},
    ],
    /** 그리드 데이터 */
    data: data,
    /** 행추가팝업 */
    rowAddPopupInfo: gridPopupInfo[0],
    /** 수정팝업 */
    gridPopupInfo: gridPopupInfo,
    gridComboInfo: [
      { // 투입단위 콤보박스
        columnNames: [
          {codeColName:{original:'unit_uuid', popup:'unit_uuid'}, textColName:{original:'unit_nm', popup:'unit_nm'}},
        ],
        dataApiSettings: {
          uriPath: '/std/units',
          params: {}
        }
      },
    ],
  };
  //#endregion

  
  //#region 🔶신규 팝업 관련
  const newPopupGridRef = useRef<Grid>();
  const [newPopupVisible, setNewPopupVisible] = useState(false);

  /** 신규 항목 추가 팝업 속성 */
  const newGridPopupInfo:IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.투입품목관리+'_NEW_POPUP_GRID',
    ref: newPopupGridRef,
    gridMode: 'create',
    defaultData: [],
    data: null,
    height: null,
    onAfterClick: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.투입품목관리+'_NEW_POPUP',
    /** 팝업 제목 */
    title: '투입품목 등록',
    /** 포지티브 버튼 글자 */
    okText: '저장하기',
    onOk: () => {
      saveGridData(
        getModifiedRows(newPopupGridRef, newGridPopupInfo.columns, newGridPopupInfo.data),
        newGridPopupInfo.columns,
        newGridPopupInfo.saveUriPath,
        newGridPopupInfo.saveOptionParams,
      ).then(({success}) => {
        if (!success) return;
        onSearch();
        setNewPopupVisible(false);
      });
    },
    /** 네거티브 버튼 글자 */
    cancelText: '취소',
    onCancel: () => {
      setNewPopupVisible(false);
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
    visible: newPopupVisible,
    onAfterOk: (isSuccess, savedData) => { 
      if (!isSuccess) return;
      onSearch();
      setNewPopupVisible(false);
    },
  };
  //#endregion


  //#region 🔶수정 팝업 관련
  const editPopupGridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  /** 항목 수정 팝업 속성 */
  const editGridPopupInfo:IGridPopupProps = {
    ...gridInfo,
    gridId: TAB_CODE.투입품목관리+'_EDIT_POPUP_GRID',
    ref: editPopupGridRef,
    gridMode: 'update',
    defaultData: data,
    data: null,
    height: null,
    onAfterClick: null,
    /** 팝업 아이디 */
    popupId: TAB_CODE.투입품목관리+'_EDIT_POPUP',
    /** 팝업 제목 */
    title: '비가동 항목 수정',
    /** 포지티브 버튼 글자 */
    okText: '저장하기',
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

  const onAppend = (ev) => {
    if (saveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }
    setNewPopupVisible(true);
  }

  const onEdit = (ev) => {
    if (saveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }
    setEditPopupVisible(true);
  }
  
  const onDelete = () => {
    if (saveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    };

    onDefaultGridSave('basic', gridRef, gridInfo.columns, gridInfo.saveUriPath, {}, modal,
      ({success}) => {
        if (!success) return;
        onSearch();
      }
    );
  }

  const element = (
    !permissions ?
      <Spin spinning={true} tip='권한 정보를 가져오고 있습니다.' />
    :
    <>
      <Container>
        <div style={{width:'100%', display:'inline-block'}}>
          <Space size={[6,0]} style={{float:'right'}}>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={onDelete} disabled={!permissions?.delete_fg}>삭제</Button>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={onEdit} disabled={!permissions?.update_fg}>수정</Button>
            <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onAppend} disabled={!permissions?.create_fg}>항목 추가</Button>
          </Space>
        </div>
        {/* <p/> */}
        <Datagrid {...gridInfo} gridMode={!permissions?.delete_fg ? 'view' : gridInfo.gridMode} />
      </Container>

      <GridPopup {...newGridPopupInfo} />
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