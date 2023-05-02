import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { FormikProps, FormikValues } from 'formik';
import { cloneDeep } from 'lodash';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { IGridColumn, getPopupForm, useGrid } from '~/components/UI';
import {
  IInputGroupboxItem,
  useInputGroup,
} from '~/components/UI/input-groupbox';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps, {
  TExtraGridPopups,
} from '~/components/templates/grid-double/grid-double.template.type';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import {
  cleanupKeyOfObject,
  cloneObject,
  dataGridEvents,
  getData,
  getPageName,
  isModified,
} from '~/functions';
import { isNil } from '~/helper/common';
import { MESSAGE } from '~/v2/core/Message';
import { GridRef } from '~/v2/core/ToastGrid';
import { RoutingServiceImpl } from '~/v2/service/RoutingService';
import { ServiceUtil } from '~/v2/util/CallbackServices';
import { DialogUtil } from '~/v2/util/DialogUtil';

const WORKING_INPUT_ITEMS: IInputGroupboxItem[] = [
  {
    type: 'text',
    id: 'prod_uuid',
    label: '품목UUID',
    disabled: true,
    hidden: true,
    default: null,
  },
  {
    type: 'text',
    id: 'prod_no',
    label: '품번',
    disabled: true,
    default: null,
  },
  {
    type: 'text',
    id: 'prod_nm',
    label: '품명',
    disabled: true,
    default: null,
  },
  {
    type: 'text',
    id: 'prod_std',
    label: '규격',
    disabled: true,
    default: null,
  },
];

const ROUTING_RESOURCES_INPUT_ITEMS: IInputGroupboxItem[] = [
  {
    type: 'text',
    id: 'routing_uuid',
    label: '라우팅UUID',
    disabled: true,
    hidden: true,
    default: null,
  },
  {
    type: 'text',
    id: 'proc_no',
    label: '공정순서',
    disabled: true,
    default: null,
  },
  {
    type: 'text',
    id: 'proc_nm',
    label: '공정명',
    disabled: true,
    default: null,
  },
  { type: 'text', id: 'prod_no', label: '품번', disabled: true, default: null },
  { type: 'text', id: 'prod_nm', label: '품명', disabled: true, default: null },
  {
    type: 'text',
    id: 'prod_std',
    label: '규격',
    disabled: true,
    default: null,
  },
];

