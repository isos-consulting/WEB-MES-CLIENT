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
import {
  Button,
  Container,
  Datagrid,
  GridPopup,
  IGridColumn,
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
import { ENUM_WIDTH } from '~/enums';
import {
  executeData,
  getData,
  getPageName,
  getPermissions,
  getToday,
  getUserFactoryUuid,
} from '~/functions';
import {
  extract_insp_ItemEntriesAtCounts,
  getEyeInspectionValueText,
  getInspectItems,
  getInspectResult,
  getInspectResultText,
  getInspectSamples,
  getMissingValueInspectResult,
  getRangeNumberResults,
  getSampleIndex,
  getSampleOkOrNgOrDefaultSampleValue,
  isColumnNameEndWith_insp_value,
  isColumnNamesNotEndWith_insp_value,
  isRangeAllNotNumber,
} from '~/functions/qms/inspection';
import { InspectionPostPayloadDetails } from './receive-insp-result/modals/types';

// 날짜 로케일 설정
dayjs.locale('ko-kr');

// moment 타입과 호환시키기 위한 행위
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const URI_PATH_GET_PRD_WORKS = '/prd/works';
const URI_PATH_GET_QMS_PROC_INSP_INCLUDE_DETAILS =
  '/qms/proc/insp/include-details';
const URI_PATH_GET_QMS_PROC_INSP_RESULTS = '/qms/proc/insp-results';
const URI_PATH_GET_QMS_PROC_INSP_RESULT_INCLUDE_DETAILS =
  '/qms/proc/insp-result/{uuid}/include-details';
const URI_PATH_POST_QMS_PROC_INSP_RESULTS = '/qms/proc/insp-results';
const URI_PATH_PUT_QMS_PROC_INSP_RESULTS = '/qms/proc/insp-results';
const URI_PATH_DELETE_QMS_PROC_INSP_RESULTS = '/qms/proc/insp-results';

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

type TGetQmsProcInspIncludeDetailsHeader = {
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

type TGetQmsProcInspIncludeDetailsDetail = {
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
};

type TGetQmsProcInspIncludeDetails = {
  header?: TGetQmsProcInspIncludeDetailsHeader;
  details?: TGetQmsProcInspIncludeDetailsDetail[];
};

type TGetQmsProcInspResult = {
  insp_result_uuid?: string;
  factory_uuid?: string;
  factory_cd?: string;
  factory_nm?: string;
  insp_type_uuid?: string;
  insp_type_nm?: string;
  insp_detail_type_uuid?: string;
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
  insp_type_uuid?: string;
  insp_type_nm?: string;
  insp_detail_type_uuid?: string;
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

type TPutQmsProcInspResultsHeader = {
  uuid: string;
  emp_uuid: string;
  insp_result_fg: boolean;
  insp_qty: number;
  pass_qty: number;
  reject_qty: number;
  remark: string;
};

type TPutQmsProcInspResultsDetailValue = {
  uuid: string;
  delete_fg: boolean;
  sample_no: number;
  insp_result_fg: boolean;
  insp_value: number;
};

type TPutQmsProcInspDeleteResultsDetailValue = {
  uuid: string;
  delete_fg: boolean;
  sample_no: number;
};

type TPutQmsProcInspResultsDetail = {
  values?:
    | TPutQmsProcInspResultsDetailValue[]
    | TPutQmsProcInspDeleteResultsDetailValue[];
  factory_uuid?: string;
  uuid: string;
  insp_result_fg: boolean;
  remark: string;
};

type TPutQmsFinalInspResult = {
  header?: TPutQmsProcInspResultsHeader;
  details?: TPutQmsProcInspResultsDetail[];
};

export const PgQmsProcInspResult = () => {
  const title = getPageName();

  const permissions = getPermissions(title);

  const [, contextHolder] = Modal.useModal();
  const INSP_RESULT_DETAIL_GRID = INSP_RESULT_DETAIL_GRID_INFO();
  const searchRef = useRef<FormikProps<FormikValues>>();
  const gridRef = useRef<Grid>();

  const [createPopupVisible, setCreatePopupVisible] = useState(false);
  const [works, setWorks] = useState<TGetPrdWork[]>([]);
  const [workData, setWorkData] = useState<TGetPrdWork>({});

  const SEARCH_ITEMS: ISearchItem[] = FieldStore.DUE_DATE_RANGE_SEVEN.reduce(
    (fields, dateField, fieldIndex) => {
      if (fieldIndex === 0)
        return [...fields, { ...dateField, label: WORD.WORK_DATE }];

      return [...fields, { ...dateField }];
    },
    [],
  );

  const inputWork = useInputGroup(
    'INPUT_ITEMS_WORK',
    InputGroupBoxStore.PROC_INSP_ITEM_WORK,
  );

  const onSearch = () => {
    const { values } = searchRef?.current;
    const searchParams = values;

    setWorkData({});

    getData(searchParams, URI_PATH_GET_PRD_WORKS).then(res => {
      setWorks(res);
      inputWork.ref.current.resetForm();
    });
  };

  const onCreate = ev => {
    if (!workData) {
      message.warning(SENTENCE.BEFORE_INPUT_WORK_AND_ADD_RECORD);
      return;
    }
    setCreatePopupVisible(true);
  };

  useLayoutEffect(() => {
    if (workData && !createPopupVisible) {
      INSP_RESULT_DETAIL_GRID.onSearch(workData);
    }
  }, [workData, createPopupVisible]);

  return (
    <>
      <Typography.Title level={5} style={{ marginBottom: -16, fontSize: 14 }}>
        <CaretRightOutlined />
        {WORD.PROC_INSP_HISTORY}
      </Typography.Title>
      <Divider style={{ marginBottom: 10 }} />
      <Container>
        <div>
          <Searchbox
            id="PROC_INSP_RESULT_SEARCH"
            innerRef={searchRef}
            searchItems={SEARCH_ITEMS}
            onSearch={onSearch}
            boxShadow={false}
          />
        </div>
        <Datagrid
          gridId="PROC_INSP_RESULTS"
          ref={gridRef}
          gridMode="view"
          columns={ColumnStore.PROC_INSP_HISTORY}
          height={300}
          data={works}
          onAfterClick={ev => {
            const { rowKey, targetType } = ev;

            if (targetType === 'cell') {
              try {
                const row = ev?.instance?.store?.data?.rawData[rowKey];

                inputWork.setValues(row);
                setWorkData(row);
                INSP_RESULT_DETAIL_GRID.onSearch(row);
                INSP_RESULT_DETAIL_GRID.onClearResultDetail();
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
            {WORD.PERFORMANCE_INFO}
          </Typography.Title>
          <div
            style={{ width: '100%', display: 'inline-block', marginTop: -26 }}
          >
            <Space size={[6, 0]} style={{ float: 'right' }}>
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
          <Divider style={{ marginTop: 2, marginBottom: 10 }} />
          <Row gutter={[16, 16]}>
            <InputGroupbox {...inputWork.props} />
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
          workData={workData}
          popupVisible={createPopupVisible}
          setPopupVisible={setCreatePopupVisible}
        />
      ) : null}

      {contextHolder}
    </>
  );
};

const INSP_RESULT_DETAIL_GRID_INFO = () => {
  const title = getPageName();
  const permissions = getPermissions(title);

  const procInspResultsGridRef = useRef<Grid>();
  const procInspResultDetailsGridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [workData, setWorkData] = useState<TGetPrdWork>({});
  const [procInspResults, setProcInspResults] = useState<
    TGetQmsProcInspResult[]
  >([]);
  const [procInspResultIncludeDetails, setProcInspResultIncludeDetails] =
    useState<TGetQmsProcInspResultIncludeDetails>({});

  const COLUMNS_INSP_RESULT_DETAILS_INCLUDE_VALUES = useMemo(() => {
    const procInspResultDetailItem = [
      ...ColumnStore.PROC_INSP_RESULT_DETAIL_ITEM,
    ];
    const procInspMaxSampleCount =
      procInspResultIncludeDetails?.header?.max_sample_cnt;

    if (procInspMaxSampleCount > 0) {
      for (
        let sampleIndex = 1;
        sampleIndex <= procInspMaxSampleCount;
        sampleIndex++
      ) {
        procInspResultDetailItem.push({
          header: `x${sampleIndex}_insp_result_detail_value_uuid`,
          name: `x${sampleIndex}_insp_result_detail_value_uuid`,
          width: ENUM_WIDTH.L,
          filter: 'text',
          hidden: true,
        });
        procInspResultDetailItem.push({
          header: `x${sampleIndex}_sample_no`,
          name: `x${sampleIndex}_sample_no`,
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        procInspResultDetailItem.push({
          header: `x${sampleIndex}`,
          name: `x${sampleIndex}_insp_value`,
          width: ENUM_WIDTH.L,
          filter: 'text',
          editable: true,
        });
        procInspResultDetailItem.push({
          header: `x${sampleIndex}_판정`,
          name: `x${sampleIndex}_insp_result_fg`,
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        procInspResultDetailItem.push({
          header: `x${sampleIndex}_판정`,
          name: `x${sampleIndex}_insp_result_state`,
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
      }
    }

    procInspResultDetailItem.push(...ColumnStore.INSP_ITEM_RESULT);

    return procInspResultDetailItem;
  }, [procInspResultIncludeDetails]);

  const inputInspResult = useInputGroup(
    'INPUT_INSP_RESULT',
    InputGroupBoxStore.PROC_INSP_RESULT_DETAIL_ITEM,
    { title: WORD.INSP_INFO },
  );

  const onEdit = ev => {
    if (!procInspResultIncludeDetails?.header?.insp_result_uuid) {
      message.warning(SENTENCE.BEFORE_SELECT_INSP_REPORT_AND_EDIT);
      return;
    }
    setEditPopupVisible(true);
  };

  const onDelete = async ev => {
    if (!procInspResultIncludeDetails?.header?.insp_result_uuid) {
      message.warn(SENTENCE.BEFORE_SELECT_INSP_REPORT_AND_DELETE);
      return;
    }
    Modal.confirm({
      icon: null,
      title: WORD.DELETE,
      content: SENTENCE.CONFIRM_TO_INSP_REPORT_DELETE,
      onOk: async () => {
        await executeData(
          [{ uuid: procInspResultIncludeDetails?.header?.insp_result_uuid }],
          URI_PATH_DELETE_QMS_PROC_INSP_RESULTS,
          'delete',
          'success',
        )
          .then(value => {
            if (!value) return;
            onSearch(workData);
            onClearResultDetail();
            message.info(SENTENCE.SAVE_COMPLETE);
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
    setProcInspResults([]);
    setProcInspResultIncludeDetails({});
  };

  const onClearResultDetail = () => {
    inputInspResult.ref.current.resetForm();
    setProcInspResultIncludeDetails({});
  };

  const onSearch = (workData: TGetPrdWork) => {
    if (!workData) return;

    setWorkData(workData);
    if (workData.work_uuid) {
      getData(
        {
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
          message.error(SENTENCE.ERROR_OCCURRED);
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
    getData<TGetQmsProcInspResultIncludeDetails>(
      {},
      searchUriPath,
      'header-details',
    )
      .then(res => {
        setProcInspResultIncludeDetails(res);
        inputInspResult.setValues({
          ...res.header,
          reg_date: dayjs(res.header.reg_date).format('YYYY-MM-DD'),
          reg_date_time: `${res.header.reg_date}`
            .replace('T', ' ')
            .slice(0, -5),
        });
      })
      .catch(err => {
        inputInspResult.ref.current.resetForm();
        setProcInspResultIncludeDetails({});
        message.error(SENTENCE.ERROR_OCCURRED);
      });
  };

  useLayoutEffect(() => {
    if (!editPopupVisible) {
      onSearch(workData);
    }
  }, [editPopupVisible]);

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
          style={{ minHeight: 550, maxHeight: 600, marginTop: -15 }}
        >
          <Col span={8} style={{ overflow: 'auto' }}>
            <Datagrid
              height={560}
              gridId="PROC_INSP_RESULT_DETAILS"
              ref={procInspResultsGridRef}
              gridMode="view"
              columns={ColumnStore.PROC_INSP_RESULT_DETAIL_HEADER}
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
              gridId="PROC_INSP_RESULT_INCLUDE_VALUES"
              ref={procInspResultDetailsGridRef}
              gridMode="view"
              columns={COLUMNS_INSP_RESULT_DETAILS_INCLUDE_VALUES}
              data={procInspResultIncludeDetails?.details}
            />
          </Col>
        </Row>
      </Container>
      {editPopupVisible ? (
        <INSP_RESULT_EDIT_POPUP
          workData={workData}
          inspResultUuid={
            procInspResultIncludeDetails?.header?.insp_result_uuid
          }
          popupVisible={editPopupVisible}
          setPopupVisible={setEditPopupVisible}
          onAfterCloseSearch={onSesrchInspResultDetail}
        />
      ) : null}
    </>
  );

  return {
    onSearch,
    onClearResultDetail,
    component,
  };
};

const INSP_RESULT_CREATE_POPUP = (props: {
  workData: TGetPrdWork;
  popupVisible: boolean;
  setPopupVisible: (value?) => void;
}) => {
  const gridRef = useRef<Grid>();
  const [inspIncludeDetails, setInspIncludeDetails] =
    useState<TGetQmsProcInspIncludeDetails>({});

  const COLUMNS_INSP_DETAILS_INCLUDE_VALUES = useMemo(() => {
    const procInspResultDetailItems = [
      ...ColumnStore.PROC_INSP_RESULT_DETAIL_ITEM,
    ];
    const inspectMaxSampleCount = inspIncludeDetails?.header?.max_sample_cnt;

    if (inspectMaxSampleCount > 0) {
      for (
        let sampleIndex = 1;
        sampleIndex <= inspectMaxSampleCount;
        sampleIndex++
      ) {
        procInspResultDetailItems.push({
          header: `x${sampleIndex}_insp_result_detail_value_uuid`,
          name: `x${sampleIndex}_insp_result_detail_value_uuid`,
          width: ENUM_WIDTH.L,
          filter: 'text',
          hidden: true,
        });
        procInspResultDetailItems.push({
          header: `x${sampleIndex}_sample_no`,
          name: `x${sampleIndex}_sample_no`,
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        procInspResultDetailItems.push({
          header: `x${sampleIndex}`,
          name: `x${sampleIndex}_insp_value`,
          width: ENUM_WIDTH.L,
          filter: 'text',
          editable: true,
        });
        procInspResultDetailItems.push({
          header: `x${sampleIndex}_판정`,
          name: `x${sampleIndex}_insp_result_fg`,
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        procInspResultDetailItems.push({
          header: `x${sampleIndex}_판정`,
          name: `x${sampleIndex}_insp_result_state`,
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
      }
    }

    procInspResultDetailItems.push(...ColumnStore.INSP_ITEM_RESULT);

    return procInspResultDetailItems;
  }, [inspIncludeDetails]);

  const INPUT_ITEMS_INSP_RESULT = InputGroupBoxStore.PROC_INSP_RESULT.map(
    inspResult => {
      if (inspResult.id === 'insp_detail_type_uuid') {
        return {
          ...inspResult,
          onAfterChange: inspTypeDetailUuid => {
            handleInspTypeChange(inspTypeDetailUuid);
          },
        };
      }
      return {
        ...inspResult,
      };
    },
  );

  const inputWork = useInputGroup(
    'INPUT_CREATE_ITEMS_WORK',
    InputGroupBoxStore.PROC_INSP_ITEM_WORK,
    {
      title: WORD.WORK_INFO,
    },
  );
  const inputInspResult = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: WORD.INSP_INFO },
  );

  const onClear = () => {
    inputWork.ref.current.resetForm();
    inputInspResult.ref.current.resetForm();
    setInspIncludeDetails({});
  };

  const onAfterChange = ({ changes, instance }: any) => {
    if (isColumnNamesNotEndWith_insp_value(changes)) return;

    const procInspections = instance.getData();
    const inspectionItemRanges = procInspections.map((item: any) => ({
      min: item.spec_min,
      max: item.spec_max,
    }));
    const extractedInspections =
      extract_insp_ItemEntriesAtCounts(procInspections);

    const inspectionSampleResults = getInspectSamples(
      extractedInspections,
      inspectionItemRanges,
    );
    const inspectionItemResults = getInspectItems(inspectionSampleResults);
    const inspectionResult = getInspectResult(inspectionItemResults);

    changes.forEach(({ rowKey, columnName }: any) => {
      if (isColumnNameEndWith_insp_value(columnName)) {
        const sampleIndex = getSampleIndex(columnName);
        const sampleResult = inspectionSampleResults[rowKey][sampleIndex];
        const isNumberFlagsInItemRange = getRangeNumberResults(
          inspectionItemRanges[rowKey],
        );
        const eyeInspectValueText = getEyeInspectionValueText(sampleResult);

        const uiMappedSampleInfo = {
          [`x${sampleIndex + 1}_insp_result_fg`]: sampleResult,
          [`x${sampleIndex + 1}_insp_result_state`]:
            getInspectResultText(sampleResult),
        };

        for (const [key, value] of Object.entries(uiMappedSampleInfo)) {
          instance.setValue(rowKey, key, value);
        }

        if (
          isRangeAllNotNumber(isNumberFlagsInItemRange) &&
          eyeInspectValueText
        ) {
          instance.setValue(rowKey, columnName, eyeInspectValueText);
        }
      }
    });

    inspectionItemResults.forEach((item: any, index: number) => {
      instance.setValue(index, 'insp_result_fg', item);
      instance.setValue(index, 'insp_result_state', getInspectResultText(item));
    });

    inputInspResult.setFieldValue('insp_result_fg', inspectionResult);
    inputInspResult.setFieldValue(
      'insp_result_state',
      getInspectResultText(inspectionResult),
    );
  };

  interface ManufacturingProcessInspectionPostAPIPayloadHeader {
    factory_uuid: string;
    work_uuid: string;
    insp_type_uuid: string;
    insp_detail_type_uuid: string;
    insp_uuid: string;
    prod_uuid: string;
    lot_no: string;
    emp_uuid: string;
    reg_date: string;
    insp_result_fg: boolean;
    insp_qty: number;
    pass_qty: number;
    reject_qty: number;
    remark: string;
  }

  const saveInspectionData = inspectionGridInstance => {
    const inputInspResultValues = inputInspResult?.ref?.current?.values;

    const inspectionHeader: ManufacturingProcessInspectionPostAPIPayloadHeader =
      {
        factory_uuid: getUserFactoryUuid(),
        work_uuid: props?.workData?.work_uuid,
        insp_type_uuid: inputInspResultValues?.insp_type_uuid,
        insp_detail_type_uuid: inputInspResultValues?.insp_detail_type_uuid,
        insp_uuid: inspIncludeDetails?.header?.insp_uuid,
        prod_uuid: props?.workData?.prod_uuid,
        lot_no: props?.workData?.lot_no,
        emp_uuid: inputInspResultValues?.emp_uuid,
        reg_date:
          inputInspResultValues?.reg_date +
          ' ' +
          inputInspResultValues?.reg_date_time +
          ':00',
        insp_result_fg: inputInspResultValues?.insp_result_fg,
        insp_qty: 0,
        pass_qty: 0,
        reject_qty: 0,
        remark: inputInspResultValues?.remark,
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

    const inspectionItems = inspectionSampleResults.map((item, itemIndex) => {
      const notNullSamples = item.reduce(
        (samples, currentSample, sampleIndex) => {
          if (currentSample === null) {
            return samples;
          }

          return [
            ...samples,
            {
              sample_no: sampleIndex + 1,
              insp_result_fg: currentSample,
              insp_value: getSampleOkOrNgOrDefaultSampleValue(
                inspectionDatas[itemIndex][`x${sampleIndex + 1}_insp_value`],
              ),
            },
          ];
        },
        [],
      );

      return {
        factory_uuid: getUserFactoryUuid(),
        insp_detail_uuid: inspectionDatas[itemIndex].insp_detail_uuid,
        insp_result_fg: inspectionDatas[itemIndex].insp_result_fg,
        remark: inspectionDatas[itemIndex].remark,
        values: notNullSamples,
      };
    });

    return {
      header: inspectionHeader,
      details: inspectionItems,
    };
  };

  interface ManufacturingProcessInspectionPostAPIPayload {
    header: ManufacturingProcessInspectionPostAPIPayloadHeader;
    details: InspectionPostPayloadDetails[];
  }

  const callInspectionCreateAPI = (
    saveData: ManufacturingProcessInspectionPostAPIPayload,
  ) =>
    executeData(
      saveData,
      URI_PATH_POST_QMS_PROC_INSP_RESULTS,
      'post',
      'success',
    )
      .then(value => {
        if (!value) return;
        message.info(SENTENCE.SAVE_COMPLETE);
        onClear();
        props.setPopupVisible(false);
      })
      .catch(e => {
        console.log(e);
      });

  const onSave = async inspectionGridRef => {
    const { emp_uuid, reg_date_time } = inputInspResult?.ref?.current?.values;

    if (emp_uuid == null) {
      message.warn(SENTENCE.INPUT_INSPECTOR);
      return;
    }
    if (reg_date_time == null) {
      message.warn(SENTENCE.INPUT_INSPECT_TIME);
      return;
    }

    const savedProcInspectionDatas = inspectionGridRef.current
      .getInstance()
      .getData();
    const procInspectionItemRanges = savedProcInspectionDatas.map(item => ({
      min: item.spec_min,
      max: item.spec_max,
    }));

    const inspectionSampleResults = getInspectSamples(
      extract_insp_ItemEntriesAtCounts(savedProcInspectionDatas),
      procInspectionItemRanges,
    );

    const isMissingValue = inspectionSampleResults.some(
      getMissingValueInspectResult,
    );

    if (isMissingValue === true) {
      message.warn(SENTENCE.EXIST_INSPECT_MISSING_VALUE);
      return;
    }

    const isUserInputAllCell = inspectionSampleResults.every(cells =>
      cells.every(cell => cell !== null),
    );

    const userDefinedInspectionSaveOption = await getData(
      { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
      '/std/tenant-opts',
    );

    const saveData = saveInspectionData(
      inspectionGridRef.current.getInstance(),
    );

    if (isUserInputAllCell === true) {
      callInspectionCreateAPI(saveData);
      return;
    }

    if (userDefinedInspectionSaveOption.length === 0) {
      throw new Error(
        SENTENCE.CANNOT_FOUND_INSP_REPORT_RESULT_VALUE_TO_SAVE_OPTION,
      );
    }

    if (userDefinedInspectionSaveOption[0].value === 0) {
      callInspectionCreateAPI(saveData);
      return;
    }

    if (userDefinedInspectionSaveOption[0].value === 1) {
      message.warn(SENTENCE.INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT);
      return;
    }

    if (userDefinedInspectionSaveOption[0].value === 2) {
      Modal.confirm({
        title: '',
        content:
          SENTENCE.CONFIRM_TO_SAVE_NOT_INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT,
        onOk: async close => {
          const saveData = saveInspectionData(
            inspectionGridRef.current.getInstance(),
          );
          await callInspectionCreateAPI(saveData);
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

  const handleInspTypeChange = inspTypeDetailUuid => {
    if (props?.workData && props.popupVisible && inspTypeDetailUuid) {
      if (inspTypeDetailUuid !== '-') {
        getData(
          {
            work_uuid: props?.workData?.work_uuid,
            insp_detail_type_uuid: inspTypeDetailUuid,
          },
          URI_PATH_GET_QMS_PROC_INSP_INCLUDE_DETAILS,
          'header-details',
        )
          .then((res: any) => {
            inputInspResult.setFieldValue(
              'insp_type_uuid',
              res?.header?.insp_type_uuid,
            );
            setInspIncludeDetails(res);
          })
          .catch(err => {
            onClear();
            message.error(SENTENCE.ERROR_OCCURRED);
          });
      } else {
        setInspIncludeDetails({});
      }
    }
  };

  useLayoutEffect(() => {
    if (props?.workData && props.popupVisible) {
      inputWork.setValues(props.workData);
      inputInspResult.setFieldValue('reg_date', getToday());
    }
  }, [props?.workData, props?.popupVisible]);

  useLayoutEffect(() => {
    Promise.resolve({ ...inspIncludeDetails }).then(processInspectionInfo => {
      processInspectionInfo.details?.forEach(
        (processInspectionItem, itemIndex) => {
          for (
            let cell = processInspectionItem.sample_cnt;
            cell < processInspectionInfo?.header?.max_sample_cnt;

          ) {
            cell++;
            gridRef.current
              .getInstance()
              .disableCell(itemIndex, `x${cell}_insp_value`);
            gridRef.current
              .getInstance()
              .removeCellClassName(itemIndex, `x${cell}_insp_value`, 'editor');
          }
        },
      );
    });
  }, [inspIncludeDetails]);

  return (
    <GridPopup
      title={SENTENCE.DO_ADD_DATA}
      onOk={onSave}
      okText={WORD.SAVE}
      cancelText={WORD.CANCEL}
      onCancel={onCancel}
      gridMode="update"
      popupId={'INSP_CREATE_POPUP'}
      gridId={'INSP_CREATE_POPUP_GRID'}
      ref={gridRef}
      columns={COLUMNS_INSP_DETAILS_INCLUDE_VALUES}
      inputProps={[inputWork.props, inputInspResult.props]}
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
  workData: TGetPrdWork;
  inspResultUuid: string;
  popupVisible: boolean;
  setPopupVisible: (value?) => void;
  onAfterCloseSearch?: (insp_result_uuid: string) => void;
}) => {
  const gridRef = useRef<Grid>();
  const [inspResultIncludeDetails, setInspResultIncludeDetails] =
    useState<TGetQmsProcInspResultIncludeDetails>({});
  const COLUMNS_INSP_RESULT_DETAILS_INCLUDE_VALUES = useMemo(() => {
    const editableProcInspDetails: IGridColumn[] = [
      ...ColumnStore.EDITABLE_PROC_INSP_RESULT_DETAIL,
    ];

    const procInspectMaxSampleCount =
      inspResultIncludeDetails?.header?.max_sample_cnt;

    if (procInspectMaxSampleCount > 0) {
      for (
        let sampleIndex = 1;
        sampleIndex <= inspResultIncludeDetails?.header?.max_sample_cnt;
        sampleIndex++
      ) {
        editableProcInspDetails.push({
          header: `x${sampleIndex}_insp_result_detail_value_uuid`,
          name: `x${sampleIndex}_insp_result_detail_value_uuid`,
          width: ENUM_WIDTH.L,
          filter: 'text',
          hidden: true,
        });
        editableProcInspDetails.push({
          header: `x${sampleIndex}_sample_no`,
          name: `x${sampleIndex}_sample_no`,
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        editableProcInspDetails.push({
          header: `x${sampleIndex}`,
          name: `x${sampleIndex}_insp_value`,
          width: ENUM_WIDTH.L,
          filter: 'text',
          editable: true,
        });
        editableProcInspDetails.push({
          header: `x${sampleIndex}_판정`,
          name: `x${sampleIndex}_insp_result_fg`,
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        editableProcInspDetails.push({
          header: `x${sampleIndex}_판정`,
          name: `x${sampleIndex}_insp_result_state`,
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
      }
    }

    editableProcInspDetails.push(...ColumnStore.INSP_ITEM_RESULT);

    return editableProcInspDetails;
  }, [inspResultIncludeDetails]);

  const INPUT_ITEMS_INSP_RESULT: IInputGroupboxItem[] =
    InputGroupBoxStore.PROC_INSP_RESULT.reduce((procInspectGroupBox, field) => {
      if (field.id === 'insp_detail_type_uuid') {
        return [
          ...procInspectGroupBox,
          {
            id: 'seq',
            label: '검사차수',
            type: 'number',
            disabled: true,
          },
          {
            ...field,
            disabled: true,
          },
        ];
      }
      return [...procInspectGroupBox, field];
    }, []);

  const inputWork = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT',
    InputGroupBoxStore.PROC_INSP_ITEM_WORK,
    { title: WORD.WORK_INFO },
  );
  const inputInspResult = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: WORD.INSP_INFO },
  );

  const onClear = () => {
    inputWork?.ref?.current?.resetForm();
    inputInspResult?.ref?.current?.resetForm();
    setInspResultIncludeDetails({});
  };

  const onAfterChange = ({ changes, instance }: any) => {
    if (isColumnNamesNotEndWith_insp_value(changes)) return;

    const procInspections = instance.getData();
    const inspectionItemRanges = procInspections.map((item: any) => ({
      min: item.spec_min,
      max: item.spec_max,
    }));
    const extractedInspections =
      extract_insp_ItemEntriesAtCounts(procInspections);

    const inspectionSampleResults = getInspectSamples(
      extractedInspections,
      inspectionItemRanges,
    );
    const inspectionItemResults = getInspectItems(inspectionSampleResults);
    const inspectionResult = getInspectResult(inspectionItemResults);

    changes.forEach(({ rowKey, columnName }: any) => {
      if (isColumnNameEndWith_insp_value(columnName)) {
        const sampleIndex = getSampleIndex(columnName);
        const sampleResult = inspectionSampleResults[rowKey][sampleIndex];
        const isNumberFlagsInItemRange = getRangeNumberResults(
          inspectionItemRanges[rowKey],
        );
        const eyeInspectValueText = getEyeInspectionValueText(sampleResult);

        const uiMappedSampleInfo = {
          [`x${sampleIndex + 1}_insp_result_fg`]: sampleResult,
          [`x${sampleIndex + 1}_insp_result_state`]:
            getInspectResultText(sampleResult),
        };

        for (const [key, value] of Object.entries(uiMappedSampleInfo)) {
          instance.setValue(rowKey, key, value);
        }

        if (
          isRangeAllNotNumber(isNumberFlagsInItemRange) &&
          eyeInspectValueText
        ) {
          instance.setValue(rowKey, columnName, eyeInspectValueText);
        }
      }
    });

    inspectionItemResults.forEach((item: any, index: number) => {
      instance.setValue(index, 'insp_result_fg', item);
      instance.setValue(index, 'insp_result_state', getInspectResultText(item));
    });

    inputInspResult.setFieldValue('insp_result_fg', inspectionResult);
    inputInspResult.setFieldValue(
      'insp_result_state',
      getInspectResultText(inspectionResult),
    );
  };

  const createInspectionPutApiPayload = (inspectionGridInstance: TuiGrid) => {
    const inputInspResultValues = inputInspResult?.ref?.current?.values;
    const processInspectionPayloadHeader: TPutQmsProcInspResultsHeader = {
      uuid: `${inputInspResultValues?.insp_result_uuid}`,
      emp_uuid: `${inputInspResultValues?.emp_uuid}`,
      insp_result_fg: Boolean(inputInspResultValues?.insp_result_fg),
      insp_qty: 0,
      pass_qty: 0,
      reject_qty: 0,
      remark:
        inputInspResultValues?.remark == null
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

    const procInsptionsPayloadDetails: TPutQmsProcInspResultsDetail[] =
      inspectionSampleResults.map((item, itemIndex) => {
        const editedSamples:
          | TPutQmsProcInspResultsDetailValue[]
          | TPutQmsProcInspDeleteResultsDetailValue[] = item.reduce(
          (samples, currentSample, sampleIndex) => {
            const sampleUuid =
              inspectionDatas[itemIndex][
                `x${sampleIndex + 1}_insp_result_detail_value_uuid`
              ];

            if (sampleUuid == null && currentSample == null) return samples;
            if (currentSample == null)
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

            const uuid = sampleUuid == null ? null : `${sampleUuid}`;

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
          },
          [],
        );

        return {
          factory_uuid: getUserFactoryUuid(),
          uuid: inspectionDatas[
            itemIndex
          ].insp_result_detail_info_uuid.toString(),
          insp_result_fg: Boolean(inspectionDatas[itemIndex].insp_result_fg),
          remark:
            inputInspResultValues?.remark == null
              ? null
              : `${inspectionDatas[itemIndex].remark}`,
          values: editedSamples,
        };
      });

    return {
      header: processInspectionPayloadHeader,
      details: procInsptionsPayloadDetails,
    };
  };

  const fetchInsepctionPutAPI = async (
    inspectionPostApiPayload: TPutQmsFinalInspResult,
  ) => {
    await executeData(
      inspectionPostApiPayload,
      URI_PATH_PUT_QMS_PROC_INSP_RESULTS,
      'put',
      'success',
    )
      .then(value => {
        if (!value) return;
        message.info(SENTENCE.SAVE_COMPLETE);
        props.onAfterCloseSearch(props?.inspResultUuid);
        onClear();
        props.setPopupVisible(false);
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
    const { emp_uuid, reg_date, reg_date_time } =
      inputInspResult?.ref?.current?.values;

    if (emp_uuid == null) {
      message.warn(SENTENCE.INPUT_INSPECTOR);
      return;
    }
    if (reg_date == null) {
      message.warn(SENTENCE.INPUT_INSPECT_DATE);
      return;
    }
    if (reg_date_time == null) {
      message.warn(SENTENCE.INPUT_INSPECT_TIME);
      return;
    }

    const updatedProcInspections = inspectionGridRef.current
      .getInstance()
      .getData();
    const procInspectionItemRanges = updatedProcInspections.map(item => ({
      min: String(item.spec_min),
      max: String(item.spec_max),
    }));

    const inspectionSampleResults = getInspectSamples(
      extract_insp_ItemEntriesAtCounts(updatedProcInspections),
      procInspectionItemRanges,
    );

    const isMissingValue = inspectionSampleResults.some(
      getMissingValueInspectResult,
    );

    if (isMissingValue === true) {
      message.warn(SENTENCE.EXIST_INSPECT_MISSING_VALUE);
      return;
    }

    const isFilledAllInspectionSample = inspectionSampleResults.every(
      sampleResults => sampleResults.every(result => result !== null),
    );

    const fetchOptionFilledQualityAllInspectionResult = await getData(
      { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
      '/std/tenant-opts',
    );

    const inspectionPutApiPayload = createInspectionPutApiPayload(
      inspectionGridRef.current.getInstance(),
    );

    if (isFilledAllInspectionSample === true) {
      fetchInsepctionPutAPI(inspectionPutApiPayload);
      return;
    }

    if (fetchOptionFilledQualityAllInspectionResult.length === 0) {
      throw new Error(
        SENTENCE.CANNOT_FOUND_INSP_REPORT_RESULT_VALUE_TO_SAVE_OPTION,
      );
    }

    if (fetchOptionFilledQualityAllInspectionResult[0].value === 0) {
      fetchInsepctionPutAPI(inspectionPutApiPayload);
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
          const inspectionPutApiPayload = createInspectionPutApiPayload(
            inspectionGridRef.current.getInstance(),
          );
          await fetchInsepctionPutAPI(inspectionPutApiPayload);
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

  useLayoutEffect(() => {
    if (props?.workData && props.popupVisible) {
      inputWork.setValues(props.workData);
    }
  }, [props?.workData, props?.popupVisible]);

  useLayoutEffect(() => {
    const searchUriPath =
      URI_PATH_GET_QMS_PROC_INSP_RESULT_INCLUDE_DETAILS.replace(
        '{uuid}',
        props.inspResultUuid,
      );

    if (props.inspResultUuid && props.popupVisible) {
      getData<TGetQmsProcInspResultIncludeDetails>(
        {},
        searchUriPath,
        'header-details',
      )
        .then(res => {
          setInspResultIncludeDetails(res);
          inputInspResult.setValues({
            ...res.header,
            reg_date: dayjs(res.header.reg_date).format('YYYY-MM-DD'),
            reg_date_time: `${res.header.reg_date}`
              .replace('T', ' ')
              .slice(0, -5),
          });

          res.details.forEach((detail, index) => {
            for (
              let cell = detail.sample_cnt;
              cell < res.header.max_sample_cnt;

            ) {
              cell++;
              gridRef.current
                .getInstance()
                .disableCell(index, `x${cell}_insp_value`);
              gridRef.current
                .getInstance()
                .removeCellClassName(index, `x${cell}_insp_value`, 'editor');
            }
          });
        })
        .catch(err => {
          onClear();
          message.error(SENTENCE.ERROR_OCCURRED);
        });
    } else {
      onClear();
    }
  }, [props.popupVisible, props.inspResultUuid]);

  return (
    <GridPopup
      title={SENTENCE.DO_UPDATE_DATA}
      onOk={onSave}
      okText={WORD.SAVE}
      cancelText={WORD.CANCEL}
      onCancel={onCancel}
      gridMode="update"
      popupId={'INSP_EDIT_POPUP'}
      gridId={'INSP_EDIT_POPUP_GRID'}
      ref={gridRef}
      columns={COLUMNS_INSP_RESULT_DETAILS_INCLUDE_VALUES}
      inputProps={[inputWork.props, inputInspResult.props]}
      onAfterChange={onAfterChange}
      saveUriPath={null}
      searchUriPath={null}
      data={inspResultIncludeDetails.details}
      hiddenActionButtons={true}
      saveType="basic"
      visible={props.popupVisible}
    />
  );
};
