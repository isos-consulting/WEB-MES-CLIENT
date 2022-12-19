import Grid from '@toast-ui/react-grid';
import { Space, Col, Row, message, Spin, Modal } from 'antd';
import dayjs from 'dayjs';
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
  IGridColumn,
  TGridMode,
  useGrid,
} from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import {
  IInputGroupboxItem,
  InputGroupbox,
} from '~/components/UI/input-groupbox/input-groupbox.ui';
import { ColumnStore } from '~/constants/columns';
import {
  cloneObject,
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
import { onDefaultGridSave } from '.';
import {
  extract_insp_ItemEntriesAtCounts,
  getInspectItems,
  getInspectResult,
  getInspectSamples,
  getSampleIndex,
  isColumnNameEndWith_insp_value,
  isColumnNamesNotEndWith_insp_value,
} from './proc-inspection/proc-inspection-service';
import { onErrorMessage, TAB_CODE } from './work.page.util';

//#region 🔶🚫공정검사
export const INSP = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 권한 관련 */
  const permissions = getPermissions(title);

  const [modal, modalContext] = Modal.useModal();

  //#region ✅설정값
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

  const createInspDetailColumns = (maxSampleCnt: number) => {
    let items: IGridColumn[] = cloneDeep(ColumnStore.WORK_INSP_DETAIL);

    if (maxSampleCnt > 0) {
      //시료수 최대값에 따라 컬럼 생성
      for (let i = 1; i <= maxSampleCnt; i++) {
        items.push({
          header: 'x' + i + '_insp_result_detail_value_uuid',
          name: 'x' + i + '_insp_result_detail_value_uuid',
          width: 80,
          hidden: true,
        });
        items.push({
          header: 'x' + i + '_sample_no',
          name: 'x' + i + '_sample_no',
          width: 80,
          hidden: true,
        });
        items.push({
          header: 'x' + i,
          name: 'x' + i + '_insp_value',
          width: 80,
          hidden: false,
          editable: true,
          align: 'center',
        });
        items.push({
          header: 'x' + i + '_insp_result_fg',
          name: 'x' + i + '_insp_result_fg',
          width: 80,
          format: 'text',
          hidden: true,
        });
        items.push({
          header: 'x' + i + '_insp_result_state',
          name: 'x' + i + '_insp_result_state',
          width: 80,
          format: 'text',
          hidden: true,
        });
      }
    }

    items.push({
      header: '합격여부',
      name: 'insp_result_fg',
      width: 120,
      hidden: true,
    });
    items.push({
      header: '판정',
      name: 'insp_result_state',
      width: 100,
      hidden: false,
    });
    items.push({ header: '비고', name: 'remark', width: 150, hidden: false });

    return items;
  };

  type InsepctionDataGridOnChangeEvent = {
    origin: string;
    changes: Array<{ columnName: string; rowKey: number; value: any }>;
    instance: any;
  };

  const calculateResultForInspectionSample = (
    { origin, changes, instance }: InsepctionDataGridOnChangeEvent,
    { gridInstance, inputInstance },
  ) => {
    if (isColumnNamesNotEndWith_insp_value(changes)) return;

    const inspections = instance.getData();
    const ranges = inspections.map((item: any) => ({
      min: item.spec_min,
      max: item.spec_max,
    }));
    const extractedInspections = extract_insp_ItemEntriesAtCounts(inspections);
    const inspectionSampleResults = getInspectSamples(
      extractedInspections,
      ranges,
    );
    const inspectionItemResults = getInspectItems(inspectionSampleResults);
    const inspectionResult = getInspectResult(inspectionItemResults);

    changes.forEach(({ rowKey, columnName }) => {
      if (isColumnNameEndWith_insp_value(columnName)) {
        const cellIndex = getSampleIndex(columnName);

        console.log('sampleResult', inspectionSampleResults[rowKey][cellIndex]);
      }
    });
    const { columnName, rowKey, value } = changes[0];

    const { rawData } = instance?.store?.data;
    const rowData = rawData[rowKey];

    const specMin = rowData?.spec_min;
    const specMax = rowData?.spec_max;

    let sampleCnt: any = rowData?.sample_cnt;
    let nullFg: boolean = true;
    let resultFg: boolean = true;
    let emptyFg: boolean;

    const popupGridInstance = gridInstance;
    const popupInputboxInstance = inputInstance;

    //#region ✅CELL단위 합/불 판정
    [nullFg, resultFg] = getInspCheckResultValue(value, { specMin, specMax });

    const cellFlagColumnName = String(columnName)?.replace(
      '_insp_value',
      '_insp_result_fg',
    );
    const cellStateColumnName = String(columnName)?.replace(
      '_insp_value',
      '_insp_result_state',
    );
    const cellFlagResultValue = nullFg ? null : resultFg;
    const cellStateResultValue = nullFg ? '' : resultFg ? '합격' : '불합격';

    if (!isNumber(specMin) && !isNumber(specMax)) {
      if (resultFg === true) {
        popupGridInstance?.setValue(rowKey, columnName, 'OK');
      } else if (resultFg === false) {
        popupGridInstance?.setValue(rowKey, columnName, 'NG');
      }
    }

    popupGridInstance?.setValue(
      rowKey,
      cellFlagColumnName,
      cellFlagResultValue,
    );
    popupGridInstance?.setValue(
      rowKey,
      cellStateColumnName,
      cellStateResultValue,
    );
    //#endregion

    //#region ✅ROW단위 합/불 판정
    if (resultFg === true) {
      // 현재 값이 합격일 경우만 다른 cell의 판정값 체크
      [nullFg, resultFg] = getInspCheckResultInfo(rowData, rowKey, {
        maxCnt: sampleCnt,
      });
    }

    const rowFlagColumnName = 'insp_result_fg';
    const rowStateColumnName = 'insp_result_state';
    const rowFlagResultValue = nullFg ? null : resultFg;
    const rowStateResultValue = nullFg ? '' : resultFg ? '합격' : '불합격';

    popupGridInstance?.setValue(rowKey, rowFlagColumnName, rowFlagResultValue);
    popupGridInstance?.setValue(
      rowKey,
      rowStateColumnName,
      rowStateResultValue,
    );
    //#endregion

    //#region ✅최종 합/불 판정
    const maxRowCnt = popupGridInstance?.getRowCount() - 1;
    if (resultFg === true) {
      [nullFg, resultFg, emptyFg] = getInspCheckResultTotal(rawData, maxRowCnt);
    } else {
      [nullFg, resultFg] = [false, false];
    }

    const flagInputboxName = rowFlagColumnName;
    const stateInputboxName = rowStateColumnName;
    const flagInputboxValue = emptyFg
      ? null
      : !resultFg
      ? false
      : nullFg
      ? null
      : resultFg;
    const stateInputboxValue = emptyFg
      ? ''
      : !resultFg
      ? '불합격'
      : nullFg
      ? '진행중'
      : '합격';

    popupInputboxInstance?.setFieldValue(flagInputboxName, flagInputboxValue);
    popupInputboxInstance?.setFieldValue(stateInputboxName, stateInputboxValue);
    //#endregion
  };

  //#endregion

  type GetMaxSampleCntParams = {
    insp_detail_type_uuid: string;
    work_uuid: string;
  };
  type GetMaxSampleCntResponse = {
    datas: any;
    header: any;
    details: any;
    maxSampleCnt: number;
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
            const newColumns = createInspDetailColumns(maxSampleCnt);
            detailGrid.setGridColumns(newColumns);

            if (createPopupVisible) {
              createPopupGrid.setGridData(details);
              createPopupInput.setFieldValue('insp_uuid', header?.insp_uuid);
              createPopupInput.setFieldValue(
                'insp_type_uuid',
                header?.insp_type_uuid,
              );
              createPopupGrid.setGridColumns(newColumns);
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
  //#endregion
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
      // createPopupInput?.instance?.resetForm();
      // getMaxSampleCnt({
      //   insp_detail_type_uuid: 'selfProc',
      //   work_uuid: (headerSaveOptionParams as any)?.work_uuid
      // }).then(({
      //   maxSampleCnt,
      //   details
      // }) => {
      //   const columns = createInspDetailColumns(maxSampleCnt);
      //   createPopupGrid.setGridColumns(columns);
      //   createPopupGrid.setGridData(details);
      // }).finally(() => {
      //   onSearch(headerSaveOptionParams);
      // })
    } else {
      createPopupInput?.instance?.resetForm();
      onSearch(headerSaveOptionParams);
    }
  }, [createPopupVisible]);

  //#region 🚫함수
  const onSearch = (headerSaveOptionParams: {
    work_uuid?: string;
    prod_uuid?: string;
    lot_no?: string;
  }) => {
    const { work_uuid, prod_uuid, lot_no } = headerSaveOptionParams;
    if (work_uuid) {
      getData(
        {
          work_uuid: String(work_uuid),
        },
        HEADER_SEARCH_URI_PATH,
        undefined,
        undefined,
        undefined,
        undefined,
        { disabledZeroMessage: true },
      ).then(res => {
        setHeaderData(res);

        setHeaderSaveOptionParams({
          work_uuid,
          prod_uuid,
          lot_no,
        });
      });
    }
  };

  const onReset = () => {
    setHeaderSaveOptionParams({});
    setDetailSaveOptionParams({});
    setHeaderData([]);
    detailGrid.setGridData([]);
  };

  const onDelete = ev => {
    if ((headerSaveOptionParams as any)?.work_uuid == null) {
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
    if ((headerSaveOptionParams as any)?.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }

    if (inputRef?.current?.values?.insp_result_uuid == null) {
      message.error('검사결과 항목을 선택해주세요.');
      return;
    }

    setEditPopupVisible(true);
  };

  const onAppend = ev => {
    if ((headerSaveOptionParams as any)?.work_uuid == null) {
      onErrorMessage('하위이력작업시도');
      return;
    }
    createPopupGrid.setGridData([]);
    setCreatePopupVisible(true);
  };

  const compareRequiredData = (compareDatas, requiredFileds) => {
    requiredFileds.forEach(requiredFiled => {
      if (!compareDatas[requiredFiled.key])
        throw new Error(`${requiredFiled.name} 정보를 확인해주세요.`);
    });
  };

  const onSave = async (gridRef, inputRef) => {
    try {
      const saveGridRef: MutableRefObject<Grid> = gridRef;
      const saveInputRef: MutableRefObject<FormikProps<FormikValues>> =
        inputRef;

      const methodType: 'delete' | 'post' | 'put' | 'patch' = createPopupVisible
        ? 'post'
        : 'put';
      let headerData: object;
      let detailDatas: object[] = [];

      const saveGridInstance = saveGridRef?.current?.getInstance();

      const saveInputValues = saveInputRef?.current?.values;
      const regDate = dayjs(saveInputValues?.reg_date).isValid()
        ? dayjs(saveInputValues?.reg_date).format('YYYY-MM-DD')
        : saveInputValues?.reg_date;
      const regTime = dayjs(saveInputValues?.reg_date_time).isValid()
        ? dayjs(saveInputValues?.reg_date_time).format('HH:mm:ss')
        : saveInputValues?.reg_date_time;
      const regDateTime = dayjs(regDate + ' ' + regTime).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      headerData = {
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

      const requiredFileds = [
        { key: 'factory_uuid', name: '공장' },
        { key: 'work_uuid', name: '생산실적' },
        { key: 'insp_detail_type_uuid', name: '검사유형' },
        { key: 'insp_uuid', name: '검사기준서' },
        { key: 'prod_uuid', name: '품목' },
        { key: 'lot_no', name: 'LOT NO' },
        { key: 'emp_uuid', name: '검사자' },
        { key: 'reg_date', name: '검사일시' },
      ];

      compareRequiredData(headerData, requiredFileds);

      for (let i = 0; i <= saveGridInstance.getRowCount() - 1; i++) {
        const values: object[] = [];
        const row = saveGridInstance?.getRow(i);
        const inspResultDetailInfoUuid =
          methodType === 'post' ? null : row?.insp_result_detail_info_uuid;

        for (let k = 1; k <= row.sample_cnt; k++) {
          const value: any = row?.['x' + k + '_insp_value'];
          if (value) {
            values.push({
              uuid: inspResultDetailInfoUuid,
              sample_no: k,
              insp_result_fg: row?.['x' + k + '_insp_result_fg'],
              insp_value: value === 'OK' ? 1 : value === 'NG' ? 0 : value,
            });
          }
        }

        detailDatas.push({
          values,
          factory_uuid: getUserFactoryUuid(),
          insp_result_fg: row?.insp_result_fg,
          insp_detail_uuid: row?.insp_detail_uuid,
          remark: row?.remark,
        });
      }

      const saveData: object = {
        header: headerData,
        details: detailDatas,
      };
      await executeData(saveData, SAVE_URI_PATH, methodType, 'success')
        .then(value => {
          if (!value) return;
          message.info('저장되었습니다.');
          setCreatePopupVisible(false);
          setEditPopupVisible(false);
        })
        .catch(e => {
          console.log(e);
        });
    } catch (e) {
      message.warn(e.message);
    }
  };
  //#endregion

  //#region ✅사이드 이펙트
  // 헤더 데이터가 없으면 우측 데이터들 초기화
  useEffect(() => {
    if (headerData?.length === 0) {
      inputRef?.current?.resetForm();
      detailGrid.setGridData([]);
    }
  }, [headerData]);
  //#endregion

  useLayoutEffect(() => {
    if (Object.keys(selectedRow)?.length > 0 && selectedRow) {
      try {
        const insp_result_uuid = selectedRow?.insp_result_uuid;
        const work_uuid = selectedRow?.work_uuid;
        const URI_PATH = DETAIL_SEARCH_URI_PATH.replace('$', insp_result_uuid);
        // 공정검사 상세 데이터 조회
        getData({}, URI_PATH, 'header-details', null, null, null, {
          disabledZeroMessage: true,
        }).then(res => {
          const header = res?.['header'];
          const details = res?.['details'];
          const maxSampleCnt = header?.max_sample_cnt;
          const columns = createInspDetailColumns(maxSampleCnt);

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

  //#region 🚫렌더부
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
          onOk={() => onSave(createPopupGrid.gridRef, createPopupInput.ref)}
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
          onOk={() => onSave(editPopupGrid.gridRef, editPopupInput.ref)}
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
  //#endregion

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
//#endregion
