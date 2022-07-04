import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import { Divider, Space, Typography, Modal, Col, Row, message } from 'antd';
import dayjs from 'dayjs';
import { FormikProps, FormikValues } from 'formik';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Container,
  Datagrid,
  getPopupForm,
  GridPopup,
  IGridColumn,
  ISearchItem,
  Label,
  Searchbox,
  Textbox,
  TGridMode,
} from '~/components/UI';
import {
  IInputGroupboxItem,
  InputGroupbox,
} from '~/components/UI/input-groupbox/input-groupbox.ui';
import {
  blankThenNull,
  executeData,
  getData,
  getInspCheckResultInfo,
  getInspCheckResultTotal,
  getInspCheckResultValue,
  getPageName,
  getPermissions,
  getToday,
  getUserFactoryUuid,
  isNumber,
} from '~/functions';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_ADM } from '~/enums';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { InspectionHandlingTypeUuidSet } from './receive-insp-result/modals/types';
import InspectionHandlingServiceImpl from './receive-insp-result/modals/service/inspection-handling.service.impl';
import { InputForm, QuantityField } from './receive-insp-result/models/fields';
import {
  EmptyInspectionChecker,
  EyeInspectionChecker,
  InspectionConcreate,
  NumberInspectionChecker,
} from './receive-insp-result/models/inspection-checker';
import TuiGrid from 'tui-grid';
import { GridEventProps } from 'tui-grid/types/event';
import { slice } from 'lodash';

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
const URI_PATH_GET_INV_STORES_STOCKS = getPopupForm('재고관리').uriPath;
const URI_PATH_GET_QMS_INSPS = '/qms/insps';
const URI_PATH_GET_QMS_INSP_INCLUDE_DETAILS =
  '/qms/insp/{uuid}/include-details';
const URI_PATH_GET_QMS_FINAL_INSP_RESULTS = '/qms/final/insp-results';
const URI_PATH_GET_QMS_FINAL_INSP_RESULT_INCLUDE_DETAILS =
  '/qms/final/insp-result/{uuid}/include-details';
const URI_PATH_POST_QMS_FINAL_INSP_RESULTS = '/qms/final/insp-results';
const URI_PATH_PUT_QMS_FINAL_INSP_RESULT_INCLUDE_DETAILS =
  '/qms/final/insp-results';
const URI_PATH_DELETE_QMS_FINAL_INSP_RESULTS = '/qms/final/insp-results';

type TGetInvStoresStocks = {
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  lot_no?: string;
  qty?: number;
  store_uuid?: string;
  store_cd?: string;
  store_nm?: string;
  location_uuid?: string;
  location_cd?: string;
  location_nm?: string;
  partner_uuid?: string;
  partner_cd?: string;
  partner_nm?: string;
  price?: number;
  money_unit_uuid?: string;
  money_unit_cd?: string;
  money_unit_nm?: string;
  price_type_uuid?: string;
  price_type_cd?: string;
  price_type_nm?: string;
  exchange?: string;
};

type TGetQmsInsp = {
  insp_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_uuid?: string;
  insp_type_nm?: string;
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
  reg_date?: string;
  apply_date?: string;
  apply_fg?: boolean;
  apply_state?: string;
  contents?: string;
  remark?: string;
};

type TGetQmsInspIncludeDetails = {
  header?: {
    insp_uuid?: string;
    factory_uuid?: string;
    factory_cd?: string;
    factory_nm?: string;
    insp_type_uuid?: string;
    insp_type_nm?: string;
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
    reg_date?: string;
    apply_date?: string;
    apply_fg?: boolean;
    apply_state?: string;
    contents?: string;
    max_sample_cnt?: number;
    remark?: string;
  };
  details?: {
    insp_detail_uuid?: string;
    insp_uuid?: string;
    seq?: number;
    insp_no?: string;
    insp_no_sub?: string;
    factory_uuid?: string;
    factory_cd?: string;
    factory_nm?: string;
    insp_item_uuid?: string;
    insp_item_cd?: string;
    insp_item_nm?: string;
    insp_item_type_uuid?: string;
    insp_item_type_cd?: string;
    insp_item_type_nm?: string;
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
    sortby?: number;
    position_no?: number;
    special_property?: string;
    sample_cnt?: number;
    insp_cycle?: string;
    remark?: string;
  }[];
};

type TGetQmsFinalInspResult = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_uuid?: string;
  insp_type_nm?: string;
  insp_handling_type_uuid?: string;
  insp_handling_type_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  reject_store_uuid?: string;
  reject_store_cd?: string;
  reject_store_nm?: string;
  reject_location_uuid?: string;
  reject_location_cd?: string;
  reject_location_nm?: string;
  remark?: string;
};

type TGetQmsFinalInspResultIncludeDetailsHeader = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_uuid?: string;
  insp_type_nm?: string;
  insp_handling_type_uuid?: string;
  insp_handling_type_cd?: string;
  insp_handling_type_nm?: string;
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
  reject_uuid?: string;
  reject_cd?: string;
  reject_nm?: string;
  reject_type_uuid?: string;
  reject_type_cd?: string;
  reject_type_nm?: string;
  max_sample_cnt?: number;
  from_store_uuid?: string;
  from_store_cd?: string;
  from_store_nm?: string;
  from_location_uuid?: string;
  from_location_cd?: string;
  from_location_nm?: string;
  to_store_uuid?: string;
  to_store_cd?: string;
  to_store_nm?: string;
  to_location_uuid?: string;
  to_location_cd?: string;
  to_location_nm?: string;
  reject_store_uuid?: string;
  reject_store_cd?: string;
  reject_store_nm?: string;
  reject_location_uuid?: string;
  reject_location_cd?: string;
  reject_location_nm?: string;
  remark?: string;
  created_at?: string;
  created_nm?: string;
  updated_at?: string;
  updated_nm?: string;
};

