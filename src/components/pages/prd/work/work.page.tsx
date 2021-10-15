import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import { Divider, message, Space, Typography, Modal, Col, Row, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { FormikProps, FormikValues } from 'formik';
import React, { useLayoutEffect, useReducer, useRef, useState } from 'react';
import { Button, Container, Datagrid, IGridColumn, ISearchItem, Label, Searchbox, Tabs, TGridMode } from '~/components/UI';
import { executeData, getData, getToday, saveGridData } from '~/functions';
import { useLoadingState } from '~/hooks';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { INSP } from './work.page.insp';
import { INPUT } from './work.page.input';
import { WORKER } from './work.page.worker';
import { REJECT } from './work.page.reject';
import { DOWNTIME } from './work.page.downtime';
import { ROUTING } from './work.page.route';


// 날짜 로케일 설정
dayjs.locale('ko-kr');

// moment 타입과 호환시키기 위한 행위
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);


const TAB_CODE = {
  공정검사: 'INSP',
  투입품목관리: 'INPUT',
  투입인원관리: 'WORKER',
  부적합관리: 'REJECT',
  비가동관리: 'DOWNTIME',
  공정순서: 'ROUTING',
}


const onErrorMessage = (type) => {
  switch (type) {
    case '하위이력작업시도':
      message.warn('작업이력을 선택한 후 다시 시도해주세요.');
      break;

    case '완료된작업시도':
      message.warn('이미 완료된 작업은 수정할 수 없습니다.');
      break;
  
    default:
      break;
  }
}


//#region ✅작업정보 / 생산정보 관련 상태 값
const infoInit = {
  orderInfo: {
    prod_uuid: null,
    prod_no: null,
    prod_nm: null,
    item_type_uuid: null,
    item_type_nm: null,
    prod_type_uuid: null,
    prod_type_nm: null,
    model_uuid: null,
    model_nm: null,
    rev: null,
    prod_std: null,
    unit_uuid: null,
    unit_nm: null,
    equip_uuid: null,
    equip_nm: null,
    proc_uuid: null,
    proc_nm: null,
    shift_uuid: null,
    shift_nm: null,
    workings_uuid: null,
    workings_nm: null,
    order_remark: null,
  },

  workInfo: {
    work_uuid: null,
    complete_fg: null,
    start_date: null,
    end_date: null,
    _start_date: null,
    _end_date: null,
    _start_time: null,
    _end_time: null,
    to_store_uuid: null,
    to_store_nm: null,
    to_location_uuid: null,
    to_location_nm: null,
    order_qty: null, //지시수량
    total_qty: null, //생산수량
    qty: null, //양품수량
    reject_qty: null, //부적합수량
    lot_no: null,
    remark: null,
  }
}

type TAction =
| {type:'CHANGE_ORDER_INFO', name:string, value:any}
| {type:'CHANGE_WORK_INFO', name:string, value:any}
| {type:'CHANGE_ALL', name?:string, value?:any}
| {type:'CLEAR_ORDER_INFO', name?:string, value?:any}
| {type:'CLEAR_WORK_INFO', name?:string, value?:any}
| {type:'CLEAR_ALL', name?:string, value?:any}

type TState = {
  orderInfo: {
    prod_uuid: string,
    prod_no: string,
    prod_nm: string,
    item_type_uuid: string,
    item_type_nm: string,
    prod_type_uuid: string,
    prod_type_nm: string,
    model_uuid: string,
    model_nm: string,
    rev: string,
    prod_std: string,
    unit_uuid: string,
    unit_nm: string,
    equip_uuid: string,
    equip_nm: string,
    proc_uuid: string,
    proc_nm: string,
    shift_uuid: string,
    shift_nm: string,
    workings_uuid: string,
    workings_nm: string,
    order_remark: string,
  },
  workInfo: {
    work_uuid: string,
    complete_fg: string,
    start_date: string,
    end_date: string,
    _start_date: dayjs.Dayjs,
    _end_date: dayjs.Dayjs,
    _start_time: dayjs.Dayjs,
    _end_time: dayjs.Dayjs,
    to_store_uuid: string,
    to_store_nm: string,
    to_location_uuid: string,
    to_location_nm: string,
    order_qty: string | number, //지시수량
    total_qty: string | number, //생산수량
    qty: string | number, //양품수량
    reject_qty: string | number, //부적합수량
    lot_no: string,
    remark: string,
  }
}

const infoReducer = (state:TState, action:TAction) => {
  const {type} = action;

  switch (type) {
    case 'CHANGE_ORDER_INFO':
      return {
        ...state,
        orderInfo: {
          ...state.orderInfo,
          [action.name]: action.value
        }
      };

    case 'CHANGE_WORK_INFO':
      return {
        ...state,
        workInfo: {
          ...state.workInfo,
          [action.name]: action.value
        }
      };

    case 'CHANGE_ALL':
      return action.value;

    case 'CLEAR_ORDER_INFO':
      return {
        ...state,
        orderInfo: infoInit.orderInfo
      };

    case 'CLEAR_WORK_INFO':
      return {
        ...state,
        workInfo: infoInit.workInfo
      };

    case 'CLEAR_ALL':
      return infoInit;
  
    default:
      return state;
  }
}
//#endregion


