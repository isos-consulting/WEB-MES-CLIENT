import Grid from '@toast-ui/react-grid';
import { Modal, Spin } from 'antd';
import { FormikProps, FormikValues } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import {
  Button,
  COLUMN_CODE,
  Container,
  Datagrid,
  EDIT_ACTION_CODE,
  getPopupForm,
  GridPopup,
  IGridColumn,
  IGridPopupColumnInfo,
  IGridPopupInfo,
  IPopupItemsRetrunProps,
  Result,
  Searchbox,
  TPopupKey,
} from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import { InputGroupbox } from '~/components/UI/input-groupbox';
import { ENUM_WIDTH } from '~/enums';
import {
  getData,
  getModifiedRows,
  getPageName,
  getPermissions,
  getToday,
  saveGridData,
} from '~/functions';
import { onDefaultGridSave } from './order.page.util';
import { v4 as uuidv4 } from 'uuid';
import { ColumnStore } from '~/constants/columns';
import ComboStore from '~/constants/combos';

type WorkPlanRowAddPopupInfo = {
  popupKey: TPopupKey;
  columns: IGridColumn[];
  dataApiSettings: {
    uriPath: string;
    params: { start_date: string; end_date: string; wait_task_fg: boolean };
  };
  onInterlock: () => void;
  onAfterOk: () => void;
  onBeforeOk: () => void;
  columnNames: unknown[];
  gridMode: string;
};

const getWorkPlayRowAddPopupInfo = (
  columnNamesInOrderAddRowPopupInfo: IGridPopupColumnInfo[],
) => ({
  popupKey: null,
  columns: ColumnStore.DAILY_WORK_PLAN,
  dataApiSettings: {
    uriPath: '/prd/plan-daily',
    params: {
      start_date: getToday(-7),
      end_date: getToday(),
      wait_task_fg: true,
    },
  },
  onInterlock: null,
  onAfterOk: null,
  onBeforeOk: null,
  columnNames: columnNamesInOrderAddRowPopupInfo.concat([
    { original: 'plan_daily_uuid', popup: 'plan_daily_uuid' },
  ]),
  gridMode: 'multi-select',
});

const onAddPopupRow = async ({ childGridRef, columns, gridRef, props }) => {
  const rowAddPopupInfo: WorkPlanRowAddPopupInfo = getWorkPlayRowAddPopupInfo(
    [],
  );
};

