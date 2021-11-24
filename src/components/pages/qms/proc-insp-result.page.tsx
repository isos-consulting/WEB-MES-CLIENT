import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import { Divider, Space, Typography, Modal, Col, Row, message } from 'antd';
import dayjs from 'dayjs';
import { FormikProps, FormikValues } from 'formik';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Container, Datagrid, GridPopup, IGridColumn, ISearchItem, Searchbox } from '~/components/UI';
import { IInputGroupboxItem, InputGroupbox } from '~/components/UI/input-groupbox/input-groupbox.ui';
import { executeData, getData, getInspCheckResultInfo, getInspCheckResultTotal, getInspCheckResultValue, getPageName, getPermissions, getToday, getUserFactoryUuid, isNumber } from '~/functions';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { ENUM_WIDTH } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';

// 날짜 로케일 설정
dayjs.locale('ko-kr');

// moment 타입과 호환시키기 위한 행위
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

//#region ✅전역 변수 URI Path, Type ...
const URI_PATH_GET_PRD_WORKS = '/prd/works';
const URI_PATH_GET_QMS_PROC_INSP_INCLUDE_DETAILS = '/qms/proc/insp/include-details';
const URI_PATH_GET_QMS_PROC_INSP_RESULTS = '/qms/proc/insp-results';
const URI_PATH_GET_QMS_PROC_INSP_RESULT_INCLUDE_DETAILS = '/qms/proc/insp-result/{uuid}/include-details';
const URI_PATH_POST_QMS_PROC_INSP_RESULTS = '/qms/proc/insp-results';
const URI_PATH_PUT_QMS_PROC_INSP_RESULTS = '/qms/proc/insp-results';
const URI_PATH_DELETE_QMS_PROC_INSP_RESULTS = '/qms/proc/insp-results';

type TGetPrdWork  = {
  work_uuid?: string,
  factory_uuid?: string,
  factory_cd?: string,
  factory_nm?: string,
  reg_date?: string,
  order_uuid?: string,
  order_no?: string,
  seq?: number,
  proc_uuid?: string,
  proc_cd?: string,
  proc_nm?: string,
  workings_uuid?: string,
  workings_cd?: string,
  workings_nm?: string,
  equip_uuid?: string,
  equip_cd?: string,
  equip_nm?: string,
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
  total_qty?: number,
  qty?: number,
  reject_qty?: number,
  start_date?: string,
  end_date?: string,
  work_time?: number,
  shift_uuid?: string,
  shift_nm?: string,
  worker_cnt?: number,
  worker_nm?: string,
  complete_state?: string,
  complete_fg?: boolean,
  to_store_uuid?: string,
  to_store_cd?: string,
  to_store_nm?: string,
  to_location_uuid?: string,
  to_location_cd?: string,
  to_location_nm?: string,
  order_remark?: string,
  remark?: string
}

type TGetQmsProcInspIncludeDetailsHeader = {
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
  apply_state?: string,
  contents?: string,
  max_sample_cnt?: number,
  remark?: string,
}

type TGetQmsProcInspIncludeDetailsDetail = {
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
  remark?: string
}

type TGetQmsProcInspIncludeDetails = {
  header?: TGetQmsProcInspIncludeDetailsHeader,
  details?:TGetQmsProcInspIncludeDetailsDetail[]
}

type TGetQmsProcInspResult  = {
  insp_result_uuid?: string,
  factory_uuid?: string,
  factory_cd?: string,
  factory_nm?: string,
  insp_type_cd?: string,
  insp_type_nm?: string,
  insp_detail_type_cd?: string,
  insp_detail_type_nm?: string,
  work_uuid?: string,
  seq?: number,
  insp_uuid?: string,
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
  lot_no?: string,
  emp_uuid?: string,
  emp_cd?: string,
  emp_nm?: string,
  reg_date?: string,
  insp_result_fg?: boolean,
  insp_result_state?: string,
  insp_qty?: number,
  pass_qty?: number,
  reject_qty?: number,
  remark?: string
}

type TGetQmsProcInspResultIncludeDetailsHeader = {
  insp_result_uuid?: string,
  factory_uuid?: string,
  factory_cd?: string,
  factory_nm?: string,
  insp_type_cd?: string,
  insp_type_nm?: string,
  insp_detail_type_cd?: string,
  insp_detail_type_nm?: string,
  work_uuid?: string,
  seq?: number,
  insp_uuid?: string,
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
  lot_no?: string,
  emp_uuid?: string,
  emp_cd?: string,
  emp_nm?: string,
  reg_date?: string,
  insp_result_fg?: boolean,
  insp_result_state?: string,
  insp_qty?: number,
  pass_qty?: number,
  reject_qty?: number,
  max_sample_cnt?: number,
  remark?: string,
}