//#region 🔶🚫생산실적
/** 생산실적 */
export const PgPrdWork = () => {
  //#region ✅설정값
  const [,setLoading] = useLoadingState();
  const [modal, contextHolder] = Modal.useModal();

  const [gridMode, setGridMode] = useState<TGridMode>('select');
  const [workDatas, setWorkDatas] = useState([]);

  const searchRef = useRef<FormikProps<FormikValues>>();
  const inputRef = useRef<FormikProps<FormikValues>>();
  const gridRef = useRef<Grid>();
  const popupGridRef = useRef<Grid>();

  const SEARCH_URI_PATH = '/prd/works';
  const SAVE_URI_PATH = '/prd/works';

  const 공정검사 = INSP();
  const 투입품목관리 = INPUT();
  const 투입인원관리 = WORKER();
  const 부적합관리 = REJECT();
  const 비가동관리 = DOWNTIME();
  const 공정순서 = ROUTING();

  // 팝업 관련
  const [prodOrderPopupVisible, setProdOrderPopupVisible] = useState(false);
  const [workPopupVisible, setWorkPopupVisible] = useState(false);

  // 작업정보, 생산정보 관리
  const [infoState, infoDispatch] = useReducer(infoReducer, infoInit);
  const {orderInfo, workInfo} = infoState;

  const [cboWorkStoreOptions, setCboWorkStoreOptions] = useState([]);
  const [cboWorkLocationOptions, setCboWorkLocationOptions] = useState([]);
  //#endregion


  //#region 🚫사이드 이펙트
  const [schData_disabled, setSchData_disabled] = useState(false);
  const searchParams = searchRef?.current?.values
  

  useLayoutEffect(() => {
    if (searchParams?.complete_fg === 'true') {
      setSchData_disabled(false);
    } else {
      setSchData_disabled(true);
    }
  }, [searchParams]);
  

  useLayoutEffect(() => {
    // 콤보박스 값 세팅 (입고창고/입고위치)

    //입고창고 조회
    getData(
      {
        store_type:'available'
      },
      '/std/stores'
    ).then((res) => {
      let cboItems = [];

      res?.forEach((el) => {
        cboItems.push({
          value: el?.store_uuid,
          label: el?.store_nm,
        })
      });

      setCboWorkStoreOptions(cboItems);
    });
    

    //입고위치 조회
    getData(
      {
        //store_uuid: 
      },
      '/std/locations'
    ).then((res) => {
      let cboItems = [];

      res?.forEach((el) => {
        cboItems.push({
          value: el?.location_uuid,
          label: el?.location_nm,
        })
      });

      setCboWorkLocationOptions(cboItems);
    });
  }, []);
  //#endregion


  //#region 🚫함수
  const onProdOrder = () => {
    setProdOrderPopupVisible(true);
  }

  const onProdOrderClose = () => {
    setProdOrderPopupVisible(false);
  }


  const onSearch = () => {
    const {values} = searchRef?.current;
    const searchParams =
      values?.complete_fg === 'true' ?
        values
      : {complete_fg: values?.complete_fg};

    getData(searchParams, SEARCH_URI_PATH).then((res) => {
      setWorkDatas(res || []);

      // 작업정보 및 실적정보 초기화
      infoDispatch({type:'CLEAR_ALL'});

      // 실적이력 조회되면서 하위 데이터 초기화
      공정검사.onReset;
      
      투입품목관리.setGridMode('view');
      투입인원관리.setGridMode('view');
      부적합관리.setGridMode('view');
      비가동관리.setGridMode('view');
      공정순서.setGridMode('view');
      
      // 실적이력 조회되면서 하위 데이터 초기화
      투입품목관리.setSearchParams({});
      투입품목관리.setSaveOptionParams({});
      투입품목관리.setData([]);

      투입인원관리.setSearchParams({});
      투입인원관리.setSaveOptionParams({});
      투입인원관리.setData([]);

      부적합관리.setSearchParams({});
      부적합관리.setSaveOptionParams({});
      부적합관리.setData([]);

      비가동관리.setSearchParams({});
      비가동관리.setSaveOptionParams({});
      비가동관리.setData([]);

      공정순서.setSearchParams({});
      공정순서.setSaveOptionParams({});
      공정순서.setData([]);
    });
  }


  const onDelete = (ev) => {

  }


  const onEdit = (ev) => {

  }


  const onAppend = (ev) => {
    setWorkPopupVisible(true);
  }


  const onCancel = (ev) => {

  }


  const onSave = (ev) => {

  }

  
  /** 작업 취소 처리 */
  const onCancelWork = () => {
    if (workInfo.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if (workInfo.complete_fg !== 'true') {
      message.warn('완료된 실적만 취소 가능합니다.');
      return;
    }

    const SAVE_URI_PATH = '/prd/works/cancel-complete';

    modal.confirm({
      title: '작업 취소',
      content: '작업을 취소하시겠습니까?',
      okText:'예',
      cancelText:'아니오',
      onOk: () => {
        //작업 취소처리
        executeData({
          uuid: workInfo.work_uuid,
          
        }, SAVE_URI_PATH, 'put', 'success').then((success) => {
          if (success === true) {
            message.info('정상적으로 취소되었습니다.');
            onSearch();

          } else {
            message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
          }

        }).catch((e) => {
          console.error(e);
          message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
        });
      }
    });
  }


  /** 실적 삭제 처리 */
  const onDeleteWork = () => {
    if (workInfo.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    // if (workInfo.complete_fg !== 'true') {
    //   message.warn('완료된 실적만 삭제 가능합니다.');
    //   return;
    // }

    const SAVE_URI_PATH = '/prd/works';

    modal.confirm({
      title: '실적 제거',
      content: '실적을 삭제하시겠습니까?',
      okText:'예',
      cancelText:'아니오',
      onOk: () => {
        //실적 삭제처리
        executeData({
          uuid: workInfo.work_uuid,

        }, SAVE_URI_PATH, 'delete', 'success').then((success) => {
          if (success === true) {
            message.info('정상적으로 삭제되었습니다.');
            onSearch();

          } else {
            message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
          }

        }).catch((e) => {
          console.error(e);
          message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
        });
      }
    });
  }

  
  /** 생산실적 중간저장 처리 */
  const onSaveWork = () => {
    if (workInfo.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if (workInfo.complete_fg === 'true') {
      onErrorMessage('완료된작업시도');
      return;
    }

    const SAVE_URI_PATH = '/prd/works';

    modal.confirm({
      title: '중간 저장',
      content: '실적을 중간 저장하시겠습니까?',
      okText:'예',
      cancelText:'아니오',
      onOk: () => {
        //실적완료처리
        executeData({
          uuid: workInfo.work_uuid,
          qty: workInfo.qty,
          start_date: workInfo.start_date,
          end_date: workInfo.end_date || null,
          remark: workInfo.remark,

        }, SAVE_URI_PATH, 'put', 'success').then((success) => {
          if (success === true) {
            message.info('정상적으로 저장되었습니다.');
            onSearch();

          } else {
            message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
          }

        }).catch((e) => {
          console.error(e);
          message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
        });
      }
    });
  }


  /** 생산실적 완료 처리 */
  const onCompleteWork = () => {
    if (workInfo.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if (workInfo.complete_fg === 'true') {
      onErrorMessage('완료된작업시도');
      return;
    }

    const SAVE_URI_PATH = '/prd/works/complete';

    modal.confirm({
      title: '작업 종료',
      content: '작업을 종료하시겠습니까?',
      okText:'예',
      cancelText:'아니오',
      onOk: () => {
        //실적완료처리
        executeData({
          uuid: workInfo.work_uuid,
          end_date: workInfo.end_date || null

        }, SAVE_URI_PATH, 'put', 'success').then((success) => {
          if (success === true) {
            message.info('정상적으로 종료되었습니다.');
            onSearch();

          } else {
            message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
          }

        }).catch((e) => {
          console.error(e);
          message.error('오류가 발생했습니다. 관리자에게 문의해주세요.');
        });
      }
    });
  }

  const onChangeStartDate = (value) => {
    infoDispatch({type:'CHANGE_WORK_INFO', name:'_start_date', value});

    const datetime = dayjs(value).format('YYYY-MM-DD') + ' ' + dayjs(infoState._start_time).format('HH:mm:ss');
    infoDispatch({type:'CHANGE_WORK_INFO', name:'start_date', value:datetime});
  }

  const onChangeStartTime = (value) => {
    infoDispatch({type:'CHANGE_WORK_INFO', name:'_start_time', value});

    const datetime = dayjs(infoState._start_date).format('YYYY-MM-DD') + ' ' + dayjs(value).format('HH:mm:ss');
    infoDispatch({type:'CHANGE_WORK_INFO', name:'start_date', value:datetime});
  }

  const onChangeEndDate = (value) => {
    infoDispatch({type:'CHANGE_WORK_INFO', name:'_end_date', value});

    const datetime = dayjs(value).format('YYYY-MM-DD') + ' ' + dayjs(infoState._end_time).format('HH:mm:ss');
    infoDispatch({type:'CHANGE_WORK_INFO', name:'end_date', value:datetime});
  }

  const onChangeEndTime = (value) => {
    infoDispatch({type:'CHANGE_WORK_INFO', name:'_end_time', value});

    const datetime = dayjs(infoState._end_date).format('YYYY-MM-DD') + ' ' + dayjs(value).format('HH:mm:ss');
    infoDispatch({type:'CHANGE_WORK_INFO', name:'end_date', value:datetime});
  }

  const onChangeCboStore = (value) => {
    infoDispatch({type:'CHANGE_WORK_INFO', name:'to_store_uuid', value});
  }

  const onChangeCboLocation = (value) => {
    infoDispatch({type:'CHANGE_WORK_INFO', name:'to_location_uuid', value});
  }

  const onChangeQty = (ev) => {
    const {value} = ev?.target;
    infoDispatch({type:'CHANGE_WORK_INFO', name:'qty', value});
  }

  const onChangeRemark = (ev) => {
    const {value} = ev?.target;
    infoDispatch({type:'CHANGE_WORK_INFO', name:'remark', value});
  }
  //#endregion

  
  //#region ✅조회조건
  const SEARCH_ITEMS:ISearchItem[] = [
    {type:'date', id:'start_date', label:'작업기간', default:dayjs(getToday()).add(-6, 'day').format('YYYY-MM-DD'), disabled: schData_disabled},
    {type:'date', id:'end_date', default:getToday(), disabled: schData_disabled},
    {type:'radio', id:'complete_fg', default:'false',
      options:[
        {code:'false', text:'작업중'},
        {code:'true', text:'작업완료'},
      ]
    },
  ];
  //#endregion


  //#region ✅컬럼
  const WORK_COLUMNS:IGridColumn[] = [
    {header:'생산실적UUID', name:'work_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
    {header:'실적 일시', name:'reg_date', width:200, hidden:true, format:'text'},
    {header:'작업지시UUID', name:'order_uuid', width:200, hidden:true, format:'text'},
    {header:'지시번호', name:'order_no', width:200, hidden:true, format:'text'},
    {header:'생산실적 순번', name:'seq', width:200, hidden:true, format:'text'},
    {header:'공정UUID', name:'proc_uuid', width:200, hidden:true, format:'text'},
    {header:'공정', name:'proc_nm', width:120, hidden:false, format:'text'},
    {header:'작업장UUID', name:'workings_uuid', width:200, hidden:true, format:'text'},
    {header:'작업장', name:'workings_nm', width:120, hidden:false, format:'text'},
    {header:'설비UUID', name:'equip_uuid', width:200, hidden:true, format:'text'},
    {header:'설비', name:'equip_nm', width:120, hidden:false, format:'text'},
    {header:'품목UUID', name:'prod_uuid', width:200, hidden:true, format:'text'},
    {header:'품목유형UUID', name:'item_type_uuid', width:200, hidden:true, format:'text'},
    {header:'품목유형', name:'item_type_nm', width:120, hidden:false, format:'text'},
    {header:'제품유형UUID', name:'prod_type_uuid', width:200, hidden:true, format:'text'},
    {header:'제품유형', name:'prod_type_nm', width:120, hidden:false, format:'text'},
    {header:'품번', name:'prod_no', width:150, hidden:false, format:'text'},
    {header:'품명', name:'prod_nm', width:150, hidden:false, format:'text'},
    {header:'모델UUID', name:'model_uuid', width:200, hidden:true, format:'text'},
    {header:'모델', name:'model_nm', width:120, hidden:false, format:'text'},
    {header:'Rev', name:'rev', width:100, hidden:false, format:'text'},
    {header:'규격', name:'prod_std', width:100, hidden:false, format:'text'},
    {header:'단위UUID', name:'unit_uuid', width:200, hidden:true, format:'text'},
    {header:'단위명', name:'unit_nm', width:80, hidden:false, format:'text'},
    {header:'LOT NO', name:'lot_no', width:100, hidden:false, format:'text'},
    {header:'지시 수량', name:'order_qty', width:100, hidden:false, format:'number'},
    {header:'생산 수량', name:'total_qty', width:100, hidden:false, format:'number'},
    {header:'양품 수량', name:'qty', width:100, hidden:false, format:'number'},
    {header:'부적합 수량', name:'reject_qty', width:100, hidden:false, format:'number'},
    {header:'생산시작 일시', name:'start_date', width:100, hidden:false, format:'datetime'},
    {header:'생산종료 일시', name:'end_date', width:100, hidden:false, format:'datetime'},
    {header:'작업시간', name:'work_time', width:80, hidden:true, format:'text'},
    {header:'작업교대UUID', name:'shift_uuid', width:200, hidden:true, format:'text'},
    {header:'작업교대명', name:'shift_nm', width:120, hidden:false, format:'text'},
    {header:'작업자수', name:'worker_cnt', width:100, hidden:false, format:'text'},
    {header:'작업자명', name:'worker_nm', width:100, hidden:false, format:'text'},
    {header:'생산 완료여부(완료, 미완료)', name:'complete_state', width:200, hidden:true, format:'text'},
    {header:'생산 종료여부', name:'complete_fg', width:200, hidden:true, format:'text'},
    {header:'입고 창고UUID', name:'to_store_uuid', width:200, hidden:true, format:'text'},
    {header:'입고 창고', name:'to_store_nm', width:120, hidden:false, format:'text'},
    {header:'입고 위치UUID', name:'to_location_uuid', width:200, hidden:true, format:'text'},
    {header:'입고 위치', name:'to_location_nm', width:120, hidden:false, format:'text'},
    {header:'지시 비고', name:'order_remark', width:150, hidden:false, format:'text'},
    {header:'생산 비고', name:'remark', width:150, hidden:false, format:'text'},
  ];
  //#endregion


  //#region 🚫렌더부
  return (
    <>
      <Typography.Title level={5} style={{marginBottom:-16, fontSize:14}}><CaretRightOutlined />생산이력</Typography.Title>
      <Divider style={{marginBottom:10}}/>
      <Container>
        {gridMode === 'select' ?
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
              <Button btnType='buttonFill' widthSize='large' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onProdOrder}>작업지시 관리</Button>
              {/* <Button btnType='buttonFill' widthSize='medium' ImageType='add' colorType='blue' onClick={onAppend}>신규 추가</Button> */}
            </Space>
          </div>
          :
          <div style={{width:'100%', display:'inline-block'}}>
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='cancel' colorType='blue' onClick={onCancel}>취소</Button>
              <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='ok' colorType='blue' onClick={onSave}>저장</Button>
            </Space>
          </div>
        }
        <div style={{maxWidth:700, marginTop:-33, marginLeft:-6}}>
          <Searchbox 
            id='prod_order_search'
            innerRef={searchRef}
            searchItems={SEARCH_ITEMS}
            onSearch={onSearch}
            boxShadow={false}
          />
        </div>
        <p/>
        <Datagrid
          gridId={'WORK_GRID'}
          ref={gridRef}
          gridMode={gridMode}
          columns={WORK_COLUMNS}
          height={300}
          data={workDatas}
          onAfterClick={(ev) => {
            const {rowKey, targetType} = ev;
        
            if (targetType === 'cell' && gridMode === 'select') {
              try {
                // setLoading(true);
                const searchParams = searchRef?.current?.values;

                const row = ev?.instance?.store?.data?.rawData[rowKey];
                const work_uuid = row?.work_uuid;
                const prod_uuid = row?.prod_uuid;
                const lot_no = row?.lot_no;
                const order_qty = row?.order_qty;
                const complete_fg = searchParams?.complete_fg;


                //#region  공장정보 및 생산정보 값 세팅
                // 공장정보 및 생산정보 값 세팅
                infoDispatch(
                  {
                    type:'CHANGE_ALL', 
                    value:{
                      orderInfo: {
                        prod_uuid: row?.prod_uuid,
                        prod_no: row?.prod_no,
                        prod_nm: row?.prod_nm,
                        item_type_uuid: row?.item_type_uuid,
                        item_type_nm: row?.item_type_nm,
                        prod_type_uuid: row?.prod_type_uuid,
                        prod_type_nm: row?.prod_type_nm,
                        model_uuid: row?.model_uuid,
                        model_nm: row?.model_nm,
                        rev: row?.rev,
                        prod_std: row?.prod_std,
                        unit_uuid: row?.unit_uuid,
                        unit_nm: row?.unit_nm,
                        equip_uuid: row?.equip_uuid,
                        equip_nm: row?.equip_nm,
                        proc_uuid: row?.proc_uuid,
                        proc_nm: row?.proc_nm,
                        shift_uuid: row?.shift_uuid,
                        shift_nm: row?.shift_nm,
                        workings_uuid: row?.working_uuid,
                        workings_nm: row?.working_nm,
                        order_remark: row?.order_remark,
                      },

                      workInfo: {
                        work_uuid: work_uuid,
                        complete_fg: complete_fg,
                        start_date: [null, undefined, ''].includes(row?.start_date) ? null : dayjs(row?.start_date).locale('ko').format('YYYY-MM-DD HH:mm:ss'),
                        end_date: [null, undefined, ''].includes(row?.end_date) ? null : dayjs(row?.end_date).locale('ko').format('YYYY-MM-DD HH:mm:ss'),
                        _start_date: [null, undefined, ''].includes(row?.start_date) ? null : dayjs(row?.start_date).locale('ko'),
                        _end_date: [null, undefined, ''].includes(row?.end_date) ? null : dayjs(row?.end_date).locale('ko'),
                        _start_time: [null, undefined, ''].includes(row?.start_date) ? null : dayjs(row?.start_date).locale('ko'),
                        _end_time: [null, undefined, ''].includes(row?.end_date) ? null : dayjs(row?.end_date).locale('ko'),
                        to_store_uuid: row?.to_store_uuid,
                        to_store_nm: row?.to_store_nm,
                        to_location_uuid: row?.to_location_uuid,
                        to_location_nm: row?.to_location_nm,
                        order_qty: row?.order_qty, //지시수량
                        total_qty: row?.total_qty, //생산수량
                        qty: row?.qty, //양품수량
                        reject_qty: row?.reject_qty, //부적합수량
                        lot_no: row?.lot_no,
                        remark: row?.remark,
                      }
                    }
                  }
                );
                //#endregion

                //#region 하위 데이터들 조회
                // 공정검사 데이터 조회
                공정검사.onSearch({
                  work_uuid, 
                  prod_uuid, 
                  lot_no
                });
                // getData({
                //   work_uuid: String(work_uuid),
                //   insp_detail_type: 'all'
                // }, 공정검사.HEADER_SEARCH_URI_PATH).then((res) => {
                //   공정검사.setHeaderData(res);
                //   공정검사.setHeaderSaveOptionParams({work_uuid, prod_uuid, lot_no});
                //   공정검사.setHeaderGridMode('select');
                //   공정검사.setDetailGridMode('view');
                // });

                //❗공정검사 기준서 기준으로 값 조회
                // getData({
                //   insp_detail_type: row?.insp_uuid ,
                //   work_uuid: String(work_uuid) 
                // }, 공정검사.DETAIL_STD_SEARCH_URI_PATH).then((res) => {
                //   공정검사.setDetailData(res);
                // });
        
                // 투입품목관리 데이터 조회
                if (searchParams?.complete_fg === 'true') {
                  getData({
                    work_uuid: String(work_uuid),
                  }, 투입품목관리.SEARCH_URI_PATH).then((res) => {
                    투입품목관리.setData(res);
                    투입품목관리.setSearchParams({work_uuid, complete_fg, order_qty});
                    투입품목관리.setSaveOptionParams({work_uuid});
                    투입품목관리.setParentParams(searchParams);
                    투입품목관리.setGridMode('view');
                  });

                } else if (work_uuid != null) {
                  getData({
                    work_uuid: String(work_uuid),
                  }, 투입품목관리.GOING_SEARCH_URI_PATH).then((res) => {
                    투입품목관리.setData(res);
                    투입품목관리.setSearchParams({work_uuid, complete_fg, order_qty});
                    투입품목관리.setSaveOptionParams({work_uuid});
                    투입품목관리.setParentParams(searchParams);
                    투입품목관리.setGridMode('view');
                  });
                }
                  

                // 투입인원관리 데이터 조회
                getData({
                  work_uuid: String(work_uuid),
                }, 투입인원관리.SEARCH_URI_PATH).then((res) => {
                  투입인원관리.setData(res);
                  투입인원관리.setSearchParams({work_uuid, complete_fg});
                  투입인원관리.setSaveOptionParams({work_uuid});
                  투입인원관리.setGridMode('view');
                });


                // 부적합관리 데이터 조회
                getData({
                  work_uuid: String(work_uuid),
                }, 부적합관리.SEARCH_URI_PATH).then((res) => {
                  부적합관리.setData(res);
                  부적합관리.setSearchParams({work_uuid, complete_fg});
                  부적합관리.setSaveOptionParams({work_uuid});
                  부적합관리.setGridMode('view');
                });

                
                // 비가동관리 데이터 조회
                getData({
                  work_uuid: String(work_uuid),
                }, 비가동관리.SEARCH_URI_PATH).then((res) => {
                  비가동관리.setData(res);
                  비가동관리.setSearchParams({work_uuid, complete_fg});
                  비가동관리.setSaveOptionParams({work_uuid});
                  비가동관리.setGridMode('view');
                });

                
                // 공정순서 데이터 조회
                getData({
                  work_uuid: String(work_uuid),
                }, 공정순서.SEARCH_URI_PATH).then((res) => {
                  공정순서.setData(res);
                  공정순서.setSearchParams({work_uuid, complete_fg});
                  공정순서.setSaveOptionParams({work_uuid});
                  공정순서.setGridMode('view');
                });
                //#endregion
        
              } catch(e) {
                console.log(e);
        
              } finally {
                // setLoading(false);
              }
            }
          }}
        />
      </Container>

      
      <Row gutter={[16,0]}>
        {/* 작업 정보 */}
        <Col span={24} style={{paddingLeft:0, paddingRight:0}}>
          <Typography.Title level={5} style={{marginTop:30, marginBottom:-16, fontSize:14}}><CaretRightOutlined />작업 정보</Typography.Title>
          <div style={{width:'100%', display:'inline-block', marginTop:-26}}>
            <div style={{float:'right', paddingRight:4}}>
              <Space>
                <Button btnType='buttonFill' colorType='blue' widthSize='large' heightSize='small' fontSize='small' ImageType='cancel' onClick={onCancelWork}>실행 취소</Button>
                <Button btnType='buttonFill' colorType='red' widthSize='large' heightSize='small' fontSize='small' ImageType='delete' onClick={onDeleteWork}>실적 삭제</Button>
              </Space>
            </div>
          </div>
          <Divider style={{marginTop:2, marginBottom:10}}/>
          <Row gutter={[16,16]}>
            <Col span={12} style={{paddingLeft:0}}>
              <Container>
                <Row gutter={[16,16]}>
                  <Col span={6} style={{marginBottom:16}}>
                    <Label text='품번'/>
                    <Input disabled={true} value={orderInfo.prod_no}/>
                  </Col>
                  <Col span={6} style={{marginBottom:16}}>
                    <Label text='품명'/>
                    <Input disabled={true} value={orderInfo.prod_nm}/>
                  </Col>
                  <Col span={6} style={{marginBottom:16}}>
                    <Label text='품목유형'/>
                    <Input disabled={true} value={orderInfo.item_type_nm}/>
                  </Col>
                  <Col span={6} style={{marginBottom:16}}>
                    <Label text='제품유형'/>
                    <Input disabled={true} value={orderInfo.prod_type_nm}/>
                  </Col>
                  <Col span={6}>
                    <Label text='모델'/>
                    <Input disabled={true} value={orderInfo.model_nm}/>
                  </Col>
                  <Col span={6}>
                    <Label text='REV'/>
                    <Input disabled={true} value={orderInfo.rev}/>
                  </Col>
                  <Col span={6}>
                    <Label text='규격'/>
                    <Input disabled={true} value={orderInfo.prod_std}/>
                  </Col>
                  <Col span={6}>
                    <Label text='단위'/>
                    <Input disabled={true} value={orderInfo.unit_nm}/>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col span={12} style={{paddingRight:0}}>
              <Container>
                <Row gutter={[16,16]}>
                  <Col span={6} style={{marginBottom:16}}>
                    <Label text='설비'/>
                    <Input disabled={true} value={orderInfo.equip_nm}/>
                  </Col>
                  <Col span={6} style={{marginBottom:16}}>
                    <Label text='공정'/>
                    <Input disabled={true} value={orderInfo.proc_nm}/>
                  </Col>
                  <Col span={6} style={{marginBottom:16}}>
                    <Label text='작업교대'/>
                    <Input disabled={true} value={orderInfo.shift_nm}/>
                  </Col>
                  <Col span={6} style={{marginBottom:16}}>
                    <Label text='작업장'/>
                    <Input disabled={true} value={orderInfo.workings_nm}/>
                  </Col>
                  <Col span={24}>
                    <Label text='지시 비고'/>
                    <Input disabled={true} value={orderInfo.remark}/>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Col>

        {/* 실적 정보 */}
        <Col span={24} style={{paddingLeft:0, paddingRight:0}}>
          <Typography.Title level={5} style={{marginTop:30, marginBottom:-16, fontSize:14}}><CaretRightOutlined />실적 정보</Typography.Title>
          <div style={{width:'100%', display:'inline-block', marginTop:-26}}>
            <div style={{float:'right', paddingRight:4}}>
              <Space>
                <Button btnType='buttonFill' colorType='blue' widthSize='large' heightSize='small' fontSize='small' ImageType='add' onClick={onSaveWork}>실행 저장</Button>
                <Button btnType='buttonFill' colorType='red' widthSize='large' heightSize='small' fontSize='small' ImageType='ok' onClick={onCompleteWork}>작업 종료</Button>
              </Space>
            </div>
          </div>
          <Divider style={{marginTop:2, marginBottom:10}}/>
          <Row gutter={[16,16]}>
            <Col span={12} style={{paddingLeft:0}}>
              <Container>
                <Row gutter={[16,16]}>
                  <Col span={12} style={{marginBottom:16}}>
                    <Label text='시작 일시'/>
                    <div style={{width:'100%'}}>
                      <DatePicker picker='date' style={{width:'50%'}} value={workInfo._start_date} onChange={onChangeStartDate}/>
                      <DatePicker picker='time' style={{width:'50%'}} value={workInfo._start_time} onChange={onChangeStartTime}/>
                    </div>
                  </Col>
                  <Col span={12} style={{marginBottom:16}}>
                    <Label text='종료 일시'/>
                    <div style={{width:'100%'}}>
                      <DatePicker picker='date' style={{width:'50%'}} value={workInfo._end_date} onChange={onChangeEndDate}/>
                      <DatePicker picker='time' style={{width:'50%'}} value={workInfo._end_time} onChange={onChangeEndTime}/>
                    </div>
                  </Col>
                  <Col span={6}>
                    <Label text='입고 창고'/>
                    <Select options={cboWorkStoreOptions} style={{width:'100%'}} value={workInfo.to_store_uuid} onChange={onChangeCboStore}/>
                  </Col>
                  <Col span={6}>
                    <Label text='입고 위치'/>
                    <Select options={cboWorkLocationOptions} style={{width:'100%'}} value={workInfo.to_location_uuid} onChange={onChangeCboLocation}/>
                  </Col>
                  <Col span={6}>
                    <Label text='LOT NO'/>
                    <Input disabled={true} value={workInfo.lot_no}/>
                  </Col>
                  <Col span={6}>
                    <Label text='비고'/>
                    <Input value={workInfo.remark} onChange={onChangeRemark}/>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col span={12} style={{paddingRight:0}}>
              <Container>
                <Row gutter={[16,16]}>
                  <Col span={12} style={{marginBottom:16}}>
                    <Label text='지시 수량'/>
                    <Input type='number' inputMode='numeric' disabled={true} value={workInfo.order_qty}/>
                  </Col>
                  <Col span={12} style={{marginBottom:16}}>
                    <Label text='생산 수량'/>
                    <Input type='number' inputMode='numeric' disabled={true} value={workInfo.total_qty}/>
                  </Col>
                  <Col span={12}>
                    <Label text='양품 수량'/>
                    <Input type='number' inputMode='numeric' value={workInfo.qty}  onChange={onChangeQty}/>
                  </Col>
                  <Col span={12}>
                    <Label text='부적합 수량'/>
                    <Input type='number' inputMode='numeric' disabled={true} value={workInfo.reject_qty}/>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Col>
      </Row>

      <Typography.Title level={5} style={{marginTop:30, marginBottom:-16, fontSize:14}}><CaretRightOutlined />이력 항목관리</Typography.Title>
      <Divider style={{marginBottom:10}}/>
      <Tabs
        type='card'        
        panels={[
          {
            tab: '공정검사',
            tabKey: TAB_CODE.공정검사,
            content: 공정검사.component,
          },
          {
            tab: '투입품목 관리',
            tabKey: TAB_CODE.투입품목관리,
            content: 투입품목관리.component,
          },
          {
            tab: '투입인원 관리',
            tabKey: TAB_CODE.투입인원관리,
            content: 투입인원관리.component,
          },
          {
            tab: '부적합 관리',
            tabKey: TAB_CODE.부적합관리,
            content: 부적합관리.component,
          },
          {
            tab: '비가동 관리',
            tabKey: TAB_CODE.비가동관리,
            content: 비가동관리.component,
          },
          {
            tab: '공정순서',
            tabKey: TAB_CODE.공정순서,
            content: 공정순서.component,
          },
        ]}
      />

      <ProdOrderModal visible={prodOrderPopupVisible} onClose={onProdOrderClose}/>

      {contextHolder}
    </>
  );
  //#endregion
}
//#endregion


//#region 🔶✅작업지시관리 팝업 (지시/마감 처리)
/** 작업지시관리 팝업 (지시/마감 처리) */
const ProdOrderModal = ({visible, onClose}) => {
  //#region ✅설정값
  const gridRef = useRef<Grid>();
  const searchRef = useRef<FormikProps<FormikValues>>();

  const [data, setData] = useState([]);

  const searchParams = searchRef?.current?.values;

  const WORK_START_SAVE_URI_PATH = '/prd/works';
  const COMPLETE_SAVE_URI_PATH = '/prd/orders/complete';
  // const CANCEL_COMPLETE_SAVE_URI_PATH = '/prd/works/cancel-complete';
  

  // 마감작업 체크용
  const [completeChk, setCompleteChk] = useState<boolean>(false);
  //#endregion


  //#region ✅컬럼
  const PROD_ORDER_COLUMNS:IGridColumn[] = [
    {header:'작업지시UUID', name:'order_uuid', width:200, hidden:true, format:'text'},
    {header:'구분', name:'order_state', width:80, hidden:false, format:'text', align:'center'},
    {header:'작업시작', name:'_work_start', width:80, hidden:false, format:'check', editable:true},
    {header:'마감', name:'complete_fg', width:80, hidden:false, format:'check', editable:true},
    {header:'공정UUID', name:'proc_uuid', width:200, hidden:true, format:'text'},
    {header:'공정', name:'proc_nm', width:120, hidden:false, format:'text'},
    {header:'작업장UUID', name:'workings_uuid', width:200, hidden:true, format:'text'},
    {header:'작업장', name:'workings_nm', width:120, hidden:false, format:'text'},
    {header:'설비UUID', name:'equip_uuid', width:200, hidden:true, format:'text'},
    {header:'설비', name:'equip_nm', width:120, hidden:false, format:'text'},
    {header:'품목 유형UUID', name:'item_type_uuid', width:200, hidden:true, format:'text'},
    {header:'품목 유형', name:'item_type_nm', width:120, hidden:false, format:'text'},
    {header:'제품 유형UUID', name:'prod_type_uuid', width:200, hidden:true, format:'text'},
    {header:'제품 유형', name:'prod_type_nm', width:120, hidden:false, format:'text'},
    {header:'품목UUID', name:'prod_uuid', width:200, hidden:true, format:'text'},
    {header:'품번', name:'prod_no', width:120, hidden:false, format:'text'},
    {header:'품목', name:'prod_nm', width:120, hidden:false, format:'text'},
    {header:'모델UUID', name:'model_uuid', width:200, hidden:true, format:'text'},
    {header:'모델', name:'model_nm', width:120, hidden:false, format:'text'},
    {header:'Rev', name:'rev', width:100, hidden:false, format:'text'},
    {header:'규격', name:'prod_std', width:120, hidden:false, format:'text'},
    {header:'단위UUID', name:'unit_uuid', width:200, hidden:true, format:'text'},
    {header:'단위', name:'unit_nm', width:80, hidden:false, format:'text'},
    {header:'입고 창고UUID', name:'to_store_uuid', width:200, hidden:true, format:'text'},
    {header:'입고 창고', name:'to_store_nm', width:120, hidden:false, format:'text'},
    {header:'입고 위치UUID', name:'to_location_uuid', width:200, hidden:true, format:'text'},
    {header:'입고 위치', name:'to_location_nm', width:120, hidden:false, format:'text'},
    {header:'계획 수량', name:'plan_qty', width:200, hidden:true, format:'text'},
    {header:'지시 수량', name:'qty', width:100, hidden:false, format:'text'},
    {header:'지시 순번', name:'seq', width:200, hidden:true, format:'text'},
    {header:'작업교대UUID', name:'shift_uuid', width:200, hidden:true, format:'text'},
    {header:'작업교대명', name:'shift_nm', width:120, hidden:false, format:'text'},
    {header:'시작예정', name:'start_date', width:120, hidden:false, format:'date'},
    {header:'종료예정', name:'end_date', width:120, hidden:false, format:'date'},
    {header:'작업조UUID', name:'worker_group_uuid', width:200, hidden:true, format:'text'},
    {header:'작업조', name:'worker_group_nm', width:120, hidden:false, format:'text'},
    {header:'작업인원', name:'worker_cnt', width:100, hidden:false, format:'number'},
    {header:'수주UUID', name:'sal_order_uuid', width:200, hidden:true, format:'text'},
    {header:'수주상세UUID', name:'sal_order_detail_uuid', width:200, hidden:true, format:'text'},
    {header:'생산 진행여부', name:'work_fg', width:200, hidden:true, format:'text'},
    // {header:'마감 여부', name:'complete_fg', width:200, hidden:true, format:'text'},
    {header:'마감 일시', name:'complete_date', width:120, hidden:false, format:'datetime'},
    {header:'비고', name:'remark', width:150, hidden:false, format:'text'},
  ];
  //#endregion


  //#region ✅함수
  const onSearch = (values) => {
    const searchParams =
      values?.complete_fg === 'true' ?
        {
          order_state:'complete',
          start_date: values?.start_date,
          end_date: values?.end_date,
        }
      : 
        {
          order_state:'wait',
        }
    
    setCompleteChk(values?.complete_fg === 'true');

    getData(searchParams, '/prd/orders').then((res) => {
      setData(res);
    });
  }


  const onSave = () => {
    const updatedRows = gridRef?.current?.getInstance().getModifiedRows()?.updatedRows as any[];
    const start_date = getToday();
    const lot_no = start_date?.replace(/[^0-9]/g, '');
    const qty = 0;
    const reject_qty = 0;


    // 작업시작 처리
    const workStartList =
      updatedRows?.filter((el) => el?._work_start === true)?.map((el) => ({
        ...el,
        start_date,
        lot_no,
        qty,
        reject_qty
      }));

    const workSaveData = {
      createdRows: workStartList,
      updatedRows: undefined,
      deletedRows: undefined,
    }
    
    if (workStartList?.length > 0)
      saveGridData(
        workSaveData as any, 
        PROD_ORDER_COLUMNS, 
        WORK_START_SAVE_URI_PATH

      ).then(() => {
        gridRef?.current?.getInstance()?.clearModifiedData();

      }).catch((e) => console.log(e));


    // 마감 처리
    let completeChkList = [];
    if (searchParams?.complete_fg === 'true') {
      completeChkList = updatedRows?.map((el) => ({...el, uuid:el?.order_uuid, complete_date: start_date}));

    } else {
      completeChkList = updatedRows?.filter((el) => el?.complete_fg === true)?.map((el) => ({...el, uuid:el?.order_uuid, complete_date: start_date}));
    }
    
    const completeSaveData = {
      createdRows: undefined,
      updatedRows: completeChkList,
      deletedRows: undefined,
    }

    if (completeChkList?.length > 0)
      saveGridData(
        completeSaveData as any, 
        PROD_ORDER_COLUMNS, 
        COMPLETE_SAVE_URI_PATH

      ).then(() => {
        gridRef?.current?.getInstance()?.clearModifiedData();

      }).catch((e) => console.log(e));
  }
  //#endregion


  //#region ✅렌더부
  return (
    <Modal
      title='작업지시 관리'
      okText={null}
      cancelText={null}
      maskClosable={false}
      visible={visible}
      onCancel={onClose}
      onOk={onSave}
      width='80%'
    >
      <>
        <Searchbox
          id='PROD_ORDER_SEARCH'
          innerRef={searchRef}
          searchItems={[
            {type:'radio', id:'complete_fg', default:'false',
              options: [
                {code:'false', text:'작업대기'},
                {code:'true', text:'마감작업'},
              ],
            },
            {type:'date', id:'start_date', default:getToday(), label:'마감일', disabled:!completeChk},
            {type:'date', id:'end_date', default:getToday(), disabled:!completeChk},
          ]}
          onSearch={onSearch}
        />
        <Datagrid
          gridId='PROD_ORDER_GRID'
          ref={gridRef}
          gridMode='update'
          columns={PROD_ORDER_COLUMNS}
          columnOptions={{
            frozenCount: 3,
            frozenBorderWidth: 2,
          }}
          data={data}
        />
      </>
    </Modal>
  );
  //#endregion
}
//#endregion

