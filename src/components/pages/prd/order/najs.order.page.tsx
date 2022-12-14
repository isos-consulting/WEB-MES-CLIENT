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
  IGridPopupInfo,
  IPopupItemsRetrunProps,
  Searchbox,
  TPopupKey,
} from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
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
import ModalStore from '~/constants/modals';

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

const getDailyWorkPlanModalProps = async ({
  childGridRef,
  columns,
  gridRef,
  props,
}) => {
  const {
    searchProps,
    params,
    uriPath,
    modalProps,
    datagridProps,
    gridMode,
  }: IPopupItemsRetrunProps &
    WorkPlanRowAddPopupInfo & {
      params: WorkPlanRowAddPopupInfo['dataApiSettings']['params'];
    } = {
    columnNames: ModalStore.ORDER_ADD_ROW_POPUP_INFO.columnNames.concat([
      { original: 'plan_daily_uuid', popup: 'plan_daily_uuid' },
    ]),
    columns: ColumnStore.DAILY_WORK_PLAN,
    dataApiSettings: {
      uriPath: '/prd/plan-daily',
      params: {
        start_date: getToday(-7),
        end_date: getToday(),
        wait_task_fg: true,
      },
    },
    datagridProps: {
      gridId: null,
      columns: ColumnStore.DAILY_WORK_PLAN,
    },
    gridMode: 'multi-select',
    modalProps: {
      title: '생산계획 - 다중선택',
    },
    onAfterOk: null,
    onBeforeOk: null,
    onInterlock: null,
    params: {
      start_date: getToday(-7),
      end_date: getToday(),
      wait_task_fg: true,
    },
    popupKey: null,
    searchProps: {
      id: 'workPlanSearch',
      searchItems: [
        {
          type: 'date',
          id: 'start_date',
          label: '지시기간',
          default: getToday(-7),
        },
        {
          type: 'date',
          id: 'end_date',
          default: getToday(),
        },
      ],
      onSearch: async (
        dailyWorkPlanConditions: WorkPlanRowAddPopupInfo['dataApiSettings']['params'],
      ) => {
        const dailyWorkPlans = await getData(
          { ...dailyWorkPlanConditions },
          '/prd/plan-daily',
        );

        childGridRef.current.getInstance().resetData(dailyWorkPlans);
      },
      boxShadow: false,
    },
    uriPath: '/prd/plan-daily',
  };

  const dailyWrokPlans = await getData(params, uriPath);

  if (typeof dailyWrokPlans === 'undefined') {
    throw new Error('에러가 발생되었습니다.');
  }

  return {
    title: modalProps.title,
    width: '80%',
    icon: null,
    okText: '선택',
    cancelText: '취소',
    maskClosable: false,
    content: (
      <>
        <Searchbox {...searchProps} />
        <Datagrid
          ref={childGridRef}
          gridId={uuidv4()}
          columns={datagridProps.columns}
          gridMode={gridMode}
          data={dailyWrokPlans}
        />
      </>
    ),
    onOk: () => {
      const dailyWorkPlanGridInstance = childGridRef.current.getInstance();
      const prodOrderGridInstanceInNewModal = gridRef.current.getInstance();
      const selectedDailyWorkPlans = dailyWorkPlanGridInstance.getCheckedRows();

      const dailyWorkPlanUuids = selectedDailyWorkPlans
        .reduce((acc, cur) => `${acc}${cur.plan_daily_uuid}`, '')
        .slice(0, -1);

      getData(
        { prod_uuid: dailyWorkPlanUuids },
        '/std/routings/integrated-actived-prod',
      );
    },
  };
};