type TGetQmsProcInspResultIncludeDetailsDetail = {
  insp_result_detail_info_uuid?: string,
  factory_uuid?: string,
  factory_cd?: string,
  factory_nm?: string,
  insp_result_uuid?: string,
  insp_detail_uuid?: string,
  insp_item_type_uuid?: string,
  insp_item_type_cd?: string,
  insp_item_type_nm?: string,
  insp_item_uuid?: string,
  insp_item_cd?: string,
  insp_item_nm?: string,
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
  sample_cnt?: number,
  insp_cycle?: string,
  sortby?: number,
  insp_result_fg?: boolean,
  insp_result_state?: string,
  remark?: string,
  xn_insp_result_detail_value_uuid?: string,
  xn_sample_no?: number,
  xn_insp_value?: number,
  xn_insp_result_fg?: boolean,
  xn_insp_result_state?: string,
}

type TGetQmsProcInspResultIncludeDetails = {
  header?: TGetQmsProcInspResultIncludeDetailsHeader,
  details?:TGetQmsProcInspResultIncludeDetailsDetail[]
}

type TPostQmsProcInspResultsHeader = {
  uuid?: string,
  factory_uuid?: string,
  work_uuid?: string,
  insp_detail_type_cd?: string,
  insp_uuid?: string,
  prod_uuid?: string,
  lot_no?: string,
  emp_uuid?: string,
  reg_date?: string,
  insp_result_fg?: boolean,
  insp_qty?: number,
  pass_qty?: number,
  reject_qty?: number,
  remark?: string
}

type TPostQmsProcInspResultsDetailValue = {
  sample_no?: number,
  insp_result_fg?: boolean,
  insp_value?: number
}

type TPostQmsProcInspResultsDetail = {
  values?: TPostQmsProcInspResultsDetailValue[],
  factory_uuid?: string,
  insp_detail_uuid?: string,
  insp_result_fg?: boolean,
  remark?: string
}

type TPostQmsFinalInspResult = {
  header?: TPostQmsProcInspResultsHeader,
  details?: TPostQmsProcInspResultsDetail[],
}

type TPutQmsProcInspResultsHeader = {
  uuid: string,
  emp_uuid: string,
  insp_result_fg: boolean,
  insp_qty: number,
  pass_qty: number,
  reject_qty: number,
  remark: string
}

type TPutQmsProcInspResultsDetailValue = {
  uuid: string
  delete_fg: boolean,
  sample_no: number,
  insp_result_fg: boolean,
  insp_value: number
}

type TPutQmsProcInspResultsDetail = {
  values?: TPutQmsProcInspResultsDetailValue[],
  factory_uuid?: string,
  uuid: string,
  insp_result_fg: boolean,
  remark: string
}

type TPutQmsFinalInspResult = {
  header?: TPutQmsProcInspResultsHeader,
  details?: TPutQmsProcInspResultsDetail[],
}
//#endregion

