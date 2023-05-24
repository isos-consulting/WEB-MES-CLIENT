import Grid from '@toast-ui/react-grid';
import { Col, message, Modal, Row, Space, Spin } from 'antd';
import { FormikProps, FormikValues } from 'formik';
import { cloneDeep } from 'lodash';
import React, {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Container,
  Datagrid,
  GridPopup,
  TGridMode,
  useGrid,
} from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import {
  IInputGroupboxItem,
  InputGroupbox,
} from '~/components/UI/input-groupbox/input-groupbox.ui';
import { ColumnStore } from '~/constants/columns';
import { SENTENCE } from '~/constants/lang/ko';
import {
  cloneObject,
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
  getDateFormat,
  getDateTimeFormat,
  getInspectSamples,
  getMissingValueInspectResult,
  getTimeFormat,
} from '~/functions/qms/inspection';
import InspectionReportViewController from '~/functions/qms/InspectionReportViewController';
import { isNil, isNull } from '~/helper/common';
import { SaveApiMethod } from '~/types/api/api.type';
import {
  GetMaxSampleCntParams,
  GetMaxSampleCntResponse,
  HeaderSaveOptionParams,
  InspectionDataGridOnChangeEvent,
  InspectionSampleComponentInstances,
} from '~/types/qms/inspection.type';
import { onDefaultGridSave } from '.';
import { onErrorMessage, TAB_CODE } from './work.page.util';

