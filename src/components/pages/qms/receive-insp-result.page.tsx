import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import { Divider, Space, Typography, Modal, Col, Row, message } from 'antd';
import dayjs from 'dayjs';
import { FormikProps, FormikValues } from 'formik';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Container, Datagrid, getPopupForm, GridPopup, IGridColumn, ISearchItem, Searchbox } from '~/components/UI';
import { IInputGroupboxItem, InputGroupbox } from '~/components/UI/input-groupbox/input-groupbox.ui';
import { blankThenNull, executeData, getData, getInspCheckResultInfo, getInspCheckResultTotal, getInspCheckResultValue, getPageName, getPermissions, getToday, getUserFactoryUuid, isNumber } from '~/functions';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_ADM } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { cloneDeep } from 'lodash';

// 날짜 로케일 설정
dayjs.locale('ko-kr');

// moment 타입과 호환시키기 위한 행위
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);


//#region ✅입하정보 관련 상태 값
const URI_PATH_GET_QMS_RECEIVE_INSP_RESULTS = '/qms/receive/insp-results';
const URI_PATH_GET_QMS_RECEIVE_INSP_RESULTS_WAITING = '/qms/receive/insp-results/waiting';
const URI_PATH_GET_QMS_RECEIVE_INSP_RESULT_INCLUDE_DETAILS = '/qms/receive/insp-result/{uuid}/include-details';
const URI_PATH_POST_QMS_RECEIVE_INSP_RESULTS = '/qms/receive/insp-results';
const URI_PATH_PUT_QMS_RECEIVE_INSP_RESULTS = '/qms/receive/insp-results';
const URI_PATH_DELETE_QMS_RECEIVE_INSP_RESULT = '/qms/receive/insp-results';

type TReceiveInspHeader = {
  insp_uuid?: string,
  factory_uuid?: string,
  factory_cd?: string,
  factory_nm?: string,
  insp_type_cd?: string,
  insp_type_nm?: string,
  insp_no?: string,
  prod_uuid?: string,
  prod_no?: string,
  prod_nm?: string,
  item_type_uuid?: string,
  item_type_cd?: string,
  item_type_nm?: string,
  prod_type_uuid?: string,
  prod_type_cd?: string,
  prod_type_nm?: string,
  model_uuid?: string,
  model_cd?: string,
  model_nm?: string,
  rev?: string,
  prod_std?: string,
  unit_uuid?: string,
  unit_cd?: string,
  unit_nm?: string,
  reg_date?: string,
  apply_date?: string,
  apply_fg?: boolean,
  contents?: string,
  max_sample_cnt?: number,
  remark?: string,
}

type TReceiveInspDetail = {
  insp_detail_uuid?: string,
  insp_uuid?: string,
  seq?: number,
  insp_no?: string,
  insp_no_sub?: string,
  factory_uuid?: string,
  factory_cd?: string,
  factory_nm?: string,
  insp_item_uuid?: string,
  insp_item_cd?: string,
  insp_item_nm?: string,
  insp_item_type_uuid?: string,
  insp_item_type_cd?: string,
  insp_item_type_nm?: string,
  insp_item_desc?: string,
  spec_std?: string,
  spec_min?: number,
  spec_max?: number,
  insp_method_uuid?: string,
  insp_method_cd?: string,
  insp_method_nm?: string,
  insp_tool_uuid?: string,
  insp_tool_cd?: string,
  insp_tool_nm?: string,
  sortby?: number,
  position_no?: number,
  special_property?: string,
  sample_cnt?: number,
  insp_cycle?: string,
  remark?: string,
}

type TReceiveDetail = {
  receive_detail_uuid?: string,
  receive_uuid?: string,
  seq?: number,
  stmt_no?: string,
  stmt_no_sub?: string,
  reg_date?: string,
  insp_detail_type_cd?: string,
  insp_detail_type_nm?: string,
  factory_uuid?: string,
  factory_cd?: string,
  factory_nm?: string,
  order_detail_uuid?: string,
  prod_uuid?: string,
  prod_no?: string,
  prod_nm?: string,
  item_type_uuid?: string,
  item_type_cd?: string,
  item_type_nm?: string,
  prod_type_uuid?: string,
  prod_type_cd?: string,
  prod_type_nm?: string,
  model_uuid?: string,
  model_cd?: string,
  model_nm?: string,
  rev?: string,
  prod_std?: string,
  unit_uuid?: string,
  unit_cd?: string,
  unit_nm?: string,
  lot_no?: string,
  order_qty?: number,
  qty?: number,
  price?: number,
  money_unit_uuid?: string,
  money_unit_cd?: string,
  money_unit_nm?: string,
  exchange?: string,
  total_price?: number,
  unit_qty?: number,
  insp_fg?: boolean,
  insp_result?: string,
  carry_fg?: boolean,
  to_store_uuid?: string,
  to_store_cd?: string,
  to_store_nm?: string,
  to_location_uuid?: string,
  to_location_cd?: string,
  to_location_nm?: string,
  remark?: string,
  barcode?: string
}
//#endregion