//#region 🔶공정검사 성적서
export const PgQmsProcInspResult = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region ✅설정값
  const [modal, contextHolder] = Modal.useModal();
  const INSP_RESULT_DETAIL_GRID = INSP_RESULT_DETAIL_GRID_INFO();
  //#region Ref 관리
  const searchRef = useRef<FormikProps<FormikValues>>();
  const gridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리 
  const [createPopupVisible, setCreatePopupVisible] = useState(false)
  //#endregion

  //#region 데이터 관리
  const [works, setWorks] = useState<TGetPrdWork[]>([]);
  
  const [workData, setWorkData] = useState<TGetPrdWork>({})
  //#endregion  

  //#region ✅조회조건
  const SEARCH_ITEMS:ISearchItem[] = [
    {type:'date', id:'start_date', label:'작업일', default:getToday(-7)},
    {type:'date', id:'end_date', default:getToday()}
  ];
  //#endregion

   //#region 그리드 컬럼세팅
  const COLUMNS_WORKS:IGridColumn[] = [
    {header:'생산실적UUID', name:'work_uuid', alias:'uuid', width:200, hidden:true, format:'text'},
    {header:'작업구분', name:'complete_state', width:200, hidden:true, format:'text'},
    {header:'실적 일시', name:'reg_date', width:200, hidden:true, format:'text'},
    {header:'작업지시UUID', name:'order_uuid', width:200, hidden:true, format:'text'},
    {header:'지시번호', name:'order_no', width:200, hidden:true, format:'text'},
    {header:'생산실적 순번', name:'seq', width:200, hidden:true, format:'text'},
    {header:'공정', name:'proc_nm', width:120, hidden:false, format:'text'},
    {header:'작업장', name:'workings_nm', width:120, hidden:false, format:'text'},
    {header:'설비', name:'equip_nm', width:120, hidden:false, format:'text'},
    {header:'품목유형', name:'item_type_nm', width:120, hidden:false, format:'text'},
    {header:'제품유형', name:'prod_type_nm', width:120, hidden:false, format:'text'},
    {header:'품번', name:'prod_no', width:150, hidden:false, format:'text'},
    {header:'품명', name:'prod_nm', width:150, hidden:false, format:'text'},
    {header:'모델', name:'model_nm', width:120, hidden:false, format:'text'},
    {header:'Rev', name:'rev', width:100, hidden:false, format:'text'},
    {header:'규격', name:'prod_std', width:100, hidden:false, format:'text'},
    {header:'단위', name:'unit_nm', width:80, hidden:false, format:'text'},
    {header:'LOT NO', name:'lot_no', width:100, hidden:false, format:'text'},
    {header:'지시 수량', name:'order_qty', width:100, hidden:false, format:'number'},
    {header:'생산 수량', name:'total_qty', width:100, hidden:false, format:'number'},
    {header:'양품 수량', name:'qty', width:100, hidden:false, format:'number'},
    {header:'부적합 수량', name:'reject_qty', width:100, hidden:false, format:'number'},
    {header:'생산시작 일시', name:'start_date', width:100, hidden:false, format:'datetime'},
    {header:'생산종료 일시', name:'end_date', width:100, hidden:false, format:'datetime'},
    {header:'작업시간', name:'work_time', width:80, hidden:true, format:'text'},
    {header:'작업교대명', name:'shift_nm', width:120, hidden:false, format:'text'},
    {header:'작업자수', name:'worker_cnt', width:100, hidden:false, format:'text'},
    {header:'작업자명', name:'worker_nm', width:100, hidden:false, format:'text'},
    {header:'입고 창고', name:'to_store_nm', width:120, hidden:false, format:'text'},
    {header:'입고 위치', name:'to_location_nm', width:120, hidden:false, format:'text'},
    {header:'지시 비고', name:'order_remark', width:150, hidden:false, format:'text'},
    {header:'생산 비고', name:'remark', width:150, hidden:false, format:'text'},
  ];
  //#endregion

  //#region inputbox 세팅
  const INPUT_ITEMS_WORK:IInputGroupboxItem[] = [
    {id:'reg_date', label:'실적일시', type:'date', disabled:true},
    {id:'prod_no', label:'품번', type:'text', disabled:true},
    {id:'prod_nm', label:'품명', type:'text', disabled:true},
    {id:'prod_std', label:'규격', type:'text', disabled:true},
    {id:'unit_nm', label:'단위', type:'text', disabled:true},
    {id:'proc_nm', label:'공정', type:'text', disabled:true},
    {id:'lot_no', label:'LOT NO', type:'text', disabled:true}
  ];

  const inputWork = useInputGroup('INPUT_ITEMS_WORK', INPUT_ITEMS_WORK);
  //#endregion

  //#region 함수 
  const onSearch = () => {
    const {values} = searchRef?.current;
    const searchParams = values;

    setWorkData({});

    getData(searchParams, URI_PATH_GET_PRD_WORKS).then((res) => {
      setWorks(res);
      // 입하정보 및 실적정보 초기화
      inputWork.ref.current.resetForm();
    });
  }
  
  const onCreate = (ev) => {
    if(!workData){
      message.warning('실적을 입력 후 등록 버튼을 눌러주세요.')
      return;
    }
    setCreatePopupVisible(true);
  }
  //#endregion

  //#region Hook 함수
  useLayoutEffect(() => {
    if (workData && !createPopupVisible) {
      INSP_RESULT_DETAIL_GRID.onSearch(workData)
    }
  }, [workData, createPopupVisible]);

  //#endregion

  //#region 렌더부
  return (
    <>
      <Typography.Title level={5} style={{marginBottom:-16, fontSize:14}}><CaretRightOutlined />공정검사 이력</Typography.Title>
      <Divider style={{marginBottom:10}}/>
      <Container>
        <div>
          <Searchbox
            id='receive_insp_result_search'
            innerRef={searchRef}
            searchItems={SEARCH_ITEMS}
            onSearch={onSearch}
            boxShadow={false}
          />
        </div>
        <Datagrid
          gridId={'FINAL_INSP_RESULTS'}
          ref={gridRef}
          gridMode={'view'}
          columns={COLUMNS_WORKS}
          height={300}
          data={works}
          onAfterClick={(ev) => {
            const {rowKey, targetType} = ev;
        
            if (targetType === 'cell') {
              try {
                const row = ev?.instance?.store?.data?.rawData[rowKey];

                inputWork.setValues(row);
                setWorkData(row);
                INSP_RESULT_DETAIL_GRID.onSearch(row);
                INSP_RESULT_DETAIL_GRID.onClearResultDetail();
              } catch(e) {
                console.log(e);
        
              } finally {
                
              }
            }
          }}
        />
      </Container>
      <Row gutter={[16,0]}>
        {/* 품목 정보 */}
        <Col span={24} style={{paddingLeft:0, paddingRight:0}}>
          <Typography.Title level={5} style={{marginTop:30, marginBottom:-16, fontSize:14}}><CaretRightOutlined />실적 정보</Typography.Title>
          <div style={{width:'100%', display:'inline-block', marginTop:-26}}> 
            <Space size={[6,0]} style={{float:'right'}}>
              <Button btnType='buttonFill' widthSize='auto' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onCreate} disabled={!permissions?.create_fg}>신규 추가</Button>
            </Space>
          </div>
          <Divider style={{marginTop:2, marginBottom:10}}/>
          <Row gutter={[16,16]}>
            <InputGroupbox {...inputWork.props} />
          </Row>
        </Col>
      </Row>
      <Typography.Title level={5} style={{marginTop:30, marginBottom:-16, fontSize:14}}><CaretRightOutlined />검사정보</Typography.Title>
      <Divider style={{marginBottom:10}}/>
      {INSP_RESULT_DETAIL_GRID.component}
      <INSP_RESULT_CREATE_POPUP workData={workData} popupVisible={createPopupVisible} setPopupVisible={setCreatePopupVisible} />

      {contextHolder}
    </>
  );
  //#endregion
}
//#endregion