type TGetQmsFinalInspResultIncludeDetailsDetail = {
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

type TGetQmsFinalInspResultIncludeDetails = {
  header?: TGetQmsFinalInspResultIncludeDetailsHeader;
  details?: TGetQmsFinalInspResultIncludeDetailsDetail[];
};

type TPostQmsFinalInspResultsHeader = {
  factory_uuid?: string;
  insp_handling_type_uuid?: string;
  insp_type_uuid?: string;
  insp_detail_type_uuid?: string;
  insp_uuid?: string;
  prod_uuid?: string;
  lot_no?: string;
  emp_uuid?: string;
  reg_date?: string;
  insp_result_fg?: boolean;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  reject_uuid?: string;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  reject_store_uuid?: string;
  reject_location_uuid?: string;
  remark?: string;
};

type TPostQmsFinalInspResultsDetailsValue = {
  sample_no?: number;
  insp_result_fg?: boolean;
  insp_value?: number;
};

type TPostQmsFinalInspResultsDetails = {
  values?: TPostQmsFinalInspResultsDetailsValue[];
  factory_uuid?: string;
  insp_detail_uuid?: string;
  insp_result_fg?: boolean;
  remark?: string;
};

type TPostQmsFinalInspResults = {
  header?: TPostQmsFinalInspResultsHeader;
  details?: TPostQmsFinalInspResultsDetails[];
};

type TPutQmsFinalInspResultsHeader = {
  uuid?: string;
  emp_uuid?: string;
  reg_date: string;
  insp_result_fg?: boolean;
  insp_handling_type_uuid?: string;
  insp_qty?: number;
  pass_qty?: number;
  reject_qty?: number;
  reject_uuid?: string;
  from_store_uuid?: string;
  from_location_uuid?: string;
  to_store_uuid?: string;
  to_location_uuid?: string;
  reject_store_uuid?: string;
  reject_location_uuid?: string;
  remark?: string;
};

type TPutQmsFinalInspResultsDetailsValues = {
  uuid?: string;
  delete_fg?: boolean;
  sample_no?: number;
  insp_result_fg?: boolean;
  insp_value?: number;
};

type TPutQmsFinalInspResultsDetails = {
  values?: TPutQmsFinalInspResultsDetailsValues[];
  uuid?: string;
  factory_uuid?: string;
  insp_result_fg?: boolean;
  remark?: string;
};

type TPutQmsFinalInspResults = {
  header: TPutQmsFinalInspResultsHeader;
  details: TPutQmsFinalInspResultsDetails[];
};
//#endregion

//#region 🔶최종검사 성적서
/** 최종검사 성적서 리스트 */
export const PgQmsFinalInspResult = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region ✅설정값
  const [modal, contextHolder] = Modal.useModal();

  //#region Ref 관리
  const searchRef = useRef<FormikProps<FormikValues>>();
  const gridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리
  const [createPopupVisible, setCreatePopupVisible] = useState(false);
  //#endregion

  //#region 데이터 관리
  const [finalInspResults, setFinalInspResults] = useState<
    TGetQmsFinalInspResult[]
  >([]);
  const [inspHandlingType, setInspHandlingType] = useState([]);
  //#endregion

  //#region ✅조회조건
  const SEARCH_ITEMS: ISearchItem[] = [
    { type: 'date', id: 'start_date', label: '검사일', default: getToday(-7) },
    { type: 'date', id: 'end_date', default: getToday() },
  ];
  //#endregion

  //#region 그리드 컬럼세팅
  const COLUMNS_FINAL_INSP_RESULT: IGridColumn[] = [
    {
      header: '성적서UUID',
      name: 'insp_result_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '판정',
      name: 'insp_result_state',
      width: ENUM_WIDTH.S,
      filter: 'text',
    },
    {
      header: '처리결과',
      name: 'insp_handling_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '품목유형명',
      name: 'item_type_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '제품유형명',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    { header: '품번', name: 'prod_no', width: ENUM_WIDTH.L, filter: 'text' },
    { header: '품목명', name: 'prod_nm', width: ENUM_WIDTH.L, filter: 'text' },
    { header: 'Rev', name: 'rev', width: ENUM_WIDTH.S, filter: 'text' },
    { header: '모델명', name: 'model_nm', width: ENUM_WIDTH.L, filter: 'text' },
    { header: '단위명', name: 'unit_nm', width: ENUM_WIDTH.L, filter: 'text' },
    { header: '규격', name: 'prod_std', width: ENUM_WIDTH.L, filter: 'text' },
    {
      header: '안전재고',
      name: 'safe_stock',
      width: ENUM_WIDTH.M,
      filter: 'number',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    { header: 'LOT NO', name: 'lot_no', width: ENUM_WIDTH.M, filter: 'text' },
    {
      header: '검사 수량',
      name: 'insp_qty',
      width: ENUM_WIDTH.M,
      filter: 'number',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '합격 수량',
      name: 'pass_qty',
      width: ENUM_WIDTH.M,
      filter: 'number',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '부적합 수량',
      name: 'reject_qty',
      width: ENUM_WIDTH.M,
      filter: 'number',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '입고 창고UUID',
      name: 'to_store_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '입고 창고',
      name: 'to_store_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '입고 위치UUID',
      name: 'to_location_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '입고 위치',
      name: 'to_location_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '출고 창고UUID',
      name: 'from_store_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '출고 창고',
      name: 'from_store_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '출고 위치UUID',
      name: 'from_location_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '출고 위치',
      name: 'from_location_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '부적합 창고UUID',
      name: 'reject_store_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '부적합 창고',
      name: 'reject_store_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '부적합 위치UUID',
      name: 'reject_location_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '부적합 위치',
      name: 'reject_location_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    { header: '비고', name: 'remark', width: ENUM_WIDTH.XL, filter: 'text' },
    {
      header: '바코드',
      name: 'remark',
      width: ENUM_WIDTH.XL,
      filter: 'text',
      hidden: true,
    },
  ];
  //#endregion

  //#region inputbox 세팅
  const INPUT_ITEMS_FINAL_INSP_RESULT: IInputGroupboxItem[] = [
    { id: 'prod_no', label: '품번', type: 'text', disabled: true },
    { id: 'prod_nm', label: '품명', type: 'text', disabled: true },
    { id: 'prod_std', label: '규격', type: 'text', disabled: true },
    { id: 'unit_nm', label: '단위', type: 'text', disabled: true },
    { id: 'from_store_nm', label: '출고창고', type: 'text', disabled: true },
    { id: 'from_location_nm', label: '출고위치', type: 'text', disabled: true },
    { id: 'lot_no', label: 'LOT NO', type: 'text', disabled: true },
    { id: 'insp_qty', label: '검사수량', type: 'number', disabled: true },
  ];

  const inputInspResult = useInputGroup(
    'INPUT_ITEMS_FINAL_INSP_RESULT',
    INPUT_ITEMS_FINAL_INSP_RESULT,
  );
  //#endregion

  //#region 함수
  const onSearch = () => {
    const { values } = searchRef?.current;
    const searchParams = values;
    getData(searchParams, URI_PATH_GET_QMS_FINAL_INSP_RESULTS).then(res => {
      setFinalInspResults(res || []);
      // 입하정보 및 실적정보 초기화
      inputInspResult.ref.current.resetForm();
      INSP_RESULT_DETAIL_GRID.onClear();
    });
  };

  const onCreate = ev => {
    setCreatePopupVisible(true);
  };
  //#endregion

  //#region 추가 컴포넌트
  const INSP_RESULT_DETAIL_GRID = INSP_RESULT_DETAIL_GRID_INFO({
    inspHandlingType: inspHandlingType,
    onAfterSave: onSearch,
  }); //props:{onAftetSave={onSearch}});
  //#endregion

  useLayoutEffect(() => {
    const _inspHandlingType: object[] = [];
    getData(
      {},
      URL_PATH_ADM.INSP_HANDLING_TYPE.GET.INSP_HANDLING_TYPES,
      'raws',
    ).then(async res => {
      res.map(item => {
        _inspHandlingType.push({
          code: JSON.stringify({
            insp_handling_type_uuid: item.insp_handling_type_uuid,
            insp_handling_type_cd: item.insp_handling_type_cd,
          }),
          text: item.insp_handling_type_nm,
        });
      });
      setInspHandlingType(_inspHandlingType);
    });
  }, []);

  //#region 렌더부
  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: -16, fontSize: 14 }}>
        <CaretRightOutlined />
        최종검사 이력
      </Typography.Title>
      <Divider style={{ marginBottom: 10 }} />
      <Container>
        <div style={{ width: '100%', display: 'inline-block' }}>
          <Space size={[6, 0]} style={{ float: 'right', marginTop: -70 }}>
            <Button
              btnType="buttonFill"
              widthSize="auto"
              heightSize="small"
              fontSize="small"
              ImageType="add"
              colorType="blue"
              onClick={onCreate}
              disabled={!permissions?.create_fg}
            >
              신규 추가
            </Button>
          </Space>
        </div>
        <div style={{ maxWidth: 700, marginTop: -20, marginLeft: -6 }}>
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
          columns={COLUMNS_FINAL_INSP_RESULT}
          height={300}
          data={finalInspResults}
          onAfterClick={ev => {
            const { rowKey, targetType } = ev;

            if (targetType === 'cell') {
              try {
                const row = ev?.instance?.store?.data?.rawData[rowKey];
                inputInspResult.setValues(row);
                INSP_RESULT_DETAIL_GRID.onSearch(row?.insp_result_uuid);
              } catch (e) {
                console.log(e);
              } finally {
              }
            }
          }}
        />
      </Container>
      <Row gutter={[16, 0]}>
        {/* 검사 품목 정보 */}
        <Col span={24} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Typography.Title
            level={5}
            style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
          >
            <CaretRightOutlined />
            검사 품목 정보
          </Typography.Title>
          <div
            style={{ width: '100%', display: 'inline-block', marginTop: -26 }}
          >
            {' '}
          </div>
          <Divider style={{ marginTop: 2, marginBottom: 10 }} />
          <Row gutter={[16, 16]}>
            <InputGroupbox boxShadow={false} {...inputInspResult.props} />
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
      {createPopupVisible ? (
        <INSP_RESULT_CREATE_POPUP
          inspHandlingType={inspHandlingType}
          popupVisible={createPopupVisible}
          setPopupVisible={setCreatePopupVisible}
          onAfterSave={onSearch}
        />
      ) : null}

      {contextHolder}
    </>
  );
  //#endregion
};
//#endregion

