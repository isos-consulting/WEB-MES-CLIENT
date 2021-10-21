import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid'
import { Divider, message, Space, Typography, Modal } from 'antd';
import { FormikProps, FormikValues } from 'formik';
import React, { MutableRefObject, useMemo, useRef, useState } from 'react';
import { Button, Container, Datagrid, GridPopup, IGridColumn, IGridComboInfo, IGridPopupInfo, Searchbox, Tabs, TGridMode } from '~/components/UI';
import { checkGridData, executeData, getData, getModifiedRows, getToday, getUserFactoryUuid, isModified, saveGridData } from '~/functions';
import { useLoadingState } from '~/hooks';

const TAB_CODE = {
  투입품목관리: 'TUIP_PROD',
  투입인원관리: 'TUIP_WORKER',
  공정순서: 'PROC_ORDER',
}

const onErrorMessage = (type) => {
  switch (type) {
    case '하위이력작업시도':
      message.warn('지시이력을 선택한 후 다시 시도해주세요.');
      break;
  
    default:
      break;
  }
}

/** 작업지시 */
export const PgPrdOrder = () => {
  //#region 🔶투입품목 관련 
  const [tuipProdGridMode, setTuipProdGridMode] = useState<TGridMode>('view');
  const [tuipProdDatas, setTuipProdDatas] = useState([]);
  const TUIP_PROD_REF = useRef<Grid>();
  
  const TUIP_PROD_POPUP_REF = useRef<Grid>();
  const [tuipProdVisible, setTuipProdVisible] = useState<boolean>(false);

  const TUIP_PROD_SAVE_URIPATH = '/prd/order-inputs';
  const TUIP_PROD_SEARCH_URIPATH = '/prd/order-inputs';

  const [tuipProdSaveOptionParams, setTuipProdSaveOptionParams] = useState({});


  const TUIP_PROD_onSearch = () => {
    getData(
      tuipProdSaveOptionParams,
      TUIP_PROD_SEARCH_URIPATH
    ).then((res) => {
      TUIP_PROD_setData(res);
    });
  }

  const TUIP_PROD_setData = (data) => {
    setTuipProdDatas(data);
  }

  const TUIP_PROD_onAppend = (ev) => {
    if (tuipProdSaveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }
    setTuipProdVisible(true);
  }

  const TUIP_PROD_onEdit = (ev) => {
    if (tuipProdSaveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setTuipProdGridMode('update');
  }

  const TUIP_PROD_onDelete = (ev) => {
    if (tuipProdSaveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setTuipProdGridMode('delete');
  }

  const TUIP_PROD_onCancel = (ev) => {
    onDefaultGridCancel(TUIP_PROD_REF, TUIP_PROD_COLUMNS, modal,
      () => {
        setTuipProdGridMode('view');
        TUIP_PROD_onSearch();
      }
    );
  }

  const TUIP_PROD_onSave = (ev) => {
    onDefaultGridSave('basic', TUIP_PROD_REF, TUIP_PROD_COLUMNS, TUIP_PROD_SAVE_URIPATH, {}, modal,
      () => {
        setTuipProdGridMode('view');
        TUIP_PROD_onSearch();
        setTuipProdVisible(false);
      }
    );
  }

  const TUIP_PROD_COLUMNS:IGridColumn[] = [
    {header:'투입이력UUID', name:'order_input_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
    {header:'작업지시UUID', name:'order_uuid', width:200, hidden:true, format:'text'},
    {header:'지시번호', name:'order_no', width:200, hidden:true, format:'text'},
    {header:'품목UUID', name:'prod_uuid', width:200, hidden:true, format:'text'},
    {header:'품번', name:'prod_no', width:120, hidden:false, format:'popup'},
    {header:'품목명', name:'prod_nm', width:120, hidden:false, format:'popup'},
    {header:'제품 유형UUID', name:'prod_type_uuid', width:200, hidden:true, format:'text'},
    // {header:'제품 유형코드', name:'prod_type_cd', width:200, hidden:true, format:'text'},
    {header:'제품 유형명', name:'prod_type_nm', width:120, hidden:false, format:'popup'},
    {header:'품목 유형UUID', name:'item_type_uuid', width:200, hidden:true, format:'text'},
    // {header:'품목 유형코드', name:'item_type_cd', width:200, hidden:true, format:'text'},
    {header:'품목 유형명', name:'item_type_nm', width:120, hidden:false, format:'popup'},
    {header:'모델UUID', name:'model_uuid', width:200, hidden:true, format:'text'},
    // {header:'모델코드', name:'model_cd', width:200, hidden:true, format:'text'},
    {header:'모델명', name:'model_nm', width:120, hidden:false, format:'popup'},
    {header:'Rev', name:'rev', width:80, hidden:false, format:'popup'},
    {header:'규격', name:'prod_std', width:100, hidden:false, format:'popup'},
    {header:'단위UUID', name:'unit_uuid', width:200, hidden:true, format:'text'},
    // {header:'단위코드', name:'unit_cd', width:200, hidden:true, format:'text'},
    {header:'투입단위', name:'unit_nm', width:80, hidden:false, editable:true, format:'combo', requiredField:true},
    {header:'소요량', name:'c_usage', width:80, hidden:false, editable:true, format:'number', requiredField:true},
    {header:'출고 창고UUID', name:'from_store_uuid', width:200, hidden:true, format:'text'},
    // {header:'출고 창고코드', name:'from_store_cd', width:200, hidden:true, format:'text'},
    {header:'출고 창고명', name:'from_store_nm', width:150, hidden:false, editable:true, format:'combo', align:'center', requiredField:true},
    // relations:[
    //   {
    //     targetNames:['from_location_nm'],
    //     listItems({value}) {
    //       console.log(value);
    //       let data = [];
    //       let newData = [];
          
    //       getData({
    //         store_uuid: value
    //       }, '/std/locations').then((res) => {
    //         data = res;
    //       });

    //       data.forEach((value) => {
    //         newData.push({value:value?.location_uuid, text:value?.location_nm});
    //       })

    //       return newData;
    //     }
    //   }
    // ]},
    {header:'출고 위치UUID', name:'from_location_uuid', width:200, hidden:true, format:'text'},
    {header:'출고 위치코드', name:'from_location_cd', width:200, hidden:true, format:'text'},
    {header:'출고 위치명', name:'from_location_nm', width:150, hidden:false, editable:true, format:'combo', align:'center', requiredField:true},
    {header:'비고', name:'remark', width:150, hidden:false, editable:true, format:'text'},
  ];

  const TUIP_PROD_POPUP_INFO:IGridPopupInfo[] = [
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
        uriPath:'/std/prod',
        params: {
          use_fg:true
        }
      },
      columns: [
        {header: '품목아이디', name:'prod_uuid', width:150, filter:'text', hidden:true},
        {header: '품번', name:'prod_no', width:150, filter:'text', format:'text'},
        {header: '품목명', name:'prod_nm', width:150, filter:'text', format:'text'},
        {header: '품목 유형아이디', name:'item_type_uuid', width:150, filter:'text', format:'text', hidden:true },
        {header: '품목 유형코드', name:'item_type_cd', width:150, filter:'text', format:'text', hidden:true},
        {header: '품목 유형명', name:'item_type_nm', width:100, align:'center', filter:'text', format:'text' },
        {header: '제품 유형아이디', name:'prod_type_uuid', width:150, filter:'text', format:'text', hidden:true},
        {header: '제품 유형코드', name:'prod_type_cd', width:150, filter:'text', format:'text', hidden:true},
        {header: '제품 유형명', name:'prod_type_nm', width:150, filter:'text', format:'text'},
        {header: '모델아이디', name:'model_uuid', width:150, filter:'text', format:'text', hidden:true},
        {header: '모델코드', name:'model_cd', width:150, filter:'text', format:'text', hidden:true},
        {header: '모델명', name:'model_nm', width:150, filter:'text', format:'text'},
        {header: '리비전', name:'rev', width:100, filter:'text', format:'text'},
        {header: '규격', name:'prod_std', width:150, filter:'text', format:'text'},
        {header: '단위아최소 단위수량', name:'mat_order_min_qty', width:150, filter:'text', format:'number'},
        {header: '발주 소요일', name:'mat_supply_days', width:150, filter:'text', format:'date'},
        {header: '수주 사용유무', name:'sal_order_fg', width:120, filter:'text', format:'check'},
        {header: '창고 사용유무', name:'inv_use_fg', width:120, filter:'text', format:'check'},
        {header: '단위수량', name:'inv_package_qty', width:100, filter:'text', format:'number'},
        {header: '안전 재고수량', name:'inv_safe_qty', width:150, filter:'text', format:'number'},
        {header: '입고 창고아이디', name:'inv_to_store_uuid', width:150, filter:'text', format:'text', hidden:true},
        {header: '위치 아이디', name:'inv_to_location_uuid', width:150, filter:'text', editable:true, format:'text', hidden:true},
        {header: '위치코드', name:'location_cd', width:150, filter:'text', editable:true, format:'text', hidden:true},
        {header: '위치명', name:'location_nm', width:100, align:'center', filter:'text', editable:true, format:'text'},
        {header: '창고코드', name:'store_cd', width:150, filter:'text', format:'text', hidden:true},
        {header: '창고명', name:'store_nm', width:100, align:'center', filter:'text', format:'text'},
        {header: '수입검사유무', name:'qms_recv_insp_fg', width:120, filter:'text', format:'check'},
        {header: '공정검사유무', name:'qms_proc_insp_fg', width:120, filter:'text', format:'check'},
        {header: '출하검사유무', name:'qms_outgo_insp_fg', width:120, filter:'text', format:'check'},
        {header: '생산품유무', name:'prd_active_fg', width:100, filter:'text', format:'check'},
        {header: '계획유형코드 (MPS/MRP)', name:'prd_plan_type_cd', width:180, align:'center', filter:'text', format:'text'},
        {header: '최소값', name:'prd_min', width:150, filter:'text', format:'number'},
        {header: '최대값', name:'prd_max', width:150, filter:'text', format:'number'},
        {header: '등록일자', name:'updated_at', width:100, filter:'text', format:'date'},
        {header: '등록자이디', name:'unit_uuid', width:150, filter:'text', format:'text', hidden:true},
        {header: '단위코드', name:'unit_cd', width:150, filter:'text', format:'text', hidden:true},
        {header: '단위명', name:'unit_nm', width:150, filter:'text', format:'text'},
        {header: 'LOT 사용유무', name:'lot_fg', width:120, filter:'text', format:'check'},
        {header: '사용유무', name:'use_fg', width:100, filter:'text', format:'check'},
        {header: '품목 활성 상태', name:'active_fg', width:120, filter:'text', format:'check'},
        {header: 'BOM 유형 코드', name:'bom_type_cd', width:150, align:'center', filter:'text', format:'text'},
        {header: '폭', name:'width', width:100, filter:'text', format:'number'},
        {header: '길이', name:'length', width:100, filter:'text', format:'number'},
        {header: '높이', name:'height', width:100, filter:'text', format:'number'},
        {header: '재질', name:'material', width:100, filter:'text', format:'text'},
        {header: '색상', name:'color', width:100, filter:'text', format:'text'},
        {header: '중량', name:'weight', width:100, filter:'text', format:'number'},
        {header: '두께', name:'thickness', width:100, filter:'text', format:'number'},
        {header: '발주 사용유무', name:'mat_order_fg', width:120, filter:'text', format:'check'},
        {header: '발주 ', name:'updated_nm', width:100, align:'center', filter:'text', format:'text'},
      ],
      gridMode:'multi-select'
    }
  ];

  const TUIP_PROD_COMBO_INFO:IGridComboInfo[] = [
    { // 투입단위 콤보박스
      columnNames: [
        {codeColName:{original:'unit_uuid', popup:'unit_uuid'}, textColName:{original:'unit_nm', popup:'unit_nm'}},
      ],
      itemListFromRequest: {
        uriPath: '/std/units',
        params: {}
      }
    },
    { // 출고창고 콤보박스
      columnNames: [
        {codeColName:{original:'from_store_uuid', popup:'store_uuid'}, textColName:{original:'from_store_nm', popup:'store_nm'}},
      ],
      itemListFromRequest: {
        uriPath: '/std/stores',
        params: {
          store_type: 'available'
        }
      }
    },
    { // 출고위치 콤보박스
      columnNames: [
        {codeColName:{original:'from_location_uuid', popup:'location_uuid'}, textColName:{original:'from_location_nm', popup:'location_nm'}},
      ],
      itemListFromRequest: {
        uriPath: '/std/locations',
        params: {
          // store_uuid: ''
        }
      }
    },
  ]

  const 투입품목관리 = (
    <>
      <Container>
        {tuipProdGridMode === 'view' ?
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={TUIP_PROD_onDelete}>삭제</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={TUIP_PROD_onEdit}>수정</Button>
              <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={TUIP_PROD_onAppend}>항목 추가</Button>
            </Space>
          </div>
          :
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='cancel' colorType='blue' onClick={TUIP_PROD_onCancel}>취소</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='ok' colorType='blue' onClick={TUIP_PROD_onSave}>저장</Button>
            </Space>
          </div>
        }
        {/* <p/> */}
        <Datagrid
          gridId={TAB_CODE.투입품목관리+'_GRID'}
          gridMode={tuipProdGridMode}
          ref={TUIP_PROD_REF}
          columns={TUIP_PROD_COLUMNS}
          gridComboInfo={TUIP_PROD_COMBO_INFO}
          data={tuipProdDatas}
        />
      </Container>
      <GridPopup
        title='데이터 추가하기'
        okText='추가하기'
        cancelText='취소'
        onCancel={() => {
          // TUIP_PROD_onSearch();
          setTuipProdVisible(false);
        }}
        gridMode='create'
        popupId={TAB_CODE.투입품목관리+'_POPUP'}
        gridId={TAB_CODE.투입품목관리+'_POPUP_GRID'}
        ref={TUIP_PROD_POPUP_REF}
        parentGridRef={TUIP_PROD_REF}
        columns={TUIP_PROD_COLUMNS}
        gridPopupInfo={TUIP_PROD_POPUP_INFO}
        gridComboInfo={TUIP_PROD_COMBO_INFO}
        rowAddPopupInfo={TUIP_PROD_POPUP_INFO[0]}
        saveUriPath={TUIP_PROD_SAVE_URIPATH}
        searchUriPath={TUIP_PROD_SEARCH_URIPATH}
        saveOptionParams={tuipProdSaveOptionParams}
        setParentData={TUIP_PROD_setData}
        data={[]}
        saveType='basic'
        defaultVisible={false}
        visible={tuipProdVisible}
        onAfterOk={(success) => {
          if (success) {
            setTuipProdGridMode('view');
            TUIP_PROD_onSearch();
            setTuipProdVisible(false);
          }
        }}
      />
    </>
  );
  //#endregion

  //#region 🔶투입인원 관련 
  const [tuipWorkerGridMode, setTuipWorkerGridMode] = useState<TGridMode>('view');
  const [tuipWorkerDatas, setTuipWorkerDatas] = useState([]);
  const TUIP_WORKER_REF = useRef<Grid>();
  
  const TUIP_WORKER_POPUP_REF = useRef<Grid>();
  const [tuipWorkerVisible, setTuipWorkerVisible] = useState<boolean>(false);

  const TUIP_WORKER_SAVE_URIPATH = '/prd/order-workers';
  const TUIP_WORKER_SEARCH_URIPATH = '/prd/order-workers';

  const [tuipWorkerSaveOptionParams, setTuipWorkerSaveOptionParams] = useState({});

  const TUIP_WORKER_onSearch = () => {
    getData(
      tuipWorkerSaveOptionParams,
      TUIP_WORKER_SEARCH_URIPATH
    ).then((res) => {
      setTuipWorkerDatas(res);
    });
  }

  const TUIP_WORKER_setData = (data) => {
    setTuipWorkerDatas(data);
  }

  const TUIP_WORKER_onAppend = (ev) => {
    if (tuipWorkerSaveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setTuipWorkerVisible(true);
  }

  const TUIP_WORKER_onEdit = (ev) => {
    if (tuipWorkerSaveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }
    setTuipWorkerGridMode('update');
  }

  const TUIP_WORKER_onDelete = (ev) => {
    if (tuipWorkerSaveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setTuipWorkerGridMode('delete');
  }
  
  const TUIP_WORKER_onCancel = (ev) => {
    onDefaultGridCancel(TUIP_WORKER_REF, TUIP_WORKER_COLUMNS, modal,
      () => {
        setTuipWorkerGridMode('view');
        TUIP_WORKER_onSearch();
      }
    );
  }

  const TUIP_WORKER_onSave = (ev) => {
    onDefaultGridSave('basic', TUIP_WORKER_REF, TUIP_WORKER_COLUMNS, TUIP_WORKER_SAVE_URIPATH, {}, modal,
      () => {
        setTuipWorkerGridMode('view');
        TUIP_WORKER_onSearch();
      }
    );
  }

  const TUIP_WORKER_COLUMNS:IGridColumn[] = [
    {header:'작업자투입UUID', name:'order_worker_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
    {header:'작업지시UUID', name:'order_uuid', width:200, hidden:true, format:'text'},
    {header:'작업자UUID', name:'worker_uuid', width:200, hidden:true, format:'text'},
    {header:'작업자명', name:'worker_nm', width:200, hidden:false, format:'text'},
  ];

  
  const TUIP_WORKER_POPUP_INFO:IGridPopupInfo[] = [
    {
      columnNames: [
        // {original:'order_worker_uuid', popup:'order_worker_uuid'},
        {original:'worker_uuid', popup:'worker_uuid'},
        {original:'worker_nm', popup:'worker_nm'},
      ],
      // popupKey:'',
      dataApiSettings: {
        uriPath:'/std/workers',
        params: {}
      },
      columns: [
        {header: '작업자투입UUID', name:'order_worker_uuid', alias:'uuid', width:150, format:'text', hidden:true},
        {header: '작업자UUID', name:'worker_uuid', width:200, format:'text', editable:true, requiredField:true, hidden:true},
        {header: '작업자명', name:'worker_nm', width:200, format:'text', editable:true, requiredField:true},
        {header: '공정UUID', name:'proc_uuid', alias:'uuid', width:150, format:'text', hidden:true},
        {header: '공정코드', name:'proc_cd', width:150, format:'text', hidden:true},
        {header: '공정명', name:'proc_nm', width:150, format:'popup', editable:true},
        {header: '작업장UUID', name:'workings_uuid', alias:'uuid', width:150, format:'text', hidden:true},
        {header: '작업장코드', name:'workings_cd', width:150, format:'text', hidden:true},
        {header: '작업장명', name:'workings_nm', width:120, format:'combo', editable:true},
        {header: '사원UUID', name:'emp_uuid', alias:'uuid', width:150, format:'text', hidden:true},
        {header: '사번', name:'emp_cd', width:150, format:'popup', editable:true},
        {header: '사원명', name:'emp_nm', width:120, format:'popup', editable:true},
      ],
      gridMode:'multi-select'
    }
  ];

  const 투입인원관리 = (
    <>
      <Container>
        {tuipWorkerGridMode === 'view' ?
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={TUIP_WORKER_onDelete}>삭제</Button>
              <Button btnType='buttonFill' widthSize='medium'  heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={TUIP_WORKER_onEdit} disabled={true}>수정</Button>
              <Button btnType='buttonFill' widthSize='large'  heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={TUIP_WORKER_onAppend}>항목 추가</Button>
            </Space>
          </div>
          :
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small'  ImageType='cancel' colorType='blue' onClick={TUIP_WORKER_onCancel}>취소</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small'  ImageType='ok' colorType='blue' onClick={TUIP_WORKER_onSave}>저장</Button>
            </Space>
          </div>
        }
        {/* <p/> */}
        <Datagrid
          gridId={TAB_CODE.투입인원관리+'_GRID'}
          ref={TUIP_WORKER_REF}
          gridMode={tuipWorkerGridMode}
          columns={TUIP_WORKER_COLUMNS}
          data={tuipWorkerDatas}
        />
      </Container>
      <GridPopup
        title='데이터 추가하기'
        okText='추가하기'
        cancelText='취소'
        onCancel={() => {
          setTuipWorkerVisible(false);
        }}
        gridMode='create'
        popupId={TAB_CODE.투입인원관리+'_POPUP'}
        gridId={TAB_CODE.투입인원관리+'_POPUP_GRID'}
        ref={TUIP_WORKER_POPUP_REF}
        parentGridRef={TUIP_WORKER_REF}
        columns={TUIP_WORKER_COLUMNS}
        gridPopupInfo={TUIP_WORKER_POPUP_INFO}
        rowAddPopupInfo={TUIP_WORKER_POPUP_INFO[0]}
        saveUriPath={TUIP_WORKER_SAVE_URIPATH}
        searchUriPath={TUIP_WORKER_SEARCH_URIPATH}
        saveOptionParams={tuipWorkerSaveOptionParams}
        // setParentData={TUIP_WORKER_setData}
        data={[]}
        saveType='basic'
        defaultVisible={false}
        visible={tuipWorkerVisible}
        onAfterOk={(success) => {
          if (success) {
            setTuipWorkerGridMode('view');
            TUIP_WORKER_onSearch();
            setTuipWorkerVisible(false);
          }
        }}
      />
    </>
  );
  //#endregion




  //#region 🔶공정순서 관련 
  const [procOrderGridMode, setProcOrderGridMode] = useState<TGridMode>('view');
  const [procOrderDatas, setProcOrderDatas] = useState([]);
  const PROC_ORDER_REF = useRef<Grid>();

  const PROC_ORDER_SAVE_URIPATH = '/prd/order-routings';
  const PROC_ORDER_SEARCH_URIPATH = '/prd/order-routings';

  const [procOrderSaveOptionParams, setProcOrderSaveOptionParams] = useState({});

  
  const PROC_ORDER_onSearch = () => {
    getData(
      procOrderSaveOptionParams,
      PROC_ORDER_SEARCH_URIPATH
    ).then((res) => {
      PROC_ORDER_setData(res);
    });
  }

  const PROC_ORDER_setData = (data) => {
    setProcOrderDatas(data);
  }

  const PROC_ORDER_onAppend = (ev) => {
    if (procOrderSaveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    // setProcOrderVisible(true);
  }

  const PROC_ORDER_onEdit = (ev) => {
    if (procOrderSaveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setProcOrderGridMode('update');
  }

  const PROC_ORDER_onDelete = (ev) => {
    if (procOrderSaveOptionParams?.order_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    setProcOrderGridMode('delete');
  }
  
  const PROC_ORDER_onCancel = (ev) => {
    onDefaultGridCancel(PROC_ORDER_REF, PROC_ORDER_COLUMNS, modal,
      () => {
        setProcOrderGridMode('view');
        PROC_ORDER_onSearch();
      }
    );
  }

  const PROC_ORDER_onSave = (ev) => {
    onDefaultGridSave('basic', PROC_ORDER_REF, PROC_ORDER_COLUMNS, PROC_ORDER_SAVE_URIPATH, {}, modal,
      () => {
        setProcOrderGridMode('view');
        PROC_ORDER_onSearch();
      }
    );
  }

  const PROC_ORDER_COLUMNS:IGridColumn[] = [
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
  ];

  const PROC_ORDER_POPUP_INFO:IGridPopupInfo[] = [
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

  const 공정순서 = (
    <>
      <Container>
        {procOrderGridMode === 'view' ?
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={PROC_ORDER_onDelete} disabled={true}>삭제</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={PROC_ORDER_onEdit}>수정</Button>
              <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={PROC_ORDER_onAppend} disabled={true}>항목 추가</Button>
            </Space>
          </div>
          :
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='cancel' colorType='blue' onClick={PROC_ORDER_onCancel}>취소</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='ok' colorType='blue' onClick={PROC_ORDER_onSave}>저장</Button>
            </Space>
          </div>
        }
        {/* <p/> */}
        <Datagrid
          gridId={TAB_CODE.공정순서+'_GRID'}
          gridMode={procOrderGridMode}
          ref={PROC_ORDER_REF}
          columns={PROC_ORDER_COLUMNS}
          gridPopupInfo={PROC_ORDER_POPUP_INFO}
          data={procOrderDatas}
        />
      </Container>
    </>
  );
  //#endregion




  //#region 🔶 작업지시이력 관련
  const [, setLoading] = useLoadingState();
  const [modal, contextHolder] = Modal.useModal();


  const [gridMode, setGridMode] = useState<TGridMode>('delete');
  const [orderDatas, setOrderDatas] = useState([]);
  const gridRef = useRef<Grid>();
  const popupGridRef = useRef<Grid>();
  const searchRef = useRef<FormikProps<FormikValues>>();
  const searchParams = searchRef?.current?.values;

  // const [selectedRow, setSelectedRow] = useState(null);
  const [orderPopupVisible, setOrderPopupVisible] = useState(false);

  const ORDER_SEARCH_URIPATH = '/prd/orders';
  const ORDER_SAVE_URIPATH = '/prd/orders';

  const onSearch = (values) => {
    try {
      // setLoading(true);

      getData({
        ...values,
        order_state: 'all',
      }, ORDER_SEARCH_URIPATH).then((res) => {
        setOrderDatas(res || []);

        // 지시이력 조회되면서 하위 데이터 초기화
        setTuipProdGridMode('view');
        setTuipWorkerGridMode('view');
        setProcOrderGridMode('view');
        
        // 지시이력 조회되면서 하위 데이터 초기화
        setTuipProdSaveOptionParams({});
        setTuipWorkerSaveOptionParams({});
        setProcOrderSaveOptionParams({});
        setTuipProdDatas([]);
        setTuipWorkerDatas([]);
        setProcOrderDatas([]);
      });


    } finally {
      // setLoading(false);
    }
  }

  const onAppend = (ev) => {
    setOrderPopupVisible(true);
  }

  const onEdit = (ev) => {
    setGridMode('update');
  }

  const onDelete = (ev) => {
    setGridMode('delete');
  }



  const ORDER_COLUMNS:IGridColumn[] = [
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
  ];

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

  const ORDER_COMBO_INFO:IGridComboInfo[] = [
    { // 작업교대 콤보박스
      columnNames: [
        {codeColName:{original:'shift_uuid', popup:'shift_uuid'}, textColName:{original:'shift_nm', popup:'shift_nm'}},
      ],
      itemListFromRequest: {
        uriPath:'/std/shifts',
        params:{}
      }
    },
    { // 작업조 콤보박스
      columnNames: [
        {codeColName:{original:'worker_group_uuid', popup:'worker_group_uuid'}, textColName:{original:'worker_group_nm', popup:'worker_group_nm'}},
      ],
      itemListFromRequest: {
        uriPath:'/std/worker-groups',
        params:{}
      }
    },
  ]

  const ORDER_ADD_ROW_POPUP_INFO:IGridPopupInfo = {
    ...ORDER_POPUP_INFO[0],
    gridMode:'multi-select'
  }

  //#endregion

  const HeaderGridElement = useMemo(() => {
    return (
      <Datagrid
          gridId={'PROD_ORDER_GRID'}
          ref={gridRef}
          gridMode={gridMode}
          columns={ORDER_COLUMNS}
          height={300}
          data={orderDatas}
          onAfterClick={(ev) => {
            const {rowKey, targetType} = ev;
        
            if (targetType === 'cell') {
              try {
                // setLoading(true);
        
                const row = ev?.instance?.store?.data?.rawData[rowKey];
                const order_uuid = row?.order_uuid;
        
                // 자재투입 데이터 조회
                getData({
                  order_uuid: String(order_uuid)
                }, TUIP_PROD_SEARCH_URIPATH).then((res) => {
                  setTuipProdDatas(res);
                  setTuipProdSaveOptionParams({order_uuid});
                });
                
                // 작업자투입 데이터 조회
                getData({
                  order_uuid: String(order_uuid)
                }, TUIP_WORKER_SEARCH_URIPATH).then((res) => {
                  setTuipWorkerDatas(res);
                  setTuipWorkerSaveOptionParams({order_uuid});
                });
        
                
                // 공정순서 데이터 조회
                getData({
                  order_uuid: String(order_uuid)
                }, PROC_ORDER_SEARCH_URIPATH).then((res) => {
                  setProcOrderDatas(res);
                  setProcOrderSaveOptionParams({order_uuid});
                });
        
        
              } catch(e) {
                console.log(e);
        
              } finally {
                // setLoading(false);
              }
            }
          }}
        />
    )
  }, [gridRef, orderDatas, gridMode]);

  return (
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
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='blue' onClick={onDelete}>삭제</Button>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='edit' colorType='blue' onClick={onEdit}>수정</Button>
            <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onAppend}>신규 추가</Button>
          </Space>
        </div>
        <div style={{maxWidth:500, marginTop:-33, marginLeft:-6}}>
          <Searchbox 
            id='prod_order_search'
            innerRef={searchRef}
            searchItems={[
              {type:'date', id:'start_date', label:'지시기간', default:getToday()},
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
              // setTuipProdGridMode('view');
              setTuipWorkerGridMode('view');
              setProcOrderGridMode('view');

              if ((tuipProdSaveOptionParams as any)?.order_uuid != null)
                TUIP_PROD_onSearch();
              break;
            
            case TAB_CODE.투입인원관리:
              setTuipProdGridMode('view');
              // setTuipWorkerGridMode('view');
              setProcOrderGridMode('view');

              if ((tuipWorkerSaveOptionParams as any)?.order_uuid != null)
                TUIP_WORKER_onSearch();
              break;

            case TAB_CODE.공정순서:
              setTuipProdGridMode('view');
              setTuipWorkerGridMode('view');
              // setProcOrderGridMode('view');

              if ((procOrderSaveOptionParams as any)?.order_uuid != null)
                PROC_ORDER_onSearch();
              break;
          
            default:
              setTuipProdGridMode('view');
              setTuipWorkerGridMode('view');
              setProcOrderGridMode('view');
              break;
          }
        }}
        panels={[
          {
            tab: '투입품목 관리',
            tabKey: TAB_CODE.투입품목관리,
            content: 투입품목관리,
          },
          {
            tab: '투입인원 관리',
            tabKey: TAB_CODE.투입인원관리,
            content: 투입인원관리,
          },
          {
            tab: '공정순서',
            tabKey: TAB_CODE.공정순서,
            content: 공정순서,
          },
        ]}
      />
      
      <GridPopup
        title='데이터 추가하기'
        okText='추가하기'
        cancelText='취소'
        onCancel={() => {
          // TUIP_PROD_onSearch();
          setOrderPopupVisible(false);
        }}
        gridMode='create'
        popupId={'PROD_ORDER_GRID_POPUP_POPUP'}
        gridId={'PROD_ORDER_GRID_POPUP'}
        ref={popupGridRef}
        parentGridRef={gridRef}
        columns={ORDER_COLUMNS}
        gridComboInfo={ORDER_COMBO_INFO}
        gridPopupInfo={ORDER_POPUP_INFO}
        rowAddPopupInfo={ORDER_ADD_ROW_POPUP_INFO}
        saveUriPath={ORDER_SAVE_URIPATH}
        searchUriPath={ORDER_SEARCH_URIPATH}
        
        // saveOptionParams={tuipWorkerSaveOptionParams}
        // setParentData={TUIP_WORKER_setData}
        data={[]}
        saveType='basic'
        defaultVisible={false}
        visible={orderPopupVisible}
        onAfterOk={(isSuccess, savedData) => { 
          if (!isSuccess) return;
          setOrderPopupVisible(false);
          onSearch(searchParams);
        }}
      />

      {contextHolder}
    </>
  );
}

//#region 🔶그리드 공통 이벤트 함수 정의 (나중에 옮길거임)
const onDefaultGridSave = async (saveType:'basic'|'headerInclude', ref:MutableRefObject<Grid>, columns, saveUriPath, optionParams, modal, saveAfterFunc?:Function) => {
  // 그리드의 데이터를 편집한 이력이 있는지 체크
  if (isModified(ref, columns)) { // 편집 이력이 있는 경우
    modal.confirm({
      icon: null,
      title: '저장',
      // icon: <ExclamationCircleOutlined />,
      content: '편집된 내용을 저장하시겠습니까?',
      onOk: async () => {
        let modifiedRows = null;
        

        // 기본 저장 방식
        if (saveType === 'basic') {
          modifiedRows = getModifiedRows(ref, columns);

          // 저장 가능한지 체크
          const chk:boolean = await checkGridData(columns, modifiedRows);

          if (chk === false) return;

          saveGridData(modifiedRows, columns, saveUriPath, optionParams).then(() => {
            if (saveAfterFunc)
              saveAfterFunc();
          });


        // (header / detail 형식으로 변환 후 저장)
        } else if (saveType === 'headerInclude') {
          let methodType:'delete' | 'post' | 'put' | 'patch' = 'post';
          let detailDatas = [];

          const modifiedRows = await getModifiedRows(ref, columns);

          const {createdRows, updatedRows, deletedRows} = modifiedRows;

          if (createdRows?.length > 0) {
            detailDatas = createdRows;
            methodType = 'post';

          } else if (updatedRows?.length > 0) {
            detailDatas = updatedRows;
            methodType = 'put';

          } else if (deletedRows?.length > 0) {
            detailDatas = deletedRows;
            methodType = 'delete';
          }

          const chk:boolean = await checkGridData(columns, modifiedRows);

          if (chk !== true) {
            return;
          }

          // 옵션 데이터 추가
          for (let i = 0; i < detailDatas.length; i++) {
            detailDatas[i]['factory_uuid'] = getUserFactoryUuid();
            
            // alias에 따라 키값 변경
            columns?.forEach((column) => {
              if (column?.alias != null) {
                detailDatas[i][column?.alias] = detailDatas[i][column?.name];
                delete detailDatas[i][column?.name];
              }
            });
            // const optionKeys = Object.keys(optionParams);

            // optionKeys.forEach((optionKey) => {
            //   detailDatas[i][optionKey] = optionParams[optionKey];
            // });
          }


          // 헤더 데이터 추가
          const optionKeys = Object.keys(optionParams);

          let headerData = {}
          optionKeys.forEach((optionKey) => {
            headerData[optionKey] = optionParams[optionKey];
          });

          headerData['factory_uuid'] = getUserFactoryUuid();

          // 최종적으로 저장될 데이터
          const saveData = {
            header: headerData,
            details: detailDatas,
          }

          if (headerData?._saveType != null) {
            methodType = headerData['_saveType'];
          }

          // 저장
          await executeData(saveData, saveUriPath, methodType, 'success').then((success) => {
            if (success === true) {
              if (saveAfterFunc)
                saveAfterFunc();
            }

          }).catch(e => {
            console.log('Error',e);
      
          });
        }

      },
      onCancel: () => {
      },
      okText: '예',
      cancelText: '아니오',
    });

  } else { // 편집 이력이 없는 경우
    message.warn('편집된 데이터가 없습니다.');
  }
}


/** 편집 취소 */
const onDefaultGridCancel = (ref:MutableRefObject<Grid>, columns, modal, afterCancelFunc?:Function) => {
  // 그리드의 데이터를 편집한 이력이 있는지 체크
  if (isModified(ref, columns)) { // 편집 이력이 있는 경우
    modal.confirm({
      title: '편집 취소',
      // icon: <ExclamationCircleOutlined />,
      content: '편집된 이력이 있습니다. 편집을 취소하시겠습니까?',
      onOk:() => {
        if (afterCancelFunc)
          afterCancelFunc();
      },
      onCancel:() => {
      },
      okText: '예',
      cancelText: '아니오',
    });

  } else { // 편집 이력이 없는 경우
    if (afterCancelFunc)
      afterCancelFunc();
  }
};
//#endregion