//#region 공정검사 결과
const INSP_RESULT_DETAIL_GRID_INFO = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region Ref 관리
  const procInspResultsGridRef = useRef<Grid>();
  const procInspResultDetailsGridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리 
  const [editPopupVisible, setEditPopupVisible] = useState(false)
  //#endregion

  //#region 데이터 관리
  const [workData, setWorkData] = useState<TGetPrdWork>({})
  const [procInspResults, setProcInspResults] = useState<TGetQmsProcInspResult[]>([]);
  const [procInspResultIncludeDetails, setProcInspResultIncludeDetails] = useState<TGetQmsProcInspResultIncludeDetails>({});
  //const [procInspResults, setProcInspResults] = useState<TGetQmsFinalInspResultIncludeDetails>({});
  //#endregion

  //#region 그리드 컬럼세팅
  const COLUMNS_INSP_RESULTS:IGridColumn[] = [
    {header:'검사성적서UUID', name:'insp_result_uuid', alias:'uuid', width:200, hidden:true},
    {header:'검사유형코드', name:'insp_type_cd', width:200, hidden:true},
    {header:'검사유형명', name:'insp_type_nm', width:120, hidden:true},
    {header:'검사유형', name:'insp_detail_type_nm', width:120, hidden:false},
    {header:'생산실적UUID', name:'work_uuid', width:200, hidden:true},
    {header:'차수', name:'seq', width:80, hidden:false},
    {header:'검사기준서UUID', name:'insp_uuid', width:200, hidden:true},
    {header:'검사기준서 번호', name:'insp_no', width:200, hidden:true},
    {header:'검사일시', name:'reg_date', width:100, hidden:false},
    {header:'검사자UUID', name:'emp_uuid', width:100, hidden:true},
    {header:'검사자', name:'emp_nm', width:100, hidden:false},
    {header:'판정여부', name:'insp_result_fg', width:100, hidden:true},
    {header:'판정', name:'insp_result_state', width:100, hidden:false},
    {header:'비고', name:'remark', width:150, hidden:false},
  ];

  const COLUMNS_INSP_RESULT_DETAILS:IGridColumn[] = [
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
  
  const COLUMNS_INSP_RESULT_DETAILS_INCLUDE_VALUES = useMemo(() => {
      let items:IGridColumn[] = COLUMNS_INSP_RESULT_DETAILS;

      if (procInspResultIncludeDetails?.header?.max_sample_cnt > 0) {
        //시료수 최대값에 따라 컬럼 생성
        for (let i = 1; i <= procInspResultIncludeDetails?.header?.max_sample_cnt; i++) {
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
      
  }, [procInspResultIncludeDetails]);
  //#endregion

  //#region inputbox 세팅
  const INPUT_ITEMS_INSP_RESULT:IInputGroupboxItem[] = [
    {label:'최종판정', id:'insp_result_state', type:'text', disabled:true},
    {label:'검사차수', id:'seq', type:'number', disabled:true},
    {label:'검사일', id:'reg_date', type:'date', disabled:true },
    {label:'검사시간', id:'reg_date_time', type:'time', disabled:true },
    {label:'검사자', id:'emp_nm', type:'text', disabled:true}, 
    {label:'검사유형', id:'insp_detail_type_nm', type:'text', disabled:true},
    {label:'비고', id:'remark', type:'text', disabled:true}
  ];

  const inputInspResult = useInputGroup('INPUT_INSP_RESULT', INPUT_ITEMS_INSP_RESULT, {title:'검사정보',});
  //#endregion

  //#region 함수 
  const onEdit = (ev) => {
    if(!procInspResultIncludeDetails?.header?.insp_result_uuid){
      message.warning('수정 할 성적서를 선택 후 수정기능을 이용해주세요.')
      return;
    }
    setEditPopupVisible(true);
  }

  const onDelete = async (ev) => {
    if(!procInspResultIncludeDetails?.header?.insp_result_uuid){
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
          { uuid: procInspResultIncludeDetails?.header?.insp_result_uuid }, 
          URI_PATH_DELETE_QMS_PROC_INSP_RESULTS, 
          'delete', 
          'success'
        ).then((value) => {
          if (!value) return;
          onSearch(workData);
          onClearResultDetail();
          message.info('저장되었습니다.');
        }).catch(e => {
          console.log(e);
        });
      },
      onCancel: () => {},
      okText: '예',
      cancelText: '아니오',
    });

    
  }

  const onClear = () => {
    inputInspResult.ref.current.resetForm();
    setProcInspResults([]);
    setProcInspResultIncludeDetails({});
  }

  const onClearResultDetail = () => {
    inputInspResult.ref.current.resetForm();
    setProcInspResultIncludeDetails({});
  }

  const onSearch = (workData:TGetPrdWork) => {
    if(!workData)return;
    
    setWorkData(workData);
    if (workData.work_uuid) {
      getData(
        {
          insp_detail_type: 'all',
          work_uuid: workData.work_uuid
        },
        URI_PATH_GET_QMS_PROC_INSP_RESULTS,
        'raws'
      ).then((res) => {
        setProcInspResults(res);
      }).catch((err) => {
        onClear();
        message.error('에러');
      });
    } else {
      onClear();
    }
  };

  const onSesrchInspResultDetail = (insp_result_uuid) => {
    const searchUriPath = URI_PATH_GET_QMS_PROC_INSP_RESULT_INCLUDE_DETAILS.replace('{uuid}', insp_result_uuid)
    getData(
      {},
      searchUriPath,
      'header-details'
    ).then((res:TGetQmsProcInspResultIncludeDetails) => {
      setProcInspResultIncludeDetails(res);
      inputInspResult.setValues({
        ...res.header, 
        reg_date_time: res.header.reg_date, 
      });
    }).catch((err) => {
      inputInspResult.ref.current.resetForm();
      setProcInspResultIncludeDetails({});
      message.error('에러');
    });
  }
  //#endregion

  //#region Hook 함수
  useLayoutEffect(() => {
    if (!editPopupVisible) {
      onSearch(workData);
    }
  }, [editPopupVisible]);
  //#endregion

  //#region 렌더부
  const component = (
    <>
      <Container>
        <div style={{width:'100%', display:'inline-block'}}>
          <Space size={[6,0]} style={{float:'right', marginTop:-70}}>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='add' colorType='blue' onClick={onEdit} disabled={!permissions?.update_fg}>수정</Button>
            <Button btnType='buttonFill' widthSize='medium' heightSize='small' fontSize='small' ImageType='delete' colorType='red' onClick={onDelete} disabled={!permissions?.delete_fg}>삭제</Button>
          </Space>
        </div>
        <Row gutter={[16,0]} style={{minHeight:550, maxHeight:600, marginTop:-15}}>
          <Col span={8} style={{overflow:'auto'}}>
            <Datagrid 
                height={560}
                gridId={'INSP_RESULTS'}
                ref={procInspResultsGridRef}
                gridMode={'view'}
                columns={COLUMNS_INSP_RESULTS}
                data={procInspResults}
                onAfterClick={(ev) => {
                  const {rowKey, targetType} = ev;
                  if (targetType === 'cell') {
                    const row = ev?.instance?.store?.data?.rawData[rowKey];
                    onSesrchInspResultDetail(row?.insp_result_uuid)
                  }
                }}
              />
          </Col>
          <Col span={16} style={{minHeight:550, maxHeight:600, overflow:'auto'}}>
            <InputGroupbox boxShadow={false} {...inputInspResult.props} />
            <p/>
            <Datagrid 
              height={350}
              gridId={'INSP_RESULT_INCLUDE_VALUES'}
              ref={procInspResultDetailsGridRef}
              gridMode={'view'}
              columns={COLUMNS_INSP_RESULT_DETAILS_INCLUDE_VALUES}
              data={procInspResultIncludeDetails?.details}
            />
          </Col>
        </Row>
      </Container>
      <INSP_RESULT_EDIT_POPUP 
        workData={workData} 
        inspResultUuid={procInspResultIncludeDetails?.header?.insp_result_uuid} 
        popupVisible={editPopupVisible} 
        setPopupVisible={setEditPopupVisible} 
        onAfterCloseSearch={onSesrchInspResultDetail}
      />
    </>
  );

  return {
    onSearch,
    onClearResultDetail,

    component,
  }

  //#endregion
};
//#endregion