export const PgPrdNajsOrder = () => {
  const title = getPageName();
  const permissions = getPermissions(title);
  const [modal, contextHolder] = Modal.useModal();

  const searchRef = useRef<FormikProps<FormikValues>>();
  const searchParams = searchRef?.current?.values;

  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  const ORDER_ADD_ROW_POPUP_INFO: IGridPopupInfo = {
    columnNames: [
      { original: 'routing_uuid', popup: 'routing_uuid' },
      { original: 'proc_uuid', popup: 'proc_uuid' },
      { original: 'proc_no', popup: 'proc_no' },
      { original: 'proc_nm', popup: 'proc_nm' },
      { original: 'workings_uuid', popup: 'workings_uuid' },
      { original: 'workings_nm', popup: 'workings_nm' },
      { original: 'item_type_uuid', popup: 'item_type_uuid' },
      { original: 'item_type_nm', popup: 'item_type_nm' },
      { original: 'prod_type_uuid', popup: 'prod_type_uuid' },
      { original: 'prod_type_nm', popup: 'prod_type_nm' },
      { original: 'prod_uuid', popup: 'prod_uuid' },
      { original: 'prod_no', popup: 'prod_no' },
      { original: 'prod_nm', popup: 'prod_nm' },
      { original: 'model_uuid', popup: 'model_uuid' },
      { original: 'model_nm', popup: 'model_nm' },
      { original: 'rev', popup: 'rev' },
      { original: 'prod_std', popup: 'prod_std' },
      { original: 'unit_uuid', popup: 'unit_uuid' },
      { original: 'unit_nm', popup: 'unit_nm' },
      { original: 'auto_work_fg', popup: 'auto_work_fg' },
      { original: 'plan_qty', popup: 'plan_daily_qty' },
      { original: 'qty', popup: 'balance' },
    ],
    columns: [
      {
        header: '라우팅UUID',
        name: 'routing_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '공정UUID',
        name: 'proc_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '공정순서',
        name: 'proc_no',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '공정',
        name: 'proc_nm',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '작업장UUID',
        name: 'workings_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '작업장',
        name: 'workings_nm',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '품목유형UUID',
        name: 'item_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '품목유형',
        name: 'item_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '제품유형UUID',
        name: 'prod_type_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '제품유형',
        name: 'prod_type_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '품번',
        name: 'prod_no',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '품목',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '모델UUID',
        name: 'model_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '모델',
        name: 'model_nm',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: 'Rev',
        name: 'rev',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '규격',
        name: 'prod_std',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
      {
        header: '단위',
        name: 'unit_nm',
        width: ENUM_WIDTH.S,
        filter: 'text',
        hidden: false,
        format: 'text',
      },
      {
        header: '자동 실적처리유무',
        name: 'auto_work_fg',
        width: ENUM_WIDTH.M,
        hidden: true,
        format: 'text',
      },
    ],
    dataApiSettings: {
      uriPath: '/std/routings/actived-prod',
      params: {},
    },
    gridMode: 'select',
  };
  const ORDER_POPUP_INFO: IGridPopupInfo[] = [
    {
      columnNames: [
        { original: 'routing_resource_uuid', popup: 'routing_resource_uuid' },
        { original: 'equip_uuid', popup: 'equip_uuid' },
        { original: 'equip_cd', popup: 'equip_cd' },
        { original: 'equip_nm', popup: 'equip_nm' },
      ],
      columns: [
        {
          header: '생산자원UUID',
          name: 'routing_resource_uuid',
          alias: 'uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '공장UUID',
          name: 'factory_uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '라우팅UUID',
          name: 'routing_uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '자원 유형',
          name: 'resource_type',
          width: ENUM_WIDTH.M,
          hidden: false,
          format: 'text',
        },
        {
          header: '설비UUID',
          name: 'equip_uuid',
          width: ENUM_WIDTH.M,
          hidden: true,
          format: 'text',
        },
        {
          header: '설비명',
          name: 'equip_nm',
          width: ENUM_WIDTH.L,
          hidden: false,
          format: 'text',
        },
        {
          header: '인원',
          name: 'emp_cnt',
          width: ENUM_WIDTH.M,
          hidden: false,
          format: 'text',
        },
        {
          header: 'Cycle Time',
          name: 'cycle_time',
          width: ENUM_WIDTH.M,
          hidden: false,
          format: 'text',
        },
      ],
      dataApiSettings: {
        uriPath: 'std/equips',
        params: {},
      },
      gridMode: 'select',
    },
    {
      columnNames: [
        { original: 'workings_uuid', popup: 'workings_uuid' },
        { original: 'workings_cd', popup: 'workings_cd' },
        { original: 'workings_nm', popup: 'workings_nm' },
      ],
      columns: getPopupForm('작업장관리')?.datagridProps?.columns,
      dataApiSettings: {
        uriPath: getPopupForm('작업장관리')?.uriPath,
        params: {},
      },
      gridMode: 'select',
    },
  ];

  const gridInfo: IDatagridProps = {
    gridId: 'ORDER_GRID',
    ref: gridRef,
    height: 300,
    gridMode: 'delete',
    saveUriPath: '/prd/orders',
    searchUriPath: '/prd/orders',
    columns: ColumnStore.NAJS_PROD_ORDER,
    data: data,
    rowAddPopupInfo: {
      ...ORDER_ADD_ROW_POPUP_INFO,
      gridMode: 'multi-select',
    },
    gridPopupInfo: ORDER_POPUP_INFO,
    gridComboInfo: [
      ComboStore.SHIFT,
      ComboStore.WORKER_GROUP,
      ComboStore.WORKER_EMPLOYEE,
    ],
  };

  const newPopupGridRef = useRef<Grid>();
  const [newPopupVisible, setNewPopupVisible] = useState(false);

  const openCreatableOrderModal = () => {
    setNewPopupVisible(true);
  };

  const closeCreatableOrderModal = () => {
    setNewPopupVisible(false);
  };

  const newModalDatagridColumnProps = {
    hidden: ['order_state', 'order_no'],
    readOnly: [],
    noSave: [
      'working_nm',
      'prod_no',
      'prod_nm',
      'prod_type_nm',
      'item_type_nm',
      'model_nm',
      'rev',
      'prod_std',
      'unit_nm',
      'shift_nm',
    ],
    multiSelect: ['worker_nm'],
  };

  const dataGridColumnsInNewModal = ColumnStore.NAJS_PROD_ORDER.map(
    ({ name, ...columnOpts }) => {
      const columnInEditModal = { name, ...columnOpts };

      if (newModalDatagridColumnProps.hidden.includes(name)) {
        columnInEditModal.hidden = true;
      }

      if (newModalDatagridColumnProps.readOnly.includes(name)) {
        columnInEditModal.editable = true;
      }

      if (newModalDatagridColumnProps.noSave.includes(name)) {
        columnInEditModal.noSave = true;
      }

      if (newModalDatagridColumnProps.multiSelect.includes(name)) {
        columnInEditModal.format = 'multi-select';
      }

      return columnInEditModal;
    },
  );

  /** 신규 항목 추가 팝업 속성 */
  const newGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: 'ORDER_NEW_GRID',
    ref: newPopupGridRef,
    gridMode: 'create',
    columns: dataGridColumnsInNewModal,
    defaultData: [],
    data: null,
    height: null,
    onAfterClick: null,
    disabledAutoDateColumn: true,
    popupId: 'NAJS_PROD_ORDER_NEW_MODAL',
    title: '작업지시 등록',
    okText: '저장하기',
    onOk: gridRef => {
      saveGridData(
        getModifiedRows(
          gridRef,
          newGridPopupInfo.columns,
          newGridPopupInfo.data,
        ),
        newGridPopupInfo.columns,
        newGridPopupInfo.saveUriPath,
        newGridPopupInfo.saveOptionParams,
      ).then(({ success }) => {
        if (!success) return;
        onSearch(searchParams);
        closeCreatableOrderModal();
      });
    },
    cancelText: '취소',
    onCancel: closeCreatableOrderModal,
    parentGridRef: gridRef,
    saveType: 'basic',
    saveUriPath: gridInfo.saveUriPath,
    searchUriPath: gridInfo.searchUriPath,
    defaultVisible: false,
    visible: newPopupVisible,
    onAfterOk: isSuccess => {
      if (!isSuccess) return;
      closeCreatableOrderModal();
      onSearch(searchParams);
    },
    extraButtons: [
      {
        buttonProps: { text: '생산계획 불러오기', children: '' },
        buttonAction: (_ev, props, options) => {
          const { childGridRef, columns, gridRef } = options;
          const onAppendRow = (newRow: object = {}) => {
            let classNames = { column: {} };

            columns?.forEach(column => {
              if (column.name !== COLUMN_CODE.EDIT)
                classNames['column'][column.name] = [props.gridMode];

              if (
                column?.editable === true &&
                column.name !== COLUMN_CODE.EDIT
              ) {
                classNames['column'][column.name] = [
                  ...classNames['column'][column.name],
                  'editor',
                ];
              }

              if (column?.editable === true && column?.format === 'popup') {
                classNames['column'][column.name] = [
                  ...classNames['column'][column.name],
                  'popup',
                ];
              }

              if (column?.defaultValue != null) {
                newRow[column.name] =
                  newRow[column.name] != null
                    ? newRow[column.name]
                    : typeof column?.defaultValue === 'function'
                    ? column?.defaultValue(props, newRow)
                    : column?.defaultValue;
              }
            });

            gridRef.current.getInstance().appendRow(
              {
                ...newRow,
                [COLUMN_CODE.EDIT]: EDIT_ACTION_CODE.CREATE,
                _attributes: { className: classNames },
              },
              { focus: true },
            );
          };

          const onAddPopupRow = async ({
            childGridRef,
            columns,
            gridRef,
            props,
          }) => {
            const {
              rowAddPopupInfo,
            }: {
              rowAddPopupInfo: {
                popupKey: TPopupKey;
                columns: IGridColumn[];
                dataApiSettings: any;
                onInterlock: () => void;
                onAfterOk: () => void;
                onBeforeOk: () => void;
                columnNames: any;
                gridMode: string;
              };
            } = {
              rowAddPopupInfo: {
                popupKey: null,
                columns: [...ColumnStore.DAILY_WORK_PLAN],
                dataApiSettings: {
                  uriPath: '/prd/plan-daily',
                  params: {
                    start_date: getToday(-7),
                    end_date: getToday(),
                    wait_task_fg: true,
                  },
                },
                onInterlock: null,
                onAfterOk: null,
                onBeforeOk: null,
                columnNames: [...ORDER_ADD_ROW_POPUP_INFO.columnNames].concat([
                  { original: 'plan_daily_uuid', popup: 'plan_daily_uuid' },
                ]),
                gridMode: 'multi-select',
              },
            };

            let popupContent: IPopupItemsRetrunProps = {
              datagridProps: {
                gridId: null,
                columns: null,
              },
              uriPath: null,
              params: null,
              modalProps: null,
            };

            let onBeforeOk = null;
            let onAfterOk = null;

            if (rowAddPopupInfo.popupKey == null) {
              popupContent['datagridProps']['columns'] =
                rowAddPopupInfo.columns;
            } else {
              popupContent = getPopupForm(rowAddPopupInfo.popupKey);
              popupContent['params'] = {};
            }

            if (typeof rowAddPopupInfo.dataApiSettings === 'function') {
              const apiSettings = rowAddPopupInfo.dataApiSettings();
              popupContent = {
                ...popupContent,
                ...rowAddPopupInfo,
                ...apiSettings,
              };

              if (apiSettings?.onInterlock != null) {
                const showModal: boolean = apiSettings?.onInterlock();
                if (!showModal) return;
              }

              if (apiSettings?.onBeforeOk != null) {
                onBeforeOk = apiSettings.onBeforeOk;
              }

              if (apiSettings?.onAfterOk != null) {
                onAfterOk = apiSettings.onAfterOk;
              }
            } else {
              popupContent = {
                ...popupContent,
                ...rowAddPopupInfo,
                ...rowAddPopupInfo.dataApiSettings,
                searchProps: {
                  searchItems: [
                    {
                      type: 'date',
                      id: 'start_date',
                      label: '지시기간',
                      default: getToday(-7),
                    },
                    { type: 'date', id: 'end_date', default: getToday() },
                  ],
                  onSearch: dailyWorkPlanCondition => {
                    getData(
                      { ...dailyWorkPlanCondition, wait_task_fg: true },
                      '/prd/plan-daily',
                    ).then(res =>
                      childGridRef.current.getInstance().resetData(res),
                    );
                  },
                  boxShadow: false,
                },
              };

              if (rowAddPopupInfo.dataApiSettings?.onInterlock != null) {
                const showModal: boolean =
                  rowAddPopupInfo.dataApiSettings?.onInterlock();
                if (!showModal) return;
              }

              if (rowAddPopupInfo.dataApiSettings?.onBeforeOk != null) {
                onBeforeOk = rowAddPopupInfo.dataApiSettings.onBeforeOk;
              }

              if (rowAddPopupInfo.dataApiSettings?.onAfterOk != null) {
                onAfterOk = rowAddPopupInfo.dataApiSettings.onAfterOk;
              }
            }

            const updateColumns: { original: string; popup: string }[] =
              rowAddPopupInfo.columnNames;
            const childGridId = uuidv4();

            let title = popupContent?.modalProps?.title;
            const word = '다중선택';

            if (title != null && String(title).length > 0) {
              title += ' - ' + word;
            } else {
              title = word;
            }

            await getData(popupContent.params, popupContent.uriPath)
              .then(res => {
                if (typeof res === 'undefined') {
                  throw new Error('에러가 발생되었습니다.');
                }

                modal.confirm({
                  title,
                  width: '80%',
                  content: (
                    <>
                      {popupContent?.searchProps ? (
                        <Searchbox {...popupContent.searchProps} />
                      ) : null}
                      {popupContent?.inputGroupProps ? (
                        <InputGroupbox {...popupContent.inputGroupProps} />
                      ) : null}
                      <Datagrid
                        ref={childGridRef}
                        gridId={childGridId}
                        columns={popupContent.datagridProps.columns}
                        gridMode="multi-select"
                        data={res}
                      />
                    </>
                  ),
                  icon: null,
                  okText: '선택',
                  onOk: () => {
                    const child = childGridRef.current.getInstance();
                    const $this = gridRef.current.getInstance();
                    const rows = child.getCheckedRows();

                    if (onBeforeOk != null) {
                      if (
                        !onBeforeOk(
                          {
                            popupGrid: { ...child },
                            parentGrid: { ...$this },
                            ev: {},
                          },
                          rows,
                        )
                      )
                        return;
                    }

                    console.log({ rows });
                    const prodUUID = rows.reduce(
                      (acc, cur) => `${acc}${cur.prod_uuid},`,
                      '',
                    );

                    if (prodUUID.length > 0) {
                      getData(
                        { prod_uuid: prodUUID.slice(0, -1) },
                        '/std/routings/integrated-actived-prod',
                      );
                    }

                    // rows?.forEach(row => {
                    //   let newRow = {};
                    //   if (typeof row === 'object') {
                    //     updateColumns.forEach(columnName => {
                    //       const column = columns.filter(
                    //         el => el.name === columnName.original,
                    //       )[0];
                    //       newRow[columnName.original] =
                    //         row[columnName.popup] != null
                    //           ? row[columnName.popup]
                    //           : typeof column?.defaultValue === 'function'
                    //           ? column?.defaultValue(props, row)
                    //           : column?.defaultValue;
                    //     });

                    //     onAppendRow(newRow);
                    //   }
                    // });

                    if (onAfterOk != null) {
                      onAfterOk(
                        {
                          popupGrid: { ...child },
                          parentGrid: { ...$this },
                          ev: {},
                        },
                        rows,
                      );
                    }
                  },
                  cancelText: '취소',
                  maskClosable: false,
                });
              })
              .catch(e => {
                modal.error({
                  icon: null,
                  content: <Result type="loadFailed" />,
                });
              });
          };
          onAddPopupRow({ childGridRef, columns, gridRef, props });
        },
      },
    ],
  };

  const editPopupGridRef = useRef<Grid>();
  const [editPopupVisible, setEditPopupVisible] = useState(false);

  const openEditableOrderModal = () => {
    setEditPopupVisible(true);
  };

  const closeEditableOrderModal = () => {
    setEditPopupVisible(false);
  };

  const editModalDatagridColumnProps = {
    hidden: ['order_state'],
    readOnly: ['reg_date'],
    noSave: [
      'working_nm',
      'prod_no',
      'prod_nm',
      'prod_type_nm',
      'item_type_nm',
      'model_nm',
      'rev',
      'prod_std',
      'unit_nm',
      'shift_nm',
    ],
    multiSelect: ['worker_nm'],
  };

  const dataGridColumnsInEditModal = ColumnStore.NAJS_PROD_ORDER.map(
    ({ name, ...columnOpts }) => {
      const columnInEditModal = { name, ...columnOpts };

      if (editModalDatagridColumnProps.hidden.includes(name)) {
        columnInEditModal.hidden = true;
      }

      if (editModalDatagridColumnProps.readOnly.includes(name)) {
        columnInEditModal.editable = true;
      }

      if (editModalDatagridColumnProps.noSave.includes(name)) {
        columnInEditModal.noSave = true;
      }

      if (editModalDatagridColumnProps.multiSelect.includes(name)) {
        columnInEditModal.format = 'multi-select';
      }

      return columnInEditModal;
    },
  );

  const editGridPopupInfo: IGridPopupProps = {
    ...gridInfo,
    gridId: 'ORDER_EDIT_GRID',
    ref: editPopupGridRef,
    gridMode: 'update',
    columns: dataGridColumnsInEditModal,
    defaultData: data,
    data: data,
    height: null,
    onAfterClick: null,
    popupId: 'NAJS_PROD_ORDER_EDIT_MODAL',
    title: '작업지시 수정',
    okText: '저장하기',
    onOk: () => {
      saveGridData(
        getModifiedRows(
          editPopupGridRef,
          editGridPopupInfo.columns,
          editGridPopupInfo.data,
        ),
        editGridPopupInfo.columns,
        editGridPopupInfo.saveUriPath,
        editGridPopupInfo.saveOptionParams,
      ).then(({ success }) => {
        if (!success) return;
        onSearch(searchParams);
        closeEditableOrderModal();
      });
    },
    cancelText: '취소',
    onCancel: closeEditableOrderModal,
    parentGridRef: gridRef,
    saveType: 'basic',
    saveUriPath: gridInfo.saveUriPath,
    searchUriPath: gridInfo.searchUriPath,
    defaultVisible: false,
    visible: editPopupVisible,
    onAfterOk: isSuccess => {
      if (!isSuccess) return;
      closeEditableOrderModal();
      onSearch(searchParams);
    },
  };

  const onSearch = async (orderSearchParams: Record<string, string>) => {
    const findedOrderDatas =
      (await getData(
        {
          ...orderSearchParams,
          order_state: 'all',
        },
        gridInfo.searchUriPath,
      )) ?? [];

    setData(findedOrderDatas);
  };

  const openDeleteDialog = () => {
    onDefaultGridSave(
      'basic',
      gridRef,
      gridInfo.columns,
      gridInfo.saveUriPath,
      gridInfo.saveOptionParams,
      modal,
      ({ success }) => {
        if (!success) return;
        onSearch(searchParams);
      },
    );
  };

  const HeaderGridElement = useMemo(() => {
    const gridMode = !permissions?.delete_fg ? 'view' : 'delete';
    return <Datagrid {...gridInfo} gridMode={gridMode} />;
  }, [gridRef, data, permissions]);

  return !permissions ? (
    <Spin spinning={true} tip="권한 정보를 가져오고 있습니다." />
  ) : (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '7px',
        }}
      >
        <Button
          btnType="buttonFill"
          widthSize="medium"
          heightSize="small"
          fontSize="small"
          ImageType="delete"
          colorType="delete"
          onClick={openDeleteDialog}
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
          onClick={openEditableOrderModal}
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
          onClick={openCreatableOrderModal}
          disabled={!permissions?.create_fg}
        >
          신규 추가
        </Button>
      </div>
      <Searchbox
        id="prod_order_search"
        innerRef={searchRef}
        searchItems={[
          {
            type: 'date',
            id: 'start_date',
            label: '지시기간',
            default: getToday(-7),
          },
          { type: 'date', id: 'end_date', default: getToday() },
        ]}
        onSearch={onSearch}
        boxShadow={false}
      />
      <Container>{HeaderGridElement}</Container>
      {newPopupVisible ? <GridPopup {...newGridPopupInfo} /> : null}
      {editPopupVisible ? <GridPopup {...editGridPopupInfo} /> : null}
      {contextHolder}
    </>
  );
};
