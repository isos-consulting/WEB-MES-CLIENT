import { CaretRightOutlined } from '@ant-design/icons';
import Grid from '@toast-ui/react-grid';
import { Col, Divider, message, Modal, Row, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { FormikProps, FormikValues } from 'formik';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import TuiGrid from 'tui-grid';
import { GridEventProps } from 'tui-grid/types/event';
import {
  Button,
  Container,
  Datagrid,
  GridPopup,
  ISearchItem,
  Searchbox,
} from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import {
  IInputGroupboxItem,
  InputGroupbox,
} from '~/components/UI/input-groupbox/input-groupbox.ui';
import { ColumnStore } from '~/constants/columns';
import { FieldStore } from '~/constants/fields';
import { InputGroupBoxStore } from '~/constants/input-groupboxes';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { URL_PATH_ADM } from '~/enums';
import {
  blankThenNull,
  executeData,
  getData,
  getPageName,
  getPermissions,
  getToday,
  getUserFactoryUuid,
} from '~/functions';
import {
  createInspectionReportColumns,
  extract_insp_ItemEntriesAtCounts,
  getInspectionHandlingTypeCode,
  getInspectSamples,
  getMissingValueInspectResult,
  getSampleOkOrNgOrDefaultSampleValue,
} from '~/functions/qms/inspection';
import { InspectionDataGridChange } from '~/functions/qms/InspectionReportViewController';
import ReceiveInspectionReportViewController from '~/functions/qms/ReceiveInspectionReportViewController';
import { isEmpty, isNil, isNull } from '~/helper/common';
import InspectionHandlingServiceImpl from './receive-insp-result/modals/service/inspection-handling.service.impl';
import { InspectionHandlingTypeUuidSet } from './receive-insp-result/modals/types';
import { InputForm, QuantityField } from './receive-insp-result/models/fields';

dayjs.locale('ko-kr');

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

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

export const PgQmsFinalInspResult = () => {
  const title = getPageName();
  const permissions = getPermissions(title);

  const [, contextHolder] = Modal.useModal();

  const searchRef = useRef<FormikProps<FormikValues>>();
  const gridRef = useRef<Grid>();

  const [createPopupVisible, setCreatePopupVisible] = useState(false);
  const [finalInspResults, setFinalInspResults] = useState<
    TGetQmsFinalInspResult[]
  >([]);
  const [inspHandlingType, setInspHandlingType] = useState([]);

  const SEARCH_ITEMS: ISearchItem[] = FieldStore.DUE_DATE_RANGE_SEVEN.reduce(
    (fields, dateField, fieldIndex) => {
      if (fieldIndex === 0)
        return [...fields, { ...dateField, label: WORD.INSP_DATE }];

      return [...fields, { ...dateField }];
    },
    [],
  );

  const inputInspResult = useInputGroup(
    'INPUT_ITEMS_FINAL_INSP_RESULT',
    InputGroupBoxStore.FINAL_INSP_ITEM,
  );

  const onSearch = () => {
    const { values } = searchRef?.current;
    const searchParams = values;
    getData(searchParams, URI_PATH_GET_QMS_FINAL_INSP_RESULTS).then(res => {
      setFinalInspResults(res || []);
      inputInspResult.ref.current.resetForm();
      INSP_RESULT_DETAIL_GRID.onClear();
    });
  };

  const onCreate = ev => {
    setCreatePopupVisible(true);
  };

  const INSP_RESULT_DETAIL_GRID = INSP_RESULT_DETAIL_GRID_INFO({
    inspHandlingType: inspHandlingType,
    onAfterSave: onSearch,
  });

  useLayoutEffect(() => {
    const _inspHandlingType: object[] = [];
    getData(
      {},
      URL_PATH_ADM.INSP_HANDLING_TYPE.GET.INSP_HANDLING_TYPES,
      'raws',
    ).then(async res => {
      res.forEach(item => {
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

  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: -16, fontSize: 14 }}>
        <CaretRightOutlined />
        {WORD.FINAL_INSP_HISTORY}
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
              {SENTENCE.ADD_RECORD}
            </Button>
          </Space>
        </div>
        <div style={{ maxWidth: 700, marginTop: -20, marginLeft: -6 }}>
          <Searchbox
            id="FINAL_INSP_RESULT_SEARCH"
            innerRef={searchRef}
            searchItems={SEARCH_ITEMS}
            onSearch={onSearch}
            boxShadow={false}
          />
        </div>
        <Datagrid
          gridId="FINAL_INSP_RESULTS"
          ref={gridRef}
          gridMode="view"
          columns={ColumnStore.FINAL_INSP_HISTORY}
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
              }
            }
          }}
        />
      </Container>
      <Row gutter={[16, 0]}>
        <Col span={24} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <Typography.Title
            level={5}
            style={{ marginTop: 30, marginBottom: -16, fontSize: 14 }}
          >
            <CaretRightOutlined />
            {WORD.INSP_ITEM_INFO}
          </Typography.Title>
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
        {WORD.INSP_INFO}
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
};

const INSP_RESULT_DETAIL_GRID_INFO = (props: {
  inspHandlingType: any;
  onAfterSave: () => void;
}) => {
  const title = getPageName();
  const permissions = getPermissions(title);

  const gridRef = useRef<Grid>();

  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [finalInspResultIncludeDetails, setFinalInspResultIncludeDetails] =
    useState<TGetQmsFinalInspResultIncludeDetails>({});

  const COLUMNS_FINAL_INSP_RESULT_DETAILS_INCLUDE_VALUES = useMemo(() => {
    return createInspectionReportColumns(
      ColumnStore.RECEIVE_INSP_DETAIL,
      finalInspResultIncludeDetails?.header?.max_sample_cnt,
    );
  }, [finalInspResultIncludeDetails]);

  const inputInspResult = useInputGroup(
    'INPUT_INSP_RESULT',
    InputGroupBoxStore.FINAL_INSP_RESULT,
    { title: WORD.INSP_INFO },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_INSP_RESULT_INCOME',
    InputGroupBoxStore.FINAL_INSP_RESULT_INCOME,
    { title: WORD.INCOME_INFO },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_INSP_RESULT_REJECT',
    InputGroupBoxStore.FINAL_INSP_RESULT_REJECT,
    { title: WORD.REJECT_INFO },
  );

  const onEdit = ev => {
    if (!finalInspResultIncludeDetails?.header?.insp_result_uuid) {
      message.warning(SENTENCE.BEFORE_SELECT_INSP_REPORT_AND_EDIT);
      return;
    }
    setEditPopupVisible(true);
  };

  const onDelete = async ev => {
    if (!finalInspResultIncludeDetails?.header?.insp_result_uuid) {
      message.warn(SENTENCE.BEFORE_SELECT_INSP_REPORT_AND_DELETE);
      return;
    }

    Modal.confirm({
      icon: null,
      title: WORD.DELETE,
      content: SENTENCE.DELETE_CONFIRM,
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
            message.info(SENTENCE.DELETE_COMPLETE);
          })
          .catch(e => {
            console.log(e);
          });
      },
      onCancel: () => {
        // this function will be executed when cancel button is clicked
      },
      okText: WORD.YES,
      cancelText: WORD.NO,
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
          message.error(SENTENCE.ERROR_OCCURRED);
        });
    } else {
      onClear();
    }
  };

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
              {WORD.EDIT}
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
              {WORD.DELETE}
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
              gridId="FINAL_INSP_RESULT_DETAILS_INCLUDE_VALUES"
              ref={gridRef}
              gridMode="view"
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

  return {
    onSearch,
    onClear,
    component,
  };
};

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
  const viewController = new ReceiveInspectionReportViewController();

  const COLUMNS_FINAL_INSP_DETAILS_INCLUDE_VALUES = useMemo(() => {
    return createInspectionReportColumns(
      ColumnStore.FINAL_INSP_RESULT_DETAIL_ITEM,
      inspIncludeDetails?.header?.max_sample_cnt,
    );
  }, [inspIncludeDetails]);

  const INFO_INPUT_ITEMS: IInputGroupboxItem[] =
    InputGroupBoxStore.FINAL_INSP_RESULT_ITEM.map(field => {
      if (field.id === 'prod_no') {
        return {
          ...field,
          handleChange: values => setStoresStocks(values),
        };
      }

      if (field.id === 'qty') {
        return {
          ...field,
          onAfterChange: () => setChangeInspQtyFg(true),
        };
      }

      return field;
    });

  const INPUT_ITEMS_INSP_RESULT: IInputGroupboxItem[] =
    InputGroupBoxStore.CREATE_FINAL_INSP_RESULT.map(field => {
      if (field.id === 'insp_handling_type') {
        return {
          ...field,
          options: props.inspHandlingType,
          onAfterChange: (inspectionHandlingType: string) => {
            const { insp_handling_type_cd }: InspectionHandlingTypeUuidSet =
              isEmpty(inspectionHandlingType)
                ? { insp_handling_type_cd: null }
                : JSON.parse(inspectionHandlingType);

            triggerInspectionHandlingTypeChanged(
              insp_handling_type_cd,
              inputInputItems?.ref?.current?.values?.qty * 1,
            );
          },
        };
      }
      return field;
    });

  const INPUT_ITEMS_INSP_RESULT_INCOME: IInputGroupboxItem[] =
    InputGroupBoxStore.CREATE_FINAL_INSP_RESULT_INCOME.map(field => {
      if (field.id === 'qty') {
        return {
          ...field,
          onAfterChange: () => setChangeIncomeQtyFg(true),
        };
      }
      return field;
    });

  const INPUT_ITEMS_INSP_RESULT_RETURN: IInputGroupboxItem[] =
    InputGroupBoxStore.CREATE_FINAL_INSP_RESULT_REJECT.map(field => {
      if (field.id === 'reject_qty') {
        return {
          ...field,
          onAfterChange: () => setChangeRejectQtyFg(true),
        };
      }
      return field;
    });

  const inputInputItems = useInputGroup(
    'INPUT_CREATE_POPUP_INFO',
    INFO_INPUT_ITEMS,
    { title: WORD.INSP_ITEM_INFO },
  );
  const inputInspResult = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: WORD.INSP_INFO },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT_INCOME',
    INPUT_ITEMS_INSP_RESULT_INCOME,
    { title: WORD.INCOME_INFO },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT_REJECT',
    INPUT_ITEMS_INSP_RESULT_RETURN,
    { title: WORD.REJECT_INFO },
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

  const onAfterChange = ({ changes, instance }: any) => {
    viewController.dataGridChange(changes, instance, inputInspResult);

    const result = viewController.getReportResult(instance, inputInspResult);

    const inspectionHandlingTypeCode = getInspectionHandlingTypeCode(result);

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

    const finalInspections = inspectionGridInstance.getData();
    const inspectionItemRanges = finalInspections.map((item: any) => ({
      min: item.spec_min,
      max: item.spec_max,
    }));

    const inspectionSampleResults = getInspectSamples(
      extract_insp_ItemEntriesAtCounts(finalInspections),
      inspectionItemRanges,
    );

    const finalInspectionPayloadDetails: TPostQmsFinalInspResultsDetails[] =
      inspectionSampleResults.map((item, itemIndex) => {
        const notNullSample = item.reduce(
          (samples, currentSample, sampleIndex) => {
            if (isNil(currentSample)) {
              return samples;
            }

            return [
              ...samples,
              {
                sample_no: sampleIndex + 1,
                insp_result_fg: currentSample,
                insp_value: getSampleOkOrNgOrDefaultSampleValue(
                  finalInspections[itemIndex][
                    `x${sampleIndex + 1}_insp_value`
                  ].toString(),
                ),
              },
            ];
          },
          [],
        );

        return {
          factory_uuid: getUserFactoryUuid(),
          insp_detail_uuid: `${finalInspections[itemIndex].insp_detail_uuid}`,
          insp_result_fg: Boolean(finalInspections[itemIndex].insp_result_fg),
          remark: isNil(finalInspections[itemIndex].remark)
            ? null
            : `${finalInspections[itemIndex].remark}`,
          values: notNullSample,
        };
      });

    return {
      header: finalInspectionPayloadHeader,
      details: finalInspectionPayloadDetails,
    };
  };

  const fetchInspectionPostAPI = async (
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
        message.info(SENTENCE.SAVE_COMPLETE);
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
    const { insp_handling_type, emp_uuid, reg_date_time, insp_result_fg } =
      inputInspResult?.ref?.current?.values;
    const { to_store_uuid } = inputInspResultIncome?.ref?.current?.values;
    const { reject_qty, reject_uuid, reject_store_uuid } =
      inputInspResultReject?.ref?.current?.values;

    if (isEmpty(insp_handling_type)) {
      message.warn(SENTENCE.BEFORE_INPUT_HANDLING_TYPE);
      return;
    }
    if (isNil(emp_uuid)) {
      message.warn(SENTENCE.INPUT_INSPECTOR);
      return;
    }
    if (isNil(reg_date_time)) {
      message.warn(SENTENCE.INPUT_INSPECT_TIME);
      return;
    }

    const { insp_handling_type_cd } = JSON.parse(insp_handling_type);

    if (insp_result_fg === true && insp_handling_type_cd !== 'INCOME') {
      return message.warn(SENTENCE.INSPECT_RESULT_FLAG_TRUE_CAN_BE_INCOME);
    }

    if (insp_handling_type_cd === 'INCOME') {
      if (isEmpty(to_store_uuid)) {
        message.warn(SENTENCE.BEFORE_INPUT_INCOME_STORE);
        return;
      }
    }

    if (insp_handling_type_cd === 'RETURN') {
      if (isNil(reject_uuid)) {
        message.warn(SENTENCE.BEFORE_INPUT_REJECT_TYPE);
        return;
      }

      if (isEmpty(reject_store_uuid)) {
        message.warn(SENTENCE.BEFORE_INPUT_REJECT_STORE);
        return;
      }
    }

    if (insp_handling_type_cd === 'SELECTION') {
      if (isEmpty(to_store_uuid)) {
        message.warn(SENTENCE.BEFORE_INPUT_INCOME_STORE);
        return;
      }

      if (reject_qty > 0) {
        if (isNil(reject_uuid)) {
          message.warn(SENTENCE.BEFORE_INPUT_REJECT_TYPE);
          return;
        }

        if (isEmpty(reject_store_uuid)) {
          message.warn(SENTENCE.BEFORE_INPUT_REJECT_STORE);
          return;
        }
      }
    }

    const finalInspections = inspectionGridRef.current.getInstance().getData();
    const inspectionItemRanges = finalInspections.map(item => ({
      min: String(item.spec_min),
      max: String(item.spec_max),
    }));

    const inspectionSampleResults = getInspectSamples(
      extract_insp_ItemEntriesAtCounts(finalInspections),
      inspectionItemRanges,
    );

    const isMissingValue = inspectionSampleResults.some(
      getMissingValueInspectResult,
    );

    if (isMissingValue === true) {
      message.warn(SENTENCE.EXIST_INSPECT_MISSING_VALUE);
      return;
    }

    const isFilledAllInspectionSample = inspectionSampleResults.every(item =>
      item.every(sampleResult => !isNull(sampleResult)),
    );

    const inspectionPostApiPayload: TPostQmsFinalInspResults =
      createInspectionPostApiPayload(inspectionGridRef.current.getInstance());

    if (isFilledAllInspectionSample === true) {
      fetchInspectionPostAPI(inspectionPostApiPayload);
      return;
    }

    const fetchOptionFilledQualityAllInspectionResultFlags = await getData(
      { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
      '/std/tenant-opts',
    );

    if (fetchOptionFilledQualityAllInspectionResultFlags.length === 0) {
      throw new Error(
        SENTENCE.CANNOT_FOUND_INSP_REPORT_RESULT_VALUE_TO_SAVE_OPTION,
      );
    }

    if (fetchOptionFilledQualityAllInspectionResultFlags[0].value === 0) {
      fetchInspectionPostAPI(inspectionPostApiPayload);
      return;
    }

    if (fetchOptionFilledQualityAllInspectionResultFlags[0].value === 1) {
      message.warn(SENTENCE.INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT);
      return;
    }

    if (fetchOptionFilledQualityAllInspectionResultFlags[0].value === 2) {
      Modal.confirm({
        title: '',
        content:
          SENTENCE.CONFIRM_TO_SAVE_NOT_INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT,
        onOk: async (close: () => void) => {
          const inspectionPostApiPayload = createInspectionPostApiPayload(
            inspectionGridRef.current.getInstance(),
          );

          await fetchInspectionPostAPI(inspectionPostApiPayload);
          close();
        },
        onCancel: () => {
          // this function will be executed when cancel button is clicked
        },
      });
      return;
    }

    throw new Error(SENTENCE.UNKNOWN_ERROR_OCCURRED_WHEN_SAVE_INSP_REPORT);
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
            message.error(SENTENCE.CHECK_YOUR_ADAPTABLE_INSPECT_BASE_REPORT);
            onClear();
          } else if (res[0].apply_fg === false) {
            message.error(SENTENCE.CHECK_YOUR_ADAPTABLE_INSPECT_BASE_REPORT);
            onClear();
          } else {
            setInsp(res[0]);
          }
        })
        .catch(err => {
          onClear();
          message.error(SENTENCE.ERROR_OCCURRED);
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

          if (isNil(inputInspResult?.ref?.current?.values.reg_date))
            inputInspResult.setFieldValue('reg_date', getToday());

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
          message.error(SENTENCE.ERROR_OCCURRED);
        });
    }
  }, [insp]);

  useLayoutEffect(() => {
    const { insp_handling_type_cd } = isNil(
      inputInspResult?.ref?.current?.values?.insp_handling_type,
    )
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
      message.warn(SENTENCE.RECEIVE_QTY_OVER_THEN_INCOME_QTY);
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
      message.warn(SENTENCE.RECEIVE_QTY_OVER_THEN_INCOME_QTY);
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
      title={SENTENCE.DO_ADD_DATA}
      onOk={onSave}
      okText={WORD.SAVE}
      cancelText={WORD.CANCEL}
      onCancel={onCancel}
      gridMode="update"
      popupId="INSP_CREATE_POPUP"
      gridId="INSP_CREATE_POPUP_GRID"
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

const INSP_RESULT_EDIT_POPUP = (props: {
  inspResultUuid: string;
  inspHandlingType: any;
  popupVisible: boolean;
  setPopupVisible: (value?) => void;
  onAfterCloseSearch?: (insp_result_uuid: string) => void;
}) => {
  const gridRef = useRef<Grid>();

  const [changeIncomeQtyFg, setChangeIncomeQtyFg] = useState(false);
  const [changeRejectQtyFg, setChangeRejectQtyFg] = useState(false);

  const [inspResult, setInspResult] =
    useState<TGetQmsFinalInspResultIncludeDetails>({});

  const viewController = new ReceiveInspectionReportViewController();

  const COLUMNS_FINAL_INSP_DETAILS_INCLUDE_VALUES = useMemo(() => {
    return createInspectionReportColumns(
      ColumnStore.EDITABLE_FINAL_INSP_RESULT_DETAIL,
      inspResult?.header?.max_sample_cnt,
    );
  }, [inspResult]);

  const INFO_INPUT_ITEMS: IInputGroupboxItem[] =
    InputGroupBoxStore.FINAL_INSP_RESULT_ITEM.map(field => ({
      ...field,
      disabled: true,
    }));

  const INPUT_ITEMS_INSP_RESULT: IInputGroupboxItem[] =
    InputGroupBoxStore.EDITABLE_INPUT_ITEMS_INSP_RESULT.map(field => {
      if (field.id === 'insp_handling_type') {
        return {
          ...field,
          options: props.inspHandlingType,
          onAfterChange: (stringifiedInspectionHandlingType: string) => {
            const selectedInspHandlingType = isEmpty(
              stringifiedInspectionHandlingType,
            )
              ? { insp_handling_type_cd: '' }
              : JSON.parse(stringifiedInspectionHandlingType);
            const inputQty = inputInputItems.ref.current.values.insp_qty;

            let incomeDisabled: boolean = true;
            let rejectDisabled: boolean = true;
            let qtyDisabled: boolean = true;
            if (
              ['INCOME', 'SELECTION'].includes(
                selectedInspHandlingType.insp_handling_type_cd,
              )
            ) {
              incomeDisabled = false;
            }
            if (
              ['RETURN', 'SELECTION'].includes(
                selectedInspHandlingType.insp_handling_type_cd,
              )
            ) {
              rejectDisabled = false;
            }

            if (incomeDisabled) {
              inputInspResultIncome.setFieldValue('qty', 0);
            }
            if (rejectDisabled) {
              inputInspResultReject.setFieldValue('reject_qty', 0);
            }

            if (!incomeDisabled) {
              inputInspResultIncome.setFieldValue('qty', inputQty);
              inputInspResultReject.setFieldValue('reject_qty', 0);
            } else if (!rejectDisabled) {
              inputInspResultReject.setFieldValue('reject_qty', inputQty);
            }

            if (
              selectedInspHandlingType.insp_handling_type_cd === 'SELECTION'
            ) {
              qtyDisabled = false;
            }

            inputInspResultIncome.setFieldDisabled({
              qty: qtyDisabled,
              to_store_uuid: incomeDisabled,
              to_location_uuid: incomeDisabled,
            });
            inputInspResultReject.setFieldDisabled({
              reject_qty: true,
              reject_nm: rejectDisabled,
              reject_store_uuid: rejectDisabled,
              reject_location_uuid: rejectDisabled,
            });
          },
        };
      }
      return { ...field };
    });

  const INPUT_ITEMS_INSP_RESULT_INCOME: IInputGroupboxItem[] = [
    ...InputGroupBoxStore.CREATE_FINAL_INSP_RESULT_INCOME,
  ].map(field => {
    if (field.id === 'qty') {
      return {
        ...field,
        onAfterChange: () => {
          setChangeIncomeQtyFg(true);
        },
      };
    }
    return field;
  });

  const INPUT_ITEMS_INSP_RESULT_RETURN: IInputGroupboxItem[] = [
    ...InputGroupBoxStore.CREATE_FINAL_INSP_RESULT_REJECT,
  ].map(field => {
    if (field.id === 'reject_qty') {
      return {
        ...field,
        onAfterChange: () => {
          setChangeRejectQtyFg(true);
        },
      };
    }
    return field;
  });

  const inputInputItems = useInputGroup(
    'INPUT_EDIT_POPUP_INFO',
    INFO_INPUT_ITEMS,
    { title: WORD.INSP_ITEM_INFO },
  );
  const inputInspResult = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: WORD.INSP_INFO },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT_INCOME',
    INPUT_ITEMS_INSP_RESULT_INCOME,
    { title: WORD.INCOME_INFO },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT_REJECT',
    INPUT_ITEMS_INSP_RESULT_RETURN,
    { title: WORD.REJECT_INFO },
  );

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

  interface InspectionSampleAfterChangeProps extends GridEventProps {
    changes: InspectionDataGridChange[];
    instance: TuiGrid;
  }

  const onAfterChange = ({
    changes,
    instance,
  }: InspectionSampleAfterChangeProps) => {
    viewController.dataGridChange(changes, instance, inputInspResult);

    const result = viewController.getReportResult(instance, inputInspResult);
    const inspectionHandlingTypeCode = getInspectionHandlingTypeCode(result);

    changeInspResult(inspectionHandlingTypeCode);

    if (isEmpty(inspectionHandlingTypeCode)) {
      inputInspResult.setFieldValue('insp_handling_type', '');
    } else {
      props.inspHandlingType.forEach(({ code }) => {
        const { insp_handling_type_cd } = JSON.parse(code);
        if (insp_handling_type_cd === inspectionHandlingTypeCode) {
          inputInspResult.setFieldValue('insp_handling_type', code);
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
      from_location_uuid: isNil(inspResult.header.from_location_uuid)
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
      remark: isNil(inputInspResultValues?.remark)
        ? null
        : `${inputInspResultValues?.remark}`,
    };

    const inspectionDatas = inspectionGridInstance.getData();
    const inspectionItemRanges = inspectionDatas.map((item: any) => ({
      min: item.spec_min,
      max: item.spec_max,
    }));

    const inspectionSampleResults = getInspectSamples(
      extract_insp_ItemEntriesAtCounts(inspectionDatas),
      inspectionItemRanges,
    );

    const finalInspectionPayloadDetails: TPutQmsFinalInspResultsDetails[] =
      inspectionSampleResults.map((item: any, itemIndex: number) => {
        const editedSamples: TPutQmsFinalInspResultsDetailsValues[] =
          item.reduce((samples, currentSample, sampleIndex) => {
            const sampleUuid =
              inspectionDatas[itemIndex][
                `x${sampleIndex + 1}_insp_result_detail_value_uuid`
              ];

            if (isNil(sampleUuid) && isNil(currentSample)) return samples;
            if (isNil(currentSample))
              return [
                ...samples,
                {
                  uuid: `${sampleUuid}`,
                  delete_fg: true,
                  sample_no: sampleIndex + 1,
                },
              ];

            const sampleValue =
              inspectionDatas[itemIndex][
                `x${sampleIndex + 1}_insp_value`
              ].toString();

            const uuid = isNil(sampleUuid) ? null : `${sampleUuid}`;

            return [
              ...samples,
              {
                uuid,
                delete_fg: false,
                sample_no: sampleIndex + 1,
                insp_result_fg: currentSample,
                insp_value: getSampleOkOrNgOrDefaultSampleValue(sampleValue),
              },
            ];
          }, []);

        return {
          factory_uuid: getUserFactoryUuid(),
          uuid: inspectionDatas[
            itemIndex
          ].insp_result_detail_info_uuid.toString(),
          insp_result_fg: Boolean(inspectionDatas[itemIndex].insp_result_fg),
          remark: isNil(inputInspResultValues?.remark)
            ? null
            : `${inspectionDatas[itemIndex].remark}`,
          values: editedSamples,
        };
      });

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
        message.info(SENTENCE.SAVE_COMPLETE);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const onSave = async (
    inspectionGridRef: InspectionGridInstanceReference<Grid>,
  ) => {
    const { insp_handling_type, emp_uuid, reg_date_time, insp_result_fg } =
      inputInspResult?.ref?.current?.values;
    const { to_store_uuid } = inputInspResultIncome?.ref?.current?.values;
    const { reject_qty, reject_uuid, reject_store_uuid } =
      inputInspResultReject?.ref?.current?.values;

    if (isEmpty(insp_handling_type)) {
      message.warn(SENTENCE.BEFORE_INPUT_HANDLING_TYPE);
      return;
    }
    if (isNil(emp_uuid)) {
      message.warn(SENTENCE.INPUT_INSPECTOR);
      return;
    }
    if (isNil(reg_date_time) || reg_date_time === 'Invalid Date') {
      message.warn(SENTENCE.INPUT_INSPECT_TIME);
      return;
    }

    const { insp_handling_type_cd } = JSON.parse(insp_handling_type);

    if (insp_result_fg === true && insp_handling_type_cd !== 'INCOME') {
      return message.warn(SENTENCE.INSPECT_RESULT_FLAG_TRUE_CAN_BE_INCOME);
    }

    if (insp_handling_type_cd === 'INCOME') {
      if (isEmpty(to_store_uuid)) {
        message.warn(SENTENCE.BEFORE_INPUT_INCOME_STORE);
        return;
      }
    }

    if (insp_handling_type_cd === 'RETURN') {
      if (isNil(reject_uuid)) {
        message.warn(SENTENCE.BEFORE_INPUT_REJECT_TYPE);
        return;
      }

      if (isEmpty(reject_store_uuid)) {
        message.warn(SENTENCE.BEFORE_INPUT_REJECT_STORE);
        return;
      }
    }

    if (insp_handling_type_cd === 'SELECTION') {
      if (isEmpty(to_store_uuid)) {
        message.warn(SENTENCE.BEFORE_INPUT_INCOME_STORE);
        return;
      }

      if (reject_qty > 0) {
        if (isNil(reject_uuid)) {
          message.warn(SENTENCE.BEFORE_INPUT_REJECT_TYPE);
          return;
        }

        if (isEmpty(reject_store_uuid)) {
          message.warn(SENTENCE.BEFORE_INPUT_REJECT_STORE);
          return;
        }
      }
    }
    const finalInspections = inspectionGridRef.current.getInstance().getData();
    const inspectionItemRanges = finalInspections.map(item => ({
      min: String(item.spec_min),
      max: String(item.spec_max),
    }));

    const inspectionSampleResults = getInspectSamples(
      extract_insp_ItemEntriesAtCounts(finalInspections),
      inspectionItemRanges,
    );

    const isMissingValue = inspectionSampleResults.some(
      getMissingValueInspectResult,
    );

    if (isMissingValue === true) {
      message.warn(SENTENCE.EXIST_INSPECT_MISSING_VALUE);
      return;
    }

    const isFilledAllInspectionSample = inspectionSampleResults.every(item =>
      item.every(sampleResult => !isNull(sampleResult)),
    );

    const inspectionPutApiPayload: TPutQmsFinalInspResults =
      createInspectionPutApiPayload(inspectionGridRef.current.getInstance());

    if (isFilledAllInspectionSample === true) {
      fetchInspectionPutAPI(inspectionPutApiPayload);
      return;
    }

    const fetchOptionFilledQualityAllInspectionResult = await getData(
      { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
      '/std/tenant-opts',
    );

    if (fetchOptionFilledQualityAllInspectionResult.length === 0) {
      throw new Error(
        SENTENCE.CANNOT_FOUND_INSP_REPORT_RESULT_VALUE_TO_SAVE_OPTION,
      );
    }

    if (fetchOptionFilledQualityAllInspectionResult[0].value === 0) {
      fetchInspectionPutAPI(inspectionPutApiPayload);
      return;
    }

    if (fetchOptionFilledQualityAllInspectionResult[0].value === 1) {
      message.warn(SENTENCE.INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT);
      return;
    }

    if (fetchOptionFilledQualityAllInspectionResult[0].value === 2) {
      Modal.confirm({
        title: '',
        content:
          SENTENCE.CONFIRM_TO_SAVE_NOT_INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT,
        onOk: async (close: () => void) => {
          const inspectionPutApiPayload: TPutQmsFinalInspResults =
            createInspectionPutApiPayload(
              inspectionGridRef.current.getInstance(),
            );

          await fetchInspectionPutAPI(inspectionPutApiPayload);
          close();
        },
        onCancel: () => {
          // this function will be executed when cancel button is clicked
        },
      });
      return;
    }

    throw new Error(SENTENCE.UNKNOWN_ERROR_OCCURRED_WHEN_SAVE_INSP_REPORT);
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

        const { header } = res;

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
        inputInspResult.setFieldDisabled({
          insp_handling_type: res.header.insp_result_fg,
        });
        res.details.forEach((inspectionItem, inspectionItemIndex: number) => {
          for (
            let disableSampleIndex = inspectionItem.sample_cnt;
            disableSampleIndex < res.header.max_sample_cnt;

          ) {
            disableSampleIndex++;
            gridRef.current
              .getInstance()
              .disableCell(
                inspectionItemIndex,
                `x${disableSampleIndex}_insp_value`,
              );
            gridRef.current
              .getInstance()
              .removeCellClassName(
                inspectionItemIndex,
                `x${disableSampleIndex}_insp_value`,
                'editor',
              );
          }
        });
      })
      .catch(err => {
        onClear();
        message.error(SENTENCE.ERROR_OCCURRED);
      });
  };

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
      message.warn(SENTENCE.RECEIVE_QTY_OVER_THEN_INCOME_QTY);
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
      message.warn(SENTENCE.RECEIVE_QTY_OVER_THEN_INCOME_QTY);
      inputInspResultReject.setFieldValue('reject_qty', receiveQty - incomeQty);
    } else {
      inputInspResultIncome.setFieldValue('qty', receiveQty - rejectQty);
    }
    setChangeRejectQtyFg(false);
  }, [changeRejectQtyFg]);

  return (
    <GridPopup
      title={SENTENCE.DO_UPDATE_DATA}
      onOk={onSave}
      okText={WORD.SAVE}
      cancelText={WORD.CANCEL}
      onCancel={onCancel}
      gridMode="update"
      popupId="INSP_EDIT_POPUP"
      gridId="INSP_EDIT_POPUP_GRID"
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
};