export const INSP = () => {
  const title = getPageName();

  const permissions = getPermissions(title);

  const viewController = new InspectionReportViewController();

  const [modal, modalContext] = Modal.useModal();

  const gridRef = useRef<Grid>();
  const inputRef = useRef<FormikProps<FormikValues>>();

  const defaultHeaderGridMode = 'delete';
  const defaultDetailGridMode = 'view';

  const [headerGridMode, setHeaderGridMode] = useState<TGridMode>(
    defaultHeaderGridMode,
  );

  const [headerData, setHeaderData] = useState([]);

  const [headerSaveOptionParams, setHeaderSaveOptionParams] = useState({});
  const [detailSaveOptionParams, setDetailSaveOptionParams] = useState({});

  const [selectedRow, setSelectedRow] = useState({});

  const HEADER_SEARCH_URI_PATH = '/qms/proc/insp-results';
  const DETAIL_STD_SEARCH_URI_PATH = '/qms/proc/insp/include-details';
  const DETAIL_SEARCH_URI_PATH = '/qms/proc/insp-result/$/include-details';
  const SAVE_URI_PATH = '/qms/proc/insp-results';

  // 팝업 관련 설정
  const [createPopupVisible, setCreatePopupVisible] = useState<boolean>(false);
  const [editPopupVisible, setEditPopupVisible] = useState<boolean>(false);

  //#endregion

  const INSP_DETAIL_HEADER = {
    height: 60,
    complexColumns: [
      {
        header: '작업자',
        name: '_worker',
        childNames: ['worker_sample_cnt', 'worker_insp_cycle'],
      },
      {
        header: '검사원',
        name: '_inspector',
        childNames: ['inspector_sample_cnt', 'inspector_insp_cycle'],
      },
    ],
  };

  const detailGrid = useGrid(
    'WORK_INSP_DETAIL_GRID',
    ColumnStore.WORK_INSP_DETAIL,
    {
      gridMode: defaultDetailGridMode,
      header: INSP_DETAIL_HEADER,
    },
  );

  const calculateResultForInspectionSample = (
    { changes, instance }: InspectionDataGridOnChangeEvent,
    { inputInstance }: InspectionSampleComponentInstances,
  ) => {
    viewController.dataGridChange(changes, instance, inputInstance);
  };

  const getMaxSampleCnt = async (
    params: GetMaxSampleCntParams,
  ): Promise<GetMaxSampleCntResponse> => {
    const datas = await getData(
      params,
      DETAIL_STD_SEARCH_URI_PATH,
      'header-details',
      null,
      null,
      null,
      { disabledZeroMessage: true },
    );
    const maxSampleCnt = datas?.['header']?.max_sample_cnt;

    return {
      datas,
      header: datas?.['header'],
      details: datas?.['details'],
      maxSampleCnt,
    };
  };

  //#region 🚫입력상자
  const INSP_INPUT_ITEMS: IInputGroupboxItem[] = [
    { id: 'insp_uuid', label: '검사기준서uuid', type: 'text', hidden: true },
    { id: 'insp_result_fg', label: '최종판정', type: 'text', hidden: true },
    {
      id: 'insp_result_state',
      label: '최종판정',
      type: 'text',
      disabled: true,
    },
    { id: 'seq', label: '검사차수', type: 'text', disabled: true },
    { id: 'emp_uuid', label: '검사자UUID', type: 'text', hidden: true },
    {
      id: 'emp_nm',
      label: '검사자',
      type: 'text',
      disabled: true,
      usePopup: true,
      popupKey: '사원관리',
      popupKeys: ['emp_nm', 'emp_uuid'],
      params: { emp_status: 'incumbent' },
    },
    {
      id: 'insp_type_nm',
      label: '검사유형',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'insp_detail_type_uuid',
      label: '검사유형',
      type: 'combo',
      disabled: true,
      dataSettingOptions: {
        codeName: 'insp_detail_type_uuid',
        textName: 'insp_detail_type_nm',
        uriPath: '/adm/insp-detail-types',
        params: {
          insp_type_cd: 'PROC_INSP',
        },
      },
      onAfterChange: ev => {
        if (createPopupVisible && ev != '-') {
          getMaxSampleCnt({
            insp_detail_type_uuid: ev,
            work_uuid: (headerSaveOptionParams as any)?.work_uuid,
          }).then(({ datas, maxSampleCnt, header, details }) => {
            const newColumns = createInspectionReportColumns(
              ColumnStore.WORK_INSP_DETAIL,
              maxSampleCnt,
            );
            detailGrid.setGridColumns(newColumns);

            if (createPopupVisible) {
              createPopupGrid.setGridData(details);
              createPopupInput.setFieldValue('insp_uuid', header?.insp_uuid);
              createPopupInput.setFieldValue(
                'insp_type_uuid',
                header?.insp_type_uuid,
              );
              createPopupGrid.setGridColumns(newColumns);

              details.forEach((detail, disabledRowIndex) => {
                for (
                  let cellIndex = detail.sample_cnt + 1;
                  cellIndex <= maxSampleCnt;
                  cellIndex++
                ) {
                  createPopupGrid.gridRef.current
                    .getInstance()
                    .disableCell(disabledRowIndex, `x${cellIndex}_insp_value`);
                  createPopupGrid.gridRef.current
                    .getInstance()
                    .removeCellClassName(
                      disabledRowIndex,
                      `x${cellIndex}_insp_value`,
                      'editor',
                    );
                }
              });
            }
          });
        } else {
          createPopupGrid.setGridData([]);
        }
      },
    },
    {
      id: 'reg_date',
      label: '검사일자',
      type: 'date',
      disabled: true,
      default: getToday(),
    },
    {
      id: 'reg_date_time',
      label: '검사시간',
      type: 'time',
      disabled: true,
      required: true,
      important: true,
    },
    { id: 'remark', label: '비고', type: 'text', disabled: true },
  ];

  const createPopupInput = useInputGroup(
    'WORK_INSP_CREATE_POPUP_INPUTBOX',
    INSP_INPUT_ITEMS,
    {
      boxShadow: false,
    },
  );
  const createPopupGrid = useGrid(
    'WORK_INSP_CREATE_POPUP_GRID',
    ColumnStore.WORK_INSP_DETAIL,
    {
      header: INSP_DETAIL_HEADER,
      hiddenActionButtons: true,
      disabledAutoDateColumn: true,
    },
  );
  const editPopupInput = useInputGroup(
    'WORK_INSP_EDIT_POPUP_INPUTBOX',
    INSP_INPUT_ITEMS,
    {
      boxShadow: false,
    },
  );
  const editPopupGrid = useGrid(
    'WORK_INSP_EDIT_POPUP_GRID',
    ColumnStore.WORK_INSP_DETAIL,
    {
      header: INSP_DETAIL_HEADER,
      hiddenActionButtons: true,
      disabledAutoDateColumn: true,
    },
  );

  useLayoutEffect(() => {
    if (createPopupVisible && createPopupInput) {
    } else {
      createPopupInput?.instance?.resetForm();
      onSearch(headerSaveOptionParams);
    }
  }, [createPopupVisible]);

  const onSearch = async ({
    work_uuid,
    ...saveOptions
  }: HeaderSaveOptionParams) => {
    if (isNil(work_uuid)) return;

    const procInspections = await getData(
      { work_uuid },
      HEADER_SEARCH_URI_PATH,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        disabledZeroMessage: true,
      },
    );

    setHeaderData(procInspections);

    setHeaderSaveOptionParams({
      work_uuid,
      ...saveOptions,
    });
  };

  const onReset = () => {
    setHeaderSaveOptionParams({});
    setDetailSaveOptionParams({});
    setHeaderData([]);
    detailGrid.setGridData([]);
  };

  const onDelete = ev => {
    if (isNil((headerSaveOptionParams as any)?.work_uuid)) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    const isModified = gridRef?.current?.getInstance()?.isModified();

    if (!isModified) {
      message.error('삭제할 항목을 선택해주세요.');
      return;
    }

    onDefaultGridSave(
      'basic',
      gridRef,
      ColumnStore.WORK_INSP,
      SAVE_URI_PATH,
      {},
      modal,
      ({ success, count, savedData }) => {
        const preSelectedRow = cloneDeep(selectedRow);
        if (success) {
          inputRef?.current?.resetForm();
          setHeaderData([]);
          onSearch(headerSaveOptionParams);
          headerData?.forEach(row => {
            if (row?.insp_result_uuid === preSelectedRow?.insp_result_uuid) {
              setSelectedRow(row);
            }
          });
        }
      },
    );
  };

  const onEdit = ev => {
    if (isNil((headerSaveOptionParams as any)?.work_uuid)) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if (isNil(inputRef?.current?.values?.insp_result_uuid)) {
      message.error('검사결과 항목을 선택해주세요.');
      return;
    }

    setEditPopupVisible(true);
  };

  const onAppend = ev => {
    if (isNil((headerSaveOptionParams as any)?.work_uuid)) {
      onErrorMessage('하위이력작업시도');
      return;
    }
    createPopupGrid.setGridData([]);
    setCreatePopupVisible(true);
  };

  const compareRequiredData = (compareDatas, requiredFields) => {
    requiredFields.forEach(requiredFiled => {
      if (!compareDatas[requiredFiled.key])
        throw new Error(`${requiredFiled.name} 정보를 확인해주세요.`);
    });
  };

  const saveInspectionDatas = async (
    saveGridRef: MutableRefObject<Grid>,
    saveInputRef: MutableRefObject<FormikProps<FormikValues>>,
  ) => {
    try {
      const saveInputValues = saveInputRef?.current?.values;
      const { reg_date, reg_date_time } = saveInputValues;

      const regDateTime = getDateTimeFormat(
        `${getDateFormat(reg_date)} ${getTimeFormat(reg_date_time)}`,
      );

      const headerData = {
        factory_uuid: getUserFactoryUuid(),
        work_uuid: (headerSaveOptionParams as any)?.work_uuid,
        insp_type_uuid: saveInputValues?.insp_type_uuid,
        insp_detail_type_uuid: saveInputValues?.insp_detail_type_uuid,
        insp_uuid: saveInputValues?.insp_uuid,
        prod_uuid: (headerSaveOptionParams as any)?.prod_uuid,
        lot_no: (headerSaveOptionParams as any)?.lot_no,
        emp_uuid: saveInputValues?.emp_uuid,
        reg_date: regDateTime,
        insp_result_fg: saveInputValues?.insp_result_fg,
        insp_qty: 0,
        pass_qty: 0,
        reject_qty: 0,
        remark: saveInputValues?.remark,
      };

      const requiredFields = [
        { key: 'factory_uuid', name: '공장' },
        { key: 'work_uuid', name: '생산실적' },
        { key: 'insp_detail_type_uuid', name: '검사유형' },
        { key: 'insp_uuid', name: '검사기준서' },
        { key: 'prod_uuid', name: '품목' },
        { key: 'lot_no', name: 'LOT NO' },
        { key: 'emp_uuid', name: '검사자' },
        { key: 'reg_date', name: '검사일시' },
      ];

      compareRequiredData(headerData, requiredFields);

      const methodType: SaveApiMethod = createPopupVisible ? 'post' : 'put';
      const saveGridInstance = saveGridRef?.current?.getInstance();
      const inspections = saveGridInstance.getData();
      const ranges = inspections.map((item: any) => ({
        min: item.spec_min,
        max: item.spec_max,
      }));

      const inspectionSampleResults = getInspectSamples(
        extract_insp_ItemEntriesAtCounts(inspections),
        ranges,
      );

      const isMissingValue = inspectionSampleResults.some(
        getMissingValueInspectResult,
      );

      if (isMissingValue === true) {
        throw new Error(SENTENCE.EXIST_INSPECT_MISSING_VALUE);
      }

      const detailDatas: object[] = inspections.map(
        (
          {
            insp_result_detail_info_uuid,
            sample_cnt,
            insp_result_fg,
            insp_detail_uuid,
            remark,
            ...inspectionItem
          },
          itemIndex,
        ) => {
          const values = [];

          for (let k = 1; k <= sample_cnt; k++) {
            const value = inspectionItem['x' + k + '_insp_value'];
            if (value) {
              values.push({
                uuid: insp_result_detail_info_uuid,
                sample_no: k,
                insp_result_fg: inspectionSampleResults[itemIndex][k - 1],
                insp_value: value === 'OK' ? 1 : value === 'NG' ? 0 : value,
              });
            }
          }

          return {
            values,
            factory_uuid: getUserFactoryUuid(),
            insp_result_fg,
            insp_detail_uuid,
            remark,
          };
        },
      );

      const saveData: object = {
        header: headerData,
        details: detailDatas,
      };

      const isFilledAllInspectionSample = inspectionSampleResults.every(item =>
        item.every(sampleResult => !isNull(sampleResult)),
      );

      if (isFilledAllInspectionSample === true) {
        await executeData(saveData, SAVE_URI_PATH, methodType, 'success')
          .then(value => {
            if (!value) return;
            message.info(SENTENCE.SAVE_COMPLETE);
            setCreatePopupVisible(false);
            setEditPopupVisible(false);
          })
          .catch(e => {
            console.log(e);
          });
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
        await executeData(saveData, SAVE_URI_PATH, methodType, 'success')
          .then(value => {
            if (!value) return;
            message.info(SENTENCE.SAVE_COMPLETE);
            setCreatePopupVisible(false);
            setEditPopupVisible(false);
          })
          .catch(e => {
            console.log(e);
          });
        return;
      }

      if (fetchOptionFilledQualityAllInspectionResultFlags[0].value === 1) {
        throw new Error(
          SENTENCE.INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT,
        );
      }

      if (fetchOptionFilledQualityAllInspectionResultFlags[0].value === 2) {
        Modal.confirm({
          title: '',
          content:
            SENTENCE.CONFIRM_TO_SAVE_NOT_INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT,
          onOk: async (close: () => void) => {
            await executeData(saveData, SAVE_URI_PATH, methodType, 'success')
              .then(value => {
                if (!value) return;
                message.info(SENTENCE.SAVE_COMPLETE);
                setCreatePopupVisible(false);
                setEditPopupVisible(false);
              })
              .catch(e => {
                console.log(e);
              });
            close();
          },
          onCancel: () => {
            // this function will be executed when cancel button is clicked
          },
        });
        return;
      }

      throw new Error(SENTENCE.UNKNOWN_ERROR_OCCURRED_WHEN_SAVE_INSP_REPORT);
    } catch (e) {
      message.warn(e.message);
    }
  };

  useEffect(() => {
    if (headerData?.length === 0) {
      inputRef?.current?.resetForm();
      detailGrid.setGridData([]);
    }
  }, [headerData]);

  useLayoutEffect(() => {
    if (Object.keys(selectedRow)?.length > 0 && selectedRow) {
      try {
        const insp_result_uuid = selectedRow?.insp_result_uuid;
        const work_uuid = selectedRow?.work_uuid;
        const URI_PATH = DETAIL_SEARCH_URI_PATH.replace('$', insp_result_uuid);

        getData({}, URI_PATH, 'header-details', null, null, null, {
          disabledZeroMessage: true,
        }).then(res => {
          const header = res?.['header'];
          const details = res?.['details'];
          const maxSampleCnt = header?.max_sample_cnt;
          const columns = createInspectionReportColumns(
            ColumnStore.WORK_INSP_DETAIL,
            maxSampleCnt,
          );

          inputRef?.current?.setValues({
            ...header,
            reg_date_time: header?.reg_date,
          });
          detailGrid.setGridColumns(columns);
          detailGrid.setGridData(details);
          setDetailSaveOptionParams({ work_uuid });
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, [selectedRow]);

  const onClickHeader = ev => {
    const { rowKey, targetType } = ev;
    if (targetType === 'cell' && headerGridMode === defaultHeaderGridMode) {
      try {
        const row = ev?.instance?.store?.data?.rawData[rowKey];
        setSelectedRow(row);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const component = !permissions ? (
    <Spin spinning={true} tip="권한 정보를 가져오고 있습니다." />
  ) : (
    <>
      <Container boxShadow={false}>
        <div style={{ width: '100%', display: 'inline-block' }}>
          <Space size={[6, 0]} style={{ float: 'right' }}>
            <Button
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="delete"
              colorType="blue"
              onClick={onDelete}
              hidden={true}
              disabled={!permissions?.delete_fg}
            >
              삭제
            </Button>
            <Button
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="edit"
              colorType="blue"
              onClick={onEdit}
              hidden={true}
              disabled={!permissions?.update_fg}
            >
              수정
            </Button>
            <Button
              btnType="buttonFill"
              widthSize="large"
              heightSize="small"
              fontSize="small"
              ImageType="add"
              colorType="blue"
              onClick={onAppend}
              disabled={!permissions?.create_fg}
            >
              신규 추가
            </Button>
          </Space>
        </div>
        <Row gutter={[16, 0]} style={{ minHeight: 452, maxHeight: 452 }}>
          <Col span={8}>
            <Datagrid
              gridId={TAB_CODE.workInsp + '_GRID'}
              ref={gridRef}
              gridMode={headerGridMode}
              columns={ColumnStore.WORK_INSP}
              data={headerData}
              height={420}
              onAfterChange={ev =>
                calculateResultForInspectionSample(ev, {
                  gridInstance: gridRef?.current?.getInstance(),
                  inputInstance: inputRef?.current,
                })
              }
              onAfterClick={onClickHeader}
            />
          </Col>
          <Col
            span={16}
            style={{ minHeight: 452, maxHeight: 452, overflow: 'auto' }}
          >
            <InputGroupbox
              boxShadow={false}
              id={TAB_CODE.workInsp + '_INPUT_GROUP_BOX'}
              inputItems={INSP_INPUT_ITEMS}
              innerRef={inputRef}
            />
            <Datagrid {...detailGrid.gridInfo} ref={detailGrid.gridRef} />
          </Col>
        </Row>
      </Container>
      {createPopupVisible ? (
        <GridPopup
          {...createPopupGrid.gridInfo}
          title="데이터 추가"
          onOk={() =>
            saveInspectionDatas(createPopupGrid.gridRef, createPopupInput.ref)
          }
          okText="저장하기"
          cancelText="취소"
          onCancel={() => {
            setCreatePopupVisible(false);
          }}
          gridMode="create"
          popupId={'INSP_GRID_POPUP_POPUP'}
          ref={createPopupGrid.gridRef}
          parentGridRef={gridRef}
          inputProps={{
            id: 'INSP_DETAIL_GRID_POPUP_INPUT',
            inputItems: cloneObject(INSP_INPUT_ITEMS)?.map(el => {
              if (
                [
                  'emp_nm',
                  'insp_detail_type_uuid',
                  'reg_date',
                  'reg_date_time',
                  'remark',
                ].includes(el.id)
              ) {
                el['disabled'] = false;
              }
              return el;
            }),
            innerRef: createPopupInput.ref,
          }}
          onAfterChange={ev =>
            calculateResultForInspectionSample(ev, {
              gridInstance: createPopupGrid.gridInstance,
              inputInstance: createPopupInput.instance,
            })
          }
          saveUriPath={SAVE_URI_PATH}
          searchUriPath={DETAIL_SEARCH_URI_PATH}
          saveType="basic"
          defaultVisible={false}
          visible={createPopupVisible}
        />
      ) : null}
      {editPopupVisible ? (
        <GridPopup
          {...editPopupGrid.gridInfo}
          title="데이터 수정"
          onOk={() =>
            saveInspectionDatas(editPopupGrid.gridRef, editPopupInput.ref)
          }
          okText="저장하기"
          cancelText="취소"
          onCancel={() => {
            setEditPopupVisible(false);
          }}
          gridMode="update"
          popupId={'INSP_EDIT_GRID_POPUP_POPUP'}
          ref={editPopupGrid.gridRef}
          parentGridRef={gridRef}
          inputProps={{
            id: 'INSP_DETAIL_EDIT_GRID_POPUP_INPUT',
            inputItems: cloneObject(INSP_INPUT_ITEMS)?.map(el => {
              if (
                [
                  'emp_nm',
                  'insp_detail_type_uuid',
                  'reg_date',
                  'reg_date_time',
                  'remark',
                ].includes(el.id)
              ) {
                el['disabled'] = false;
              }
              return el;
            }),
            innerRef: editPopupInput.ref,
          }}
          onAfterChange={ev =>
            calculateResultForInspectionSample(ev, {
              gridInstance: editPopupGrid.gridInstance,
              inputInstance: editPopupInput.instance,
            })
          }
          saveUriPath={SAVE_URI_PATH}
          searchUriPath={DETAIL_SEARCH_URI_PATH}
          saveType="basic"
          defaultVisible={false}
          visible={editPopupVisible}
        />
      ) : null}

      {modalContext}
    </>
  );

  return {
    component,
    onReset,
    onSearch,
    gridRef,
    detailGrid,
    headerGridMode,
    setHeaderGridMode,
    detailGridMode: detailGrid.gridInfo.gridMode,
    setDetailGridMode: detailGrid.setGridMode,
    headerData,
    setHeaderData,
    detailData: detailGrid.gridInfo.data,
    setDetailData: detailGrid.setGridData,
    headerSaveOptionParams,
    setHeaderSaveOptionParams,
    detailSaveOptionParams,
    setDetailSaveOptionParams,
    HEADER_SEARCH_URI_PATH,
    DETAIL_STD_SEARCH_URI_PATH,
    DETAIL_SEARCH_URI_PATH,
  };
};
