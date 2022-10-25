import React, { useLayoutEffect, useState } from 'react';
import { useGrid, useSearchbox } from '~/components/UI';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  getData,
  getPageName,
  getToday,
  isModified,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpDoubleGrid } from '~/components/templates/grid-double/grid-double.template';
import ITpDoubleGridProps from '~/components/templates/grid-double/grid-double.template.type';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { message } from 'antd';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';

/** 완료상태 컬럼 renderer 조건 */
const completeCondition = [
  {
    value: '완료',
    text: '완료',
    color: 'blue',
  },
  {
    value: '미완료',
    text: '미완료',
    color: 'red',
  },
];

// 금액 컬럼 계산 (단가 * 수량 * 환율)
const priceFormula = (params, props) => {
  const { value, targetValues } = params;
  return (
    Number(value) *
      Number(targetValues?._array[0]) *
      Number(targetValues?._array[1]) || 0
  );
};

/** 수주관리 */
export const PgSalOrder = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/sal/orders';
  const headerSaveUriPath = '/sal/orders';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/sal/orders';
  const detailSaveUriPath = '/sal/orders';
  const searchInitKeys = ['start_date', 'end_date'];

  /** 팝업 Visible 상태 관리 */
  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  /** 헤더 클릭시 해당 Row 상태 관리 */
  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);

  //#region 🔶그리드 상태 관리
  /** 화면 Grid View */
  const headerGrid = useGrid(
    'HEADER_GRID',
    [
      {
        header: '수주UUID',
        name: 'order_uuid',
        alias: 'uuid',
        hidden: true,
      },
      {
        header: '전표번호',
        name: 'stmt_no',
        width: ENUM_WIDTH.M,
      },
      {
        header: '수주일',
        name: 'reg_date',
        width: ENUM_WIDTH.M,
        editable: true,
        format: 'date',
        requiredField: true,
      },
      {
        header: '거래처UUID',
        name: 'partner_uuid',
        hidden: true,
        requiredField: true,
      },
      {
        header: '거래처코드',
        name: 'partner_cd',
        hidden: true,
        requiredField: true,
      },
      {
        header: '거래처명',
        name: 'partner_nm',
        width: ENUM_WIDTH.M,
        editable: true,
        requiredField: true,
      },
      {
        header: '합계금액',
        name: 'total_price',
        width: ENUM_WIDTH.M,
        editable: true,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
      },
    ],
    {
      searchUriPath: headerSearchUriPath,
      saveUriPath: headerSaveUriPath,
      gridMode: headerDefaultGridMode,
    },
  );

  const detailGrid = useGrid(
    'DETAIL_GRID',
    [
      {
        header: '세부수주UUID',
        name: 'order_detail_uuid',
        alias: 'uuid',
        hidden: true,
      },
      {
        header: '수주UUID',
        name: 'order_uuid',
        hidden: true,
      },
      {
        header: '완료상태',
        width: ENUM_WIDTH.S,
        name: 'complete_state',
        format: 'tag',
        options: { conditions: completeCondition },
        hiddenCondition: props => !['view', 'delete'].includes(props?.gridMode),
      },
      {
        header: '완료여부',
        width: ENUM_WIDTH.S,
        name: 'complete_fg',
        format: 'check',
        editable: true,
        hiddenCondition: props => ['view', 'delete'].includes(props?.gridMode),
      },
      {
        header: '품목UUID',
        name: 'prod_uuid',
        hidden: true,
        requiredField: true,
      },
      {
        header: '품목유형',
        width: ENUM_WIDTH.M,
        name: 'item_type_nm',
        filter: 'text',
        format: 'popup',
        editable: true,
        align: 'center',
      },
      {
        header: '제품유형',
        width: ENUM_WIDTH.M,
        name: 'prod_type_nm',
        filter: 'text',
        format: 'popup',
        editable: true,
        align: 'center',
      },
      {
        header: '품번',
        width: ENUM_WIDTH.M,
        name: 'prod_no',
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '품명',
        width: ENUM_WIDTH.L,
        name: 'prod_nm',
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '모델',
        width: ENUM_WIDTH.M,
        name: 'model_nm',
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: 'Rev',
        width: ENUM_WIDTH.S,
        name: 'rev',
        format: 'popup',
        editable: true,
      },
      {
        header: '규격',
        width: ENUM_WIDTH.L,
        name: 'prod_std',
        format: 'popup',
        editable: true,
      },
      {
        header: '안전재고',
        width: ENUM_WIDTH.S,
        name: 'safe_stock',
        format: 'popup',
        editable: true,
      },
      {
        header: '단위UUID',
        name: 'unit_uuid',
        format: 'popup',
        editable: true,
        hidden: true,
      },
      {
        header: '단위',
        width: ENUM_WIDTH.XS,
        name: 'unit_nm',
        format: 'popup',
        editable: true,
      },
      {
        header: '화폐단위UUID',
        name: 'money_unit_uuid',
        hidden: true,
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '화폐단위',
        width: ENUM_WIDTH.S,
        name: 'money_unit_nm',
        align: 'center',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '단가',
        width: ENUM_WIDTH.S,
        name: 'price',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        editable: true,
        requiredField: true,
        formula: {
          targetColumnNames: ['qty', 'exchange'],
          resultColumnName: 'total_price',
          formula: priceFormula,
        },
      },
      {
        header: '환율',
        width: ENUM_WIDTH.S,
        name: 'exchange',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        editable: true,
        requiredField: true,
        formula: {
          targetColumnNames: ['qty', 'price'],
          resultColumnName: 'total_price',
          formula: priceFormula,
        },
      },
      {
        header: '수량',
        width: ENUM_WIDTH.S,
        name: 'qty',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        editable: true,
        requiredField: true,
        formula: {
          targetColumnNames: ['price', 'exchange'],
          resultColumnName: 'total_price',
          formula: priceFormula,
        },
      },
      {
        header: '금액',
        width: ENUM_WIDTH.S,
        name: 'total_price',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_PRICE,
        editable: true,
      },
      {
        header: '단위수량',
        width: ENUM_WIDTH.M,
        name: 'unit_qty',
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        editable: true,
      },
      {
        header: '납기일',
        width: ENUM_WIDTH.M,
        name: 'due_date',
        format: 'date',
        editable: true,
      },
      {
        header: '비고',
        width: ENUM_WIDTH.XL,
        name: 'remark',
        editable: true,
      },
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridMode: detailDefaultGridMode,
    },
  );

  const gridPopupColumns = cloneDeep(detailGrid.gridInfo.columns)?.map(el => {
    if (
      [
        'prod_type_nm',
        'item_type_nm',
        'prod_no',
        'prod_nm',
        'model_nm',
        'rev',
        'prod_std',
        'safe_stock',
        'unit_nm',
        'money_unit_nm',
      ].includes(el?.name)
    )
      el['editable'] = false;

    return el;
  });

  /** 팝업 Grid View */
  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID', gridPopupColumns, {
    searchUriPath: headerSearchUriPath,
    saveUriPath: headerSaveUriPath,

    rowAddPopupInfo: {
      columnNames: [
        { original: 'prod_uuid', popup: 'prod_uuid' },
        { original: 'item_type_nm', popup: 'item_type_nm' },
        { original: 'prod_type_nm', popup: 'prod_type_nm' },
        { original: 'prod_no', popup: 'prod_no' },
        { original: 'prod_nm', popup: 'prod_nm' },
        { original: 'model_nm', popup: 'model_nm' },
        { original: 'rev', popup: 'rev' },
        { original: 'prod_std', popup: 'prod_std' },
        { original: 'safe_stock', popup: 'safe_stock' },
        { original: 'unit_uuid', popup: 'unit_uuid' },
        { original: 'unit_nm', popup: 'unit_nm' },
        { original: 'money_unit_uuid', popup: 'money_unit_uuid' },
        { original: 'money_unit_nm', popup: 'money_unit_nm' },
        { original: 'price', popup: 'price' },
        { original: 'unit_qty', popup: 'unit_qty' },
      ],
      columns: [
        {
          header: '품목UUID',
          name: 'prod_uuid',
          format: 'text',
          hidden: true,
        },
        {
          header: '품목 유형UUID',
          name: 'item_type_uuid',
          format: 'text',
          hidden: true,
        },
        {
          header: '품목 유형코드',
          name: 'item_type_cd',
          width: ENUM_WIDTH.M,
          format: 'text',
          hidden: true,
        },
        {
          header: '품목 유형명',
          name: 'item_type_nm',
          width: ENUM_WIDTH.L,
          format: 'text',
        },
        {
          header: '제품 유형UUID',
          name: 'prod_type_uuid',
          format: 'text',
          hidden: true,
        },
        {
          header: '제품 유형코드',
          name: 'prod_type_cd',
          width: ENUM_WIDTH.M,
          format: 'text',
          hidden: true,
        },
        {
          header: '제품 유형명',
          name: 'prod_type_nm',
          width: ENUM_WIDTH.L,
          format: 'text',
        },
        {
          header: '품번',
          name: 'prod_no',
          width: ENUM_WIDTH.M,
          format: 'text',
        },
        {
          header: '품명',
          name: 'prod_nm',
          width: ENUM_WIDTH.L,
          format: 'text',
        },
        {
          header: '모델UUID',
          name: 'model_uuid',
          format: 'text',
          hidden: true,
        },
        {
          header: '모델코드',
          name: 'model_cd',
          width: ENUM_WIDTH.M,
          format: 'text',
          hidden: true,
        },
        {
          header: '모델명',
          name: 'model_nm',
          width: ENUM_WIDTH.M,
          format: 'text',
        },
        {
          header: 'Rev',
          name: 'rev',
          width: ENUM_WIDTH.S,
          format: 'text',
        },
        {
          header: '규격',
          name: 'prod_std',
          width: ENUM_WIDTH.L,
          format: 'text',
        },
        {
          header: '안전재고',
          name: 'safe_stock',
          width: ENUM_WIDTH.M,
          format: 'text',
        },
        {
          header: '단위수량',
          name: 'unit_qty',
          width: ENUM_WIDTH.M,
          format: 'number',
          decimal: ENUM_DECIMAL.DEC_STCOK,
        },
        {
          header: '단위UUID',
          name: 'unit_uuid',
          format: 'text',
          hidden: true,
        },
        {
          header: '단위코드',
          name: 'unit_cd',
          width: ENUM_WIDTH.M,
          format: 'text',
          hidden: true,
        },
        {
          header: '단위명',
          name: 'unit_nm',
          width: ENUM_WIDTH.M,
          format: 'text',
        },
        {
          header: '화폐단위UUID',
          name: 'money_unit_uuid',
          format: 'text',
          hidden: true,
        },
        {
          header: '화폐단위코드',
          name: 'money_unit_cd',
          width: ENUM_WIDTH.M,
          format: 'text',
          hidden: true,
        },
        {
          header: '화폐단위명',
          name: 'money_unit_nm',
          width: ENUM_WIDTH.M,
          format: 'text',
        },
        {
          header: '단가유형UUID',
          name: 'price_type_uuid',
          format: 'text',
          hidden: true,
        },
        {
          header: '단가유형코드',
          name: 'price_type_cd',
          width: ENUM_WIDTH.M,
          format: 'text',
          hidden: true,
        },
        {
          header: '단가유형명',
          name: 'price_type_nm',
          width: ENUM_WIDTH.M,
          format: 'text',
        },
        {
          header: '단가',
          name: 'price',
          width: ENUM_WIDTH.S,
          format: 'number',
          decimal: ENUM_DECIMAL.DEC_PRICE,
        },
        {
          header: '소급단가',
          name: 'retroactive_price',
          width: ENUM_WIDTH.S,
          format: 'number',
          decimal: ENUM_DECIMAL.DEC_PRICE,
          hidden: true,
        },
        {
          header: '배분율',
          name: 'division',
          width: ENUM_WIDTH.S,
          format: 'number',
          decimal: ENUM_DECIMAL.DEC_NOMAL,
          hidden: true,
        },
        {
          header: '비고',
          name: 'remark',
          width: ENUM_WIDTH.XL,
          format: 'text',
        },
      ],
      dataApiSettings: () => {
        type TParams = { date?: string; partner_uuid?: string; uuid?: string };
        let inputValues = null;
        let params: TParams = {};

        if (newDataPopupGridVisible) {
          // 신규 등록 팝업일 경우
          inputValues = newDataPopupInputInfo.ref.current.values;
        } else {
          // 세부 항목 등록 팝업일 경우
          inputValues = addDataPopupInputInfo.ref.current.values;
        }

        if (inputValues != null) {
          params = {
            uuid: newDataPopupGridVisible ? null : inputValues.order_uuid,
            partner_uuid: inputValues?.partner_uuid,
            date: inputValues?.reg_date
              ? dayjs(inputValues?.reg_date).format('YYYY-MM-DD')
              : null,
          };
        }

        return {
          uriPath: '/std/customer-prices',
          params,
          onInterlock: () => {
            let showPopup: boolean = false;

            if (params?.date == null) {
              message.warn('수주일을 입력하신 후 다시 시도해주세요.');
            } else if (params?.partner_uuid == null) {
              message.warn('거래처를 선택하신 후 다시 시도해주세요.');
            } else {
              showPopup = true;
            }

            return showPopup;
          },
        };
      },
      gridMode: 'multi-select',
    },
  });

  const addDataPopupGrid = useGrid('ADD_DATA_POPUP_GRID', gridPopupColumns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
    rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
    extraButtons: newDataPopupGrid.gridInfo.extraButtons,
  });

  const editDataPopupGrid = useGrid(
    'EDIT_DATA_POPUP_GRID',
    cloneDeep(newDataPopupGrid.gridInfo.columns).map(el => {
      if (
        [
          'order_detail_uuid',
          'qty',
          'price',
          'money_unit_nm',
          'exchange',
          'complete_fg',
        ].includes(el?.name)
      ) {
        el['requiredField'] = true;
      } else {
        el['requiredField'] = false;
      }
      return el;
    }),
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      gridPopupInfo: newDataPopupGrid.gridInfo.gridPopupInfo,
      rowAddPopupInfo: newDataPopupGrid.gridInfo.rowAddPopupInfo,
      extraButtons: newDataPopupGrid.gridInfo.extraButtons,
    },
  );

  /** 헤더 클릭 이벤트 */
  const onClickHeader = ev => {
    const { targetType, rowKey, instance } = ev;
    const headerRow = instance?.store?.data?.rawData[rowKey];

    if (targetType !== 'cell') return;
    setSelectedHeaderRow(headerRow);
  };

  /** 상세 그리드 데이터 세팅 */
  const reloadDetailGrid = uuid => {
    if (!uuid) return;

    const uriPath = `/sal/order/${uuid}/include-details`;
    getData(detailSearchInfo?.values, uriPath, 'header-details').then(res => {
      const detailsRes = res as unknown as { details: any };
      detailGrid.setGridData(detailsRes?.details || []);
    });
  };
  //#endregion

  //#region 🔶조회조건 관리
  /** 조회조건 View */
  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      defaults: [getToday(-7), getToday()],
      label: '수주일',
    },
  ]);

  const detailSearchInfo = useSearchbox('DETAIL_SEARCH_INPUTBOX', [
    { type: 'text', id: 'complete_state', default: 'all', hidden: true },
  ]);

  /** 조회조건 Event */
  const onSearchHeader = async values => {
    const searchParams = cleanupKeyOfObject(values, searchInitKeys);

    let data = [];
    await getData(searchParams, headerSearchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        detailInputInfo.ref.current.resetForm();
        setSelectedHeaderRow(null);
        headerGrid.setGridData(data);
      });

    return data;
  };

  const onSearchDetail = uuid => {
    if (uuid == null) return;
    reloadDetailGrid(uuid);
  };
  //#endregion

  //#region 🔶입력상자 관리
  const detailInputInfo = useInputGroup('DETAIL_INPUTBOX', [
    {
      type: 'text',
      id: 'order_uuid',
      alias: 'uuid',
      label: '수주UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'partner_uuid',
      label: '거래처UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'stmt_no',
      label: '전표번호',
      disabled: true,
    },
    {
      type: 'date',
      id: 'reg_date',
      label: '수주일',
      disabled: true,
    },
    {
      type: 'text',
      id: 'partner_nm',
      label: '거래처',
      disabled: true,
      usePopup: true,
      popupKey: '거래처관리',
      popupKeys: ['partner_uuid', 'partner_nm'],
      params: { partner_fg: 2 },
      required: true,
      handleChange: values => {
        newDataPopupGrid?.setGridData([]);
      },
    },
    {
      type: 'number',
      id: 'total_qty',
      label: '합계수량',
      disabled: true,
    },
    {
      type: 'number',
      id: 'total_price',
      label: '합계금액',
      disabled: true,
      decimal: ENUM_DECIMAL.DEC_PRICE,
    },
    {
      type: 'text',
      id: 'remark',
      label: '비고',
      disabled: detailGrid.gridInfo.gridMode !== 'update',
    },
  ]);

  const newDataPopupInputInfo = useInputGroup(
    'NEW_DATA_POPUP_INPUTBOX',
    cloneDeep(detailInputInfo.props?.inputItems)?.map(el => {
      if (
        el?.id !== 'total_qty' &&
        el?.id !== 'total_price' &&
        el?.id !== 'stmt_no'
      ) {
        el['disabled'] = false;
      }

      if (el?.id === 'reg_date') el['default'] = getToday();

      return el;
    }),
  );

  const editDataPopupInputInfo = useInputGroup(
    'EDIT_DATA_POPUP_INPUTBOX',
    cloneDeep(detailInputInfo.props?.inputItems)?.map(el => {
      if (
        el?.id !== 'total_qty' &&
        el?.id !== 'total_price' &&
        el?.id !== 'stmt_no'
      ) {
        el['disabled'] = false;
      }

      if (el?.id === 'reg_date') el['default'] = getToday();

      return el;
    }),
  );

  const addDataPopupInputInfo = useInputGroup(
    'ADD_DATA_POPUP_INPUTBOX',
    detailInputInfo.props.inputItems,
  );
  //#endregion

  //#region 🔶페이지 액션 관리
  useLayoutEffect(() => {
    if (selectedHeaderRow == null) {
      detailGrid.setGridData([]);
    } else {
      detailInputInfo.setValues(selectedHeaderRow);
      onSearchDetail(selectedHeaderRow?.order_uuid);
    }
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
      // ❗ 수정 팝업이 켜진 후, detailInfo 데이터를 삽입합니다
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
      'headerInclude',
      {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
      },
      detailInputInfo.ref.current.values,
      modal,
      res => {
        // 헤더 그리드 재조회
        onSearchHeader(headerSearchInfo.values).then(searchResult => {
          const headerRow = res.datas.raws[0].header[0];
          onAfterSaveAction(searchResult, headerRow?.uuid);
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (detailInputInfo?.values?.order_uuid == null) {
      message.warn('전표를 선택하신 후 다시 시도해 주세요.');
      return false;
    }
    return true;
  };

  //#region 🔶작동될 버튼들의 기능 정의 (By Template)
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearchHeader(headerSearchInfo.values);
    },

    /** 수정 */
    update: () => {
      if (!onCheckUuid()) return;
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: () => {
      onSave();
    },

    /** 신규 추가 */
    create: () => {
      newDataPopupInputInfo.instance?.resetForm();
      setNewDataPopupGridVisible(true);
    },

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
  const onAfterSaveNewData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setNewDataPopupGridVisible(false);
  };

  /** 수정 이후 수행될 함수 */
  const onAfterSaveEditData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.receive?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setEditDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 */
  const onAfterSaveAddData = (isSuccess, savedData?) => {
    if (!isSuccess) return;
    const savedUuid = savedData[0]?.header[0]?.uuid;

    // 헤더 그리드 재조회
    onSearchHeader(headerSearchInfo.values).then(searchResult => {
      onAfterSaveAction(searchResult, savedUuid);
    });
    setAddDataPopupGridVisible(false);
  };

  // 사용자가 저장한 데이터의 결과를 찾아서 보여줍니다.
  const onAfterSaveAction = (searchResult, uuid) => {
    let selectedRow = searchResult?.find(el => el?.order_uuid === uuid);

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
    dataSaveType: 'headerInclude',
    gridRefs: [headerGrid.gridRef, detailGrid.gridRef],
    gridInfos: [
      {
        ...headerGrid.gridInfo,
        onAfterClick: onClickHeader,
      },
      detailGrid.gridInfo,
    ],
    popupGridRefs: [
      newDataPopupGrid.gridRef,
      addDataPopupGrid.gridRef,
      editDataPopupGrid.gridRef,
    ],
    popupGridInfos: [
      newDataPopupGrid.gridInfo,
      addDataPopupGrid.gridInfo,
      editDataPopupGrid.gridInfo,
    ],
    searchProps: [
      {
        ...headerSearchInfo.props,
        onSearch: onSearchHeader,
      },
      {
        ...detailSearchInfo.props,
        onSearch: () => onSearchDetail(selectedHeaderRow?.order_uuid),
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
    popupInputProps: [
      newDataPopupInputInfo?.props,
      addDataPopupInputInfo?.props,
      editDataPopupInputInfo?.props,
    ],
    buttonActions,
    modalContext,

    onAfterOkNewDataPopup: onAfterSaveNewData,
    onAfterOkEditDataPopup: onAfterSaveEditData,
    onAfterOkAddDataPopup: onAfterSaveAddData,
  };
  //#endregion

  return <TpDoubleGrid {...props} />;
};