//#region 🔶🚫수입검사 성적서
/** 입하이력 */
export const PgQmsReceiveInspResult = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region ✅설정값
  const [modal, contextHolder] = Modal.useModal();

  const [workDatas, setWorkDatas] = useState([]);

  const searchRef = useRef<FormikProps<FormikValues>>();
  const gridRef = useRef<Grid>();

  const [inspResultUuid, setInspResultUuid] = useState('');
  const [inspDetailType, setInspDetailType] = useState([]);

  // 데이터 추가 팝업 관련
  const [createPopupVisible, setCreatePopupVisible] = useState(false);
  //#endregion

  const INPUT_ITEMS_RECIEVE:IInputGroupboxItem[] = [
    {id:'partner_nm', label:'거래처', type:'text', disabled:true},
    {id:'receive_date', label:'입하일', type:'date', disabled:true},
    {id:'receive_type', label:'입하구분', type:'text', disabled:true},
    {id:'prod_no', label:'품번', type:'text', disabled:true},
    {id:'prod_nm', label:'품명', type:'text', disabled:true},
    {id:'prod_std', label:'규격', type:'text', disabled:true},
    {id:'unit_nm', label:'단위', type:'text', disabled:true},
    {id:'lot_no', label:'LOT NO', type:'text', disabled:true},
    {id:'receive_qty', label:'입하수량', type:'number', disabled:true},
  ];

  const inputReceive = useInputGroup('INPUT_ITEMS_WORK', INPUT_ITEMS_RECIEVE);

  //#region ✅조회조건
  const SEARCH_ITEMS:ISearchItem[] = [
    {type:'date', id:'start_date', label:'검사일', default:getToday(-7)},
    {type:'date', id:'end_date', default:getToday()},
    {type:'combo', id:'insp_detail_type', firstItemType:'all', default:'all',
      options:inspDetailType
    },
  ];
  //#endregion

  //#region ✅컬럼
  const COLUMNS:IGridColumn[] = [
    {header:'성적서UUID', name:'insp_result_uuid', alias:'uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'판정', name:'insp_result_state', width:ENUM_WIDTH.S, filter:'text', align:'center'},
    {header:'세부검사유형코드', name:'insp_detail_type_cd', width:ENUM_WIDTH.M, filter:'text', hidden:true},
    {header:'세부검사유형', name:'insp_detail_type_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header:'처리결과', name:'insp_handling_type_nm', width:ENUM_WIDTH.M, filter:'text'},
    {header:'세부입하UUID', name:'receive_detail_uuid', alias:'uuid', width:ENUM_WIDTH.L, hidden:true},
    {header:'거래처명', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'입하일자', name:'receive_date', format:'date', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품목유형명', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'제품유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품목명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text'},
    {header:'모델명', name:'model_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'단위명', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
    {header:'LOT NO', name:'lot_no', width:ENUM_WIDTH.M, filter:'text'},
    {header:'검사 수량', name:'insp_qty', width:ENUM_WIDTH.M, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header:'합격 수량', name:'pass_qty', width:ENUM_WIDTH.M, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header:'부적합 수량', name:'reject_qty', width:ENUM_WIDTH.M, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header:'입고 창고UUID', name:'to_store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'입고 창고', name:'to_store_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'입고 위치UUID', name:'to_location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'입고 위치', name:'to_location_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'부적합 창고UUID', name:'reject_store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'부적합 창고', name:'reject_store_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'부적합 위치UUID', name:'reject_location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'부적합 위치', name:'reject_location_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text'},
    {header:'바코드', name:'remark', width:ENUM_WIDTH.XL, filter:'text', hidden:true},
  ];
  //#endregion
  
  //#region 함수
  const onSearch = () => {
    const {values} = searchRef?.current;
    const searchParams = cloneDeep(values);
    if (searchParams.insp_detail_type !== 'all'){
      searchParams.insp_detail_type_uuid = searchParams.insp_detail_type
    }
    delete searchParams.insp_detail_type
    getData(searchParams, URI_PATH_GET_QMS_RECEIVE_INSP_RESULTS).then((res) => {
      setWorkDatas(res || []);
      // 입하정보 및 실적정보 초기화
      inputReceive.ref.current.resetForm();
      setInspResultUuid('')
    });
  }

  const onCreate = (ev) => {
    setCreatePopupVisible(true); 
  }
  //#endregion

  useLayoutEffect(()=>{
    const _inspDetailType:object[] = []
    getData({insp_type_cd:'RECEIVE_INSP'},URL_PATH_ADM.INSP_DETAIL_TYPE.GET.INSP_DETAIL_TYPES,'raws').then(async (res)=>{
      res.map((item) => {
        _inspDetailType.push({code: item.insp_detail_type_uuid, text: item.insp_detail_type_nm})
      })
      setInspDetailType(_inspDetailType)
    })
  },[])

  //#region 렌더부
  return (
    <>
      <Typography.Title level={5} style={{marginBottom:-16, fontSize:14}}><CaretRightOutlined />수입검사 이력</Typography.Title>
      <Divider style={{marginBottom:10}}/>
      <Container>
        <div style={{width:'100%', display:'inline-block'}}>
          <Space size={[6,0]} style={{float:'right', marginTop:-70}}>
            <Button btnType='buttonFill' widthSize='auto' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onCreate} disabled={!permissions?.create_fg}>신규 추가</Button>
          </Space>
        </div>
        <div style={{maxWidth:700, marginTop:-20, marginLeft:-6}}>
          <Searchbox
            id='receive_insp_result_search'
            innerRef={searchRef}
            searchItems={SEARCH_ITEMS}
            onSearch={onSearch}
            boxShadow={false}
          />
        </div>
        <Datagrid
          gridId={'RECEIVE_GRID'}
          ref={gridRef}
          gridMode={'select'}
          columns={COLUMNS}
          height={300}
          data={workDatas}
          onAfterClick={(ev) => {
            const {rowKey, targetType} = ev;
        
            if (targetType === 'cell') {
              try {
                const row = ev?.instance?.store?.data?.rawData[rowKey];
                inputReceive.setValues({...row, receive_type: row?.insp_detail_type_nm, receive_qty: row?.insp_qty});
                //#region 하위 데이터들 조회
                setInspResultUuid(row?.insp_result_uuid)
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
        {/* 입하정보 */}
        <Col span={24} style={{paddingLeft:0, paddingRight:0}}>
          <Typography.Title level={5} style={{marginTop:30, marginBottom:-16, fontSize:14}}><CaretRightOutlined />입하정보</Typography.Title>
          <div style={{width:'100%', display:'inline-block', marginTop:-26}}> </div>
          <Divider style={{marginTop:2, marginBottom:10}}/>
          <Row gutter={[16,16]}>
            <InputGroupbox {...inputReceive.props} />
          </Row>
        </Col>
      </Row>
      <Typography.Title level={5} style={{marginTop:30, marginBottom:-16, fontSize:14}}><CaretRightOutlined />검사정보</Typography.Title>
      <Divider style={{marginBottom:10}}/>
      {/* {INSP_RESULT_DETAIL.component} */}
      <INSP_RESULT_DETAIL_GRID inspResultUuid={inspResultUuid} onSearchResults={onSearch} />
      <INSP_RESULT_CREATE_POPUP popupVisible={createPopupVisible} setPopupVisible={setCreatePopupVisible} onAfterCloseSearch={onSearch} />

      {contextHolder}
    </>
  );
  //#endregion
}
//#endregion

//#region 수입검사 결과
const INSP_RESULT_DETAIL_GRID = (props:{
  inspResultUuid:string,
  onSearchResults: () => void
}) => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region Ref 관리
  const gridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리 
  const [editPopupVisible, setEditPopupVisible] = useState(false)
  //#endregion

  //#region 데이터 관리
  const [receiveInspHeaderData, setReceiveInspHeaderData] = useState<TReceiveInspHeader>({});
  const [receiveInspDetailData, setReceiveInspDetailData] = useState<TReceiveInspDetail[]>([]);
  //#endregion

  //#region 그리드 컬럼세팅
  const INSP_DETAIL_COLUMNS:IGridColumn[] = [
    {header:'검사기준서 상세UUID', name:'insp_detail_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사항목 유형UUID', name:'insp_item_type_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사항목 유형명', name:'insp_item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'검사항목UUID', name:'insp_item_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사항목명', name:'insp_item_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'검사 기준', name:'spec_std', width:ENUM_WIDTH.L, filter:'text'},
    {header:'최소 값', name:'spec_min', width:ENUM_WIDTH.M, filter:'text'},
    {header:'최대 값', name:'spec_max', width:ENUM_WIDTH.M, filter:'text'},
    {header:'검사방법UUID', name:'insp_method_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사방법명', name:'insp_method_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'검사구UUID', name:'insp_tool_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사구명', name:'insp_tool_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'정렬', name:'sortby', width:ENUM_WIDTH.S, filter:'text', hidden:true},
    {header:'시료 수량', name:'sample_cnt', width:ENUM_WIDTH.M, filter:'text'},
    {header:'검사 주기', name:'insp_cycle', width:ENUM_WIDTH.M, filter:'text'},
  ];
  
  const CREATE_POPUP_DETAIL_COLUMNS = useMemo(() => {
      let items:IGridColumn[] = INSP_DETAIL_COLUMNS;

      if (receiveInspHeaderData?.max_sample_cnt > 0) {
        //시료수 최대값에 따라 컬럼 생성
        for (let i = 1; i <= receiveInspHeaderData?.max_sample_cnt; i++) {
          items.push({header:'x'+i+'_insp_result_detail_value_uuid', name:'x'+i+'_insp_result_detail_value_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true});
          items.push({header:'x'+i+'_sample_no', name:'x'+i+'_sample_no', width:ENUM_WIDTH.M, filter:'text', hidden:true});
          items.push({header:'x'+i, name:'x'+i+'_insp_value', width:ENUM_WIDTH.L, filter:'text', editable:true});
          items.push({header:'x'+i+'_판정', name:'x'+i+'_insp_result_fg', width:ENUM_WIDTH.M, filter:'text', hidden:true});
          items.push({header:'x'+i+'_판정', name:'x'+i+'_insp_result_state', width:ENUM_WIDTH.M, filter:'text', hidden:true});
        }
      }
      
      items.push({header:'합격여부', name:'insp_result_fg', width:ENUM_WIDTH.M, filter:'text', hidden:true})
      items.push({header:'판정', name:'insp_result_state', width:ENUM_WIDTH.M, filter:'text'})
      items.push({header:'비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text'})
      
      return items;
      
  }, [receiveInspHeaderData]);
  //#endregion

  //#region inputbox 세팅
  const INPUT_ITEMS_INSP_RESULT:IInputGroupboxItem[] = [
    {id:'insp_result_state', label:'최종판정', type:'text', disabled:true},
    {id:'reg_date', label:'검사일', type:'date', disabled:true, required:true },
    {id:'reg_date_time', label:'검사시간', type:'time', disabled:true, required:true },
    {id:'emp_nm', label:'검사자', type:'text', disabled:true, required:true}, 
    {id:'insp_handling_type_nm', label:'처리결과', type:'text', disabled:true},
    {id:'remark', label:'비고', type:'text', disabled:true},
  ];

  const INPUT_ITEMS_INSP_RESULT_INCOME:IInputGroupboxItem[] = [
    {id:'pass_qty', label:'입고수량', type:'number', disabled:true},
    {id:'to_store_nm', label:'입고창고', type:'text', disabled:true},
    {id:'to_location_nm', label:'입고위치', type:'text', disabled:true},
  ];

  const INPUT_ITEMS_INSP_RESULT_RETURN:IInputGroupboxItem[] = [
    {id:'reject_qty', label:'부적합수량', type:'number', disabled:true},
    {id:'reject_nm', label:'불량유형', type:'text', disabled:true}, 
    {id:'reject_store_nm', label:'반출창고', type:'text', disabled:true},
    {id:'reject_location_nm', label:'반출위치', type:'text', disabled:true},
  ];

  const inputInspResult = useInputGroup('INPUT_INSP_RESULT', INPUT_ITEMS_INSP_RESULT, {title:'검사정보',});
  const inputInspResultIncome = useInputGroup('INPUT_INSP_RESULT_INCOME', INPUT_ITEMS_INSP_RESULT_INCOME, {title:'입고정보',});
  const inputInspResultReject = useInputGroup('INPUT_INSP_RESULT_REJECT', INPUT_ITEMS_INSP_RESULT_RETURN, {title:'부적합정보',});
  //#endregion

  //#region 함수 
  const onEdit = (ev) => {
    if(!props.inspResultUuid){
      message.warning('수정 할 성적서를 선택 후 수정기능을 이용해주세요.')
      return;
    }
    setEditPopupVisible(true);
  }

  const onDelete = async (ev) => {
    
    if(!props.inspResultUuid){
      message.warn('삭제 할 성적서를 선택 후 다시 시도해주세요..')
      return;
    }
    
    Modal.confirm({
      icon: null,
      title: '삭제',
      // icon: <ExclamationCircleOutlined />,
      content: '성적서를 삭제하시겠습니까?',
      onOk: async () => {
        await executeData(
          [{
            uuid: props.inspResultUuid,
            insp_detail_type_uuid: (receiveInspHeaderData as any)?.insp_detail_type_uuid,
          }], 
          URI_PATH_DELETE_QMS_RECEIVE_INSP_RESULT, 
          'delete', 
          'success'
        ).then((value) => {
          if (!value) return;
          onClear();
          props.onSearchResults();
          message.info('저장되었습니다.');
        }).catch(e => {console.log(e)});
      },
      onCancel: () => {},
      okText: '예',
      cancelText: '아니오',
    });
  }

  const onClear = () => {
    inputInspResult.ref.current.resetForm();
    inputInspResultIncome.ref.current.resetForm();
    inputInspResultReject.ref.current.resetForm();
    setReceiveInspHeaderData({});
    setReceiveInspDetailData([]);
  }

  const onSesrchInspResultDetail = (insp_result_uuid) => {
    const searchUriPath = URI_PATH_GET_QMS_RECEIVE_INSP_RESULT_INCLUDE_DETAILS.replace('{uuid}', insp_result_uuid)
    getData(
      {},
      searchUriPath,
      'header-details'
    ).then((res) => {
      setReceiveInspHeaderData(res.header);
      setReceiveInspDetailData(res.details);
      inputInspResult.setValues({...res.header, reg_date_time:res.header.reg_date});
      inputInspResultIncome.setValues({...res.header, qty:res.header.pass_qty});
      inputInspResultReject.setValues({...res.header});
    }).catch((err) => {
      onClear();
      message.error('에러');
    });
  }
  //#endregion

  //#region Hook 함수
  useLayoutEffect(() => {
    if (props.inspResultUuid) {
      onSesrchInspResultDetail(props.inspResultUuid)
    } else {
      onClear();
    }
  }, [props.inspResultUuid]);
  //#endregion

  //#region 렌더부
  return (
    <>
      <Container>
        <div style={{width:'100%', display:'inline-block'}}>
          <Space size={[6,0]} style={{float:'right', marginTop:-70}}>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onEdit} disabled={!permissions?.update_fg}>수정</Button>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='red' onClick={onDelete} disabled={!permissions?.delete_fg}>삭제</Button>
          </Space>
        </div>
        <Row gutter={[16,0]} style={{minHeight:550, maxHeight:700, marginTop:-15}}>
          <Col span={24} style={{minHeight:550, maxHeight:700, overflow:'auto'}}>
            <InputGroupbox boxShadow={false} {...inputInspResult.props} />
            <InputGroupbox boxShadow={false} {...inputInspResultIncome.props}/>
            <InputGroupbox boxShadow={false} {...inputInspResultReject.props}/>
            <p/>
            <Datagrid 
              height={250}
              gridId={'DETAIL_GRID'}
              ref={gridRef}
              gridMode={'view'}
              columns={CREATE_POPUP_DETAIL_COLUMNS}
              data={receiveInspDetailData}
            />
          </Col>
        </Row>
      </Container>
      <INSP_RESULT_EDIT_POPUP 
        inspResultUuid={props.inspResultUuid} 
        popupVisible={editPopupVisible} 
        setPopupVisible={setEditPopupVisible} 
        onAfterCloseSearch={onSesrchInspResultDetail}
      />
    </>
  );
  //#endregion
};
//#endregion

//#region 성적서 신규 팝업
export const INSP_RESULT_CREATE_POPUP = (props:{
  popupVisible:boolean,
  setPopupVisible: (value?) => void
  onAfterCloseSearch?: () => void
}) =>{
  //#region Ref 관리
  const gridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리 
  const [changeIncomeQtyFg, setChangeIncomeQtyFg] = useState(false);
  const [changeRejectQtyFg, setChangeRejectQtyFg] = useState(false);
  //#endregion

  //#region 데이터 관리
  const [receiveInputData, setReceiveInputData] = useState<TReceiveDetail>({});
  const [receiveInspHeaderData, setReceiveInspHeaderData] = useState<TReceiveInspHeader>({});
  const [receiveInspDetailData, setReceiveInspDetailData] = useState<TReceiveInspDetail[]>([]);

  const [inspHandlingType, setInspHandlingType] = useState([])
  //#endregion

  //#region 그리드 컬럼세팅
  const RECEIVE_POPUP_COLUMNS:IGridColumn[] = [
    {header:'세부입하UUID', name:'receive_detail_uuid', width:ENUM_WIDTH.L, hidden:true},
    {header:'세부입하전표번호', name:'stmt_no_sub', width:ENUM_WIDTH.L, hidden:true},
    {header:'입하구분코드', name:'insp_detail_type_uuid', width:ENUM_WIDTH.M, hidden:true},
    {header:'입하구분', name:'insp_detail_type_nm', width:ENUM_WIDTH.M},
    {header:'입하일자', name:'reg_date', width:ENUM_WIDTH.M, format:'date', filter:'text'},
    {header:'거래처명', name:'partner_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품목유형명', name:'item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'제품유형명', name:'prod_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품번', name:'prod_no', width:ENUM_WIDTH.L, filter:'text'},
    {header:'품목명', name:'prod_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'Rev', name:'rev', width:ENUM_WIDTH.S, filter:'text'},
    {header:'모델명', name:'model_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'단위명', name:'unit_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'규격', name:'prod_std', width:ENUM_WIDTH.L, filter:'text'},
    {header:'LOT NO', name:'lot_no', width:ENUM_WIDTH.L, filter:'text'},
    {header:'입하 수량', name:'qty', width:ENUM_WIDTH.M, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header:'안전재고', name:'inv_safe_qty', width:ENUM_WIDTH.M, filter:'number', format:'number', decimal:ENUM_DECIMAL.DEC_STCOK},
    {header:'입고 창고UUID', name:'to_store_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'입고 창고', name:'to_store_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'입고 위치UUID', name:'to_location_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'입고 위치', name:'to_location_nm', width:ENUM_WIDTH.L, filter:'text'},
  ];

  const INSP_DETAIL_COLUMNS:IGridColumn[] = [
    {header:'검사기준서 상세UUID', name:'insp_detail_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사항목 유형UUID', name:'insp_item_type_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사항목 유형명', name:'insp_item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'검사항목UUID', name:'insp_item_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사항목명', name:'insp_item_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'검사 기준', name:'spec_std', width:ENUM_WIDTH.L, filter:'text'},
    {header:'최소 값', name:'spec_min', width:ENUM_WIDTH.M, filter:'text'},
    {header:'최대 값', name:'spec_max', width:ENUM_WIDTH.M, filter:'text'},
    {header:'검사방법UUID', name:'insp_method_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사방법명', name:'insp_method_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'검사구UUID', name:'insp_tool_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사구명', name:'insp_tool_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'정렬', name:'sortby', width:ENUM_WIDTH.S, filter:'text', hidden:true},
    {header:'시료 수량', name:'sample_cnt', width:ENUM_WIDTH.M, filter:'text'},
    {header:'검사 주기', name:'insp_cycle', width:ENUM_WIDTH.M, filter:'text'},
  ];
  
  const CREATE_POPUP_DETAIL_COLUMNS = useMemo(() => {
      let items:IGridColumn[] = INSP_DETAIL_COLUMNS;

      if (receiveInspHeaderData?.max_sample_cnt > 0) {
        //시료수 최대값에 따라 컬럼 생성
        for (let i = 1; i <= receiveInspHeaderData?.max_sample_cnt; i++) {
          items.push({header:'x'+i+'_insp_result_detail_value_uuid', name:'x'+i+'_insp_result_detail_value_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true});
          items.push({header:'x'+i+'_sample_no', name:'x'+i+'_sample_no', width:ENUM_WIDTH.M, filter:'text', hidden:true});
          items.push({header:'x'+i, name:'x'+i+'_insp_value', width:ENUM_WIDTH.L, filter:'text', editable:true});
          items.push({header:'x'+i+'_판정', name:'x'+i+'_insp_result_fg', width:ENUM_WIDTH.M, filter:'text', hidden:true});
          items.push({header:'x'+i+'_판정', name:'x'+i+'_insp_result_state', width:ENUM_WIDTH.M, filter:'text', hidden:true});
        }
      }
      
      items.push({header:'합격여부', name:'insp_result_fg', width:ENUM_WIDTH.M, filter:'text', hidden:true})
      items.push({header:'판정', name:'insp_result_state', width:ENUM_WIDTH.M, filter:'text'})
      items.push({header:'비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text'})
      
      return items;
      
  }, [receiveInspHeaderData]);
  //#endregion

  //#region inputbox 세팅
  const INFO_INPUT_ITEMS:IInputGroupboxItem[] = [
    {id:'receive_detail_uuid', label:'입하상세UUID', type:'text', disabled:true, hidden:true},
    {
      id:'stmt_no_sub', label:'세부입하전표번호', type:'text', readOnly:true, usePopup:true, 
      popupKeys:[
        'receive_detail_uuid', 
        'stmt_no_sub', 
        'partner_nm', 
        'reg_date', 
        'to_store_uuid',
        'insp_type_uuid', 
        'insp_detail_type_uuid', 
        'insp_detail_type_cd', 
        'insp_detail_type_nm', 
        'prod_uuid', 
        'prod_no', 
        'prod_nm', 
        'prod_std', 
        'unit_uuid', 
        'unit_nm', 
        'lot_no', 
        'qty'],
      popupButtonSettings:{
        dataApiSettings:{uriPath:URI_PATH_GET_QMS_RECEIVE_INSP_RESULTS_WAITING}, 
        datagridSettings:{gridId:null, columns:RECEIVE_POPUP_COLUMNS},
        modalSettings:{title:'입하전표 선택'}
      },
      handleChange: (values) => {setReceiveInputData(values);}
    },
    {id:'partner_nm', label:'거래처', type:'text', disabled:true},
    {id:'reg_date', label:'입하일', type:'date', disabled:true},
    {id:'insp_detail_type_cd', label:'입하구분코드', type:'text', hidden:true},
    {id:'insp_detail_type_nm', label:'입하구분', type:'text', disabled:true},
    {id:'prod_uuid', label:'품목UUID', type:'text', hidden:true},
    {id:'prod_no', label:'품번', type:'text', disabled:true},
    {id:'prod_nm', label:'품명', type:'text', disabled:true},
    {id:'prod_std', label:'규격', type:'text', disabled:true},
    {id:'unit_uuid', label:'단위UUID', type:'text', disabled:true, hidden:true},
    {id:'unit_nm', label:'단위', type:'text', disabled:true},
    {id:'lot_no', label:'LOT NO', type:'text', disabled:true},
    {id:'qty', label:'입하수량', type:'number', disabled:true},
  ];

  const INPUT_ITEMS_INSP_RESULT:IInputGroupboxItem[] = [
    {id:'insp_uuid', label:'검사기준서UUID', type:'text', disabled:true, hidden:true},
    {id:'insp_result_fg', label:'최종판정', type:'text', disabled:true, hidden:true },
    {id:'insp_result_state', label:'최종판정', type:'text', disabled:true},
    {id:'reg_date', label:'검사일자', type:'date', default:getToday() },
    {id:'reg_date_time', label:'검사시간', type:'time'},
    {id:'emp_uuid', label:'검사자UUID', type:'text', hidden:true},
    {id:'emp_nm', label:'검사자', type:'text', usePopup:true, popupKey:'사원관리', popupKeys:['emp_nm', 'emp_uuid'], params:{emp_status:'incumbent'}}, 
    {
      id:'insp_handling_type', 
      label:'처리결과', 
      type:'combo', 
      firstItemType:'empty',
      options:inspHandlingType,
      disabled:false,
      onAfterChange: (ev) => {}
    },
    {id:'remark', label:'비고', type:'text'},
  ];

  const INPUT_ITEMS_INSP_RESULT_INCOME:IInputGroupboxItem[] = [
    {
      id:'qty', 
      label:'입고수량', 
      type:'number', 
      disabled:true,
      onAfterChange:()=>{
        setChangeIncomeQtyFg(true)
      }
    },
    {
      id:'to_store_uuid', 
      label:'입고창고', 
      type:'combo',
      firstItemType:'empty',
      dataSettingOptions:{
        codeName:'store_uuid',
        textName:'store_nm',
        uriPath:getPopupForm('창고관리')?.uriPath,
        params:{
          store_type: 'available',
        }
      },
      onAfterChange: (ev) => {}
    },
      {
        id:'to_location_uuid', 
      label:'입고위치', 
      type:'combo',
      firstItemType:'empty',
      dataSettingOptions:{
        codeName:'location_uuid',
        textName:'location_nm',
        uriPath:getPopupForm('위치관리')?.uriPath,
      },
      onAfterChange: (ev) => {}
    },
  ];

  const INPUT_ITEMS_INSP_RESULT_RETURN:IInputGroupboxItem[] = [
    {
      id:'reject_qty', 
      label:'부적합수량', 
      type:'number', 
      disabled:true,
      onAfterChange:()=>{setChangeRejectQtyFg(true)}
    },
    {id:'reject_uuid', label:'불량유형UUID', type:'text', hidden:true},
    {id:'reject_nm', label:'불량유형', type:'text', usePopup:true, popupKey:'부적합관리', popupKeys:['reject_nm', 'reject_uuid']}, 
    {
      id:'reject_store_uuid', 
      label:'반출창고', 
      type:'combo',
      firstItemType:'empty',
      dataSettingOptions:{
        codeName:'store_uuid',
        textName:'store_nm',
        uriPath:getPopupForm('창고관리')?.uriPath,
        params:{
          store_type: 'return',
        }
      }
    },
    {
      id:'reject_location_uuid', 
      label:'반출위치', 
      type:'combo',
      firstItemType:'empty',
      dataSettingOptions:{
        codeName:'location_uuid',
        textName:'location_nm',
        uriPath:getPopupForm('위치관리')?.uriPath,
      },
      onAfterChange: (ev) => {}
    }
  ];

  const inputInputItems = useInputGroup('INPUT_CREATE_POPUP_INFO', INFO_INPUT_ITEMS, {title:'입하정보',});
  const inputInspResult = useInputGroup('INPUT_CREATE_POPUP_INSP_RESULT', INPUT_ITEMS_INSP_RESULT, {title:'검사정보',});
  const inputInspResultIncome = useInputGroup('INPUT_CREATE_POPUP_INSP_RESULT_INCOME', INPUT_ITEMS_INSP_RESULT_INCOME, {title:'입고정보',});
  const inputInspResultReject = useInputGroup('INPUT_CREATE_POPUP_INSP_RESULT_REJECT', INPUT_ITEMS_INSP_RESULT_RETURN, {title:'부적합정보',});
  //#endregion

  //#region 함수 
  const onClear = () => {
    inputInputItems.ref.current.resetForm();
    inputInspResult.ref.current.resetForm();
    inputInspResultIncome.ref.current.resetForm();
    inputInspResultReject.ref.current.resetForm();
    setReceiveInspHeaderData({});
    setReceiveInspDetailData([]);
  };

  const changeInspResult=(inspResult?:string)=>{
    let incomeDisabled:boolean=true;
    let rejectDisabled:boolean=true;
    let qtyDisabled:boolean=true;
    if(inspResult){
      if(['INCOME','SELECTION'].includes(inspResult)){
        incomeDisabled = false
      };
      if(['RETURN','SELECTION'].includes(inspResult)){
        rejectDisabled = false
      };
    }
    
    if(incomeDisabled){
      inputInspResultIncome.setFieldValue('qty',0)
    }
    if(rejectDisabled){
      inputInspResultReject.setFieldValue('reject_qty',0)
    }

    if(!incomeDisabled){
      inputInspResultIncome.setFieldValue('qty',receiveInputData?.qty)
      inputInspResultReject.setFieldValue('reject_qty',0)
    }else if(!rejectDisabled){
      inputInspResultReject.setFieldValue('reject_qty',receiveInputData?.qty)
    }

    if(inspResult==='SELECTION'){
      qtyDisabled=false 
    }

    inputInspResultIncome.setFieldDisabled({qty:qtyDisabled, to_store_uuid:incomeDisabled, to_location_uuid:incomeDisabled});
    inputInspResultReject.setFieldDisabled({reject_qty:qtyDisabled, reject_nm:rejectDisabled, reject_store_uuid:rejectDisabled, reject_location_uuid:rejectDisabled});
  };
  
  const onAfterChange = (ev:any) => {
    const {origin, changes, instance} = ev;
    if (changes.length===0) return;
    
    const {columnName, rowKey, value} = changes[0];
    
    if ((!['cell', 'delete', 'paste'].includes(origin))  || !columnName?.includes('_insp_value')) return;
    
    const {rawData} = instance?.store?.data;
    const rowData = rawData[rowKey];

    const specMin = rowData?.spec_min;
    const specMax = rowData?.spec_max;

    let sampleCnt:any = rowData?.sample_cnt; //입력 가능한 시료수
    let nullFg:boolean = true;
    let resultFg:boolean = true;
    let emptyFg:boolean;

    const popupGridInstance = gridRef.current?.getInstance();
    
    //#region ✅CELL단위 합/불 판정
    [nullFg, resultFg] = getInspCheckResultValue(value, {specMin, specMax});
    
    const cellFlagColumnName = String(columnName)?.replace('_insp_value', '_insp_result_fg');
    const cellStateColumnName = String(columnName)?.replace('_insp_value', '_insp_result_state');
    const cellFlagResultValue = nullFg ? null : resultFg;
    const cellStateResultValue = nullFg ? '' : resultFg ? '합격' : '불합격';

    if (!isNumber(specMin) && !isNumber(specMax)) {
      if (resultFg === true ) {
        popupGridInstance?.setValue(rowKey, columnName, 'OK');  
      } else if (resultFg === false ) {
        popupGridInstance?.setValue(rowKey, columnName, 'NG');  
      }
    }
    popupGridInstance?.setValue(rowKey, cellFlagColumnName, cellFlagResultValue);
    popupGridInstance?.setValue(rowKey, cellStateColumnName, cellStateResultValue); 
    //#endregion
    
    //#region ✅ROW단위 합/불 판정
    if (resultFg === true) { // 현재 값이 합격일 경우만 다른 cell의 판정값 체크
      [nullFg, resultFg] = getInspCheckResultInfo(rowData, rowKey, {maxCnt: sampleCnt});
    }
    
    const rowFlagColumnName = 'insp_result_fg';
    const rowStateColumnName = 'insp_result_state';
    const rowFlagResultValue = nullFg ? null : resultFg;
    const rowStateResultValue = nullFg ? '' : resultFg ? '합격' : '불합격';
    
    popupGridInstance?.setValue(rowKey, rowFlagColumnName, rowFlagResultValue);
    popupGridInstance?.setValue(rowKey, rowStateColumnName, rowStateResultValue);
    //#endregion

    //#region ✅최종 합/불 판정
    const maxRowCnt = popupGridInstance?.getRowCount() - 1;
    if (resultFg === true){
      [nullFg, resultFg, emptyFg] = getInspCheckResultTotal(rawData, maxRowCnt);
    } else {
      [nullFg, resultFg, emptyFg] = [false, false, false]
    }
    
    const flagInputboxName = rowFlagColumnName;
    const stateInputboxName = rowStateColumnName;
    // const flagInputboxValue = emptyFg || nullFg ? null : resultFg;
    // const stateInputboxValue = emptyFg ? '' : nullFg ? '진행중' : resultFg ? '합격' : '불합격';
    
    const flagInputboxValue = 
      emptyFg ? null
      : !resultFg ? false
      : nullFg ? null
      : resultFg ;
    const stateInputboxValue = 
      emptyFg ? ''
      : !resultFg ? '불합격'
      : nullFg ? '진행중'
      : '합격' ;
    
    inputInspResult.setFieldValue(flagInputboxName, flagInputboxValue);
    inputInspResult.setFieldValue(stateInputboxName, stateInputboxValue);

    if(emptyFg || nullFg){
      inputInspResult.setFieldDisabled({insp_handling_type:true});
    }else{
      inputInspResult.setFieldDisabled({insp_handling_type:false});
    }

    let _inspHandlingCd:string
    
    if (flagInputboxValue===true) {
      _inspHandlingCd = 'INCOME'
      changeInspResult('INCOME');
    }else if(flagInputboxValue===false){
      _inspHandlingCd = 'RETURN'
      changeInspResult('RETURN');
    }else {
      _inspHandlingCd = ''
      //inputInspResult.setFieldValue('insp_handling_type','')
      changeInspResult('');
    }
    console.log(_inspHandlingCd, inspHandlingType, inputInspResult.values)
    if (_inspHandlingCd === ''){
      inputInspResult.setFieldValue('insp_handling_type','')
    } else {
      inspHandlingType.forEach(el => {
        if (JSON.parse(el.code).insp_handling_type_cd === _inspHandlingCd){
          inputInspResult.setFieldValue('insp_handling_type',el.code)
          return ;
        }
      })
    }
    //#endregion
  };

  const onSave = async (ev) => {
    let headerData:object;
    let detailDatas:object[]=[];

    const inputInputItemsValues = inputInputItems?.ref?.current?.values
    const inputInspResultValues = inputInspResult?.ref?.current?.values
    const inputInspResultIncomeValues = inputInspResultIncome?.ref?.current?.values
    const inputInspResultRejectValues = inputInspResultReject?.ref?.current?.values

    const saveGridInstance = gridRef?.current?.getInstance();

    if(!inputInspResultValues?.insp_result_fg){
      message.warn('최종판정이 되지 않았습니다. 확인 후 다시 저장해주세요.')
      return;
    }else if(!inputInspResultValues?.emp_uuid){
      message.warn('검사자를 등록해주세요.')
      return;
    }else if(!inputInspResultValues?.reg_date_time){
      message.warn('검사시간을 등록해주세요.')
      return;
    }
    
    headerData = {
      factory_uuid: getUserFactoryUuid(),
      receive_detail_uuid: inputInputItemsValues?.receive_detail_uuid,
      insp_type_uuid: inputInputItemsValues?.insp_type_uuid,
      insp_detail_type_uuid: inputInputItemsValues?.insp_detail_type_uuid,
      insp_handling_type_uuid: JSON.parse(inputInspResultValues.insp_handling_type).insp_handling_type_uuid,
      insp_uuid: receiveInspHeaderData?.insp_uuid,
      unit_uuid: inputInputItemsValues?.unit_uuid,
      prod_uuid: receiveInspHeaderData?.prod_uuid,
      lot_no: inputInputItemsValues?.lot_no,
      emp_uuid: inputInspResultValues?.emp_uuid,
      reg_date: inputInspResultValues?.reg_date + ' ' + inputInspResultValues?.reg_date_time + ':00',
      insp_result_fg: inputInspResultValues?.insp_result_fg,
      insp_qty: inputInputItemsValues?.qty,
      pass_qty: inputInspResultIncomeValues?.qty,
      reject_qty: inputInspResultRejectValues?.reject_qty,
      reject_uuid: blankThenNull(inputInspResultRejectValues?.reject_uuid),
      to_store_uuid: blankThenNull(inputInspResultIncomeValues?.to_store_uuid),
      to_location_uuid: blankThenNull(inputInspResultIncomeValues?.to_location_uuid),
      reject_store_uuid: blankThenNull(inputInspResultRejectValues?.reject_store_uuid),
      reject_location_uuid: blankThenNull(inputInspResultRejectValues?.reject_location_uuid),
      remark: inputInspResultValues?.remark,
    }

    for (let i = 0; i <= saveGridInstance?.getRowCount() - 1 ; i++) {
      const values:object[] = [];
      const row = saveGridInstance?.getRow(i);

      for (let k = 1; k <= row.sample_cnt; k++) {
        const value:any = row?.['x'+k+'_insp_value'];
        if(value){
          values.push({
            sample_no: k,
            insp_result_fg: row?.['x'+k+'_insp_result_fg'],
            insp_value: value === 'OK' ? 1 : value === 'NG' ? 0 : value
          })
        }
      };

      detailDatas.push({
        values,
        factory_uuid: getUserFactoryUuid(),
        insp_detail_uuid: row?.insp_detail_uuid,
        insp_result_fg: row?.insp_result_fg,
        remark: row?.remark
      })
    }

    console.log('headerData detailDatas',headerData,detailDatas)

    const saveData:object = ({
      header:headerData,
      details:detailDatas
    });
    await executeData(saveData, URI_PATH_POST_QMS_RECEIVE_INSP_RESULTS, 'post', 'success').then((value) => {
      if (!value) return;
      message.info('저장되었습니다.')
      props.onAfterCloseSearch();
      onClear();
      props.setPopupVisible(false);
    }).catch(e => {console.log(e)});
  };

  const onCancel = (ev) => {
    onClear();
    props.setPopupVisible(false);
  };
  //#endregion

  //#region Hook 함수

  useLayoutEffect(()=>{
    const _inspHandlingType:object[] = []
    getData({},URL_PATH_ADM.INSP_HANDLING_TYPE.GET.INSP_HANDLING_TYPE,'raws').then(async (res)=>{
      res.map((item) => {
        _inspHandlingType.push({code: JSON.stringify({insp_handling_type_uuid:item.insp_handling_type_uuid,insp_handling_type_cd:item.insp_handling_type_cd}), text: item.insp_handling_type_nm})
      })
      console.log(res,_inspHandlingType)

      setInspHandlingType(_inspHandlingType)
    })
  },[])

  useLayoutEffect(()=>{
    // console.log(inspHandlingType)
    inputInspResult.setInputItems(INPUT_ITEMS_INSP_RESULT);
  },[inspHandlingType])

  useLayoutEffect(() => {
    const inspDetailTypeCd = receiveInputData.insp_detail_type_cd;
    const inspDetailType = inspDetailTypeCd === 'MAT_RECEIVE' ? 'matReceive' : inspDetailTypeCd === 'OUT_RECEIVE' ? 'outReceive' : '';
    
    inputInspResultIncome.setFieldValue('to_store_uuid',receiveInputData.to_store_uuid)
    
    if (inspDetailType && receiveInputData.receive_detail_uuid) {
      getData(
        {
          insp_detail_type_uuid: receiveInputData.insp_detail_type_uuid,
          receive_detail_uuid: receiveInputData.receive_detail_uuid
        },
        '/qms/receive/insp/include-details',
        'header-details'
      ).then((res) => {
        setReceiveInspHeaderData(res.header);
        setReceiveInspDetailData(res.details);
      }).catch((err) => {
        onClear();
        message.error('에러');
      });
    }
  }, [receiveInputData]);

  useLayoutEffect(() => {
    if(inputInspResult?.values?.insp_handling_type){
      changeInspResult(JSON.parse(inputInspResult?.values?.insp_handling_type).insp_handling_type_uuid);
    }
  }, [inputInspResult?.values?.insp_handling_type]);

  useLayoutEffect(() => {
    if (changeIncomeQtyFg===false) return;
    let receiveQty:number = Number(inputInputItems?.values?.qty)
    let incomeQty:number = Number(inputInspResultIncome?.values?.qty)
    let rejectQty:number = Number(inputInspResultReject?.values?.reject_qty)

    if (receiveQty - incomeQty < 0 ){
      message.warn('입하수량보다 판정수량이 많습니다. 확인 후 다시 입력해주세요.')
      inputInspResultIncome.setFieldValue('qty',receiveQty - rejectQty)
    }else{
      inputInspResultReject.setFieldValue('reject_qty',receiveQty - incomeQty)
    }
    
    setChangeIncomeQtyFg(false)
  }, [changeIncomeQtyFg]);

  useLayoutEffect(() => {
    if (!changeRejectQtyFg) return;
    let receiveQty:number = Number(inputInputItems?.values?.qty)
    let incomeQty:number = Number(inputInspResultIncome?.values?.qty)
    let rejectQty:number = Number(inputInspResultReject?.values?.reject_qty)
    
    if (receiveQty - rejectQty < 0 ){
      message.warn('입하수량보다 판정수량이 많습니다. 확인 후 다시 입력해주세요.')
      inputInspResultReject.setFieldValue('reject_qty',receiveQty - incomeQty)
    }else{
      inputInspResultIncome.setFieldValue('qty',receiveQty - rejectQty)
    }
    setChangeRejectQtyFg(false)
  }, [changeRejectQtyFg]);
  //#endregion

  //#region 컴포넌트 rander
  return (
    <GridPopup
      title='데이터 추가하기'
      onOk={onSave}
      okText='저장'
      cancelText='취소'
      onCancel={onCancel}
      gridMode='update'
      popupId={'INSP_CREATE_POPUP'}
      gridId={'INSP_CREATE_POPUP_GRID'}
      ref={gridRef}
      columns={CREATE_POPUP_DETAIL_COLUMNS}
      inputProps={[
        inputInputItems.props,
        inputInspResult.props,
        inputInspResultIncome.props,
        inputInspResultReject.props,
      ]}
      onAfterChange={onAfterChange}
      saveUriPath={null}
      searchUriPath={null}
      data={receiveInspDetailData}
      hiddenActionButtons={true}
      saveType='basic'
      visible={props.popupVisible}
    />
  );
  //#endregion
};
//#endregion

//#region 성적서 수정 팝업
export const INSP_RESULT_EDIT_POPUP = (props:{
  inspResultUuid:string,
  popupVisible:boolean,
  setPopupVisible: (value?) => void,
  onAfterCloseSearch?: (insp_result_uuid:string) => void
}) =>{
  //#region Ref 관리
  const gridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리 
  const [changeIncomeQtyFg, setChangeIncomeQtyFg] = useState(false);
  const [changeRejectQtyFg, setChangeRejectQtyFg] = useState(false);
  //#endregion

  //#region 데이터 관리
  const [receiveInspHeaderData, setReceiveInspHeaderData] = useState<TReceiveInspHeader>({});
  const [receiveInspDetailData, setReceiveInspDetailData] = useState<TReceiveInspDetail[]>([]);

  const [inspHandlingType, setInspHandlingType] = useState([])
  //#endregion

  //#region 그리드 컬럼세팅
  const INSP_DETAIL_COLUMNS:IGridColumn[] = [
    {header:'검사성적서 상세UUID', name:'insp_result_detail_info_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사기준서 상세UUID', name:'insp_detail_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사항목 유형UUID', name:'insp_item_type_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사항목 유형명', name:'insp_item_type_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'검사항목UUID', name:'insp_item_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사항목명', name:'insp_item_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'검사 기준', name:'spec_std', width:ENUM_WIDTH.L, filter:'text'},
    {header:'최소 값', name:'spec_min', width:ENUM_WIDTH.M, filter:'text'},
    {header:'최대 값', name:'spec_max', width:ENUM_WIDTH.M, filter:'text'},
    {header:'검사방법UUID', name:'insp_method_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사방법명', name:'insp_method_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'검사구UUID', name:'insp_tool_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true},
    {header:'검사구명', name:'insp_tool_nm', width:ENUM_WIDTH.L, filter:'text'},
    {header:'정렬', name:'sortby', width:ENUM_WIDTH.S, filter:'text', hidden:true},
    {header:'시료 수량', name:'sample_cnt', width:ENUM_WIDTH.M, filter:'text'},
    {header:'검사 주기', name:'insp_cycle', width:ENUM_WIDTH.M, filter:'text'},
  ];
  
  const CREATE_POPUP_DETAIL_COLUMNS = useMemo(() => {
      let items:IGridColumn[] = INSP_DETAIL_COLUMNS;
      
      if (receiveInspHeaderData?.max_sample_cnt > 0) {
        //시료수 최대값에 따라 컬럼 생성
        for (let i = 1; i <= receiveInspHeaderData?.max_sample_cnt; i++) {
          items.push({header:'x'+i+'_insp_result_detail_value_uuid', name:'x'+i+'_insp_result_detail_value_uuid', width:ENUM_WIDTH.L, filter:'text', hidden:true});
          items.push({header:'x'+i+'_sample_no', name:'x'+i+'_sample_no', width:ENUM_WIDTH.M, filter:'text', hidden:true});
          items.push({header:'x'+i, name:'x'+i+'_insp_value', width:ENUM_WIDTH.L, filter:'text', editable:true});
          items.push({header:'x'+i+'_판정', name:'x'+i+'_insp_result_fg', width:ENUM_WIDTH.M, filter:'text', hidden:true});
          items.push({header:'x'+i+'_판정', name:'x'+i+'_insp_result_state', width:ENUM_WIDTH.M, filter:'text', hidden:true});
        }
      }
      
      items.push({header:'합격여부', name:'insp_result_fg', width:ENUM_WIDTH.M, filter:'text', hidden:true})
      items.push({header:'판정', name:'insp_result_state', width:ENUM_WIDTH.M, filter:'text'})
      items.push({header:'비고', name:'remark', width:ENUM_WIDTH.XL, filter:'text'})
      
      return items;
      
  }, [receiveInspHeaderData]);
  //#endregion

  //#region inputbox 세팅
  const INFO_INPUT_ITEMS:IInputGroupboxItem[] = [
    {id:'receive_detail_uuid', label:'입하상세UUID', type:'text', disabled:true, hidden:true},
    {id:'stmt_no_sub', label:'세부입하전표번호', type:'text', disabled:true},
    {id:'partner_nm', label:'거래처', type:'text', disabled:true},
    {id:'receive_date', label:'입하일', type:'text', disabled:true},
    {id:'insp_detail_type_uuid', label:'입하구분코드', type:'text', hidden:true},
    {id:'insp_detail_type_nm', label:'입하구분', type:'text', disabled:true},
    {id:'prod_uuid', label:'품목UUID', type:'text', hidden:true},
    {id:'prod_no', label:'품번', type:'text', disabled:true},
    {id:'prod_nm', label:'품명', type:'text', disabled:true},
    {id:'prod_std', label:'규격', type:'text', disabled:true},
    {id:'unit_uuid', label:'단위UUID', type:'text', disabled:true, hidden:true},
    {id:'unit_nm', label:'단위', type:'text', disabled:true},
    {id:'lot_no', label:'LOT NO', type:'text', disabled:true},
    {id:'qty', label:'입하수량', type:'number', disabled:true},
  ];

  const INPUT_ITEMS_INSP_RESULT:IInputGroupboxItem[] = [
    {id:'insp_uuid', label:'검사기준서UUID', type:'text', disabled:true, hidden:true},
    {id:'insp_result_uuid', label:'검사성적서UUID', type:'text', disabled:true, hidden:true},
    {id:'insp_result_fg', label:'최종판정', type:'text', disabled:true, hidden:true },
    {id:'insp_result_state', label:'최종판정', type:'text', disabled:true},
    {id:'reg_date', label:'검사일자', type:'date', default:getToday() },
    {id:'reg_date_time', label:'검사시간', type:'time'},
    {id:'emp_uuid', label:'검사자UUID', type:'text', hidden:true},
    {id:'emp_nm', label:'검사자', type:'text', usePopup:true, popupKey:'사원관리', popupKeys:['emp_nm', 'emp_uuid'], params:{emp_status:'incumbent'}}, 
    {
      id:'insp_handling_type', 
      label:'처리결과', 
      type:'combo', 
      firstItemType:'empty',
      options:inspHandlingType,
      disabled:false,
      onAfterChange: (ev) => {}
    },
    {id:'remark', label:'비고', type:'text'},
  ];

  const INPUT_ITEMS_INSP_RESULT_INCOME:IInputGroupboxItem[] = [
    {
      id:'qty', 
      label:'입고수량', 
      type:'number', 
      disabled:true,
      onAfterChange:()=>{
        setChangeIncomeQtyFg(true)
      }
    },
    {
      id:'to_store_uuid', 
      label:'입고창고', 
      type:'combo',
      firstItemType:'empty',
      dataSettingOptions:{
        codeName:'store_uuid',
        textName:'store_nm',
        uriPath:getPopupForm('창고관리')?.uriPath,
        params:{
          store_type: 'available',
        }
      },
      onAfterChange: (ev) => {}
    },
      {
        id:'to_location_uuid', 
      label:'입고위치', 
      type:'combo',
      firstItemType:'empty',
      dataSettingOptions:{
        codeName:'location_uuid',
        textName:'location_nm',
        uriPath:getPopupForm('위치관리')?.uriPath,
      },
      onAfterChange: (ev) => {}
    },
  ];

  const INPUT_ITEMS_INSP_RESULT_RETURN:IInputGroupboxItem[] = [
    {
      id:'reject_qty', 
      label:'부적합수량', 
      type:'number', 
      disabled:true,
      onAfterChange:()=>{setChangeRejectQtyFg(true)}
    },
    {id:'reject_uuid', label:'불량유형UUID', type:'text', hidden:true},
    {id:'reject_nm', label:'불량유형', type:'text', usePopup:true, popupKey:'부적합관리', popupKeys:['reject_nm', 'reject_uuid']}, 
    {
      id:'reject_store_uuid', 
      label:'반출창고', 
      type:'combo',
      firstItemType:'empty',
      dataSettingOptions:{
        codeName:'store_uuid',
        textName:'store_nm',
        uriPath:getPopupForm('창고관리')?.uriPath,
        params:{
          store_type: 'return',
        }
      }
    },
    {
      id:'reject_location_uuid', 
      label:'반출위치', 
      type:'combo',
      firstItemType:'empty',
      dataSettingOptions:{
        codeName:'location_uuid',
        textName:'location_nm',
        uriPath:getPopupForm('위치관리')?.uriPath,
      },
      onAfterChange: (ev) => {}
    }
  ];

  const inputInputItems = useInputGroup('INPUT_EDIT_POPUP_INFO', INFO_INPUT_ITEMS, {title:'입하정보',});
  const inputInspResult = useInputGroup('INPUT_EDIT_POPUP_INSP_RESULT', INPUT_ITEMS_INSP_RESULT, {title:'검사정보',});
  const inputInspResultIncome = useInputGroup('INPUT_EDIT_POPUP_INSP_RESULT_INCOME', INPUT_ITEMS_INSP_RESULT_INCOME, {title:'입고정보',});
  const inputInspResultReject = useInputGroup('INPUT_EDIT_POPUP_INSP_RESULT_REJECT', INPUT_ITEMS_INSP_RESULT_RETURN, {title:'부적합정보',});

  //#endregion

  //#region 함수 
  const onClear = () => {
    inputInputItems?.ref?.current?.resetForm();
    inputInspResult?.ref?.current?.resetForm();
    inputInspResultIncome?.ref?.current?.resetForm();
    inputInspResultReject?.ref?.current?.resetForm();
    setReceiveInspHeaderData({});
    setReceiveInspDetailData([]);
  };

  const changeInspResult=(inspResult?:string, firstLoadingFg?:boolean)=>{
    let incomeDisabled:boolean=true;
    let rejectDisabled:boolean=true;
    let qtyDisabled:boolean=true;
    if(inspResult){
      if(['INCOME','SELECTION'].includes(inspResult)){
        incomeDisabled = false
      };
      if(['RETURN','SELECTION'].includes(inspResult)){
        rejectDisabled = false
      };
    }
    if(!firstLoadingFg){
      if(incomeDisabled){
        inputInspResultIncome.setFieldValue('qty',0)
      }
      if(rejectDisabled){
        inputInspResultReject.setFieldValue('reject_qty',0)
      }

      if(!incomeDisabled){
        inputInspResultIncome.setFieldValue('qty',inputInputItems?.ref?.current?.values?.qty)
        inputInspResultReject.setFieldValue('reject_qty',0)
      }else if(!rejectDisabled){
        inputInspResultReject.setFieldValue('reject_qty',inputInputItems?.ref?.current?.values?.qty)
      }
    }

    if(inspResult==='SELECTION'){
      qtyDisabled=false 
    }

    inputInspResultIncome.setFieldDisabled({qty:qtyDisabled, to_store_uuid:incomeDisabled, to_location_uuid:incomeDisabled});
    inputInspResultReject.setFieldDisabled({reject_qty:qtyDisabled, reject_nm:rejectDisabled, reject_store_uuid:rejectDisabled, reject_location_uuid:rejectDisabled});
  };
  
  const onAfterChange = (ev:any) => {
    const {origin, changes, instance} = ev;
    if (changes.length===0) return;
    
    const {columnName, rowKey, value} = changes[0];
    
    if ((!['cell', 'delete', 'paste'].includes(origin))  || !columnName?.includes('_insp_value')) return;
    
    const {rawData} = instance?.store?.data;
    const rowData = rawData[rowKey];

    const specMin = rowData?.spec_min;
    const specMax = rowData?.spec_max;

    let sampleCnt:any = rowData?.sample_cnt; //입력 가능한 시료수
    let nullFg:boolean = true;
    let resultFg:boolean = true;
    let emptyFg:boolean;

    const popupGridInstance = gridRef.current?.getInstance();
    
    //#region ✅CELL단위 합/불 판정
    [nullFg, resultFg] = getInspCheckResultValue(value, {specMin, specMax});
    
    const cellFlagColumnName = String(columnName)?.replace('_insp_value', '_insp_result_fg');
    const cellStateColumnName = String(columnName)?.replace('_insp_value', '_insp_result_state');
    const cellFlagResultValue = nullFg ? null : resultFg;
    const cellStateResultValue = nullFg ? '' : resultFg ? '합격' : '불합격';

    if (!isNumber(specMin) && !isNumber(specMax)) {
      if (resultFg === true ) {
        popupGridInstance?.setValue(rowKey, columnName, 'OK');  
      } else if (resultFg === false ) {
        popupGridInstance?.setValue(rowKey, columnName, 'NG');  
      }
    }
    popupGridInstance?.setValue(rowKey, cellFlagColumnName, cellFlagResultValue);
    popupGridInstance?.setValue(rowKey, cellStateColumnName, cellStateResultValue); 
    //#endregion
    
    //#region ✅ROW단위 합/불 판정
    if (resultFg === true) { // 현재 값이 합격일 경우만 다른 cell의 판정값 체크
      [nullFg, resultFg] = getInspCheckResultInfo(rowData, rowKey, {maxCnt: sampleCnt});
    }
    
    const rowFlagColumnName = 'insp_result_fg';
    const rowStateColumnName = 'insp_result_state';
    const rowFlagResultValue = nullFg ? null : resultFg;
    const rowStateResultValue = nullFg ? '' : resultFg ? '합격' : '불합격';
    
    popupGridInstance?.setValue(rowKey, rowFlagColumnName, rowFlagResultValue);
    popupGridInstance?.setValue(rowKey, rowStateColumnName, rowStateResultValue);
    //#endregion

    //#region ✅최종 합/불 판정
    const maxRowCnt = popupGridInstance?.getRowCount() - 1;
    if (resultFg === true){
      [nullFg, resultFg, emptyFg] = getInspCheckResultTotal(rawData, maxRowCnt);
    } else {
      [nullFg, resultFg, emptyFg] = [false, false, false]
    }
    
    const flagInputboxName = rowFlagColumnName;
    const stateInputboxName = rowStateColumnName;
    // const flagInputboxValue = emptyFg || nullFg ? null : resultFg;
    // const stateInputboxValue = emptyFg ? '' : nullFg ? '진행중' : resultFg ? '합격' : '불합격';
    
    const flagInputboxValue = 
      emptyFg ? null
      : !resultFg ? false
      : nullFg ? null
      : resultFg ;
    const stateInputboxValue = 
      emptyFg ? ''
      : !resultFg ? '불합격'
      : nullFg ? '진행중'
      : '합격' ;
    
    inputInspResult.setFieldValue(flagInputboxName, flagInputboxValue);
    inputInspResult.setFieldValue(stateInputboxName, stateInputboxValue);

    if(emptyFg || nullFg){
      inputInspResult.setFieldDisabled({insp_handling_type:true});
    }else{
      inputInspResult.setFieldDisabled({insp_handling_type:false});
    }

    let _inspHandlingCd:string

    if (flagInputboxValue===true) {
      _inspHandlingCd = 'INCOME'
      changeInspResult('INCOME', false);
    }else if(flagInputboxValue===false){
      _inspHandlingCd = 'RETURN'
      changeInspResult('RETURN', false);
    }else {
      _inspHandlingCd = ''
      //inputInspResult.setFieldValue('insp_handling_type','')
      changeInspResult('', false);
    }
    
    if (_inspHandlingCd === ''){
      inputInspResult.setFieldValue('insp_handling_type','')
    } else {
      inspHandlingType.forEach(el => {
        if (JSON.parse(el.code).insp_handling_type_cd === _inspHandlingCd){
          inputInspResult.setFieldValue('insp_handling_type',el.code)
          return ;
        }
      })
    }

    //#endregion
  };

  const onSave = async (ev) => {
    let headerData:object;
    let detailDatas:object[]=[];

    const inputInputItemsValues = inputInputItems?.ref?.current?.values
    const inputInspResultValues = inputInspResult?.ref?.current?.values
    const inputInspResultIncomeValues = inputInspResultIncome?.ref?.current?.values
    const inputInspResultRejectValues = inputInspResultReject?.ref?.current?.values

    const saveGridInstance = gridRef?.current?.getInstance();

    if(!inputInspResultValues?.insp_result_fg){
      message.warn('최종판정이 되지 않았습니다. 확인 후 다시 저장해주세요.')
      return;
    }else if(!inputInspResultValues?.emp_uuid){
      message.warn('검사자를 등록해주세요.')
      return;
    }else if(!inputInspResultValues?.reg_date_time){
      message.warn('검사시간을 등록해주세요.')
      return;
    }

    headerData = {
      uuid: inputInspResultValues?.insp_result_uuid,
      emp_uuid: inputInspResultValues?.emp_uuid,
      unit_uuid: inputInputItemsValues?.unit_uuid,
      insp_result_fg: inputInspResultValues?.insp_result_fg,
      insp_detail_type_cd: inputInputItemsValues?.insp_detail_type_cd,
      insp_qty: inputInputItemsValues?.qty,
      pass_qty: inputInspResultIncomeValues?.qty,
      reject_qty: inputInspResultRejectValues?.reject_qty,
      reject_uuid: blankThenNull(inputInspResultRejectValues?.reject_uuid),
      to_store_uuid: blankThenNull(inputInspResultIncomeValues?.to_store_uuid),
      to_location_uuid: blankThenNull(inputInspResultIncomeValues?.to_location_uuid),
      reject_store_uuid: blankThenNull(inputInspResultRejectValues?.reject_store_uuid),
      reject_location_uuid: blankThenNull(inputInspResultRejectValues?.reject_location_uuid),
      remark: inputInspResultValues?.remark,
    }

    for (let i = 0; i <= saveGridInstance?.getRowCount() - 1 ; i++) {
      const values:object[] = [];
      const row = saveGridInstance?.getRow(i);

      for (let k = 1; k <= row.sample_cnt; k++) {
        const value:any = row?.['x'+k+'_insp_value'];
        const uuid:any = row?.['x'+k+'_insp_result_uuid'];
        
        if(value){
          values.push({
            uuid: uuid,
            delete_fg: false,
            sample_no: k,
            insp_result_fg: row?.['x'+k+'_insp_result_fg'],
            insp_value: value === 'OK' ? 1 : value === 'NG' ? 0 : value
          })
        } else if (uuid) {
          values.push({
            uuid: uuid,
            delete_fg: true,
            sample_no: k,
            insp_result_fg: row?.['x'+k+'_insp_result_fg'],
            insp_value: value === 'OK' ? 1 : value === 'NG' ? 0 : value
          })
        }
      };

      detailDatas.push({
        values,
        factory_uuid: getUserFactoryUuid(),
        uuid: row?.insp_result_detail_info_uuid,
        insp_detail_uuid: row?.insp_detail_uuid,
        insp_result_fg: row?.insp_result_fg,
        remark: row?.remark
      })
    }

    const saveData:object = ({
      header:headerData,
      details:detailDatas
    });
    await executeData(saveData, URI_PATH_PUT_QMS_RECEIVE_INSP_RESULTS, 'put', 'success').then((value) => {
      if (!value) return;
      message.info('저장되었습니다.')
      props.onAfterCloseSearch(props.inspResultUuid);
      props.setPopupVisible(false);
      onClear();
    }).catch(e => {console.log(e)});
  };

  const onCancel = (ev) => {
    onClear();
    props.setPopupVisible(false);
  };
  //#endregion

  //#region Hook 함수

  useLayoutEffect(()=>{
    const _inspHandlingType:object[] = []
    getData({},URL_PATH_ADM.INSP_TYPE.GET.INSP_TYPES,'raws').then(async (res)=>{
      res.map((item) => {
        _inspHandlingType.push({code: JSON.stringify({insp_handling_type_uuid:item.insp_handling_type_uuid,insp_handling_type_cd:item.insp_handling_type_cd}), text: item.insp_handling_type_nm})
      })
      setInspHandlingType(_inspHandlingType)
    })
  },[])

  useLayoutEffect(()=>{
    inputInspResult.setInputItems(INPUT_ITEMS_INSP_RESULT);
  },[inspHandlingType])

  useLayoutEffect(() => {
    const searchUriPath = URI_PATH_GET_QMS_RECEIVE_INSP_RESULT_INCLUDE_DETAILS.replace('{uuid}', props.inspResultUuid)

    if (props.inspResultUuid && props.popupVisible) {
      getData(
        {},
        searchUriPath,
        'header-details'
      ).then((res) => {
        setReceiveInspHeaderData(res.header);
        setReceiveInspDetailData(res.details);
        inputInputItems.setValues({...res.header, receive_date:dayjs(res.header.receive_date).add(-6, 'day').format('YYYY-MM-DD'), qty:res.header.insp_qty});
        inputInspResult.setValues({...res.header, reg_date_time:res.header.reg_date});
        inputInspResultIncome.setValues({...res.header, qty:res.header.pass_qty});
        inputInspResultReject.setValues({...res.header});

        changeInspResult(res.header.insp_handling_type_cd, true);
      }).catch((err) => {
        onClear();
        message.error('에러');
      });
    } else {
      onClear();
    }
  }, [props.popupVisible, props.inspResultUuid]);

  useLayoutEffect(() => {
    changeInspResult(inputInspResult?.values?.insp_handling_type_cd, false);
  }, [inputInspResult?.values?.insp_handling_type_cd]);

  useLayoutEffect(() => {
    if (changeIncomeQtyFg===false) return;
    let receiveQty:number = Number(inputInputItems?.values?.qty)
    let incomeQty:number = Number(inputInspResultIncome?.values?.qty)
    let rejectQty:number = Number(inputInspResultReject?.values?.reject_qty)

    if (receiveQty - incomeQty < 0 ){
      message.warn('입하수량보다 판정수량이 많습니다. 확인 후 다시 입력해주세요.')
      inputInspResultIncome.setFieldValue('qty',receiveQty - rejectQty)
    }else{
      inputInspResultReject.setFieldValue('reject_qty',receiveQty - incomeQty)
    }
    
    setChangeIncomeQtyFg(false)
  }, [changeIncomeQtyFg]);

  useLayoutEffect(() => {
    if (!changeRejectQtyFg) return;
    let receiveQty:number = Number(inputInputItems?.values?.qty)
    let incomeQty:number = Number(inputInspResultIncome?.values?.qty)
    let rejectQty:number = Number(inputInspResultReject?.values?.reject_qty)
    
    if (receiveQty - rejectQty < 0 ){
      message.warn('입하수량보다 판정수량이 많습니다. 확인 후 다시 입력해주세요.')
      inputInspResultReject.setFieldValue('reject_qty',receiveQty - incomeQty)
    }else{
      inputInspResultIncome.setFieldValue('qty',receiveQty - rejectQty)
    }
    setChangeRejectQtyFg(false)
  }, [changeRejectQtyFg]);
  //#endregion

  //#region 컴포넌트 rander
  return (
    <GridPopup
      title='수입검사 성적서 수정'
      onOk={onSave}
      okText='저장'
      cancelText='취소'
      onCancel={onCancel}
      gridMode='update'
      popupId={'INSP_EDIT_POPUP'}
      gridId={'INSP_EDIT_POPUP_GRID'}
      ref={gridRef}
      columns={CREATE_POPUP_DETAIL_COLUMNS}
      inputProps={[
        inputInputItems.props,
        inputInspResult.props,
        inputInspResultIncome.props,
        inputInspResultReject.props,
      ]}
      onAfterChange={onAfterChange}
      saveUriPath={null}
      searchUriPath={null}
      data={receiveInspDetailData}
      hiddenActionButtons={true}
      saveType='basic'
      visible={props.popupVisible}
    />
  );
  //#endregion
};
//#endregion