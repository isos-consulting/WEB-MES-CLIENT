import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import { Divider, Typography, Modal, Col, Row, message } from 'antd';
import dayjs from 'dayjs';
import { FormikProps, FormikValues } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import {
  Container,
  Datagrid,
  IGridColumn,
  ISearchItem,
  Searchbox,
} from '~/components/UI';
import {
  IInputGroupboxItem,
  InputGroupbox,
} from '~/components/UI/input-groupbox/input-groupbox.ui';
import { getData, getToday } from '~/functions';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
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
const URI_PATH_GET_QMS_PROC_INSP_RESULTS = '/qms/proc/insp-results';
const URI_PATH_GET_QMS_PROC_INSP_RESULT_INCLUDE_DETAILS =
  '/qms/proc/insp-result/{uuid}/include-details';

type TGetPrdWork = {
  work_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  reg_date?: string;
  order_uuid?: string;
  order_no?: string;
  seq?: number;
  proc_uuid?: string;
  proc_cd?: string;
  proc_nm?: string;
  workings_uuid?: string;
  workings_cd?: string;
  workings_nm?: string;
  equip_uuid?: string;
  equip_cd?: string;
  equip_nm?: string;
  prod_uuid?: string;
  prod_no?: string;
  prod_nm?: string;
  item_type_uuid?: string;
  item_type_cd?: string;
  item_type_nm?: string;
  prod_type_uuid?: string;
  prod_type_cd?: string;
  prod_type_nm?: string;
  model_uuid?: string;
  model_cd?: string;
  model_nm?: string;
  rev?: string;
  prod_std?: string;
  unit_uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
  lot_no?: string;
  order_qty?: number;
  total_qty?: number;
  qty?: number;
  reject_qty?: number;
  start_date?: string;
  end_date?: string;
  work_time?: number;
  shift_uuid?: string;
  shift_nm?: string;
  worker_cnt?: number;
  worker_nm?: string;
  complete_state?: string;
  complete_fg?: boolean;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  order_remark?: string;
  remark?: string;
};

type TGetQmsProcInspResult = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_cd?: string;
  insp_type_nm?: string;
  insp_detail_type_cd?: string;
  insp_detail_type_nm?: string;
  work_uuid?: string;
  seq?: number;
  insp_uuid?: string;
  insp_no?: string;
  prod_uuid?: string;
  prod_no?: string;
  prod_nm?: string;
  item_type_uuid?: string;
  item_type_cd?: string;
  item_type_nm?: string;
  prod_type_uuid?: string;
  prod_type_cd?: string;
  prod_type_nm?: string;
  model_uuid?: string;
  model_cd?: string;
  model_nm?: string;
  rev?: string;
  prod_std?: string;
  unit_uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
  lot_no?: string;
  emp_uuid?: string;
  emp_cd?: string;
  emp_nm?: string;
  reg_date?: string;
  insp_result_fg?: boolean;
  insp_result_state?: string;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  remark?: string;
};

type TGetQmsProcInspResultIncludeDetailsHeader = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_cd?: string;
  insp_type_nm?: string;
  insp_detail_type_cd?: string;
  insp_detail_type_nm?: string;
  work_uuid?: string;
  seq?: number;
  insp_uuid?: string;
  insp_no?: string;
  prod_uuid?: string;
  prod_no?: string;
  prod_nm?: string;
  item_type_uuid?: string;
  item_type_cd?: string;
  item_type_nm?: string;
  prod_type_uuid?: string;
  prod_type_cd?: string;
  prod_type_nm?: string;
  model_uuid?: string;
  model_cd?: string;
  model_nm?: string;
  rev?: string;
  prod_std?: string;
  unit_uuid?: string;
  unit_cd?: string;
  unit_nm?: string;
  lot_no?: string;
  emp_uuid?: string;
  emp_cd?: string;
  emp_nm?: string;
  reg_date?: string;
  insp_result_fg?: boolean;
  insp_result_state?: string;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  max_sample_cnt?: number;
  remark?: string;
};