//#region 최종검사 결과
const INSP_RESULT_DETAIL_GRID_INFO = (props: {
  inspHandlingType: any;
  onAfterSave: () => void;
}) => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  //#region Ref 관리
  const gridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  //#endregion

  //#region 데이터 관리
  const [finalInspResultIncludeDetails, setFinalInspResultIncludeDetails] =
    useState<TGetQmsFinalInspResultIncludeDetails>({});
  //#endregion

  //#region 그리드 컬럼세팅
  const COLUMNS_FINAL_INSP_RESULT_DETAILS: IGridColumn[] = [
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

  const COLUMNS_FINAL_INSP_RESULT_DETAILS_INCLUDE_VALUES = useMemo(() => {
    let items: IGridColumn[] = COLUMNS_FINAL_INSP_RESULT_DETAILS;

    if (finalInspResultIncludeDetails?.header?.max_sample_cnt > 0) {
      //시료수 최대값에 따라 컬럼 생성
      for (
        let i = 1;
        i <= finalInspResultIncludeDetails?.header?.max_sample_cnt;
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
  }, [finalInspResultIncludeDetails]);
  //#endregion

  //#region inputbox 세팅
  const INPUT_ITEMS_INSP_RESULT: IInputGroupboxItem[] = [
    {
      id: 'insp_result_state',
      label: '최종판정',
      type: 'text',
      disabled: true,
    },
    { id: 'reg_date', label: '검사일', type: 'date', disabled: true },
    { id: 'reg_date_time', label: '검사시간', type: 'time', disabled: true },
    { id: 'emp_nm', label: '검사자', type: 'text', disabled: true },
    {
      id: 'insp_handling_type_nm',
      label: '처리결과',
      type: 'text',
      disabled: true,
    },
    { id: 'remark', label: '비고', type: 'text', disabled: true },
    { id: 'insp_qty', label: '검사수량', type: 'number', disabled: true },
  ];

  const INPUT_ITEMS_INSP_RESULT_INCOME: IInputGroupboxItem[] = [
    { id: 'pass_qty', label: '입고수량', type: 'number', disabled: true },
    { id: 'to_store_nm', label: '입고창고', type: 'text', disabled: true },
    { id: 'to_location_nm', label: '입고위치', type: 'text', disabled: true },
  ];

  const INPUT_ITEMS_INSP_RESULT_REJECT: IInputGroupboxItem[] = [
    { id: 'reject_qty', label: '부적합수량', type: 'number', disabled: true },
    { id: 'reject_nm', label: '불량유형', type: 'text', disabled: true },
    {
      id: 'reject_store_nm',
      label: '부적합창고',
      type: 'text',
      disabled: true,
    },
    {
      id: 'reject_location_nm',
      label: '부적합위치',
      type: 'text',
      disabled: true,
    },
  ];

  const inputInspResult = useInputGroup(
    'INPUT_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: '검사정보' },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_INSP_RESULT_INCOME',
    INPUT_ITEMS_INSP_RESULT_INCOME,
    { title: '입고정보' },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_INSP_RESULT_REJECT',
    INPUT_ITEMS_INSP_RESULT_REJECT,
    { title: '부적합정보' },
  );
  //#endregion

  //#region 함수
  const onEdit = ev => {
    if (!finalInspResultIncludeDetails?.header?.insp_result_uuid) {
      message.warning('수정 할 성적서를 선택 후 수정기능을 이용해주세요.');
      return;
    }
    setEditPopupVisible(true);
  };

  const onDelete = async ev => {
    if (!finalInspResultIncludeDetails?.header?.insp_result_uuid) {
      message.warn('삭제 할 성적서를 선택 후 다시 시도해주세요..');
      return;
    }

    Modal.confirm({
      icon: null,
      title: '삭제',
      // icon: <ExclamationCircleOutlined />,
      content: '성적서를 삭제하시겠습니까?',
      onOk: async () => {
        await executeData(
          [{ uuid: finalInspResultIncludeDetails?.header?.insp_result_uuid }],
          URI_PATH_DELETE_QMS_FINAL_INSP_RESULTS,
          'delete',
          'success',
        )
          .then(value => {
            if (!value) return;
            onClear();
            props.onAfterSave();
            message.info('저장되었습니다.');
          })
          .catch(e => {
            console.log(e);
          });
      },
      onCancel: () => {},
      okText: '예',
      cancelText: '아니오',
    });
  };

  const onClear = () => {
    inputInspResult.ref.current.resetForm();
    inputInspResultIncome.ref.current.resetForm();
    inputInspResultReject.ref.current.resetForm();
    setFinalInspResultIncludeDetails({});
  };

  const onSearch = (inspResultUuid: string) => {
    if (inspResultUuid) {
      const searchUriPath =
        URI_PATH_GET_QMS_FINAL_INSP_RESULT_INCLUDE_DETAILS.replace(
          '{uuid}',
          inspResultUuid,
        );
      getData<TGetQmsFinalInspResultIncludeDetails>(
        {},
        searchUriPath,
        'header-details',
      )
        .then(res => {
          setFinalInspResultIncludeDetails(res);
          inputInspResult.setValues({
            ...res.header,
            reg_date: dayjs(res.header.reg_date).format('YYYY-MM-DD'),
            reg_date_time: `${res.header.reg_date
              .replace('T', '')
              .slice(0, -5)}`,
          });
          inputInspResultIncome.setValues({
            ...res.header,
            qty: res.header.pass_qty,
          });
          inputInspResultReject.setValues({ ...res.header });
        })
        .catch(err => {
          onClear();
          message.error('에러');
        });
    } else {
      onClear();
    }
  };
  //#endregion

  //#region Hook 함수

  //#endregion

  //#region 렌더부
  const component = (
    <>
      <Container>
        <div style={{ width: '100%', display: 'inline-block' }}>
          <Space size={[6, 0]} style={{ float: 'right', marginTop: -70 }}>
            <Button
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="add"
              colorType="blue"
              onClick={onEdit}
              disabled={!permissions?.update_fg}
            >
              수정
            </Button>
            <Button
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="delete"
              colorType="red"
              onClick={onDelete}
              disabled={!permissions?.delete_fg}
            >
              삭제
            </Button>
          </Space>
        </div>
        <Row
          gutter={[16, 0]}
          style={{ minHeight: 550, maxHeight: 700, marginTop: -15 }}
        >
          <Col
            span={24}
            style={{ minHeight: 550, maxHeight: 700, overflow: 'auto' }}
          >
            <InputGroupbox boxShadow={false} {...inputInspResult.props} />
            <InputGroupbox boxShadow={false} {...inputInspResultIncome.props} />
            <InputGroupbox boxShadow={false} {...inputInspResultReject.props} />
            <p />
            <Datagrid
              height={250}
              gridId={'FINAL_INSP_RESULT_DETAILS_INCLUDE_VALUES'}
              ref={gridRef}
              gridMode={'view'}
              columns={COLUMNS_FINAL_INSP_RESULT_DETAILS_INCLUDE_VALUES}
              data={finalInspResultIncludeDetails?.details}
            />
          </Col>
        </Row>
      </Container>
      {editPopupVisible ? (
        <INSP_RESULT_EDIT_POPUP
          inspHandlingType={props.inspHandlingType}
          inspResultUuid={
            finalInspResultIncludeDetails?.header?.insp_result_uuid
          }
          popupVisible={editPopupVisible}
          setPopupVisible={setEditPopupVisible}
          onAfterCloseSearch={onSearch}
        />
      ) : null}
    </>
  );
  //#endregion

  return {
    onSearch,
    onClear,
    component,
  };
};
//#endregion

const INSP_RESULT_CREATE_POPUP = (props: {
  popupVisible: boolean;
  inspHandlingType: any;
  setPopupVisible: (value?) => void;
  onAfterSave?: () => void;
}) => {
  const gridRef = useRef<Grid>();

  const [changeInspQtyFg, setChangeInspQtyFg] = useState(false);
  const [changeIncomeQtyFg, setChangeIncomeQtyFg] = useState(false);
  const [changeRejectQtyFg, setChangeRejectQtyFg] = useState(false);

  const [storesStocks, setStoresStocks] = useState<TGetInvStoresStocks>({});
  const [insp, setInsp] = useState<TGetQmsInsp>({});
  const [inspIncludeDetails, setInspIncludeDetails] =
    useState<TGetQmsInspIncludeDetails>({});

  const COLUMNS_FINAL_INSP_DETAILS: IGridColumn[] = [
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

  const COLUMNS_FINAL_INSP_DETAILS_INCLUDE_VALUES = useMemo(() => {
    let items: IGridColumn[] = COLUMNS_FINAL_INSP_DETAILS;

    if (inspIncludeDetails?.header?.max_sample_cnt > 0) {
      for (let i = 1; i <= inspIncludeDetails?.header?.max_sample_cnt; i++) {
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
  }, [inspIncludeDetails]);

  const INFO_INPUT_ITEMS: IInputGroupboxItem[] = [
    {
      id: 'prod_uuid',
      label: '품목UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'prod_no',
      label: '품번',
      type: 'text',
      readOnly: true,
      usePopup: true,
      popupKeys: [
        'prod_uuid',
        'prod_no',
        'prod_nm',
        'prod_std',
        'unit_nm',
        'store_uuid',
        'store_nm',
        'location_uuid',
        'location_nm',
        'lot_no',
        'qty',
      ],
      popupButtonSettings: {
        dataApiSettings: {
          uriPath: URI_PATH_GET_INV_STORES_STOCKS,
          params: {
            stock_type: 'finalInsp',
            grouped_type: 'all',
            price_type: 'all',
            exclude_zero_fg: true,
            exclude_minus_fg: true,
            reg_date: getToday(),
          },
        },
        datagridSettings: {
          gridId: null,
          columns: getPopupForm('재고관리').datagridProps.columns,
        },
        modalSettings: { title: '출하검사 대상 재고' },
      },
      handleChange: values => setStoresStocks(values),
    },
    {
      id: 'prod_nm',
      label: '품명',
      type: 'text',
      disabled: true,
    },
    {
      id: 'prod_std',
      label: '규격',
      type: 'text',
      disabled: true,
    },
    {
      id: 'unit_nm',
      label: '단위',
      type: 'text',
      disabled: true,
    },
    {
      id: 'store_uuid',
      label: '출고창고UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'store_nm',
      label: '출고창고',
      type: 'text',
      disabled: true,
    },
    {
      id: 'location_uuid',
      label: '출고위치UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'location_nm',
      label: '출고위치',
      type: 'text',
      disabled: true,
    },
    {
      id: 'lot_no',
      label: 'LOT NO',
      type: 'text',
      disabled: true,
    },
    {
      id: 'qty',
      label: '검사수량',
      type: 'number',
      onAfterChange: () => setChangeInspQtyFg(true),
    },
  ];

  const INPUT_ITEMS_INSP_RESULT: IInputGroupboxItem[] = [
    {
      id: 'insp_uuid',
      label: '검사기준서UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'insp_result_fg',
      label: '최종판정',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'insp_result_state',
      label: '최종판정',
      type: 'text',
      disabled: true,
    },
    {
      id: 'reg_date',
      label: '검사일자',
      type: 'date',
      default: getToday(),
    },
    {
      id: 'reg_date_time',
      label: '검사시간',
      type: 'time',
    },
    {
      id: 'emp_uuid',
      label: '검사자UUID',
      type: 'text',
      hidden: true,
    },
    {
      id: 'emp_nm',
      label: '검사자',
      type: 'text',
      usePopup: true,
      popupKey: '사원관리',
      popupKeys: ['emp_nm', 'emp_uuid'],
      params: { emp_status: 'incumbent' },
    },
    {
      id: 'insp_handling_type',
      label: '처리결과',
      type: 'combo',
      firstItemType: 'empty',
      options: props.inspHandlingType,
      disabled: true,
      onAfterChange: (inspectionHandlingType: string) => {
        const { insp_handling_type_cd }: InspectionHandlingTypeUuidSet =
          inspectionHandlingType === ''
            ? { insp_handling_type_cd: null }
            : JSON.parse(inspectionHandlingType);

        triggerInspectionHandlingTypeChanged(
          insp_handling_type_cd,
          inputInputItems?.ref?.current?.values?.qty * 1,
        );
      },
    },
    {
      id: 'remark',
      label: '비고',
      type: 'text',
    },
  ];

  const INPUT_ITEMS_INSP_RESULT_INCOME: IInputGroupboxItem[] = [
    {
      id: 'qty',
      label: '입고수량',
      type: 'number',
      disabled: true,
      onAfterChange: () => setChangeIncomeQtyFg(true),
    },
    {
      id: 'to_store_uuid',
      label: '입고창고',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'store_uuid',
        textName: 'store_nm',
        uriPath: getPopupForm('창고관리')?.uriPath,
        params: {
          store_type: 'available',
        },
      },
      onAfterChange: ev => {},
    },
    {
      id: 'to_location_uuid',
      label: '입고위치',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'location_uuid',
        textName: 'location_nm',
        uriPath: getPopupForm('위치관리')?.uriPath,
      },
      onAfterChange: ev => {},
    },
  ];

  const INPUT_ITEMS_INSP_RESULT_RETURN: IInputGroupboxItem[] = [
    {
      id: 'reject_qty',
      label: '부적합수량',
      type: 'number',
      disabled: true,
      onAfterChange: () => setChangeRejectQtyFg(true),
    },
    { id: 'reject_uuid', label: '불량유형UUID', type: 'text', hidden: true },
    {
      id: 'reject_nm',
      label: '불량유형',
      type: 'text',
      usePopup: true,
      popupKey: '부적합관리',
      popupKeys: ['reject_nm', 'reject_uuid'],
    },
    {
      id: 'reject_store_uuid',
      label: '반출창고',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'store_uuid',
        textName: 'store_nm',
        uriPath: getPopupForm('창고관리')?.uriPath,
        params: {
          store_type: 'reject',
        },
      },
    },
    {
      id: 'reject_location_uuid',
      label: '반출위치',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'location_uuid',
        textName: 'location_nm',
        uriPath: getPopupForm('위치관리')?.uriPath,
      },
      onAfterChange: ev => {},
    },
  ];

  const inputInputItems = useInputGroup(
    'INPUT_CREATE_POPUP_INFO',
    INFO_INPUT_ITEMS,
    { title: '검사대상 품목 정보' },
  );
  const inputInspResult = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: '검사정보' },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT_INCOME',
    INPUT_ITEMS_INSP_RESULT_INCOME,
    { title: '입고정보' },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT_REJECT',
    INPUT_ITEMS_INSP_RESULT_RETURN,
    { title: '부적합정보' },
  );

  const onClear = () => {
    inputInputItems?.setValues({});
    inputInspResult?.instance?.setValues({});
    inputInspResultIncome?.instance?.setValues({});
    inputInspResultReject?.instance?.setValues({});
    inputInputItems?.instance?.resetForm();
    inputInspResult?.instance?.resetForm();
    inputInspResultIncome?.instance?.resetForm();
    inputInspResultReject?.instance?.resetForm();
    setStoresStocks({});
    setInsp({});
    setInspIncludeDetails({});
  };

  const inspectionCheck = <T extends InspectionConcreate>(
    checker: T,
    arg: any,
  ) => {
    return new checker().check(arg);
  };

  const cellKeys = (
    records: Array<object>,
    cellKey: string,
  ): Array<Array<string>> =>
    records.map(record =>
      Object.keys(record).filter(key => key.includes(cellKey)),
    );

  const sliceKeys = (keys: Array<string>, slicePoint: number) =>
    keys.slice(0, slicePoint);

  const recordChecker = (
    inspectionSampleResultFlagStore: Array<Array<boolean>>,
  ): Array<boolean> =>
    inspectionSampleResultFlagStore.map(flags => {
      if (flags.every(flag => flag === null)) {
        return null;
      }

      if (flags.includes(false)) {
        return false;
      }

      return true;
    });

  const totalChecker = (inspectionItemResultFlags: Array<boolean>): boolean => {
    if (inspectionItemResultFlags.includes(null)) {
      return null;
    }

    if (inspectionItemResultFlags.includes(false)) {
      return false;
    }

    return true;
  };

  const checkUIProtocol = (inspectResultFlag: boolean): string =>
    inspectResultFlag === null
      ? null
      : inspectResultFlag === true
      ? '합격'
      : '불합격';

  const eyeCellUIProtocol = (eyeInspectionResultFlag: boolean): string =>
    eyeInspectionResultFlag === null
      ? null
      : eyeInspectionResultFlag === true
      ? 'OK'
      : 'NG';

  const onAfterChange = (ev: any) => {
    const { changes, instance } = ev;
    const finalInspectorGridInstanceData = instance.getData();

    if (changes.some(change => !change.columnName.includes('_insp_value')))
      return;

    const inspectionKeyStore = cellKeys(
      finalInspectorGridInstanceData,
      '_insp_value',
    );

    const definedInsepctionKeysBySampleCount = inspectionKeyStore.map(
      (inspectionKeys: Array<string>, index: number) =>
        sliceKeys(
          inspectionKeys,
          finalInspectorGridInstanceData[index].sample_cnt,
        ),
    );

    const inspectionSampleResultStore = definedInsepctionKeysBySampleCount.map(
      (inspectionKeys, rowIndex) =>
        inspectionKeys.map(inspectionKey =>
          finalInspectorGridInstanceData[rowIndex][inspectionKey] == null ||
          finalInspectorGridInstanceData[rowIndex][inspectionKey] === ''
            ? inspectionCheck(EmptyInspectionChecker, null)
            : isNumber(finalInspectorGridInstanceData[rowIndex].spec_min) &&
              isNumber(finalInspectorGridInstanceData[rowIndex].spec_max)
            ? inspectionCheck(NumberInspectionChecker, {
                value:
                  finalInspectorGridInstanceData[rowIndex][inspectionKey] * 1,
                min: finalInspectorGridInstanceData[rowIndex].spec_min * 1,
                max: finalInspectorGridInstanceData[rowIndex].spec_max * 1,
              })
            : inspectionCheck(EyeInspectionChecker, {
                value: finalInspectorGridInstanceData[rowIndex][inspectionKey],
              }),
        ),
    );

    const inspectionItemResultStore = recordChecker(
      inspectionSampleResultStore,
    );

    const inspectionFinalResultFlag = totalChecker(inspectionItemResultStore);

    changes.forEach(inspectionSample => {
      if (inspectionSample.columnName.includes('_insp_value')) {
        const sampleIndex = inspectionKeyStore[
          inspectionSample.rowKey
        ].findIndex(sampleKey => sampleKey === inspectionSample.columnName);

        instance.setValue(
          inspectionSample.rowKey,
          inspectionSample.columnName.replace('_insp_value', '_insp_result_fg'),
          inspectionSampleResultStore[inspectionSample.rowKey][sampleIndex],
        );

        instance.setValue(
          inspectionSample.rowKey,
          inspectionSample.columnName.replace(
            '_insp_value',
            '_insp_result_state',
          ),
          checkUIProtocol(
            inspectionSampleResultStore[inspectionSample.rowKey][sampleIndex],
          ),
        );

        if (
          !(
            isNumber(
              finalInspectorGridInstanceData[inspectionSample.rowKey].spec_min,
            ) &&
            isNumber(
              finalInspectorGridInstanceData[inspectionSample.rowKey].spec_max,
            )
          )
        ) {
          instance.setValue(
            inspectionSample.rowKey,
            inspectionSample.columnName,
            eyeCellUIProtocol(
              inspectionSampleResultStore[inspectionSample.rowKey][sampleIndex],
            ),
          );
        }
      }
    });

    finalInspectorGridInstanceData.forEach(
      (_: unknown, inspectionItemIndex: number) => {
        instance.setValue(
          inspectionItemIndex,
          'insp_result_fg',
          inspectionItemResultStore[inspectionItemIndex],
        );
        instance.setValue(
          inspectionItemIndex,
          'insp_result_state',
          checkUIProtocol(inspectionItemResultStore[inspectionItemIndex]),
        );
      },
    );

    inputInspResult.setFieldValue('insp_result_fg', inspectionFinalResultFlag);
    inputInspResult.setFieldValue(
      'insp_result_state',
      checkUIProtocol(inspectionFinalResultFlag),
    );

    if (
      inspectionFinalResultFlag === null ||
      inspectionFinalResultFlag === true
    ) {
      inputInspResult.setFieldDisabled({ insp_handling_type: true });
    } else {
      inputInspResult.setFieldDisabled({ insp_handling_type: false });
    }

    const inspectionHandlingTypeCode: string =
      inspectionFinalResultFlag === true
        ? 'INCOME'
        : inspectionFinalResultFlag === false
        ? 'RETURN'
        : '';

    triggerInspectionHandlingTypeChanged(
      inspectionHandlingTypeCode,
      inputInputItems?.ref?.current?.values?.qty * 1,
    );

    const { code } = props.inspHandlingType.find(
      el =>
        JSON.parse(el.code).insp_handling_type_cd ===
        inspectionHandlingTypeCode,
    ) ?? { code: '' };

    inputInspResult.setFieldValue('insp_handling_type', code);
  };

  const createInspectionPostApiPayload = (
    inspectionGridInstance: TuiGrid,
  ): TPostQmsFinalInspResults => {
    const inspectionGridInstanceData = inspectionGridInstance.getData();
    const inputInspResultValues = inputInspResult?.ref?.current?.values;
    const inputInputItemsValues = inputInputItems?.ref?.current?.values;
    const inputInspResultIncomeValues =
      inputInspResultIncome?.ref?.current?.values;
    const inputInspResultRejectValues =
      inputInspResultReject?.ref?.current?.values;

    const finalInspectionPayloadHeader: TPostQmsFinalInspResultsHeader = {
      factory_uuid: getUserFactoryUuid(),
      insp_handling_type_uuid: JSON.parse(
        inputInspResultValues.insp_handling_type,
      ).insp_handling_type_uuid,
      insp_type_uuid: inputInputItemsValues?.insp_type_uuid,
      insp_uuid: insp?.insp_uuid,
      prod_uuid: storesStocks?.prod_uuid,
      lot_no: storesStocks?.lot_no,
      from_store_uuid: storesStocks?.store_uuid,
      from_location_uuid: storesStocks?.location_uuid,
      emp_uuid: inputInspResultValues?.emp_uuid,
      reg_date:
        inputInspResultValues?.reg_date +
        ' ' +
        inputInspResultValues?.reg_date_time +
        ':00',
      insp_result_fg: inputInspResultValues?.insp_result_fg,
      insp_qty: inputInputItemsValues?.qty,
      pass_qty: inputInspResultIncomeValues?.qty,
      reject_qty: inputInspResultRejectValues?.reject_qty,
      reject_uuid: blankThenNull(inputInspResultRejectValues?.reject_uuid),
      to_store_uuid: blankThenNull(inputInspResultIncomeValues?.to_store_uuid),
      to_location_uuid: blankThenNull(
        inputInspResultIncomeValues?.to_location_uuid,
      ),
      reject_store_uuid: blankThenNull(
        inputInspResultRejectValues?.reject_store_uuid,
      ),
      reject_location_uuid: blankThenNull(
        inputInspResultRejectValues?.reject_location_uuid,
      ),
      remark: inputInspResultValues?.remark,
    };

    const finalInspectionPayloadDetails: Array<TPostQmsFinalInspResultsDetails> =
      cellKeys(inspectionGridInstanceData, '_insp_value')
        .map((inspectionKeys: Array<string>, inspectionItemIndex: number) =>
          sliceKeys(
            inspectionKeys,
            Number(
              inspectionGridInstance.getValue(
                inspectionItemIndex,
                'sample_cnt',
              ),
            ),
          ),
        )
        .map(
          (
            definedInspectionKeysBySampleCount: Array<string>,
            inspectionItemIndex: number,
          ) => ({
            factory_uuid: `${getUserFactoryUuid()}`,
            insp_detail_uuid: `${inspectionGridInstance.getValue(
              inspectionItemIndex,
              'insp_detail_uuid',
            )}`,
            insp_result_fg: Boolean(
              inspectionGridInstance.getValue(
                inspectionItemIndex,
                'insp_result_fg',
              ),
            ),
            remark:
              inspectionGridInstance.getValue(inspectionItemIndex, 'remark') ===
              null
                ? null
                : `${inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    'remark',
                  )}`,
            values: definedInspectionKeysBySampleCount
              .map((inspectionSampleKey: string, sampleKeyIndex: number) => ({
                sample_no: sampleKeyIndex + 1,
                insp_result_fg:
                  inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    inspectionSampleKey.replace(
                      '_insp_value',
                      '_insp_result_fg',
                    ),
                  ) === null
                    ? null
                    : Boolean(
                        inspectionGridInstance.getValue(
                          inspectionItemIndex,
                          inspectionSampleKey.replace(
                            '_insp_value',
                            '_insp_result_fg',
                          ),
                        ),
                      ),
                insp_value:
                  inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    inspectionSampleKey,
                  ) === 'OK'
                    ? 1
                    : inspectionGridInstance.getValue(
                        inspectionItemIndex,
                        inspectionSampleKey,
                      ) === 'NG'
                    ? 0
                    : inspectionGridInstance.getValue(
                        inspectionItemIndex,
                        inspectionSampleKey,
                      ) === null
                    ? null
                    : Number(
                        inspectionGridInstance.getValue(
                          inspectionItemIndex,
                          inspectionSampleKey,
                        ),
                      ),
              }))
              .filter(({ insp_result_fg }) => insp_result_fg !== null),
          }),
        );

    return {
      header: finalInspectionPayloadHeader,
      details: finalInspectionPayloadDetails,
    };
  };

  const fetchInsepctionPostAPI = async (
    inspectionPostApiPayload: TPostQmsFinalInspResults,
  ) => {
    await executeData(
      inspectionPostApiPayload,
      URI_PATH_POST_QMS_FINAL_INSP_RESULTS,
      'post',
      'success',
    )
      .then(value => {
        if (!value) return;
        message.info('저장되었습니다.');
        onClear();
        props.setPopupVisible(false);
        props.onAfterSave();
      })
      .catch(e => {
        console.log(e);
      });
  };

  interface InspectionGridInstanceReference<GridInstance> {
    current: GridInstance;
  }

  const onSave = async (
    inspectionGridRef: InspectionGridInstanceReference<Grid>,
  ) => {
    const inputInspResultValues = inputInspResult?.ref?.current?.values;
    const fetchOptionFilledQualityAllInspectionResultFlags = getData(
      { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
      '/std/tenant-opts',
    );

    if (
      inputInspResultValues.insp_handling_type === '' ||
      inputInspResultValues.insp_handling_type == null
    ) {
      return message.warn('처리결과를 등록해주세요.');
    } else if (inputInspResultValues.emp_uuid == null) {
      return message.warn('검사자를 등록해주세요.');
    } else if (inputInspResultValues.reg_date_time == null) {
      return message.warn('검사시간을 등록해주세요.');
    }

    const { insp_handling_type_cd } = JSON.parse(
      inputInspResultValues.insp_handling_type,
    );

    if (
      inputInspResultValues.insp_result_fg === true &&
      insp_handling_type_cd !== 'INCOME'
    ) {
      return message.warn(
        '최종 판정이 합격일 경우 입고만 처리만 할 수 있습니다.',
      );
    }

    const inspectionGridInstance = inspectionGridRef.current.getInstance();

    const inspectionSampleResultFlagStore = cellKeys(
      inspectionGridInstance.getData(),
      '_insp_value',
    )
      .map((inspectionKeys: Array<string>, inspectionItemIndex: number) =>
        sliceKeys(
          inspectionKeys,
          Number(
            inspectionGridInstance.getValue(inspectionItemIndex, 'sample_cnt'),
          ),
        ),
      )
      .map(
        (
          definedInspectionKeysBySampleCount: Array<string>,
          inspectionItemIndex: number,
        ) =>
          definedInspectionKeysBySampleCount.map(inspectionKey =>
            inspectionGridInstance.getValue(
              inspectionItemIndex,
              inspectionKey,
            ) == null ||
            inspectionGridInstance.getValue(
              inspectionItemIndex,
              inspectionKey,
            ) === ''
              ? inspectionCheck(EmptyInspectionChecker, null)
              : isNumber(
                  `${inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    'spec_min',
                  )}`,
                ) &&
                isNumber(
                  `${inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    'spec_max',
                  )}`,
                )
              ? inspectionCheck(NumberInspectionChecker, {
                  value: Number(
                    inspectionGridInstance.getValue(
                      inspectionItemIndex,
                      inspectionKey,
                    ),
                  ),
                  min: Number(
                    inspectionGridInstance.getValue(
                      inspectionItemIndex,
                      'spec_min',
                    ),
                  ),
                  max: Number(
                    inspectionGridInstance.getValue(
                      inspectionItemIndex,
                      'spec_max',
                    ),
                  ),
                })
              : inspectionCheck(EyeInspectionChecker, {
                  value: inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    inspectionKey,
                  ),
                }),
          ),
      );

    const sequencialMissingValueState = inspectionSampleResultFlagStore.some(
      (sampleResultFlags: Array<boolean>) => {
        if (sampleResultFlags[0] === null) return true;

        if (sampleResultFlags.length > 1) {
          for (
            let sampleIndex = 1;
            sampleIndex < sampleResultFlags.length;
            sampleIndex++
          ) {
            if (
              sampleResultFlags[sampleIndex - 1] === null &&
              sampleResultFlags[sampleIndex] !== null
            )
              return true;
          }
        }
      },
    );

    if (sequencialMissingValueState === true) {
      return message.warn('결측치가 존재합니다. 확인 후 다시 저장해주세요.');
    }

    const isFilledAllInspectionSample = inspectionSampleResultFlagStore.every(
      (sampleResultFlags: Array<boolean>) =>
        sampleResultFlags.every((resultFlag: boolean) => resultFlag !== null),
    );

    const inspectionPostApiPayload: TPostQmsFinalInspResults =
      createInspectionPostApiPayload(inspectionGridInstance);

    if (isFilledAllInspectionSample === false) {
      let qualityInspectionFilledOption = 0;
      await fetchOptionFilledQualityAllInspectionResultFlags.then(options => {
        if (options.length > 0) {
          qualityInspectionFilledOption = options[0].value;
        }
      });

      if (qualityInspectionFilledOption === 1) {
        return message.warn('검사 결과 값을 시료 수 만큼 입력해주세요.');
      } else if (qualityInspectionFilledOption === 2) {
        return Modal.confirm({
          title: '',
          content:
            '검사 결과 시료 수 만큼 등록되지 않았습니다. 저장하시겠습니까?',
          onOk: async (close: () => void) => {
            const inspectionPostApiPayload = createInspectionPostApiPayload(
              inspectionGridInstance,
            );

            await fetchInsepctionPostAPI(inspectionPostApiPayload);
            close();
          },
          onCancel: () => {},
        });
      }

      return await fetchInsepctionPostAPI(inspectionPostApiPayload);
    }
    return await fetchInsepctionPostAPI(inspectionPostApiPayload);
  };

  const onCancel = ev => {
    onClear();
    props.setPopupVisible(false);
  };

  const triggerInspectionHandlingTypeChanged = (
    inspectionHandlingTypeCode: string,
    inputQuantity: number,
  ) => {
    const incomeFormService = new InspectionHandlingServiceImpl(
      new InputForm(),
    );

    const rejectFormService = new InspectionHandlingServiceImpl(
      new InputForm(),
    );

    incomeFormService.addFields(inputInspResultIncome.inputItemKeys);
    rejectFormService.addFields(inputInspResultReject.inputItemKeys);

    const incomeQuantity = new QuantityField(incomeFormService.getField('qty'));
    const rejectQuantity = new QuantityField(
      rejectFormService.getField('reject_qty'),
    );

    if ('INCOME' === inspectionHandlingTypeCode) {
      incomeQuantity.setQuantity(inputQuantity);
      incomeQuantity.toggle();
      rejectFormService.toggle();
    } else if ('RETURN' === inspectionHandlingTypeCode) {
      rejectQuantity.setQuantity(inputQuantity);

      incomeFormService.toggle();
      rejectQuantity.toggle();
    } else if ('SELECTION' === inspectionHandlingTypeCode) {
      incomeQuantity.setQuantity(inputQuantity);

      rejectQuantity.toggle();
    } else {
      incomeFormService.toggle();
      rejectFormService.toggle();
    }

    inputInspResultIncome.setFieldValue('qty', incomeQuantity.info().quantity);
    inputInspResultReject.setFieldValue(
      'reject_qty',
      rejectQuantity.info().quantity,
    );

    const incomeEnabled = incomeFormService.attributes();
    const rejectEnabled = rejectFormService.attributes();

    inputInspResultIncome.setFieldDisabled({ ...incomeEnabled });
    inputInspResultReject.setFieldDisabled({ ...rejectEnabled });
  };

  useLayoutEffect(() => {
    if (storesStocks.prod_uuid) {
      getData(
        {
          prod_uuid: storesStocks.prod_uuid,
          insp_type_cd: 'FINAL_INSP',
          apply_fg: true,
        },
        URI_PATH_GET_QMS_INSPS,
      )
        .then(res => {
          if (res.length === 0) {
            message.error(
              '적용중인 기준서가 없습니다. 기준서를 확인 후 다시 시도해주세요.',
            );
            onClear();
            return;
          } else if (res[0].apply_fg === false) {
            message.error(
              '적용중인 기준서가 없습니다. 기준서를 확인 후 다시 시도해주세요.',
            );
            onClear();
            return;
          } else {
            setInsp(res[0]);
          }
        })
        .catch(err => {
          onClear();
          message.error('에러');
        });
    }
  }, [storesStocks]);

  useLayoutEffect(() => {
    if (insp.insp_uuid) {
      getData(
        { insp_detail_type_cd: 'FINAL_INSP' },
        URI_PATH_GET_QMS_INSP_INCLUDE_DETAILS.replace('{uuid}', insp.insp_uuid),
        'header-details',
      )
        .then((res: any) => {
          inputInputItems.setFieldValue(
            'insp_type_uuid',
            res.header.insp_type_uuid,
          );

          setInspIncludeDetails(res);

          inputInspResult?.ref?.current?.values.reg_date == null
            ? inputInspResult.setFieldValue('reg_date', getToday())
            : null;

          res?.details.forEach((inspectionItem, inspectionRowIndex) => {
            const { max_sample_cnt } = res?.header;
            for (
              let inspectionInputCellIndex = inspectionItem.sample_cnt;
              inspectionInputCellIndex < max_sample_cnt;

            ) {
              inspectionInputCellIndex++;
              gridRef.current
                .getInstance()
                .disableCell(
                  inspectionRowIndex,
                  `x${inspectionInputCellIndex}_insp_value`,
                );
              gridRef.current
                .getInstance()
                .removeCellClassName(
                  inspectionRowIndex,
                  `x${inspectionInputCellIndex}_insp_value`,
                  'editor',
                );
            }
          });
        })
        .catch(err => {
          onClear();
          message.error('에러');
        });
    }
  }, [insp]);

  useLayoutEffect(() => {
    const { insp_handling_type_cd } =
      inputInspResult?.ref?.current?.values?.insp_handling_type == null
        ? { insp_handling_type_cd: null }
        : JSON.parse(inputInspResult?.ref?.current?.values?.insp_handling_type);

    triggerInspectionHandlingTypeChanged(
      insp_handling_type_cd,
      inputInputItems?.ref?.current?.values?.qty * 1,
    );
  }, [inputInspResult?.ref?.current?.values?.insp_handling_type_uuid]);

  useLayoutEffect(() => {
    if (changeInspQtyFg === false) return;

    triggerInspectionHandlingTypeChanged(
      JSON.parse(inputInspResult?.ref?.current?.values?.insp_handling_type)
        .insp_handling_type_cd,
      inputInputItems?.ref?.current?.values?.qty * 1,
    );

    setChangeInspQtyFg(false);
  }, [changeInspQtyFg]);

  useLayoutEffect(() => {
    if (changeIncomeQtyFg === false) return;
    let receiveQty: number = Number(inputInputItems?.ref?.current?.values?.qty);
    let incomeQty: number = Number(
      inputInspResultIncome?.ref?.current?.values?.qty,
    );
    let rejectQty: number = Number(
      inputInspResultReject?.ref?.current?.values?.reject_qty,
    );

    if (receiveQty - incomeQty < 0) {
      message.warn(
        '입하수량보다 판정수량이 많습니다. 확인 후 다시 입력해주세요.',
      );
      inputInspResultIncome.setFieldValue('qty', receiveQty - rejectQty);
    } else {
      inputInspResultReject.setFieldValue('reject_qty', receiveQty - incomeQty);
    }

    setChangeIncomeQtyFg(false);
  }, [changeIncomeQtyFg]);

  useLayoutEffect(() => {
    if (!changeRejectQtyFg) return;
    let receiveQty: number = Number(inputInputItems?.ref?.current?.values?.qty);
    let incomeQty: number = Number(
      inputInspResultIncome?.ref?.current?.values?.qty,
    );
    let rejectQty: number = Number(
      inputInspResultReject?.ref?.current?.values?.reject_qty,
    );

    if (receiveQty - rejectQty < 0) {
      message.warn(
        '입하수량보다 판정수량이 많습니다. 확인 후 다시 입력해주세요.',
      );
      inputInspResultReject.setFieldValue('reject_qty', receiveQty - incomeQty);
    } else {
      inputInspResultIncome.setFieldValue('qty', receiveQty - rejectQty);
    }
    setChangeRejectQtyFg(false);
  }, [changeRejectQtyFg]);

  useLayoutEffect(() => {
    onClear();
  }, [props.popupVisible]);

  return (
    <GridPopup
      title="데이터 추가하기"
      onOk={onSave}
      okText="저장"
      cancelText="취소"
      onCancel={onCancel}
      gridMode="update"
      popupId={'INSP_CREATE_POPUP'}
      gridId={'INSP_CREATE_POPUP_GRID'}
      ref={gridRef}
      columns={COLUMNS_FINAL_INSP_DETAILS_INCLUDE_VALUES}
      inputProps={[
        inputInputItems.props,
        inputInspResult.props,
        inputInspResultIncome.props,
        inputInspResultReject.props,
      ]}
      onAfterChange={onAfterChange}
      saveUriPath={null}
      searchUriPath={null}
      data={inspIncludeDetails?.details}
      hiddenActionButtons={true}
      saveType="basic"
      visible={props.popupVisible}
    />
  );
};

