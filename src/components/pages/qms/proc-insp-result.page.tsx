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
import {
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
  getInspectSamples,
  getSampleOkOrNgOrDefaultSampleValue,
} from '~/functions/qms/inspection';
import InspectionReportViewController from '~/functions/qms/InspectionReportViewController';
import { isEmpty, isNil, isNull } from '~/helper/common';
import {
  TGetPrdWork,
  TGetQmsProcInspIncludeDetails,
  TGetQmsProcInspResult,
  TGetQmsProcInspResultIncludeDetails,
  TPutQmsFinalInspResult,
  TPutQmsProcInspDeleteResultsDetailValue,
  TPutQmsProcInspResultsDetail,
  TPutQmsProcInspResultsDetailValue,
  TPutQmsProcInspResultsHeader,
} from '~/types/qms/inspection.type';
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

  const onCreate = (_ev: unknown) => {
    if (isEmpty(workData)) {
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
    return createInspectionReportColumns(
      ColumnStore.PROC_INSP_RESULT_DETAIL_ITEM,
      procInspResultIncludeDetails?.header?.max_sample_cnt,
    );
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
  const viewController = new InspectionReportViewController();

  const COLUMNS_INSP_DETAILS_INCLUDE_VALUES = useMemo(() => {
    return createInspectionReportColumns(
      ColumnStore.PROC_INSP_RESULT_DETAIL_ITEM,
      inspIncludeDetails?.header?.max_sample_cnt,
    );
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
    viewController.dataGridChange(changes, instance, inputInspResult);
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
          if (isNull(currentSample)) {
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
    const userDefinedInspectionSaveOption = await getData(
      { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
      '/std/tenant-opts',
    );

    viewController.validate(
      inputInspResult?.ref?.current?.values,
      inspectionGridRef.current.getInstance().getData(),
      userDefinedInspectionSaveOption,
    );

    const saveData = saveInspectionData(
      inspectionGridRef.current.getInstance(),
    );

    if (userDefinedInspectionSaveOption[0].value === 0) {
      callInspectionCreateAPI(saveData);
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

    callInspectionCreateAPI(saveData);
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
      popupId="INSP_CREATE_POPUP"
      gridId="INSP_CREATE_POPUP_GRID"
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
    return createInspectionReportColumns(
      ColumnStore.EDITABLE_PROC_INSP_RESULT_DETAIL,
      inspResultIncludeDetails?.header?.max_sample_cnt,
    );
  }, [inspResultIncludeDetails]);
  const viewController = new InspectionReportViewController();

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
    viewController.dataGridChange(changes, instance, inputInspResult);
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
          },
          [],
        );

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

  const onSave = async (inspectionGridRef: React.MutableRefObject<Grid>) => {
    const fetchOptionFilledQualityAllInspectionResult = await getData(
      { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
      '/std/tenant-opts',
    );

    viewController.validate(
      inputInspResult?.ref?.current?.values,
      inspectionGridRef.current.getInstance().getData(),
      fetchOptionFilledQualityAllInspectionResult,
    );

    const inspectionPutApiPayload = createInspectionPutApiPayload(
      inspectionGridRef.current.getInstance(),
    );

    if (fetchOptionFilledQualityAllInspectionResult[0].value === 0) {
      fetchInsepctionPutAPI(inspectionPutApiPayload);
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

    fetchInsepctionPutAPI(inspectionPutApiPayload);
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
      onOk={okEvent => {
        onSave(okEvent as unknown as React.MutableRefObject<Grid>);
      }}
      okText={WORD.SAVE}
      cancelText={WORD.CANCEL}
      onCancel={onCancel}
      gridMode="update"
      popupId="INSP_EDIT_POPUP"
      gridId="INSP_EDIT_POPUP_GRID"
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