type TGetQmsProcInspResultIncludeDetailsDetail = {
  insp_result_detail_info_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_result_uuid?: string;
  insp_detail_uuid?: string;
  insp_item_type_uuid?: string;
  insp_item_type_cd?: string;
  insp_item_type_nm?: string;
  insp_item_uuid?: string;
  insp_item_cd?: string;
  insp_item_nm?: string;
  insp_item_desc?: string;
  spec_std?: string;
  spec_min?: number;
  spec_max?: number;
  insp_method_uuid?: string;
  insp_method_cd?: string;
  insp_method_nm?: string;
  insp_tool_uuid?: string;
  insp_tool_cd?: string;
  insp_tool_nm?: string;
  sample_cnt?: number;
  insp_cycle?: string;
  sortby?: number;
  insp_result_fg?: boolean;
  insp_result_state?: string;
  remark?: string;
  xn_insp_result_detail_value_uuid?: string;
  xn_sample_no?: number;
  xn_insp_value?: number;
  xn_insp_result_fg?: boolean;
  xn_insp_result_state?: string;
};

type TGetQmsProcInspResultIncludeDetails = {
  header?: TGetQmsProcInspResultIncludeDetailsHeader;
  details?: TGetQmsProcInspResultIncludeDetailsDetail[];
};
//#endregion