export const PgPrdNajsOrder = () => {
  const title = getPageName();
  const permissions = getPermissions(title);
  const [modal, contextHolder] = Modal.useModal();

  const searchRef = useRef<FormikProps<FormikValues>>();
  const searchParams = searchRef?.current?.values;

  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

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
      ...ModalStore.ORDER_ADD_ROW_POPUP_INFO,
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

          // const onAddPopupRow = async ({
          //   childGridRef,
          //   columns,
          //   gridRef,
          //   props,
          // }) => {
          // const {
          //   rowAddPopupInfo,
          // }: {
          //   rowAddPopupInfo: {
          //     popupKey: TPopupKey;
          //     columns: IGridColumn[];
          //     dataApiSettings: any;
          //     onInterlock: () => void;
          //     onAfterOk: () => void;
          //     onBeforeOk: () => void;
          //     columnNames: any;
          //     gridMode: string;
          //   };
          // } = {
          //   rowAddPopupInfo: {
          //     popupKey: null,
          //     columns: [...ColumnStore.DAILY_WORK_PLAN],
          //     dataApiSettings: {
          //       uriPath: '/prd/plan-daily',
          //       params: {
          //         start_date: getToday(-7),
          //         end_date: getToday(),
          //         wait_task_fg: true,
          //       },
          //     },
          //     onInterlock: null,
          //     onAfterOk: null,
          //     onBeforeOk: null,
          //     columnNames: [
          //       ...ModalStore.ORDER_ADD_ROW_POPUP_INFO.columnNames,
          //     ].concat([
          //       { original: 'plan_daily_uuid', popup: 'plan_daily_uuid' },
          //     ]),
          //     gridMode: 'multi-select',
          //   },
          // };
          // let popupContent: IPopupItemsRetrunProps = {
          //   datagridProps: {
          //     gridId: null,
          //     columns: null,
          //   },
          //   uriPath: null,
          //   params: null,
          //   modalProps: null,
          // };
          // let onBeforeOk = null;
          // let onAfterOk = null;
          // popupContent['datagridProps']['columns'] = rowAddPopupInfo.columns;
          // console.log({
          //   popupContent: { ...popupContent },
          //   rowAddPopupInfo: { ...rowAddPopupInfo },
          // });
          // popupContent = {
          //   ...popupContent,
          //   ...rowAddPopupInfo,
          //   ...rowAddPopupInfo.dataApiSettings,
          //   searchProps: {
          //     searchItems: [
          //       {
          //         type: 'date',
          //         id: 'start_date',
          //         label: '지시기간',
          //         default: getToday(-7),
          //       },
          //       { type: 'date', id: 'end_date', default: getToday() },
          //     ],
          //     onSearch: dailyWorkPlanCondition => {
          //       getData(
          //         { ...dailyWorkPlanCondition, wait_task_fg: true },
          //         '/prd/plan-daily',
          //       ).then(res =>
          //         childGridRef.current.getInstance().resetData(res),
          //       );
          //     },
          //     boxShadow: false,
          //   },
          // };
          // console.log({ updatedPopupContent: { ...popupContent } });
          // const updateColumns: { original: string; popup: string }[] =
          //   rowAddPopupInfo.columnNames;
          // const childGridId = uuidv4();
          // let title = popupContent?.modalProps?.title;
          // const word = '다중선택';
          // if (title != null && String(title).length > 0) {
          //   title += ' - ' + word;
          // } else {
          //   title = word;
          // }
          // await getData(popupContent.params, popupContent.uriPath)
          //   .then(res => {
          //     if (typeof res === 'undefined') {
          //       throw new Error('에러가 발생되었습니다.');
          //     }
          //     modal.confirm({
          //       title,
          //       width: '80%',
          //       content: (
          //         <>
          //           {popupContent?.searchProps ? (
          //             <Searchbox {...popupContent.searchProps} />
          //           ) : null}
          //           {popupContent?.inputGroupProps ? (
          //             <InputGroupbox {...popupContent.inputGroupProps} />
          //           ) : null}
          //           <Datagrid
          //             ref={childGridRef}
          //             gridId={childGridId}
          //             columns={popupContent.datagridProps.columns}
          //             gridMode="multi-select"
          //             data={res}
          //           />
          //         </>
          //       ),
          //       icon: null,
          //       okText: '선택',
          //       onOk: () => {
          //         const child = childGridRef.current.getInstance();
          //         const $this = gridRef.current.getInstance();
          //         const rows = child.getCheckedRows();
          //         if (onBeforeOk != null) {
          //           if (
          //             !onBeforeOk(
          //               {
          //                 popupGrid: { ...child },
          //                 parentGrid: { ...$this },
          //                 ev: {},
          //               },
          //               rows,
          //             )
          //           )
          //             return;
          //         }
          //         const planDailyUuid = rows.reduce(
          //           (acc, cur) => `${acc}${cur.plan_daily_uuid},`,
          //           '',
          //         );
          //         if (planDailyUuid.length > 0) {
          //           getData(
          //             { prod_uuid: planDailyUuid.slice(0, -1) },
          //             '/std/routings/integrated-actived-prod',
          //           );
          //         }
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
          //           if (onAfterOk != null) {
          //             onAfterOk(
          //               {
          //                 popupGrid: { ...child },
          //                 parentGrid: { ...$this },
          //                 ev: {},
          //               },
          //               rows,
          //             );
          //           }
          //         },
          //         cancelText: '취소',
          //         maskClosable: false,
          //       });
          //     })
          //     .catch(e => {
          //       modal.error({
          //         icon: null,
          //         content: <Result type="loadFailed" />,
          //       });
          //     });
          // };

          getDailyWorkPlanModalProps({
            childGridRef,
            columns,
            gridRef,
            props,
          }).then(modal.confirm);
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
