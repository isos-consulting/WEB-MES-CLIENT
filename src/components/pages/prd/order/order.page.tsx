import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid'
import { Divider, Space, Typography, Modal, Spin } from 'antd';
import { FormikProps, FormikValues } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import { Button, Container, Datagrid, GridPopup, IDatagridProps, IGridColumn, IGridComboInfo, IGridPopupInfo, IGridPopupProps, Searchbox, Tabs, TGridMode } from '~/components/UI';
import { getData, getModifiedRows, getPageName, getPermissions, getToday, saveGridData } from '~/functions';
import { useLoadingState } from '~/hooks';
import { orderInput, orderRoute, TAB_CODE } from '../order';
import { onDefaultGridCancel, onDefaultGridSave } from './order.page.util';
import { orderWorker } from './order.page.worker';



/** 작업지시 */
export const PgPrdOrder = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region 🔶 작업지시이력 관련
  const [modal, contextHolder] = Modal.useModal();

  const popupGridRef = useRef<Grid>();
  const searchRef = useRef<FormikProps<FormikValues>>();
  const searchParams = searchRef?.current?.values;

  const ORDER_INPUT = orderInput();
  const ORDER_WORKER = orderWorker();
  const ORDER_ROUTE = orderRoute();

  
  //#region 🔶메인 그리드 관련
  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  const ORDER_POPUP_INFO:IGridPopupInfo[] =[
    { // 라우팅 팝업 불러오기
      columnNames: [
        {original:'routing_uuid', popup:'routing_uuid'},
        {original:'proc_uuid', popup:'proc_uuid'},
        {original:'proc_no', popup:'proc_no'},
        {original:'proc_cd', popup:'proc_cd'},
        {original:'proc_nm', popup:'proc_nm'},
        {original:'workings_uuid', popup:'workings_uuid'},
        {original:'workings_cd', popup:'workings_cd'},
        {original:'workings_nm', popup:'workings_nm'},
        {original:'item_type_uuid', popup:'item_type_uuid'},
        {original:'item_type_cd', popup:'item_type_cd'},
        {original:'item_type_nm', popup:'item_type_nm'},
        {original:'prod_type_uuid', popup:'prod_type_uuid'},
        {original:'prod_type_cd', popup:'prod_type_cd'},
        {original:'prod_type_nm', popup:'prod_type_nm'},
        {original:'prod_uuid', popup:'prod_uuid'},
        {original:'prod_no', popup:'prod_no'},
        {original:'prod_nm', popup:'prod_nm'},
        {original:'model_uuid', popup:'model_uuid'},
        {original:'model_cd', popup:'model_cd'},
        {original:'model_nm', popup:'model_nm'},
        {original:'rev', popup:'rev'},
        {original:'prod_std', popup:'prod_std'},
        {original:'unit_uuid', popup:'unit_uuid'},
        {original:'unit_cd', popup:'unit_cd'},
        {original:'unit_nm', popup:'unit_nm'},
        {original:'auto_work_fg', popup:'auto_work_fg'},
      ],
      columns: [
        {header:'라우팅UUID', name:'routing_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
        {header:'공정UUID', name:'proc_uuid', width:200, hidden:true, format:'text'},
        {header:'공정순서', name:'proc_no', width:200, hidden:false, format:'text'},
        {header:'공정코드', name:'proc_cd', width:200, hidden:true, format:'text'},
        {header:'공정명', name:'proc_nm', width:200, hidden:true, format:'text'},
        {header:'작업장UUID', name:'workings_uuid', width:200, hidden:true, format:'text'},
        {header:'작업장코드', name:'workings_cd', width:200, hidden:true, format:'text'},
        {header:'작업장명', name:'workings_nm', width:200, hidden:true, format:'text'},
        {header:'품목 유형UUID', name:'item_type_uuid', width:200, hidden:true, format:'text'},
        {header:'품목 유형코드', name:'item_type_cd', width:200, hidden:true, format:'text'},
        {header:'품목 유형명', name:'item_type_nm', width:200, hidden:false, format:'text'},
        {header:'제품 유형UUID', name:'prod_type_uuid', width:200, hidden:true, format:'text'},
        {header:'제품 유형코드', name:'prod_type_cd', width:200, hidden:true, format:'text'},
        {header:'제품 유형명', name:'prod_type_nm', width:200, hidden:false, format:'text'},
        {header:'품목UUID', name:'prod_uuid', width:200, hidden:true, format:'text'},
        {header:'품번', name:'prod_no', width:200, hidden:false, format:'text'},
        {header:'품목명', name:'prod_nm', width:200, hidden:false, format:'text'},
        {header:'모델UUID', name:'model_uuid', width:200, hidden:true, format:'text'},
        {header:'모델코드', name:'model_cd', width:200, hidden:true, format:'text'},
        {header:'모델명', name:'model_nm', width:200, hidden:false, format:'text'},
        {header:'Rev', name:'rev', width:200, hidden:false, format:'text'},
        {header:'규격', name:'prod_std', width:200, hidden:false, format:'text'},
        {header:'단위UUID', name:'unit_uuid', width:200, hidden:true, format:'text'},
        {header:'단위코드', name:'unit_cd', width:200, hidden:true, format:'text'},
        {header:'단위명', name:'unit_nm', width:200, hidden:false, format:'text'},
        {header:'자동 실적처리유무', name:'auto_work_fg', width:200, hidden:true, format:'text'},
      ],
      dataApiSettings: {
        uriPath:'/std/routings/actived-prod',
        params: {}
      },
      gridMode:'select'
    },
    { // 생산자원정보 (리소스) 팝업 불러오기
      columnNames: [
        {original:'routing_resource_uuid', popup:'routing_resource_uuid'},
        {original:'equip_uuid', popup:'equip_uuid'},
        {original:'equip_cd', popup:'equip_cd'},
        {original:'equip_nm', popup:'equip_nm'},
      ],
      columns: [
        {header:'생산자원UUID', name:'routing_resource_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
        {header:'공장UUID', name:'factory_uuid', width:200, hidden:true, format:'text'},
        {header:'라우팅UUID', name:'routing_uuid', width:200, hidden:true, format:'text'},
        {header:'자원 유형', name:'resource_type', width:200, hidden:false, format:'text'},
        {header:'설비UUID', name:'equip_uuid', width:200, hidden:true, format:'text'},
        {header:'설비코드', name:'equip_cd', width:200, hidden:true, format:'text'},
        {header:'설비명', name:'equip_nm', width:200, hidden:false, format:'text'},
        {header:'인원', name:'emp_cnt', width:200, hidden:false, format:'text'},
        {header:'Cycle Time', name:'cycle_time', width:200, hidden:false, format:'text'},
      ],
      dataApiSettings: {
        uriPath:'/std/routing-resources',
        params: {
          resource_type:'equip',
        }
      },
      gridMode:'select'
    },
  ];

  /** 메인 그리드 속성 */
  const gridInfo:IDatagridProps = {
    /** 그리드 아이디 */
    gridId: 'ORDER_GRID',
    /** 참조 */
    ref: gridRef,
    /** 그리드 높이 */
    height: 300,
    /** 그리드 모드 */
    gridMode: 'delete',
    /** 저장 END POINT */
    saveUriPath: '/prd/orders',
    /** 조회 END POINT */
    searchUriPath: '/prd/orders',
    /** 컬럼 */
    columns: [
      {header:'작업지시UUID', name:'order_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
      {header:'지시일', name:'reg_date', width:180, hidden:false, editable:true, format:'date', filter:'date', requiredField:true},
      {header:'시작예정일', name:'start_date', width:180, hidden:false, editable:true, format:'date', requiredField:true},
      {header:'종료예정일', name:'end_date', width:180, hidden:false, editable:true, format:'date', requiredField:true},
      {header:'지시번호', name:'order_no', width:200, hidden:false, editable:true, format:'text'},
      {header:'공정UUID', name:'proc_uuid', width:200, hidden:true, format:'text', requiredField:true},
      {header:'공정코드', name:'proc_cd', width:200, hidden:true, format:'text', requiredField:true},
      {header:'공정명', name:'proc_nm', width:100, hidden:false, format:'text', filter:'text', requiredField:true},
      {header:'작업장UUID', name:'workings_uuid', width:200, hidden:true, format:'text', requiredField:true},
      {header:'작업장코드', name:'workings_cd', width:200, hidden:true, format:'text', requiredField:true},
      {header:'작업장명', name:'workings_nm', width:100, hidden:false, format:'text', filter:'text', requiredField:true},
      {header:'설비UUID', name:'equip_uuid', width:200, hidden:true, format:'text'},
      {header:'설비코드', name:'equip_cd', width:200, hidden:true, format:'text'},
      {header:'설비명', name:'equip_nm', width:100, hidden:false, editable:true, format:'popup', filter:'text'},
      {header:'품목UUID', name:'prod_uuid', width:200, hidden:true, format:'text', requiredField:true},
      {header:'품번', name:'prod_no', width:200, hidden:false, format:'text', filter:'text', requiredField:true},
      {header:'품목명', name:'prod_nm', width:200, hidden:false, format:'text', filter:'text', requiredField:true},
      {header:'제품 유형UUID', name:'prod_type_uuid', width:200, hidden:true, format:'text'},
      {header:'제품 유형코드', name:'prod_type_cd', width:200, hidden:true, format:'text'},
      {header:'제품 유형명', name:'prod_type_nm', width:200, hidden:false, format:'text', filter:'text'},
      {header:'품목 유형UUID', name:'item_type_uuid', width:200, hidden:true, format:'text'},
      {header:'품목 유형코드', name:'item_type_cd', width:200, hidden:true, format:'text'},
      {header:'품목 유형명', name:'item_type_nm', width:200, hidden:false, format:'text', filter:'text'},
      {header:'모델UUID', name:'model_uuid', width:200, hidden:true, format:'text'},
      {header:'모델코드', name:'model_cd', width:200, hidden:true, format:'text'},
      {header:'모델명', name:'model_nm', width:100, hidden:false, format:'text', filter:'text'},
      {header:'Rev', name:'rev', width:100, hidden:false, format:'text', filter:'text'},
      {header:'규격', name:'prod_std', width:100, hidden:false, format:'text', filter:'text'},
      {header:'단위UUID', name:'unit_uuid', width:200, hidden:true, format:'text'},
      {header:'단위코드', name:'unit_cd', width:200, hidden:true, format:'text'},
      {header:'단위명', name:'unit_nm', width:100, hidden:false, format:'text', filter:'text'},
      {header:'입고 창고UUID', name:'to_store_uuid', width:200, hidden:true, format:'text'},
      {header:'입고 창고코드', name:'to_store_cd', width:200, hidden:true, format:'text'},
      {header:'입고 창고명', name:'to_store_nm', width:200, hidden:true, format:'text'},
      {header:'입고 위치UUID', name:'to_location_uuid', width:200, hidden:true, format:'text'},
      {header:'입고 위치코드', name:'to_location_cd', width:200, hidden:true, format:'text'},
      {header:'입고 위치명', name:'to_location_nm', width:200, hidden:true, format:'text'},
      {header:'계획 수량', name:'plan_qty', width:100, hidden:false, editable:true, format:'number'},
      {header:'지시 수량', name:'qty', width:100, hidden:false, editable:true, format:'number', requiredField:true},
      {header:'지시 순번', name:'seq', width:100, hidden:true, format:'text'},
      {header:'작업교대UUID', name:'shift_uuid', width:200, hidden:true, format:'text', requiredField:true},
      {header:'작업교대명', name:'shift_nm', width:100, hidden:false, editable:true, format:'combo', filter:'text', requiredField:true},
      {header:'작업조UUID', name:'worker_group_uuid', width:200, hidden:true, format:'text'},
      {header:'작업조코드', name:'worker_group_cd', width:200, hidden:true, format:'text'},
      {header:'작업조명', name:'worker_group_nm', width:100, hidden:false, editable:true, format:'combo', filter:'text'},
      {header:'작업자 인원 수', name:'worker_cnt', width:100, hidden:true, format:'number'},
      {header:'수주UUID', name:'sal_order_uuid', width:200, hidden:true, format:'text'},
      {header:'수주상세UUID', name:'sal_order_detail_uuid', width:200, hidden:true, format:'text'},
      {header:'생산 진행여부', name:'work_fg', width:80, hidden:true, format:'check'},
      {header:'마감 여부', name:'complete_fg', width:80, hidden:true, format:'check'},
      {header:'작업지시 진행상태', name:'order_state', width:80, hidden:true, format:'check'},
      {header:'마감 일시', name:'complete_date', width:100, hidden:true, format:'datetime'},
      {header:'비고', name:'remark', width:200, hidden:false, editable:true, format:'text', filter:'text'},
    ],
    /** 그리드 데이터 */
    data: data,
    /** 행추가팝업 */
    rowAddPopupInfo: {
      ...ORDER_POPUP_INFO[0],
      gridMode:'multi-select',
    },
    /** 수정팝업 */
    gridPopupInfo: ORDER_POPUP_INFO,
    gridComboInfo: [
      { // 작업교대 콤보박스
        columnNames: [
          {codeColName:{original:'shift_uuid', popup:'shift_uuid'}, textColName:{original:'shift_nm', popup:'shift_nm'}},
        ],
        dataApiSettings: {
          uriPath:'/std/shifts',
          params:{},
        },
      },
      { // 작업조 콤보박스
        columnNames: [
          {codeColName:{original:'worker_group_uuid', popup:'worker_group_uuid'}, textColName:{original:'worker_group_nm', popup:'worker_group_nm'}},
        ],
        dataApiSettings: {
          uriPath:'/std/worker-groups',
          params:{}
        }
      },
    ],
    onAfterClick: (ev) => {
      const {rowKey, targetType} = ev;
  
      if (targetType === 'cell') {
        try {
          // setLoading(true);
  
          const row = ev?.instance?.store?.data?.rawData[rowKey];
          const order_uuid = row?.order_uuid;
  
          // 자재투입 데이터 조회
          getData({
            order_uuid: String(order_uuid)
          }, ORDER_INPUT.searchUriPath).then((res) => {
            ORDER_INPUT.setData(res);
            ORDER_INPUT.setSaveOptionParams({order_uuid});
          });
          
          // 작업자투입 데이터 조회
          getData({
            order_uuid: String(order_uuid)
          }, ORDER_WORKER.searchUriPath).then((res) => {
            ORDER_WORKER.setData(res);
            ORDER_WORKER.setSaveOptionParams({order_uuid});
          });
  
          
          // 공정순서 데이터 조회
          getData({
            order_uuid: String(order_uuid)
          }, ORDER_ROUTE.searchUriPath).then((res) => {
            ORDER_ROUTE.setData(res);
            ORDER_ROUTE.setSaveOptionParams({order_uuid});
          });
  
  
        } catch(e) {
          console.log(e);
  
        } finally {
          // setLoading(false);
        }
      }
    },
  };
  //#endregion


  //#region 🔶신규 팝업 관련
  const newPopupGridRef = useRef<Grid>();
  const [newPopupVisible, setNewPopupVisible] = useState(false);

  /** 신규 항목 추가 팝업 속성 */
  const newGridPopupInfo:IGridPopupProps = {
    ...gridInfo,
    gridId: 'ORDER_NEW_GRID',
    ref: newPopupGridRef,
    gridMode: 'create',
    defaultData: [],
    data: null,
    height: null,
    onAfterClick: null,
    /** 팝업 아이디 */
    popupId: 'ORDER_NEW_GRID_POPUP',
    /** 팝업 제목 */
    title: '작업지시 등록',
    /** 포지티브 버튼 글자 */
    okText: '추가하기',
    onOk: () => {
      saveGridData(
        getModifiedRows(newPopupGridRef, newGridPopupInfo.columns, newGridPopupInfo.data),
        newGridPopupInfo.columns,
        newGridPopupInfo.saveUriPath,
        newGridPopupInfo.saveOptionParams,
      ).then(({success}) => {
        if (!success) return;
        onSearch(searchParams);
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
    // saveOptionParams: saveOptionParams,
    /** 최초 visible 상태 */
    defaultVisible: false,
    /** visible 상태값 */
    visible: newPopupVisible,
    onAfterOk: (isSuccess, savedData) => { 
      if (!isSuccess) return;
      setNewPopupVisible(false);
      onSearch(searchParams);
    },
  };
  //#endregion


  //#region 🔶수정 팝업 관련
  const editPopupGridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  /** 항목 수정 팝업 속성 */
  const editGridPopupInfo:IGridPopupProps = {
    ...gridInfo,
    gridId: 'ORDER_EDIT_GRID',
    ref: editPopupGridRef,
    gridMode: 'update',
    defaultData: data,
    data: null,
    height: null,
    onAfterClick: null,
    /** 팝업 아이디 */
    popupId: 'ORDER_EDIT_GRID_POPUP',
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
        onSearch(searchParams);
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
    // saveOptionParams: saveOptionParams,
    /** 최초 visible 상태 */
    defaultVisible: false,
    /** visible 상태값 */
    visible: editPopupVisible,
    onAfterOk: (isSuccess, savedData) => { 
      if (!isSuccess) return;
      setEditPopupVisible(false);
      onSearch(searchParams);
    },
  };
  //#endregion

  const onSearch = (values) => {
    getData({
      ...values,
      order_state: 'all',
    }, gridInfo.searchUriPath).then((res) => {
      setData(res || []);
      
    }).finally(() => {
      // 지시이력 조회되면서 하위 데이터 초기화
      ORDER_INPUT.setSaveOptionParams({});
      ORDER_WORKER.setSaveOptionParams({});
      ORDER_ROUTE.setSaveOptionParams({});
      ORDER_INPUT.setData([]);
      ORDER_WORKER.setData([]);
      ORDER_ROUTE.setData([]);
    });
  }

  const onAppend = () => {
    setNewPopupVisible(true);
  }

  const onEdit = () => {
    setEditPopupVisible(true);
  }

  const onDelete = () => {
    onDefaultGridSave(
      'basic',
      gridRef,
      gridInfo.columns,
      gridInfo.saveUriPath,
      gridInfo.saveOptionParams,
      modal,
      ({success}) => {
        if (!success) return;
        onSearch(searchParams);
      }
    )
  }

  //#endregion

  const HeaderGridElement = useMemo(() => {
    const gridMode = !permissions?.delete_fg ? 'view' : 'delete';
    return (
      <Datagrid {...gridInfo} gridMode={gridMode} />
    )
  }, [gridRef, data, permissions]);

  return (
    !permissions ?
      <Spin spinning={true} tip='권한 정보를 가져오고 있습니다.' />
    :
    <>
      <Typography.Title level={5} style={{marginBottom:-16, fontSize:14}}><CaretRightOutlined />지시이력</Typography.Title>
      <Divider style={{marginBottom:10}}/>
      <Container>
        <div style={{width:'100%', display:'inline-block'}}>
          <Space size={[6,0]} align='start'>
            {/* <Input.Search
              placeholder='전체 검색어를 입력하세요.'
              enterButton
              onSearch={onAllFiltered}/> */}
            {/* <Button btnType='buttonFill' widthSize='small' ImageType='search' colorType='blue' onClick={onSearch}>조회</Button> */}
          </Space>
          <Space size={[6,0]} style={{float:'right'}}>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={onDelete} disabled={!permissions?.delete_fg}>삭제</Button>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={onEdit} disabled={!permissions?.update_fg}>수정</Button>
            <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onAppend} disabled={!permissions?.create_fg}>신규 추가</Button>
          </Space>
        </div>
        <div style={{maxWidth:500, marginTop:-33, marginLeft:-6}}>
          <Searchbox 
            id='prod_order_search'
            innerRef={searchRef}
            searchItems={[
              {type:'date', id:'start_date', label:'지시기간', default:getToday(-7)},
              {type:'date', id:'end_date', default:getToday()},
            ]}
            onSearch={onSearch}
            boxShadow={false}
          />
        </div>
        {/* <p/> */}
        {HeaderGridElement}
      </Container>

      <Typography.Title level={5} style={{marginTop:30, marginBottom:-16, fontSize:14}}><CaretRightOutlined />이력 항목관리</Typography.Title>
      <Divider style={{marginBottom:10}}/>
      <Tabs
        type='card'
        onChange={(activeKey) => {
          switch (activeKey) {
            case TAB_CODE.투입품목관리:
              if ((ORDER_INPUT.saveOptionParams as any)?.order_uuid != null) {
                ORDER_INPUT.onSearch();
              }
              break;
            
            case TAB_CODE.투입인원관리:
              if ((ORDER_WORKER.saveOptionParams as any)?.order_uuid != null) {
                ORDER_WORKER.onSearch();
              }
              break;

            case TAB_CODE.공정순서:
              if ((ORDER_ROUTE.saveOptionParams as any)?.order_uuid != null) {
                ORDER_ROUTE.onSearch();
              }
              break;
          }
        }}
        panels={[
          {
            tab: '투입품목 관리',
            tabKey: TAB_CODE.투입품목관리,
            content: ORDER_INPUT.element,
          },
          {
            tab: '투입인원 관리',
            tabKey: TAB_CODE.투입인원관리,
            content: ORDER_WORKER.element,
          },
          {
            tab: '공정순서',
            tabKey: TAB_CODE.공정순서,
            content: ORDER_ROUTE.element,
          },
        ]}
      />
      
      <GridPopup {...newGridPopupInfo} />
      <GridPopup {...editGridPopupInfo} />

      {contextHolder}
    </>
  );
}

//#endregion