//#region 성적서 신규 팝업
const INSP_RESULT_CREATE_POPUP = (props:{
  workData:TGetPrdWork,
  popupVisible:boolean,
  setPopupVisible: (value?) => void
}) =>{
  //#region Ref 관리
  const gridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리 

  //#endregion

  //#region 데이터 관리
  const [inspIncludeDetails, setInspIncludeDetails] = useState<TGetQmsProcInspIncludeDetails>({});
  //#endregion

  //#region 그리드 컬럼세팅

  const COLUMNS_INSP_DETAILS:IGridColumn[] = [
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
  
  const COLUMNS_INSP_DETAILS_INCLUDE_VALUES = useMemo(() => {
      let items:IGridColumn[] = COLUMNS_INSP_DETAILS;

      if (inspIncludeDetails?.header?.max_sample_cnt > 0) {
        //시료수 최대값에 따라 컬럼 생성
        for (let i = 1; i <= inspIncludeDetails?.header?.max_sample_cnt; i++) {
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
      
  }, [inspIncludeDetails]);
  //#endregion

  //#region inputbox 세팅
  const INPUT_ITEMS_WORK:IInputGroupboxItem[] = [
    {id:'reg_date', label:'실적일시', type:'date', disabled:true},
    {id:'prod_no', label:'품번', type:'text', disabled:true},
    {id:'prod_nm', label:'품명', type:'text', disabled:true},
    {id:'prod_std', label:'규격', type:'text', disabled:true},
    {id:'unit_nm', label:'단위', type:'text', disabled:true},
    {id:'proc_nm', label:'공정', type:'text', disabled:true},
    {id:'lot_no', label:'LOT NO', type:'text', disabled:true}
  ];

  const INPUT_ITEMS_INSP_RESULT:IInputGroupboxItem[] = [
    {id:'insp_uuid', label:'검사기준서UUID', type:'text', disabled:true, hidden:true},
    {id:'insp_result_fg', label:'최종판정', type:'text', disabled:true, hidden:true },
    {id:'insp_result_state', label:'최종판정', type:'text', disabled:true},
    {id:'insp_detail_type_cd', label:'검사유형', type:'combo', 
      dataSettingOptions:{
        codeName:'insp_detail_type_cd',
        textName:'insp_detail_type_nm',
        uriPath:'/adm/insp-detail-types',
        params: {
          insp_type_cd: 'PROC_INSP'
        }
      },
      onAfterChange: (ev) => {}
    },
    {id:'reg_date', label:'검사일자', type:'date', default:getToday() },
    {id:'reg_date_time', label:'검사시간', type:'time'},
    {id:'emp_uuid', label:'검사자UUID', type:'text', hidden:true},
    {id:'emp_nm', label:'검사자', type:'text', usePopup:true, popupKey:'사원관리', popupKeys:['emp_nm', 'emp_uuid'], params:{emp_status:'incumbent'}}, 
    {id:'remark', label:'비고', type:'text'},
  ];

  const inputWork = useInputGroup('INPUT_CREATE_ITEMS_WORK', INPUT_ITEMS_WORK, {title:'작업 정보'});
  const inputInspResult = useInputGroup('INPUT_CREATE_POPUP_INSP_RESULT', INPUT_ITEMS_INSP_RESULT, {title:'검사정보',});
  //#endregion

  //#region 함수 
  const onClear = () => {
    inputWork.ref.current.resetForm();
    inputInspResult.ref.current.resetForm();
    setInspIncludeDetails({});
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
      } else {
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
    //#endregion
  };

  const onSave = async (ev) => {
    let headerData:TPostQmsProcInspResultsHeader;
    let detailDatas:TPostQmsProcInspResultsDetail[]=[];

    const inputInspResultValues = inputInspResult?.ref?.current?.values

    const saveGridInstance = gridRef?.current?.getInstance();

    if(!inputInspResultValues?.insp_result_fg){
      message.warn('최종판정이 되지 않았습니다. 확인 후 다시 저장해주세요.')
      return;
    }else if(!inputInspResultValues?.emp_uuid){
      message.warn('검사자를 등록해주세요.')
      return;
    }

    headerData = {
      factory_uuid: getUserFactoryUuid(),
      work_uuid: props?.workData?.work_uuid,
      insp_detail_type_cd: inputInspResultValues?.insp_detail_type_cd,
      insp_uuid: inspIncludeDetails?.header?.insp_uuid,
      prod_uuid: props?.workData?.prod_uuid,
      lot_no: props?.workData?.lot_no,
      emp_uuid: inputInspResultValues?.emp_uuid,
      reg_date: inputInspResultValues?.reg_date + ' ' + inputInspResultValues?.reg_date_time + ':00',
      insp_result_fg: inputInspResultValues?.insp_result_fg,
      insp_qty: 0,
      pass_qty: 0,
      reject_qty: 0,
      remark: inputInspResultValues?.remark,
    }

    for (let i = 0; i <= saveGridInstance?.getRowCount() - 1 ; i++) {
      const values:object[] = [];
      const row:TGetQmsProcInspResultIncludeDetailsDetail = saveGridInstance?.getRow(i) as TGetQmsProcInspResultIncludeDetailsDetail;

      for (let k = 1; k <= row.sample_cnt; k++) {
        const value:TPostQmsProcInspResultsDetailValue = row?.['x'+k+'_insp_value'];
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
        insp_detail_uuid: (row?.insp_detail_uuid as any),
        insp_result_fg: row?.insp_result_fg,
        remark: row?.remark
      })
    }

    const saveData:TPostQmsFinalInspResult = ({
      header:headerData,
      details:detailDatas
    });

    await executeData(saveData, URI_PATH_POST_QMS_PROC_INSP_RESULTS, 'post', 'success').then((value) => {
      if (!value) return;
      message.info('저장되었습니다.')
      props.setPopupVisible(false);
    }).catch(e => {console.log(e)});
    onClear();
    props.setPopupVisible(false);
  };

  const onCancel = (ev) => {
    onClear();
    props.setPopupVisible(false);
  };
  //#endregion

  //#region Hook 함수
  useLayoutEffect(() => {
    if (props?.workData && props.popupVisible) {
      inputWork.setValues(props.workData)
    }
  }, [props?.workData, props?.popupVisible]);

  useLayoutEffect(() => {
    if (props?.workData && props.popupVisible && inputInspResult?.values?.insp_detail_type_cd) {
      if (inputInspResult?.values?.insp_detail_type_cd != '-') {
        const insp_detail_type:string = 
          inputInspResult?.values?.insp_detail_type_cd === 'PATROL_PROC' ? 'patrolProc' :
          inputInspResult?.values?.insp_detail_type_cd === 'SELF_PROC' ? 'selfProc' :
          null
        getData(
          {
            work_uuid: props?.workData?.work_uuid,
            insp_detail_type: insp_detail_type
          },
          URI_PATH_GET_QMS_PROC_INSP_INCLUDE_DETAILS,
          'header-details'
        ).then((res) => {
          setInspIncludeDetails(res);
        }).catch((err) => {
          onClear();
          message.error('에러');
        });
      } else {
        setInspIncludeDetails({});
      }
    }
  }, [props?.workData, props?.popupVisible, inputInspResult?.values?.insp_detail_type_cd]);
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
      columns={COLUMNS_INSP_DETAILS_INCLUDE_VALUES}
      inputProps={[
        inputWork.props,
        inputInspResult.props,
      ]}
      onAfterChange={onAfterChange}
      saveUriPath={null}
      searchUriPath={null}
      data={inspIncludeDetails?.details}
      hiddenActionButtons={true}
      saveType='basic'
      visible={props.popupVisible}
    />
  );
  //#endregion
};
//#endregion

//#region 성적서 수정 팝업
const INSP_RESULT_EDIT_POPUP = (props:{
  workData:TGetPrdWork,
  inspResultUuid:string,
  popupVisible:boolean,
  setPopupVisible: (value?) => void,
  onAfterCloseSearch?: (insp_result_uuid:string) => void
}) =>{
  //#region Ref 관리
  const gridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리 
  
  //#endregion

  //#region 데이터 관리
  const [inspResultIncludeDetails, setInspResultIncludeDetails] = useState<TGetQmsProcInspResultIncludeDetails>({});
  //#endregion

  //#region 그리드 컬럼세팅
  const COLUMNS_INSP_RESULT_DETAILS:IGridColumn[] = [
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
  
  const COLUMNS_INSP_RESULT_DETAILS_INCLUDE_VALUES = useMemo(() => {
      let items:IGridColumn[] = COLUMNS_INSP_RESULT_DETAILS;
      
      if (inspResultIncludeDetails?.header?.max_sample_cnt > 0) {
        //시료수 최대값에 따라 컬럼 생성
        for (let i = 1; i <= inspResultIncludeDetails?.header?.max_sample_cnt; i++) {
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
      
  }, [inspResultIncludeDetails]);
  //#endregion

  //#region inputbox 세팅
  const INPUT_ITEMS_WORK:IInputGroupboxItem[] = [
    {id:'reg_date', label:'실적일시', type:'date', disabled:true},
    {id:'prod_no', label:'품번', type:'text', disabled:true},
    {id:'prod_nm', label:'품명', type:'text', disabled:true},
    {id:'prod_std', label:'규격', type:'text', disabled:true},
    {id:'unit_nm', label:'단위', type:'text', disabled:true},
    {id:'proc_nm', label:'공정', type:'text', disabled:true},
    {id:'lot_no', label:'LOT NO', type:'text', disabled:true}
  ];

  const INPUT_ITEMS_INSP_RESULT:IInputGroupboxItem[] = [
    {id:'insp_uuid', label:'검사기준서UUID', type:'text', disabled:true, hidden:true},
    {id:'insp_result_fg', label:'최종판정', type:'text', disabled:true, hidden:true },
    {id:'insp_result_state', label:'최종판정', type:'text', disabled:true},
    {id:'seq', label:'검사차수', type:'number', disabled:true},
    {id:'insp_detail_type_cd', label:'검사유형', type:'text', disabled:true},
    {id:'reg_date', label:'검사일자', type:'date', default:getToday() },
    {id:'reg_date_time', label:'검사시간', type:'time'},
    {id:'emp_uuid', label:'검사자UUID', type:'text', hidden:true},
    {id:'emp_nm', label:'검사자', type:'text', usePopup:true, popupKey:'사원관리', popupKeys:['emp_nm', 'emp_uuid'], params:{emp_status:'incumbent'}}, 
    {id:'remark', label:'비고', type:'text'},
  ];

  const inputWork = useInputGroup('INPUT_EDIT_POPUP_INSP_RESULT', INPUT_ITEMS_WORK, {title:'작업 정보'});
  const inputInspResult = useInputGroup('INPUT_EDIT_POPUP_INSP_RESULT', INPUT_ITEMS_INSP_RESULT, {title:'검사 정보',});
  //#endregion

  //#region 함수 
  const onClear = () => {
    inputWork?.ref?.current?.resetForm();
    inputInspResult?.ref?.current?.resetForm();
    setInspResultIncludeDetails({});
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
      } else {
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
    //#endregion
  };

  const onSave = async (ev) => {
    let headerData:TPutQmsProcInspResultsHeader;
    let detailDatas:TPutQmsProcInspResultsDetail[]=[];

    const inputInspResultValues = inputInspResult?.ref?.current?.values

    const saveGridInstance = gridRef?.current?.getInstance();

    if(!inputInspResultValues?.insp_result_fg){
      message.warn('최종판정이 되지 않았습니다. 확인 후 다시 저장해주세요.')
      return;
    }else if(!inputInspResultValues?.emp_uuid){
      message.warn('검사자를 등록해주세요.')
      return;
    }

    headerData = {
      uuid: inputInspResultValues?.insp_result_uuid,
      emp_uuid: inputInspResultValues?.emp_uuid,
      insp_result_fg: inputInspResultValues?.insp_result_fg,
      insp_qty: 0,
      pass_qty: 0,
      reject_qty: 0,
      remark: inputInspResultValues?.remark,
    }

    for (let i = 0; i <= saveGridInstance?.getRowCount() - 1 ; i++) {
      const values:TPutQmsProcInspResultsDetailValue[] = [];
      const row:TGetQmsProcInspResultIncludeDetailsDetail = saveGridInstance?.getRow(i) as TGetQmsProcInspResultIncludeDetailsDetail;

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
        insp_result_fg: row?.insp_result_fg,
        remark: row?.remark
      })
    }

    const saveData:TPutQmsFinalInspResult = ({
      header:headerData,
      details:detailDatas
    });
    await executeData(saveData, URI_PATH_PUT_QMS_PROC_INSP_RESULTS, 'put', 'success').then((value) => {
      if (!value) return;
      message.info('저장되었습니다.')
      props.onAfterCloseSearch(props?.inspResultUuid);
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
  useLayoutEffect(() => {
    if (props?.workData && props.popupVisible) {
      inputWork.setValues(props.workData)
    }
  }, [props?.workData, props?.popupVisible]);

  useLayoutEffect(() => {
    const searchUriPath = URI_PATH_GET_QMS_PROC_INSP_RESULT_INCLUDE_DETAILS.replace('{uuid}', props.inspResultUuid)

    if (props.inspResultUuid && props.popupVisible) {
      getData(
        {},
        searchUriPath,
        'header-details'
      ).then((res:TGetQmsProcInspResultIncludeDetails) => {
        setInspResultIncludeDetails(res);
        inputInspResult.setValues({...res.header, reg_date_time:res.header.reg_date});
      }).catch((err) => {
        onClear();
        message.error('에러');
      });
    } else {
      onClear();
    }
  }, [props.popupVisible, props.inspResultUuid]);
  //#endregion

  //#region 컴포넌트 rander
  return (
    <GridPopup
      title='공정검사 성적서 수정'
      onOk={onSave}
      okText='저장'
      cancelText='취소'
      onCancel={onCancel}
      gridMode='update'
      popupId={'INSP_EDIT_POPUP'}
      gridId={'INSP_EDIT_POPUP_GRID'}
      ref={gridRef}
      columns={COLUMNS_INSP_RESULT_DETAILS_INCLUDE_VALUES}
      inputProps={[
        inputWork.props,
        inputInspResult.props,
      ]}
      onAfterChange={onAfterChange}
      saveUriPath={null}
      searchUriPath={null}
      data={inspResultIncludeDetails.details}
      hiddenActionButtons={true}
      saveType='basic'
      visible={props.popupVisible}
    />
  );
  //#endregion
};
//#endregion