//#region 성적서 수정 팝업
const INSP_RESULT_EDIT_POPUP = (props: {
  inspResultUuid: string;
  inspHandlingType: any;
  popupVisible: boolean;
  setPopupVisible: (value?) => void;
  onAfterCloseSearch?: (insp_result_uuid: string) => void;
}) => {
  //#region Ref 관리
  const gridRef = useRef<Grid>();
  //#endregion

  //#region 상태관리
  const [changeIncomeQtyFg, setChangeIncomeQtyFg] = useState(false);
  const [changeRejectQtyFg, setChangeRejectQtyFg] = useState(false);
  //#endregion

  //#region 데이터 관리
  const [inspResult, setInspResult] =
    useState<TGetQmsFinalInspResultIncludeDetails>({});
  //#endregion

  //#region 그리드 컬럼세팅
  const COLUMNS_FINAL_INSP_DETAILS: IGridColumn[] = [
    {
      header: '검사성적서 상세UUID',
      name: 'insp_result_detail_info_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
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

  const COLUMNS_FINAL_INSP_DETAILS_INCLUDE_VALUES = useMemo(() => {
    let items: IGridColumn[] = COLUMNS_FINAL_INSP_DETAILS;

    if (inspResult?.header?.max_sample_cnt > 0) {
      //시료수 최대값에 따라 컬럼 생성
      for (let i = 1; i <= inspResult?.header?.max_sample_cnt; i++) {
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
  }, [inspResult]);
  //#endregion

  //#region inputbox 세팅
  const INFO_INPUT_ITEMS: IInputGroupboxItem[] = [
    { id: 'prod_uuid', label: '품목UUID', type: 'text', hidden: true },
    { id: 'prod_no', label: '품번', type: 'text', disabled: true },
    { id: 'prod_nm', label: '품명', type: 'text', disabled: true },
    { id: 'prod_std', label: '규격', type: 'text', disabled: true },
    { id: 'unit_nm', label: '단위', type: 'text', disabled: true },
    {
      id: 'store_uuid',
      label: '출고창고UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    { id: 'store_nm', label: '출고창고', type: 'text', disabled: true },
    {
      id: 'location_uuid',
      label: '출고위치UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    { id: 'location_nm', label: '출고위치', type: 'text', disabled: true },
    { id: 'lot_no', label: 'LOT NO', type: 'text', disabled: true },
    { id: 'insp_qty', label: '검사수량', type: 'number', disabled: true },
  ];

  const INPUT_ITEMS_INSP_RESULT: IInputGroupboxItem[] = [
    {
      id: 'insp_uuid',
      label: '검사기준서UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'insp_result_uuid',
      label: '검사성적서UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'insp_result_fg',
      label: '최종판정',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'insp_result_state',
      label: '최종판정',
      type: 'text',
      disabled: true,
    },
    { id: 'reg_date', label: '검사일자', type: 'date', default: getToday() },
    { id: 'reg_date_time', label: '검사시간', type: 'time' },
    { id: 'emp_uuid', label: '검사자UUID', type: 'text', hidden: true },
    {
      id: 'emp_nm',
      label: '검사자',
      type: 'text',
      usePopup: true,
      popupKey: '사원관리',
      popupKeys: ['emp_nm', 'emp_uuid'],
      params: { emp_status: 'incumbent' },
    },
    {
      id: 'insp_handling_type',
      label: '처리결과',
      type: 'combo',
      firstItemType: 'empty',
      options: props.inspHandlingType,
      disabled: true,
      onAfterChange: ev => {},
    },
    { id: 'remark', label: '비고', type: 'text' },
  ];

  const INPUT_ITEMS_INSP_RESULT_INCOME: IInputGroupboxItem[] = [
    {
      id: 'qty',
      label: '입고수량',
      type: 'number',
      disabled: true,
      onAfterChange: () => {
        setChangeIncomeQtyFg(true);
      },
    },
    {
      id: 'to_store_uuid',
      label: '입고창고',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'store_uuid',
        textName: 'store_nm',
        uriPath: getPopupForm('창고관리')?.uriPath,
        params: {
          store_type: 'available',
        },
      },
      onAfterChange: ev => {},
    },
    {
      id: 'to_location_uuid',
      label: '입고위치',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'location_uuid',
        textName: 'location_nm',
        uriPath: getPopupForm('위치관리')?.uriPath,
      },
      onAfterChange: ev => {},
    },
  ];

  const INPUT_ITEMS_INSP_RESULT_RETURN: IInputGroupboxItem[] = [
    {
      id: 'reject_qty',
      label: '부적합수량',
      type: 'number',
      disabled: true,
      onAfterChange: () => {
        setChangeRejectQtyFg(true);
      },
    },
    { id: 'reject_uuid', label: '불량유형UUID', type: 'text', hidden: true },
    {
      id: 'reject_nm',
      label: '불량유형',
      type: 'text',
      usePopup: true,
      popupKey: '부적합관리',
      popupKeys: ['reject_nm', 'reject_uuid'],
    },
    {
      id: 'reject_store_uuid',
      label: '반출창고',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'store_uuid',
        textName: 'store_nm',
        uriPath: getPopupForm('창고관리')?.uriPath,
        params: {
          store_type: 'reject',
        },
      },
    },
    {
      id: 'reject_location_uuid',
      label: '반출위치',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'location_uuid',
        textName: 'location_nm',
        uriPath: getPopupForm('위치관리')?.uriPath,
      },
      onAfterChange: ev => {},
    },
  ];

  const inputInputItems = useInputGroup(
    'INPUT_EDIT_POPUP_INFO',
    INFO_INPUT_ITEMS,
    { title: '입하정보' },
  );
  const inputInspResult = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: '검사정보' },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT_INCOME',
    INPUT_ITEMS_INSP_RESULT_INCOME,
    { title: '입고정보' },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT_REJECT',
    INPUT_ITEMS_INSP_RESULT_RETURN,
    { title: '부적합정보' },
  );
  //#endregion

  //#region 함수
  const onClear = () => {
    inputInputItems?.ref?.current?.resetForm();
    inputInspResult?.ref?.current?.resetForm();
    inputInspResultIncome?.ref?.current?.resetForm();
    inputInspResultReject?.ref?.current?.resetForm();
    setInspResult({});
  };

  const changeInspResult = (inspResult?: string, firstLoadingFg?: boolean) => {
    let incomeDisabled: boolean = true;
    let rejectDisabled: boolean = true;
    let qtyDisabled: boolean = true;
    if (inspResult) {
      if (['INCOME', 'SELECTION'].includes(inspResult)) {
        incomeDisabled = false;
      }
      if (['RETURN', 'SELECTION'].includes(inspResult)) {
        rejectDisabled = false;
      }
    }
    if (!firstLoadingFg) {
      if (incomeDisabled) {
        inputInspResultIncome.setFieldValue('qty', 0);
      }
      if (rejectDisabled) {
        inputInspResultReject.setFieldValue('reject_qty', 0);
      }

      if (!incomeDisabled) {
        inputInspResultIncome.setFieldValue(
          'qty',
          inputInputItems?.ref?.current?.values?.insp_qty,
        );
        inputInspResultReject.setFieldValue('reject_qty', 0);
      } else if (!rejectDisabled) {
        inputInspResultReject.setFieldValue(
          'reject_qty',
          inputInputItems?.ref?.current?.values?.insp_qty,
        );
      }
    }

    if (inspResult === 'SELECTION') {
      qtyDisabled = false;
    }

    inputInspResultIncome.setFieldDisabled({
      qty: qtyDisabled,
      to_store_uuid: incomeDisabled,
      to_location_uuid: incomeDisabled,
    });
    inputInspResultReject.setFieldDisabled({
      reject_qty: qtyDisabled,
      reject_nm: rejectDisabled,
      reject_store_uuid: rejectDisabled,
      reject_location_uuid: rejectDisabled,
    });
  };

  const cellKeys = (
    records: Array<any>,
    cellKey: string,
  ): Array<Array<string>> =>
    records.map(record =>
      Object.keys(record).filter(key => key.includes(cellKey)),
    );

  const sliceKeys = (keys: Array<string>, at: number): Array<string> =>
    keys.slice(0, at);

  const inspectionCheck = <T extends InspectionConcreate>(
    checker: T,
    arg: any,
  ) => {
    return new checker().check(arg);
  };

  const recordChecker = (
    inspectionItems: Array<Array<boolean>>,
  ): Array<boolean> =>
    inspectionItems.map((inspectionItem: Array<boolean>) => {
      if (
        inspectionItem.every(
          inspectionSampleResultFlag => inspectionSampleResultFlag === null,
        )
      ) {
        return null;
      }

      if (
        inspectionItem.some(
          inspectionSampleResultFlag => inspectionSampleResultFlag === false,
        )
      ) {
        return false;
      }

      return true;
    });

  const totalChecker = (inspectionItems: Array<boolean>): boolean => {
    if (
      inspectionItems.some((inspectionItem: boolean) => inspectionItem === null)
    ) {
      return null;
    }

    if (inspectionItems.includes(false)) {
      return false;
    }

    return true;
  };

  const checkUIProtocol = (sampleResultFlag: boolean): string =>
    sampleResultFlag === null
      ? null
      : sampleResultFlag === true
      ? '합격'
      : '불합격';

  const eyeCellUIProtocol = (eyeSampleResultFlag: boolean): string =>
    eyeSampleResultFlag === null
      ? null
      : eyeSampleResultFlag === true
      ? 'OK'
      : 'NG';

  interface InspectionSampleAfterChangeProps extends GridEventProps {
    instance: TuiGrid;
  }

  const onAfterChange = ({
    changes,
    instance,
  }: InspectionSampleAfterChangeProps) => {
    const finalInspectionGridInstanceData = instance.getData();

    if (
      changes.some(
        inspectionSample =>
          !inspectionSample.columnName.includes('_insp_value'),
      )
    )
      return;

    const finalInspectionSampleKeyStore = cellKeys(
      finalInspectionGridInstanceData,
      '_insp_value',
    );

    const enableInspectionSampleKeyStroe = finalInspectionSampleKeyStore.map(
      (inspectionItem: Array<string>, inspectionItemIndex: number) =>
        sliceKeys(
          inspectionItem,
          Number(
            finalInspectionGridInstanceData[inspectionItemIndex].sample_cnt,
          ),
        ),
    );

    const inspectionSamplelResultStore = enableInspectionSampleKeyStroe.map(
      (inspectionItem: Array<string>, inspectionItemIndex: number) =>
        inspectionItem.map(inspectionSampleKey =>
          instance.getValue(inspectionItemIndex, inspectionSampleKey) == null ||
          instance.getValue(inspectionItemIndex, inspectionSampleKey) === ''
            ? inspectionCheck(EmptyInspectionChecker, null)
            : isNumber(
                `${instance.getValue(inspectionItemIndex, 'spec_min')}`,
              ) &&
              isNumber(`${instance.getValue(inspectionItemIndex, 'spec_max')}`)
            ? inspectionCheck(NumberInspectionChecker, {
                value: Number(
                  instance.getValue(inspectionItemIndex, inspectionSampleKey),
                ),
                min: Number(instance.getValue(inspectionItemIndex, 'spec_min')),
                max: Number(instance.getValue(inspectionItemIndex, 'spec_max')),
              })
            : inspectionCheck(EyeInspectionChecker, {
                value: instance.getValue(
                  inspectionItemIndex,
                  inspectionSampleKey,
                ),
              }),
        ),
    );

    const inspectionItemResultStore = recordChecker(
      inspectionSamplelResultStore,
    );

    const inspectionResultFlag = totalChecker(inspectionItemResultStore);

    changes.forEach(inspectionSample => {
      if (inspectionSample.columnName.includes('insp_value')) {
        const sampleIndex = finalInspectionSampleKeyStore[
          inspectionSample.rowKey
        ].findIndex(
          inspectionSampleKey =>
            inspectionSampleKey === inspectionSample.columnName,
        );

        instance.setValue(
          inspectionSample.rowKey,
          inspectionSample.columnName.replace('_insp_value', '_insp_result_fg'),
          inspectionSamplelResultStore[inspectionSample.rowKey][sampleIndex],
        );

        instance.setValue(
          inspectionSample.rowKey,
          inspectionSample.columnName.replace(
            '_insp_value',
            '_insp_result_state',
          ),
          checkUIProtocol(
            inspectionSamplelResultStore[inspectionSample.rowKey][sampleIndex],
          ),
        );

        if (
          !(
            isNumber(
              `${instance.getValue(inspectionSample.rowKey, 'spec_min')}`,
            ) &&
            isNumber(
              `${instance.getValue(inspectionSample.rowKey, 'spec_max')}`,
            )
          )
        ) {
          instance.setValue(
            inspectionSample.rowKey,
            inspectionSample.columnName,
            eyeCellUIProtocol(
              inspectionSamplelResultStore[inspectionSample.rowKey][
                sampleIndex
              ],
            ),
          );
        }
      }
    });

    finalInspectionGridInstanceData.forEach(
      (_, inspectionItemIndex: number) => {
        instance.setValue(
          inspectionItemIndex,
          'insp_result_fg',
          inspectionItemResultStore[inspectionItemIndex],
        );

        instance.setValue(
          inspectionItemIndex,
          'insp_result_state',
          checkUIProtocol(inspectionItemResultStore[inspectionItemIndex]),
        );
      },
    );

    inputInspResult.setFieldValue('insp_result_fg', inspectionResultFlag);
    inputInspResult.setFieldValue(
      'insp_result_state',
      checkUIProtocol(inspectionResultFlag),
    );

    if (inspectionResultFlag === null) {
      inputInspResult.setFieldDisabled({ insp_handling_type: true });
    } else {
      inputInspResult.setFieldDisabled({ insp_handling_type: false });
    }

    let inspectionHandlingTypeCode =
      inspectionResultFlag === true
        ? 'INCOME'
        : inspectionResultFlag === false
        ? 'RETURN'
        : '';

    changeInspResult(inspectionHandlingTypeCode);

    if (inspectionHandlingTypeCode === '') {
      inputInspResult.setFieldValue('insp_handling_type', '');
    } else {
      props.inspHandlingType.forEach(el => {
        if (
          JSON.parse(el.code).insp_handling_type_cd ===
          inspectionHandlingTypeCode
        ) {
          inputInspResult.setFieldValue('insp_handling_type', el.code);
          return;
        }
      });
    }
  };

  interface InspectionGridInstanceReference<GridInstance> {
    current: GridInstance;
  }

  const createInspectionPutApiPayload = (inspectionGridInstance: TuiGrid) => {
    const inputInspResultValues = inputInspResult?.ref?.current?.values;
    const inputInputItemsValues = inputInputItems?.ref?.current?.values;
    const inputInspResultIncomeValues =
      inputInspResultIncome?.ref?.current?.values;
    const inputInspResultRejectValues =
      inputInspResultReject?.ref?.current?.values;
    const inspectionGridInstanceData = inspectionGridInstance.getData();

    const finalInspectionPayloadHeader: TPutQmsFinalInspResultsHeader = {
      uuid: `${inputInspResultValues?.insp_result_uuid}`,
      emp_uuid: `${inputInspResultValues?.emp_uuid}`,
      reg_date: `${inputInspResultValues?.reg_date} ${dayjs(
        inputInspResultValues.reg_date_time,
      ).format('HH:mm:ss')}`,
      insp_result_fg: Boolean(inputInspResultValues?.insp_result_fg),
      insp_handling_type_uuid: JSON.parse(
        `${inputInspResultValues.insp_handling_type}`,
      ).insp_handling_type_uuid,
      insp_qty: Number(inputInputItemsValues?.insp_qty),
      pass_qty: Number(inputInspResultIncomeValues?.qty),
      reject_qty: Number(inputInspResultRejectValues?.reject_qty),
      reject_uuid: blankThenNull(inputInspResultRejectValues?.reject_uuid),
      from_store_uuid: `${inspResult.header.from_store_uuid}`,
      from_location_uuid:
        inspResult.header.from_location_uuid == null
          ? null
          : `${inspResult.header.from_location_uuid}`,
      to_store_uuid: blankThenNull(inputInspResultIncomeValues?.to_store_uuid),
      to_location_uuid: blankThenNull(
        inputInspResultIncomeValues?.to_location_uuid,
      ),
      reject_store_uuid: blankThenNull(
        inputInspResultRejectValues?.reject_store_uuid,
      ),
      reject_location_uuid: blankThenNull(
        inputInspResultRejectValues?.reject_location_uuid,
      ),
      remark:
        inputInspResultValues?.remark == null
          ? null
          : `${inputInspResultValues?.remark}`,
    };

    const finalInspectionPayloadDetails: Array<TPutQmsFinalInspResultsDetails> =
      cellKeys(inspectionGridInstanceData, '_insp_value')
        .map((inspectionKeys: Array<string>, inspectionItemIndex: number) =>
          sliceKeys(
            inspectionKeys,
            Number(
              inspectionGridInstance.getValue(
                inspectionItemIndex,
                'sample_cnt',
              ),
            ),
          ),
        )
        .map(
          (
            inspectionSampleKeys: Array<string>,
            inspectionItemIndex: number,
          ) => ({
            factory_uuid: `${getUserFactoryUuid()}`,
            uuid: `${inspectionGridInstance.getValue(
              inspectionItemIndex,
              'insp_result_detail_info_uuid',
            )}`,
            insp_result_fg: Boolean(
              inspectionGridInstance.getValue(
                inspectionItemIndex,
                'insp_result_fg',
              ),
            ),
            remark:
              inspectionGridInstance.getValue(inspectionItemIndex, 'remark') ===
              null
                ? null
                : `${inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    'remark',
                  )}`,
            values: inspectionSampleKeys
              .map((inspectionSampleKey: string, sampleKeyIndex: number) => {
                const inspectionSample: TPutQmsFinalInspResultsDetailsValues = {
                  sample_no: sampleKeyIndex + 1,
                  uuid:
                    inspectionGridInstance.getValue(
                      inspectionItemIndex,
                      inspectionSampleKey.replace(
                        '_insp_value',
                        '_insp_result_detail_value_uuid',
                      ),
                    ) == null
                      ? null
                      : `${inspectionGridInstance.getValue(
                          inspectionItemIndex,
                          inspectionSampleKey.replace(
                            '_insp_value',
                            '_insp_result_detail_value_uuid',
                          ),
                        )}`,
                  delete_fg:
                    inspectionGridInstance.getValue(
                      inspectionItemIndex,
                      inspectionSampleKey.replace(
                        '_insp_value',
                        '_insp_result_fg',
                      ),
                    ) === null
                      ? true
                      : false,
                };

                console.log(
                  inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    inspectionSampleKey.replace(
                      '_insp_value',
                      '_insp_result_fg',
                    ),
                  ),
                  inspectionItemIndex,
                  inspectionSampleKey.replace('_insp_value', '_insp_result_fg'),
                );
                if (
                  inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    inspectionSampleKey.replace(
                      '_insp_value',
                      '_insp_result_fg',
                    ),
                  ) !== null
                ) {
                  return {
                    ...inspectionSample,
                    insp_result_fg:
                      inspectionGridInstance.getValue(
                        inspectionItemIndex,
                        inspectionSampleKey.replace(
                          '_insp_value',
                          '_insp_result_fg',
                        ),
                      ) === null
                        ? null
                        : Boolean(
                            inspectionGridInstance.getValue(
                              inspectionItemIndex,
                              inspectionSampleKey.replace(
                                '_insp_value',
                                '_insp_result_fg',
                              ),
                            ),
                          ),
                    insp_value:
                      inspectionGridInstance.getValue(
                        inspectionItemIndex,
                        inspectionSampleKey,
                      ) === 'OK'
                        ? 1
                        : inspectionGridInstance.getValue(
                            inspectionItemIndex,
                            inspectionSampleKey,
                          ) === 'NG'
                        ? 0
                        : inspectionGridInstance.getValue(
                            inspectionItemIndex,
                            inspectionSampleKey,
                          ) === null
                        ? null
                        : Number(
                            inspectionGridInstance.getValue(
                              inspectionItemIndex,
                              inspectionSampleKey,
                            ),
                          ),
                  };
                }
                return inspectionSample;
              })
              .filter(({ uuid, delete_fg }) => {
                if (uuid !== null) {
                  return true;
                }

                return delete_fg === false ? true : false;
              }),
          }),
        );

    return {
      header: finalInspectionPayloadHeader,
      details: finalInspectionPayloadDetails,
    };
  };

  const fetchInspectionPutAPI = async (
    inspectionPutApiPayload: TPutQmsFinalInspResults,
  ) => {
    await executeData(
      inspectionPutApiPayload,
      URI_PATH_PUT_QMS_FINAL_INSP_RESULT_INCLUDE_DETAILS,
      'put',
      'success',
    )
      .then(value => {
        if (!value) return;
        props.onAfterCloseSearch(props?.inspResultUuid);
        onClear();
        props.setPopupVisible(false);
        message.info('저장되었습니다.');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const onSave = async (
    inspectionGridRef: InspectionGridInstanceReference<Grid>,
  ) => {
    const inputInspResultValues = inputInspResult?.ref?.current?.values;
    const fetchOptionFilledQualityAllInspectionResult = getData(
      { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
      '/std/tenant-opts',
    );

    if (inputInspResultValues?.insp_handling_type === '') {
      return message.warn('처리결과를 등록해주세요.');
    } else if (inputInspResultValues?.emp_uuid == null) {
      return message.warn('검사자를 등록해주세요.');
    } else if (
      inputInspResultValues?.reg_date_time == null ||
      inputInspResultValues?.reg_date_time === 'Invalid Date'
    ) {
      return message.warn('검사시간을 등록해주세요.');
    }

    const inspectionGridInstance = inspectionGridRef.current.getInstance();
    const inspectionGridInstanceData = inspectionGridInstance.getData();
    const inspectionSampleResultStore = cellKeys(
      inspectionGridInstanceData,
      '_insp_value',
    )
      .map(
        (
          inspectionSampleKeys: Array<string>,
          inspectionSampleItemIndex: number,
        ) =>
          sliceKeys(
            inspectionSampleKeys,
            Number(
              inspectionGridInstance.getValue(
                inspectionSampleItemIndex,
                'sample_cnt',
              ),
            ),
          ),
      )
      .map((inspectionItem, inspectionItemIndex) =>
        inspectionItem.map(sampleKey =>
          inspectionGridInstance.getValue(inspectionItemIndex, sampleKey) ==
            null ||
          inspectionGridInstance.getValue(inspectionItemIndex, sampleKey) == ''
            ? inspectionCheck(EmptyInspectionChecker, null)
            : isNumber(
                `${inspectionGridInstance.getValue(
                  inspectionItemIndex,
                  'spec_min',
                )}`,
              ) &&
              isNumber(
                `${inspectionGridInstance.getValue(
                  inspectionItemIndex,
                  'spec_max',
                )}`,
              )
            ? inspectionCheck(NumberInspectionChecker, {
                value: Number(
                  inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    sampleKey,
                  ),
                ),
                min: Number(
                  inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    'spec_min',
                  ),
                ),
                max: Number(
                  inspectionGridInstance.getValue(
                    inspectionItemIndex,
                    'spec_max',
                  ),
                ),
              })
            : inspectionCheck(EyeInspectionChecker, {
                value: `${inspectionGridInstance.getValue(
                  inspectionItemIndex,
                  sampleKey,
                )}`,
              }),
        ),
      );

    const isSequenceMissingValue = inspectionSampleResultStore.some(
      (inspectionSampleResults: Array<boolean>) => {
        if (inspectionSampleResults[0] === null) return true;

        if (inspectionSampleResults.length > 1) {
          for (
            let inspectionItemIndex = 1;
            inspectionItemIndex < inspectionSampleResults.length;
            inspectionItemIndex++
          ) {
            if (
              inspectionSampleResults[inspectionItemIndex - 1] === null &&
              inspectionSampleResults[inspectionItemIndex] !== null
            )
              return true;
          }
        }
      },
    );

    if (isSequenceMissingValue === true) {
      return message.warn('결측치가 존재합니다. 확인 후 다시 저장해주세요');
    }

    const isFilledAllInspectionSample = inspectionSampleResultStore.every(
      (sampleResults: Array<boolean>) =>
        sampleResults.every((result: boolean) => result !== null),
    );

    const inspectionPutApiPayload: TPutQmsFinalInspResults =
      createInspectionPutApiPayload(inspectionGridInstance);

    if (isFilledAllInspectionSample === false) {
      const qualityInspectionFilledOption =
        (
          await (async () =>
            await fetchOptionFilledQualityAllInspectionResult)()
        ).length > 0
          ? (
              await (async () =>
                await fetchOptionFilledQualityAllInspectionResult)()
            )[0].value
          : 0;

      if (qualityInspectionFilledOption === 1) {
        return message.warn('검사 결과 값을 시료 수 만큼 입력해주세요.');
      } else if (qualityInspectionFilledOption === 2) {
        return Modal.confirm({
          title: '',
          content:
            '검사 결과 시료 수 만큼 등록되지 않았습니다. 저장하시겠습니까?',
          onOk: async (close: () => void) => {
            const inspectionPutApiPayload: TPutQmsFinalInspResults =
              createInspectionPutApiPayload(inspectionGridInstance);

            await fetchInspectionPutAPI(inspectionPutApiPayload);
            close();
          },
          onCancel: () => {},
        });
      }
      return await fetchInspectionPutAPI(inspectionPutApiPayload);
    }

    return await fetchInspectionPutAPI(inspectionPutApiPayload);
  };

  const onCancel = ev => {
    onClear();
    props.setPopupVisible(false);
  };

  const handleLoadData = () => {
    const searchUriPath =
      URI_PATH_GET_QMS_FINAL_INSP_RESULT_INCLUDE_DETAILS.replace(
        '{uuid}',
        props.inspResultUuid,
      );

    getData<TGetQmsFinalInspResultIncludeDetails>(
      {},
      searchUriPath,
      'header-details',
    )
      .then(res => {
        setInspResult(res);

        const { header, details } = res;

        inputInputItems.setValues({
          prod_uuid: header.prod_uuid,
          prod_no: header.prod_no,
          prod_nm: header.prod_nm,
          prod_std: header.prod_std,
          unit_nm: header.unit_nm,
          store_uuid: header.from_store_uuid,
          store_nm: header.from_store_nm,
          location_uuid: header.from_location_uuid,
          location_nm: header.from_location_nm,
          lot_no: header.lot_no,
          insp_qty: header.insp_qty,
        });

        inputInspResult.setValues({
          insp_uuid: header.insp_uuid,
          insp_result_uuid: header.insp_result_uuid,
          insp_result_fg: header.insp_result_fg,
          insp_result_state: header.insp_result_state,
          reg_date: dayjs(header.reg_date).format('YYYY-MM-DD'),
          reg_date_time: `${header.reg_date.replace('T', '').slice(0, -5)}`,
          emp_uuid: header.emp_uuid,
          emp_nm: header.emp_nm,
          insp_handling_type: JSON.stringify({
            insp_handling_type_uuid: header.insp_handling_type_uuid,
            insp_handling_type_cd: header.insp_handling_type_cd,
          }),
          remark: header.remark,
        });
        inputInspResultIncome.setValues({
          qty: header.pass_qty,
          to_store_uuid: header.to_store_uuid,
          to_location_uuid: header.to_location_uuid,
        });
        inputInspResultReject.setValues({
          reject_qty: header.reject_qty,
          reject_uuid: header.reject_uuid,
          reject_nm: header.reject_nm,
          reject_store_uuid: header.reject_store_uuid,
          reject_location_uuid: header.reject_location_uuid,
        });

        changeInspResult(res.header.insp_handling_type_cd, true);
      })
      .catch(err => {
        onClear();
        message.error('에러');
      });
  };
  //#endregion

  //#region Hook 함수
  useLayoutEffect(() => {
    handleLoadData();
    return () => {
      onClear();
    };
  }, []);

  useLayoutEffect(() => {
    changeInspResult(
      inputInspResult?.ref?.current?.values?.insp_handling_type_uuid,
      false,
    );
  }, [inputInspResult?.ref?.current?.values?.insp_handling_type_uuid]);

  useLayoutEffect(() => {
    if (changeIncomeQtyFg === false) return;
    let receiveQty: number = Number(
      inputInputItems?.ref?.current?.values?.insp_qty,
    );
    let incomeQty: number = Number(
      inputInspResultIncome?.ref?.current?.values?.qty,
    );
    let rejectQty: number = Number(
      inputInspResultReject?.ref?.current?.values?.reject_qty,
    );

    if (receiveQty - incomeQty < 0) {
      message.warn(
        '입하수량보다 판정수량이 많습니다. 확인 후 다시 입력해주세요.',
      );
      inputInspResultIncome.setFieldValue('qty', receiveQty - rejectQty);
    } else {
      inputInspResultReject.setFieldValue('reject_qty', receiveQty - incomeQty);
    }

    setChangeIncomeQtyFg(false);
  }, [changeIncomeQtyFg]);

  useLayoutEffect(() => {
    if (!changeRejectQtyFg) return;
    let receiveQty: number = Number(
      inputInputItems?.ref?.current?.values?.insp_qty,
    );
    let incomeQty: number = Number(
      inputInspResultIncome?.ref?.current?.values?.qty,
    );
    let rejectQty: number = Number(
      inputInspResultReject?.ref?.current?.values?.reject_qty,
    );

    if (receiveQty - rejectQty < 0) {
      message.warn(
        '입하수량보다 판정수량이 많습니다. 확인 후 다시 입력해주세요.',
      );
      inputInspResultReject.setFieldValue('reject_qty', receiveQty - incomeQty);
    } else {
      inputInspResultIncome.setFieldValue('qty', receiveQty - rejectQty);
    }
    setChangeRejectQtyFg(false);
  }, [changeRejectQtyFg]);
  //#endregion

  //#region 컴포넌트 rander
  return (
    <GridPopup
      title="최종검사 성적서 수정"
      onOk={onSave}
      okText="저장"
      cancelText="취소"
      onCancel={onCancel}
      gridMode="update"
      popupId={'INSP_EDIT_POPUP'}
      gridId={'INSP_EDIT_POPUP_GRID'}
      ref={gridRef}
      columns={COLUMNS_FINAL_INSP_DETAILS_INCLUDE_VALUES}
      inputProps={[
        inputInputItems.props,
        inputInspResult.props,
        inputInspResultIncome.props,
        inputInspResultReject.props,
      ]}
      onAfterChange={onAfterChange}
      saveUriPath={null}
      searchUriPath={null}
      data={inspResult.details}
      hiddenActionButtons={true}
      saveType="basic"
      visible={props.popupVisible}
    />
  );
  //#endregion
};
//#endregion