//#region 🔶공정검사 성적서
export const PgQmsProcInspResultReport = () => {
  //#region ✅설정값
  const [, contextHolder] = Modal.useModal();
  const INSP_RESULT_DETAIL_GRID = INSP_RESULT_DETAIL_GRID_INFO();
  //#region Ref 관리
  const searchRef = useRef<FormikProps<FormikValues>>();
  const gridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리

  //#endregion

  //#region 데이터 관리
  const [works, setWorks] = useState<TGetPrdWork[]>([]);
  //#endregion

  //#region ✅조회조건
  const SEARCH_ITEMS: ISearchItem[] = [
    { type: 'date', id: 'start_date', label: '작업일', default: getToday(-7) },
    { type: 'date', id: 'end_date', default: getToday() },
  ];
  //#endregion

  //#region 그리드 컬럼세팅
  const COLUMNS_WORKS: IGridColumn[] = [
    {
      header: '생산실적UUID',
      name: 'work_uuid',
      alias: 'uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업구분',
      name: 'complete_state',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '실적 일시',
      name: 'reg_date',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업지시UUID',
      name: 'order_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '지시번호',
      name: 'order_no',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '생산실적 순번',
      name: 'seq',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '공정',
      name: 'proc_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업장',
      name: 'workings_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '설비',
      name: 'equip_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '품목유형',
      name: 'item_type_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '제품유형',
      name: 'prod_type_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '품번',
      name: 'prod_no',
      width: 150,
      hidden: false,
      format: 'text',
    },
    {
      header: '품명',
      name: 'prod_nm',
      width: 150,
      hidden: false,
      format: 'text',
    },
    {
      header: '모델',
      name: 'model_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    { header: 'Rev', name: 'rev', width: 100, hidden: false, format: 'text' },
    {
      header: '규격',
      name: 'prod_std',
      width: 100,
      hidden: false,
      format: 'text',
    },
    {
      header: '단위',
      name: 'unit_nm',
      width: 80,
      hidden: false,
      format: 'text',
    },
    {
      header: 'LOT NO',
      name: 'lot_no',
      width: 100,
      hidden: false,
      format: 'text',
    },
    {
      header: '지시 수량',
      name: 'order_qty',
      width: 100,
      hidden: false,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '생산 수량',
      name: 'total_qty',
      width: 100,
      hidden: false,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '양품 수량',
      name: 'qty',
      width: 100,
      hidden: false,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '부적합 수량',
      name: 'reject_qty',
      width: 100,
      hidden: false,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '생산시작 일시',
      name: 'start_date',
      width: 100,
      hidden: false,
      format: 'datetime',
    },
    {
      header: '생산종료 일시',
      name: 'end_date',
      width: 100,
      hidden: false,
      format: 'datetime',
    },
    {
      header: '작업시간',
      name: 'work_time',
      width: 80,
      hidden: true,
      format: 'text',
    },
    {
      header: '작업교대명',
      name: 'shift_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업자수',
      name: 'worker_cnt',
      width: 100,
      hidden: false,
      format: 'text',
    },
    {
      header: '작업자명',
      name: 'worker_nm',
      width: 100,
      hidden: false,
      format: 'text',
    },
    {
      header: '입고 창고',
      name: 'to_store_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '입고 위치',
      name: 'to_location_nm',
      width: 120,
      hidden: false,
      format: 'text',
    },
    {
      header: '지시 비고',
      name: 'order_remark',
      width: 150,
      hidden: false,
      format: 'text',
    },
    {
      header: '생산 비고',
      name: 'remark',
      width: 150,
      hidden: false,
      format: 'text',
    },
  ];
  //#endregion

  //#region inputbox 세팅
  const INPUT_ITEMS_WORK: IInputGroupboxItem[] = [
    { id: 'reg_date', label: '실적일시', type: 'date', disabled: true },
    { id: 'prod_no', label: '품번', type: 'text', disabled: true },
    { id: 'prod_nm', label: '품명', type: 'text', disabled: true },
    { id: 'prod_std', label: '규격', type: 'text', disabled: true },
    { id: 'unit_nm', label: '단위', type: 'text', disabled: true },
    { id: 'proc_nm', label: '공정', type: 'text', disabled: true },
    { id: 'lot_no', label: 'LOT NO', type: 'text', disabled: true },
  ];

  const inputWork = useInputGroup('INPUT_ITEMS_WORK', INPUT_ITEMS_WORK);
  //#endregion

  //#region 함수
  const onSearch = () => {
    const { values } = searchRef?.current;
    const searchParams = values;
    getData(searchParams, URI_PATH_GET_PRD_WORKS).then(res => {
      setWorks(res);
      // 입하정보 및 실적정보 초기화
      inputWork.ref.current.resetForm();
    });
  };
  //#endregion

  //#region Hook 함수

  //#endregion

  //#region 렌더부
  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: -16, fontSize: 14 }}>
        <CaretRightOutlined />
        공정검사 이력
      </Typography.Title>
      <Divider style={{ marginBottom: 10 }} />
      <Container>
        <div>
          <Searchbox
            id="receive_insp_result_search"
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
          onAfterClick={ev => {
            const { rowKey, targetType } = ev;

            if (targetType === 'cell') {
              try {
                const row = ev?.instance?.store?.data?.rawData[rowKey];

                inputWork.setValues(row);
                INSP_RESULT_DETAIL_GRID.onSearch(row);
                INSP_RESULT_DETAIL_GRID.onClearResultDetail();
              } catch (e) {
                console.log(e);
              } finally {
                // 그리드 셀 클릭 후 처리할 코드 작성
              }
            }
          }}
        />
      </Container>
      <Row gutter={[16, 0]}>
        {/* 품목 정보 */}
        <Col span={24} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Typography.Title
            level={5}
            style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
          >
            <CaretRightOutlined />
            실적 정보
          </Typography.Title>
          <Divider style={{ marginTop: 2, marginBottom: 10 }} />
          <Row gutter={[16, 16]}>
            <InputGroupbox boxShadow={false} {...inputWork.props} />
          </Row>
        </Col>
      </Row>
      <Typography.Title
        level={5}
        style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
      >
        <CaretRightOutlined />
        검사정보
      </Typography.Title>
      <Divider style={{ marginBottom: 10 }} />
      {INSP_RESULT_DETAIL_GRID.component}
      {contextHolder}
    </>
  );
  //#endregion
};
//#endregion