/** BOM 관리 */
export const PgStdRouting = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/std/prods/workings';

  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/std/routings';
  const detailSaveUriPath = '/std/routings';
  const searchInitKeys = ['start_date', 'end_date'];

  const URI_PATH_SEARCH_ROUTING_RESOURCE = '/std/routing-resources';
  const URI_PATH_SAVE_ROUTING_RESOURCE = '/std/routing-resources';

  /** ref 관리 */
  const grdRefRoutingWorkings = useRef<Grid>();
  const grdRefRoutingResources = useRef<Grid>();

  const inputRefWorkings = useRef<FormikProps<FormikValues>>();
  const inputRefCreateWorkings = useRef<FormikProps<FormikValues>>();
  const inputRefUpdateWorkings = useRef<FormikProps<FormikValues>>();

  const inputRefResources = useRef<FormikProps<FormikValues>>();
  const inputRefCreateResources = useRef<FormikProps<FormikValues>>();
  const inputRefUpdateResources = useRef<FormikProps<FormikValues>>();

  /** 팝업 Visible 상태 관리 */
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);
  const [workingsGridPopupVisible, setWorkingsGridPopupVisible] =
    useState<boolean>(false);
  const [workingsGridPopupCreateVisible, setWorkingsGridPopupCreateVisible] =
    useState<boolean>(false);
  const [workingsGridPopupUpdateVisible, setWorkingsGridPopupUpdateVisible] =
    useState<boolean>(false);

  const [resourcesGridPopupVisible, setResourcesGridPopupVisible] =
    useState<boolean>(false);
  const [resourcesGridPopupCreateVisible, setResourcesGridPopupCreateVisible] =
    useState<boolean>(false);
  const [resourcesGridPopupUpdateVisible, setResourcesGridPopupUpdateVisible] =
    useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);

  const [prodInfo, setProdInfo] = useState<{ prod_uuid?: string }>({});
  const [routingInfo, setRoutingInfo] = useState<{ routing_uuid?: string }>({});

  const [workingsData, setWorkingsData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);

  const [routingResourcesItems, setRoutingResourcesItems] = useState<
    IInputGroupboxItem[]
  >(ROUTING_RESOURCES_INPUT_ITEMS);

  const [workingItems, setWorkingItems] =
    useState<IInputGroupboxItem[]>(WORKING_INPUT_ITEMS);

  const onSetProdInfo = async prodInfo => {
    setProdInfo(prodInfo);
  };

  const onSetRoutingInfo = async routingInfo => {
    setRoutingInfo(routingInfo);
  };

  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {
      type: 'text',
      id: 'prod_uuid',
      label: '품목UUID',
      disabled: true,
      hidden: true,
    },
    { type: 'text', id: 'prod_no', label: '품번', disabled: true },
    { type: 'text', id: 'prod_nm', label: '품명', disabled: true },
    { type: 'text', id: 'prod_std', label: '규격', disabled: true },
  ]);

  const newDataPopupInputInfo = null;
  const addDataPopupInputInfo = useInputGroup(
    'ADD_DATA_POPUP_INPUTBOX',
    detailInputInfo.props.inputItems,
  );
  const editDataPopupInputInfo = useInputGroup(
    'EDIT_DATA_POPUP_INPUTBOX',
    detailInputInfo.props.inputItems,
  );
  //#endregion

  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid(
    'HEADER_GRID',
    [
      {
        header: '작업장',
        name: 'workings_nm',
        format: 'button',
        width: ENUM_WIDTH.S,
        options: {
          formatter: props => {
            const { grid, rowKey, columnInfo } = props;

            return grid.getValue(rowKey, columnInfo.name) ?? '등록';
          },
          onClick: (_ev, props) => {
            const selectedRoutingHeader = props?.grid?.getRow(props?.rowKey);
            onSetProdInfo(selectedRoutingHeader).then(() => {
              setWorkingsGridPopupVisible(true);
              inputRefWorkings?.current?.setValues(selectedRoutingHeader);
            });
          },
        },
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
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
      {
        header: '품목명',
        name: 'prod_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
      { header: 'Rev', name: 'rev', width: ENUM_WIDTH.S, filter: 'text' },
      {
        header: '모델명',
        name: 'model_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
      { header: '규격', name: 'prod_std', width: ENUM_WIDTH.L, filter: 'text' },
      {
        header: '단위명',
        name: 'unit_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    {
      searchUriPath: headerSearchUriPath,
      searchParams: {
        use_fg: true,
        prd_active_fg: true,
      },
      saveUriPath: null,
      gridMode: headerDefaultGridMode,
    },
  );

  const detailGrid = useGrid(
    'DETAIL_GRID',
    [
      {
        header: '리소스',
        name: '_routing_resource_btn',
        format: 'button',
        width: ENUM_WIDTH.S,
        options: {
          formatter: props => {
            const { grid, rowKey, columnInfo } = props;

            return grid.getValue(rowKey, columnInfo.name) ?? '등록';
          },
          onClick: (ev, props) => {
            onSetRoutingInfo({
              ...props?.grid?.getRow(props?.rowKey),
              ...selectedHeaderRow,
            }).then(() => {
              setResourcesGridPopupVisible(true);
            });
          },
        },
      },
      {
        header: '라우팅UUID',
        name: 'routing_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '공정순서',
        name: 'proc_no',
        width: ENUM_WIDTH.M,
        editable: true,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NORMAL,
        requiredField: true,
      },
      {
        header: '공정UUID',
        name: 'proc_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '공정코드',
        name: 'proc_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
        format: 'popup',
        hidden: true,
      },
      {
        header: '공정명',
        name: 'proc_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        requiredField: true,
      },
      {
        header: '자동실적처리',
        name: 'auto_work_fg',
        width: ENUM_WIDTH.L,
        format: 'check',
        editable: true,
        requiredField: true,
      },
      {
        header: 'C/T',
        name: 'cycle_time',
        width: ENUM_WIDTH.M,
        editable: true,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NORMAL,
      },
      {
        header: 'UPH',
        name: 'uph',
        width: ENUM_WIDTH.M,
        editable: true,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NORMAL,
      },
      {
        header: '신호 카운트',
        name: 'prd_signal_cnt',
        width: ENUM_WIDTH.M,
        editable: true,
        filter: 'number',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NORMAL,
      },
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridMode: detailDefaultGridMode,
    },
  );

  const getWorkingsData = () => {
    getData({ prod_uuid: prodInfo?.prod_uuid }, '/std/routing-workingses').then(
      res => {
        setWorkingsData(res);
      },
    );
  };

  const getResourcesData = () => {
    getData(
      { routing_uuid: routingInfo?.routing_uuid, resource_type: 'all' },
      URI_PATH_SEARCH_ROUTING_RESOURCE,
    ).then(res => {
      setResourcesData(res);
    });
  };

  useLayoutEffect(() => {
    setWorkingItems(() =>
      workingItems.map(item => ({
        ...item,
        default: prodInfo[item.id],
      })),
    );
  }, [prodInfo]);

  useLayoutEffect(() => {
    setRoutingResourcesItems(() =>
      routingResourcesItems.map(item => ({
        ...item,
        default: routingInfo[item.id],
      })),
    );
  }, [routingInfo]);

  useLayoutEffect(() => {
    if (
      (workingsGridPopupVisible && !workingsGridPopupCreateVisible) ||
      workingsGridPopupUpdateVisible
    ) {
      getWorkingsData();
    }
  }, [
    workingsGridPopupVisible,
    workingsGridPopupCreateVisible,
    workingsGridPopupUpdateVisible,
  ]);

  useLayoutEffect(() => {
    if (
      (resourcesGridPopupVisible && !resourcesGridPopupCreateVisible) ||
      resourcesGridPopupUpdateVisible
    ) {
      getResourcesData();
    }
  }, [
    resourcesGridPopupVisible,
    resourcesGridPopupCreateVisible,
    resourcesGridPopupUpdateVisible,
  ]);

  // 라우팅리소스 컬럼
  const resourceColumns: IGridColumn[] = [
    {
      header: '생산자원uuid',
      name: 'routing_resource_uuid',
      alias: 'uuid',
      hidden: true,
    },
    { header: '라우팅uuid', name: 'routing_uuid', hidden: true },
    {
      header: '인원',
      name: 'emp_cnt',
      width: ENUM_WIDTH.S,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_NORMAL,
      editable: true,
      requiredField: true,
    },
    {
      header: 'C/T',
      name: 'cycle_time',
      width: ENUM_WIDTH.S,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_NORMAL,
      editable: true,
      requiredField: true,
    },
    {
      header: 'UPH',
      name: 'uph',
      width: ENUM_WIDTH.S,
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_NORMAL,
      editable: true,
    },
  ];

  // 작업장등록 popup 띄우는거 까지만 함
  const extraGridPopups: TExtraGridPopups = [
    //#region ✔ 작업장 등록 관련 팝업
    {
      title: '작업장 관리',
      popupId: 'ROUTING_WORKINGS_GRID_POPUP',
      gridId: 'ROUTING_WORKINGS_GRID_POPUP_GRID',
      columns: [
        {
          header: '라우트작업장uuid',
          name: 'routing_workings_uuid',
          alias: 'uuid',
          hidden: true,
        },
        { header: '작업장uuid', name: 'workings_uuid', hidden: true },
        {
          header: '작업장코드',
          name: 'workings_cd',
          width: ENUM_WIDTH.M,
          hidden: true,
        },
        { header: '작업장', name: 'workings_nm', width: ENUM_WIDTH.L },
      ],
      ref: grdRefRoutingWorkings,

      inputProps: {
        id: 'ROUTING_WORKINGS_GRID_INPUT',
        inputItems: workingItems,
        innerRef: inputRefWorkings,
      },
      gridMode: 'delete',
      data: workingsData,
      saveUriPath: '/std/routing-workingses',
      saveParams: {},
      saveType: 'basic',
      extraButtons: [
        {
          buttonProps: { text: '신규추가' },
          align: 'left',
          buttonAction: () => setWorkingsGridPopupCreateVisible(true),
        },
        {
          buttonProps: { text: '수정' },
          align: 'right',
          buttonAction: () => setWorkingsGridPopupUpdateVisible(true),
        },
        {
          buttonProps: { text: '삭제' },
          align: 'right',
          buttonAction: () => {
            dataGridEvents?.onSave(
              'basic',
              {
                gridRef: grdRefRoutingWorkings,
                columns: [
                  {
                    header: '라우트작업장uuid',
                    name: 'routing_workings_uuid',
                    alias: 'uuid',
                    hidden: true,
                  },
                  { header: '작업장uuid', name: 'workings_uuid', hidden: true },
                  {
                    header: '작업장코드',
                    name: 'workings_cd',
                    width: ENUM_WIDTH.M,
                    hidden: true,
                  },
                  {
                    header: '작업장',
                    name: 'workings_nm',
                    width: ENUM_WIDTH.L,
                  },
                ],
                saveUriPath: '/std/routing-workingses',
              },
              {},
              modal,
              getWorkingsData,
            );
          },
        },
      ],
      visible: workingsGridPopupVisible,

      okButtonProps: { hidden: true },
      cancelText: '닫기',
      onCancel: () => setWorkingsGridPopupVisible(false),
    },
    {
      title: '작업장 추가',
      popupId: 'ROUTING_WORKINGS_GRID_POPUP_CREATE',
      gridId: 'ROUTING_WORKINGS_GRID_POPUP_CREATE_GRID',
      columns: [
        { header: '작업장uuid', name: 'workings_uuid', hidden: true },
        {
          header: '작업장코드',
          name: 'workings_cd',
          width: ENUM_WIDTH.M,
          format: 'popup',
          hidden: true,
        },
        {
          header: '작업장',
          name: 'workings_nm',
          width: ENUM_WIDTH.L,
          format: 'popup',
        },
      ],
      gridMode: 'create',
      inputProps: {
        id: 'ROUTING_WORKINGS_GRID_CREATE_INPUT',
        inputItems: workingItems,
        innerRef: inputRefCreateWorkings,
      },
      searchUriPath: null,
      searchParams: {},
      saveUriPath: '/std/routing-workingses',
      saveParams: { prod_uuid: prodInfo?.prod_uuid },
      saveType: 'basic',
      rowAddPopupInfo: {
        columnNames: [
          { original: 'workings_uuid', popup: 'workings_uuid' },
          { original: 'workings_cd', popup: 'workings_cd' },
          { original: 'workings_nm', popup: 'workings_nm' },
        ],
        columns: getPopupForm('작업장관리')?.datagridProps?.columns,
        gridMode: 'multi-select',
        dataApiSettings: {
          uriPath: getPopupForm('작업장관리')?.uriPath,
        },
      },
      visible: workingsGridPopupCreateVisible,
      onAfterOk: (isSuccess, savedData) => {
        if (!isSuccess) return;
        setWorkingsGridPopupCreateVisible(false);
      },
      onCancel: () => setWorkingsGridPopupCreateVisible(false),
    },
    {
      title: '작업장 수정',
      popupId: 'ROUTING_WORKINGS_GRID_POPUP_UPDATE',
      gridId: 'ROUTING_WORKINGS_GRID_POPUP_UPDATE_GRID',
      columns: [
        {
          header: '라우트작업장uuid',
          name: 'routing_workings_uuid',
          alias: 'uuid',
          hidden: true,
        },
        { header: '작업장uuid', name: 'workings_uuid', hidden: true },
        {
          header: '작업장코드',
          name: 'workings_cd',
          width: ENUM_WIDTH.M,
          format: 'popup',
          hidden: true,
        },
        {
          header: '작업장',
          name: 'workings_nm',
          width: ENUM_WIDTH.L,
          format: 'popup',
          editable: true,
        },
      ],
      gridPopupInfo: [
        {
          columnNames: [
            { original: 'workings_uuid', popup: 'workings_uuid' },
            { original: 'workings_cd', popup: 'workings_cd' },
            { original: 'workings_nm', popup: 'workings_nm' },
          ],
          columns: getPopupForm('작업장관리')?.datagridProps?.columns,
          gridMode: 'select',
          dataApiSettings: {
            uriPath: getPopupForm('작업장관리')?.uriPath,
          },
        },
      ],
      gridMode: 'update',
      data: workingsData,
      inputProps: {
        id: 'ROUTING_WORKINGS_GRID_UPDATE_INPUT',
        inputItems: workingItems,
        innerRef: inputRefUpdateWorkings,
      },
      searchUriPath: null,
      searchParams: {},
      saveUriPath: '/std/routing-workingses',
      saveParams: { prod_uuid: prodInfo?.prod_uuid },
      saveType: 'basic',
      visible: workingsGridPopupUpdateVisible,
      onAfterOk: (isSuccess, savedData) => {
        if (!isSuccess) return;
        setWorkingsGridPopupUpdateVisible(false);
      },
      onCancel: () => setWorkingsGridPopupUpdateVisible(false),
    },
    //#endregion

    //#region ✔ 리소스 등록 관련 팝업
    {
      title: '리소스 관리',
      popupId: 'ROUTING_RESOURCE_GRID_POPUP',
      gridId: 'ROUTING_RESOURCE_GRID_POPUP_GRID',
      columns: resourceColumns,
      ref: grdRefRoutingResources,

      inputProps: {
        id: 'ROUTING_RESOURCES_GRID_INPUT',
        inputItems: routingResourcesItems,
        innerRef: inputRefResources,
      },
      gridMode: 'delete',
      data: resourcesData,
      saveUriPath: URI_PATH_SAVE_ROUTING_RESOURCE,
      saveParams: {},
      saveType: 'basic',
      extraButtons: [
        {
          buttonProps: { text: '신규추가' },
          align: 'left',
          buttonAction: () => setResourcesGridPopupCreateVisible(true),
        },
        {
          buttonProps: { text: '수정' },
          align: 'right',
          buttonAction: () => setResourcesGridPopupUpdateVisible(true),
        },
        {
          buttonProps: { text: '삭제' },
          align: 'right',
          buttonAction: () => {
            dataGridEvents?.onSave(
              'basic',
              {
                gridRef: grdRefRoutingResources,
                columns: resourceColumns,
                saveUriPath: URI_PATH_SAVE_ROUTING_RESOURCE,
              },
              {},
              modal,
              getResourcesData,
            );
          },
        },
      ],
      visible: resourcesGridPopupVisible,

      okButtonProps: { hidden: true },
      cancelText: '닫기',
      onCancel: () => setResourcesGridPopupVisible(false),
    },
    {
      title: '리소스 추가',
      popupId: 'ROUTING_RESOURCES_GRID_POPUP_CREATE',
      gridId: 'ROUTING_RESOURCES_GRID_POPUP_CREATE_GRID',
      columns: resourceColumns,
      gridMode: 'create',
      inputProps: {
        id: 'ROUTING_RESOURCES_GRID_CREATE_INPUT',
        inputItems: routingResourcesItems,
        innerRef: inputRefCreateResources,
      },
      searchUriPath: null,
      searchParams: {},
      saveUriPath: URI_PATH_SAVE_ROUTING_RESOURCE,
      saveParams: { routing_uuid: routingInfo?.routing_uuid },
      saveType: 'basic',
      visible: resourcesGridPopupCreateVisible,
      onAfterOk: (isSuccess, savedData) => {
        if (!isSuccess) return;
        setResourcesGridPopupCreateVisible(false);
      },
      onCancel: () => setResourcesGridPopupCreateVisible(false),
    },
    {
      title: '리소스 수정',
      popupId: 'ROUTING_RESOURCES_GRID_POPUP_UPDATE',
      gridId: 'ROUTING_RESOURCES_GRID_POPUP_UPDATE_GRID',
      columns: resourceColumns,
      gridMode: 'update',
      data: resourcesData,
      inputProps: {
        id: 'ROUTING_RESOURCES_GRID_UPDATE_INPUT',
        inputItems: routingResourcesItems,
        innerRef: inputRefUpdateResources,
      },
      searchUriPath: null,
      searchParams: {},
      saveUriPath: URI_PATH_SAVE_ROUTING_RESOURCE,
      saveParams: {},
      saveType: 'basic',
      visible: resourcesGridPopupUpdateVisible,
      onAfterOk: (isSuccess, savedData) => {
        if (!isSuccess) return;
        setResourcesGridPopupUpdateVisible(false);
      },
      onCancel: () => setResourcesGridPopupUpdateVisible(false),
    },
    //#endregion
  ];

  /** 팝업 Grid View */
  const addDataPopupGrid = useGrid(
    'ADD_DATA_POPUP_GRID',
    cloneObject(detailGrid.gridInfo.columns)?.filter(
      el => el?.name !== '_routing_resource_btn',
    ),
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      rowAddPopupInfo: {
        columnNames: [
          { original: 'proc_uuid', popup: 'proc_uuid' },
          { original: 'proc_cd', popup: 'proc_cd' },
          { original: 'proc_nm', popup: 'proc_nm' },
        ],
        columns: [
          {
            header: '공정UUID',
            name: 'proc_uuid',
            format: 'text',
            hidden: true,
          },
          {
            header: '공정코드',
            name: 'proc_cd',
            width: ENUM_WIDTH.M,
            format: 'text',
            hidden: true,
          },
          {
            header: '공정명',
            name: 'proc_nm',
            width: ENUM_WIDTH.L,
            format: 'text',
          },
        ],
        dataApiSettings: () => {
          return {
            uriPath: '/std/procs',
          };
        },
        gridMode: 'multi-select',
      },
    },
  );

  const editDataPopupGrid = useGrid(
    'EDIT_DATA_POPUP_GRID',
    cloneObject(detailGrid.gridInfo.columns)?.filter(
      el => el?.name !== '_routing_resource_btn',
    ),
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      rowAddPopupInfo: addDataPopupGrid.gridInfo.rowAddPopupInfo,
      gridPopupInfo: addDataPopupGrid.gridInfo.gridPopupInfo,
    },
  );

  /** 헤더 클릭 이벤트 */
  const onClickHeader = ev => {
    const { targetType, rowKey, instance } = ev;
    const headerRow = instance?.getRow(rowKey);

    if (targetType !== 'cell') return;
    setSelectedHeaderRow(headerRow);
  };

  /** 상세 그리드 데이터 세팅 */
  const reloadDetailGrid = uuid => {
    if (!uuid) return;

    const uriPath = `/std/routings?prod_uuid=${uuid}`;
    getData(null, uriPath, 'raws').then(res => {
      detailGrid.setGridData(res || []);
    });
  };
  //#endregion

  //#region 🔶조회조건 관리
  /** 조회조건 View */
  const headerSearchInfo = null;
  const detailSearchInfo = null;

  const newDataPopupSearchInfo = null;
  const addDataPopupSearchInfo = null;
  const editDataPopupSearchInfo = null;

  /** 조회조건 Event */
  const onSearchHeader = async values => {
    const searchParams = cleanupKeyOfObject(values, searchInitKeys);

    let data = [];
    await getData(
      {
        ...searchParams,
        prd_active_fg: true,
      },
      headerSearchUriPath,
    )
      .then(res => {
        data = res;
      })
      .finally(() => {
        setSelectedHeaderRow(null);
        headerGrid.setGridData(data);
      });

    return data;
  };

  const onSearchDetail = uuid => {
    if (isNil(uuid)) return;
    reloadDetailGrid(uuid);
  };
  //#endregion

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (isNil(selectedHeaderRow)) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.prod_uuid);
  }, [selectedHeaderRow]);

  useLayoutEffect(() => {
    if (newDataPopupGridVisible === true) {
      // 신규 등록 팝업 나타났을 때 기능 추가할 것
    } else {
      newDataPopupInputInfo?.instance?.resetForm();
    }
  }, [newDataPopupGridVisible]);

  useLayoutEffect(() => {
    if (addDataPopupGridVisible === true) {
      // ❗ 세부 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      addDataPopupInputInfo.setValues(
        cloneDeep(detailInputInfo.ref.current.values),
      );
    }
  }, [addDataPopupGridVisible, detailInputInfo.values]);

  useLayoutEffect(() => {
    if (editDataPopupGridVisible === true) {
      // ❗ 수정 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      editDataPopupInputInfo.setValues(
        cloneDeep(detailInputInfo.ref.current.values),
      );
      editDataPopupGrid.setGridData(detailGrid.gridInfo.data);
    }
  }, [
    editDataPopupGridVisible,
    detailInputInfo.values,
    detailGrid.gridInfo.data,
  ]);
  //#endregion

  const onSave = () => {
    const { gridRef, setGridMode } = detailGrid;
    const { columns, saveUriPath } = detailGrid.gridInfo;

    if (
      !detailInputInfo.isModified &&
      !isModified(detailGrid.gridRef, detailGrid.gridInfo.columns)
    ) {
      message.warn('편집된 데이터가 없습니다.');
      return;
    }

    dataGridEvents.onSave(
      'basic',
      {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
      },
      detailInputInfo.values,
      modal,
      res => {
        // 헤더 그리드 재조회
        onSearchHeader(headerSearchInfo?.values).then(searchResult => {
          const headerRow = res.savedData[0];
          onAfterSaveAction(searchResult, headerRow?.prod_uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (isNil(detailInputInfo?.values.prod_uuid)) {
      message.warn('품목을 선택하신 후 다시 시도해 주세요.');
      return false;
    }

    if (isNil(detailInputInfo?.values.factory_uuid)) {
      message.warn('품목의 작업장을 등록하신 후 다시 시도해 주세요.');
      return false;
    }

    return true;
  };

  //#region 🔶작동될 버튼들의 기능 정의 (By Template)
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearchHeader(headerSearchInfo?.values);
    },

    /** 수정 */
    update: () => {
      if (!onCheckUuid()) return;
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: () => {
      DialogUtil.valueOf(modal).confirm({
        title: MESSAGE.ROUTING_DELETE,
        message: MESSAGE.ROUTING_DELETE_QUESTION,
        onOk: () => {
          ServiceUtil.getInstance()
            .callMethod(
              RoutingServiceImpl.getInstance().delete,
              detailGrid.gridRef,
            )
            .then(_ => {
              message.success(MESSAGE.ROUTING_DELETE_SUCCESS);
              onSearchDetail(detailInputInfo.values.prod_uuid);
            })
            .catch((error: unknown) => {
              message.warn(error.toString());
            });
        },
      });
    },

    /** 신규 추가 */
    create: null,

    /** 상세 신규 추가 */
    createDetail: () => {
      if (!onCheckUuid()) return;
      setAddDataPopupGridVisible(true);
    },

    /** 저장(수정, 삭제) */
    save: () => {
      onSave();
    },

    /** 편집 취소 */
    cancelEdit: () => {
      const { gridRef, setGridMode } = detailGrid;
      const { columns } = detailGrid.gridInfo;

      if (detailInputInfo.isModified || isModified(gridRef, columns)) {
        // 편집 이력이 있는 경우
        modal.confirm({
          title: '편집 취소',
          content: '편집된 이력이 있습니다. 편집을 취소하시겠습니까?',
          onOk: () => {
            detailInputInfo.setValues(selectedHeaderRow);
            setGridMode('view');
          },
          onCancel: () => {
            // this function will be executed when cancel button is clicked
          },
          okText: '예',
          cancelText: '아니오',
        });
      } else {
        // 편집 이력이 없는 경우
        setGridMode('view');
      }
    },

    printExcel: dataGridEvents.printExcel,
  };
  //#endregion

  /** 신규 저장 이후 수행될 함수 */
  const onAfterSaveNewData = null;

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, detailInputInfo.values.prod_uuid);
    });
    setAddDataPopupGridVisible(false);
  };

  /** 세부항목 수정 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, detailInputInfo.values.prod_uuid);
    });
    setEditDataPopupGridVisible(false);
  };

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.prod_uuid === uuid);

    if (!selectedRow) {
      selectedRow = searchResult[0];
    }
    setSelectedHeaderRow(
      cleanupKeyOfObject(selectedRow, detailInputInfo.inputItemKeys),
    );
  };

  //#region 🔶템플릿에 값 전달
  const props: ITpDoubleGridProps = {
    title,
    dataSaveType: 'basic',
    gridRefs: [headerGrid.gridRef, detailGrid.gridRef],
    gridInfos: [
      {
        ...headerGrid.gridInfo,
        onAfterClick: onClickHeader,
      },
      detailGrid.gridInfo,
    ],
    popupGridRefs: [null, addDataPopupGrid.gridRef, editDataPopupGrid.gridRef],
    popupGridInfos: [
      null,
      {
        ...addDataPopupGrid.gridInfo,
        saveParams: {
          prod_uuid: addDataPopupInputInfo?.values?.prod_uuid,
        },
        onOk: (routingGridRef: GridRef) => {
          RoutingServiceImpl.getInstance()
            .createWithUuid(
              routingGridRef.current.getInstance(),
              detailInputInfo?.values.prod_uuid,
            )
            .then((_: unknown) => {
              message.success(MESSAGE.ROUTING_CREATE_SUCCESS);
              onSearchDetail(detailInputInfo.values.prod_uuid);
              setAddDataPopupGridVisible(false);
            })
            .catch((error: unknown) => {
              console.error(error);
              message.error(error.toString());
            });
        },
      },
      {
        ...editDataPopupGrid.gridInfo,
        onOk: (routingGridRef: GridRef) => {
          ServiceUtil.getInstance()
            .callMethod(RoutingServiceImpl.getInstance().update, routingGridRef)
            .then((_: unknown) => {
              message.success(MESSAGE.ROUTING_UPDATE_SUCCESS);
              onSearchDetail(detailInputInfo.values.prod_uuid);
              setEditDataPopupGridVisible(false);
            })
            .catch((error: unknown) => {
              console.error(error);
              message.error(error.toString());
            });
        },
      },
    ],
    searchProps: [
      {
        ...headerSearchInfo?.props,
        onSearch: onSearchHeader,
      },
      {
        ...detailSearchInfo?.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.prod_uuid),
      },
    ],
    inputProps: [null, detailInputInfo.props],
    popupVisibles: [
      newDataPopupGridVisible,
      addDataPopupGridVisible,
      editDataPopupGridVisible,
    ],
    setPopupVisibles: [
      setNewDataPopupGridVisible,
      setAddDataPopupGridVisible,
      setEditDataPopupGridVisible,
    ],
    popupSearchProps: [
      newDataPopupSearchInfo?.props,
      addDataPopupSearchInfo?.props,
      editDataPopupSearchInfo?.props,
    ],
    popupInputProps: [
      newDataPopupInputInfo?.props,
      addDataPopupInputInfo?.props,
      editDataPopupInputInfo?.props,
    ],
    buttonActions,
    modalContext,

    extraGridPopups,

    onAfterOkNewDataPopup: onAfterSaveNewData,
    onAfterOkEditDataPopup: onAfterSaveEditData,
    onAfterOkAddDataPopup: onAfterSaveAddData,
  };
  //#endregion

  return (
    <>
      <TpDoubleGrid {...props} />
    </>
  );
};