//#region 공정검사 결과
const INSP_RESULT_DETAIL_GRID_INFO = () => {
  //#region Ref 관리
  const procInspResultsGridRef = useRef<Grid>();
  const procInspResultDetailsGridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리

  //#endregion

  //#region 데이터 관리
  const [procInspResults, setProcInspResults] = useState<
    TGetQmsProcInspResult[]
  >([]);
  const [procInspResultIncludeDetails, setProcInspResultIncludeDetails] =
    useState<TGetQmsProcInspResultIncludeDetails>({});
  //const [procInspResults, setProcInspResults] = useState<TGetQmsFinalInspResultIncludeDetails>({});
  //#endregion

  //#region 그리드 컬럼세팅
  const COLUMNS_INSP_RESULTS: IGridColumn[] = [
    {
      header: '검사성적서UUID',
      name: 'insp_result_uuid',
      alias: 'uuid',
      width: 200,
      hidden: true,
    },
    { header: '검사유형코드', name: 'insp_type_cd', width: 200, hidden: true },
    { header: '검사유형명', name: 'insp_type_nm', width: 120, hidden: true },
    {
      header: '검사유형',
      name: 'insp_detail_type_nm',
      width: 120,
      hidden: false,
    },
    { header: '생산실적UUID', name: 'work_uuid', width: 200, hidden: true },
    { header: '차수', name: 'seq', width: 80, hidden: false },
    { header: '검사기준서UUID', name: 'insp_uuid', width: 200, hidden: true },
    { header: '검사기준서 번호', name: 'insp_no', width: 200, hidden: true },
    { header: '검사일시', name: 'reg_date', width: 100, hidden: false },
    { header: '검사자UUID', name: 'emp_uuid', width: 100, hidden: true },
    { header: '검사자', name: 'emp_nm', width: 100, hidden: false },
    { header: '판정여부', name: 'insp_result_fg', width: 100, hidden: true },
    { header: '판정', name: 'insp_result_state', width: 100, hidden: false },
    { header: '비고', name: 'remark', width: 150, hidden: false },
  ];

  const COLUMNS_INSP_RESULT_DETAILS: IGridColumn[] = [
    {
      header: '검사기준서 상세UUID',
      name: 'insp_detail_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사항목 유형UUID',
      name: 'insp_item_type_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사항목 유형명',
      name: 'insp_item_type_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '검사항목UUID',
      name: 'insp_item_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사항목명',
      name: 'insp_item_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '검사 기준',
      name: 'spec_std',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '최소 값',
      name: 'spec_min',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '최대 값',
      name: 'spec_max',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '검사방법UUID',
      name: 'insp_method_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사방법명',
      name: 'insp_method_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '검사구UUID',
      name: 'insp_tool_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사구명',
      name: 'insp_tool_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '정렬',
      name: 'sortby',
      width: ENUM_WIDTH.S,
      filter: 'text',
      hidden: true,
    },
    {
      header: '시료 수량',
      name: 'sample_cnt',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '검사 주기',
      name: 'insp_cycle',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
  ];

  const COLUMNS_INSP_RESULT_DETAILS_INCLUDE_VALUES = useMemo(() => {
    let items: IGridColumn[] = COLUMNS_INSP_RESULT_DETAILS;

    if (procInspResultIncludeDetails?.header?.max_sample_cnt > 0) {
      //시료수 최대값에 따라 컬럼 생성
      for (
        let i = 1;
        i <= procInspResultIncludeDetails?.header?.max_sample_cnt;
        i++
      ) {
        items.push({
          header: 'x' + i + '_insp_result_detail_value_uuid',
          name: 'x' + i + '_insp_result_detail_value_uuid',
          width: ENUM_WIDTH.L,
          filter: 'text',
          hidden: true,
        });
        items.push({
          header: 'x' + i + '_sample_no',
          name: 'x' + i + '_sample_no',
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        items.push({
          header: 'x' + i,
          name: 'x' + i + '_insp_value',
          width: ENUM_WIDTH.L,
          filter: 'text',
          editable: true,
        });
        items.push({
          header: 'x' + i + '_판정',
          name: 'x' + i + '_insp_result_fg',
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        items.push({
          header: 'x' + i + '_판정',
          name: 'x' + i + '_insp_result_state',
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
      }
    }

    items.push({
      header: '합격여부',
      name: 'insp_result_fg',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    });
    items.push({
      header: '판정',
      name: 'insp_result_state',
      width: ENUM_WIDTH.M,
      filter: 'text',
    });
    items.push({
      header: '비고',
      name: 'remark',
      width: ENUM_WIDTH.XL,
      filter: 'text',
    });

    return items;
  }, [procInspResultIncludeDetails]);
  //#endregion

  //#region inputbox 세팅
  const INPUT_ITEMS_INSP_RESULT: IInputGroupboxItem[] = [
    {
      label: '최종판정',
      id: 'insp_result_state',
      type: 'text',
      disabled: true,
    },
    { label: '검사차수', id: 'seq', type: 'number', disabled: true },
    { label: '검사일', id: 'reg_date', type: 'date', disabled: true },
    { label: '검사시간', id: 'reg_date_time', type: 'time', disabled: true },
    { label: '검사자', id: 'emp_nm', type: 'text', disabled: true },
    {
      label: '검사유형',
      id: 'insp_detail_type_nm',
      type: 'text',
      disabled: true,
    },
    { label: '비고', id: 'remark', type: 'text', disabled: true },
  ];

  const inputInspResult = useInputGroup(
    'INPUT_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: '검사정보' },
  );
  //#endregion

  //#region 함수
  const onClear = () => {
    inputInspResult.ref.current.resetForm();
    setProcInspResults([]);
    setProcInspResultIncludeDetails({});
  };

  const onClearResultDetail = () => {
    inputInspResult.ref.current.resetForm();
    setProcInspResultIncludeDetails({});
  };

  const onSearch = (workData: TGetPrdWork) => {
    if (!workData) return;

    if (workData.work_uuid) {
      getData(
        {
          insp_detail_type: 'all',
          work_uuid: workData.work_uuid,
        },
        URI_PATH_GET_QMS_PROC_INSP_RESULTS,
        'raws',
      )
        .then(res => {
          setProcInspResults(res);
        })
        .catch(err => {
          onClear();
          message.error('에러');
        });
    } else {
      onClear();
    }
  };

  const onSesrchInspResultDetail = insp_result_uuid => {
    const searchUriPath =
      URI_PATH_GET_QMS_PROC_INSP_RESULT_INCLUDE_DETAILS.replace(
        '{uuid}',
        insp_result_uuid,
      );
    getData({}, searchUriPath, 'header-details')
      .then((res: any) => {
        setProcInspResultIncludeDetails(res);
        inputInspResult.setValues({
          ...res.header,
          reg_date_time: res.header.reg_date,
        });
      })
      .catch(err => {
        inputInspResult.ref.current.resetForm();
        setProcInspResultIncludeDetails({});
        message.error('에러');
      });
  };
  //#endregion

  //#region Hook 함수

  //#endregion

  //#region 렌더부
  const component = (
    <>
      <Container>
        <Row
          gutter={[16, 0]}
          style={{ minHeight: 550, maxHeight: 600, marginTop: -15 }}
        >
          <Col span={8} style={{ overflow: 'auto' }}>
            <Datagrid
              height={560}
              gridId={'INSP_RESULTS'}
              ref={procInspResultsGridRef}
              gridMode={'view'}
              columns={COLUMNS_INSP_RESULTS}
              data={procInspResults}
              onAfterClick={ev => {
                const { rowKey, targetType } = ev;
                if (targetType === 'cell') {
                  const row = ev?.instance?.store?.data?.rawData[rowKey];
                  onSesrchInspResultDetail(row?.insp_result_uuid);
                }
              }}
            />
          </Col>
          <Col
            span={16}
            style={{ minHeight: 550, maxHeight: 600, overflow: 'auto' }}
          >
            <InputGroupbox boxShadow={false} {...inputInspResult.props} />
            <p />
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
    </>
  );

  return {
    onSearch,
    onClearResultDetail,

    component,
  };

  //#endregion
};
//#endregion
