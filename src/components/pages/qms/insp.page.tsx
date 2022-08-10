import { message } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useState, useLayoutEffect } from 'react';
import { TpTripleGrid } from '~/components/templates/grid-triple';
import ITpTripleGridProps, {
  IExtraButton,
  TExtraGridPopups,
} from '~/components/templates/grid-triple/grid-triple.template.type';
import {
  Button,
  getPopupForm,
  IGridColumn,
  IGridPopupProps,
  ISearchItem,
  useGrid,
  useSearchbox,
} from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH, URL_PATH_ADM } from '~/enums';
import {
  consoleLogLocalEnv,
  dataGridEvents,
  executeData,
  getData,
  getModifiedRows,
  getPageName,
  getToday,
  isModified,
} from '~/functions';
import { OptComplexColumnInfo } from 'tui-grid/types/options';
import { cloneDeep } from 'lodash';
import {
  IInputGroupboxItem,
  useInputGroup,
} from '~/components/UI/input-groupbox';

/** 검사기준서관리 */
export const PgQmsInsp = () => {
  type TPopup = 'new' | 'add' | 'edit' | 'amend' | null;

  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const headerDefaultGridMode = 'view';
  const headerSearchUriPath = '/std/prods';
  const detailDefaultGridMode = 'delete';
  const detailSearchUriPath = '/qms/insps';
  const detailSaveUriPath = '/qms/insps';
  const detailSubSearchUriPath = '/qms/insp/{uuid}/details';
  const detailSubSaveUriPath = '/qms/insps';

  const INSP_POPUP = getPopupForm('검사기준관리');
  const PROD_POPUP = getPopupForm('품목관리');

  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);
  const [amendDataPopupGridVisible, setAmendDataPopupGridVisible] =
    useState<boolean>(false);

  const newDataPopupSearchInfo = null;
  const addDataPopupSearchInfo = null;
  const editDataPopupSearchInfo = null;
  const amendDataPopupSearchInfo = null;

  const [inspType, setInspType] = useState([]);
  const [inspInfo, setInspInfo] = useState({});

  const [workerInspFg, setWorkerInspFg] = useState(false);
  const [inspectorInspFg, setInspectorInspFg] = useState(false);

  const handleDetailGridApplyFormatter = props => {
    const { rowKey, grid } = props;
    const row = grid?.store?.data?.rawData[rowKey];
    return row['apply_fg'] === true ? '해제' : '적용';
  };

  const handleApplyInsp = (ev, props) => {
    // 적용 이벤트
    const { value, rowKey, grid } = props;
    const row = grid?.store?.data?.rawData[rowKey];

    const applyUriPath = '/qms/insps/apply';
    const cancelApplyUriPath = '/qms/insps/cancel-apply';
    const uuid = row?.insp_uuid; //검사기준서uuid

    if (!uuid) {
      message.error('검사기준서 ' + (value ? '해제' : '적용') + ' 실패');
      return;
    }

    executeData(
      [{ uuid }],
      value ? cancelApplyUriPath : applyUriPath,
      'put',
      'success',
    ).then(async success => {
      if (success) {
        message.success(
          '검사기준서가 ' + (value ? '해제' : '적용') + '되었습니다.',
        );

        handleSearchDetailData(row);
      }
    });
  };

  const handleReset = async () => {
    headerGrid?.setGridData([]);
    detailGrid?.setGridData([]);
    detailSubGrid?.setGridData([]);
    detailInputInfo?.setValues({});
    detailSubInputInfo?.setValues({});
    setInspInfo({});
  };

  const handleHeaderClick = ev => {
    const { targetType, rowKey, instance } = ev;
    const headerRow = instance?.store?.data?.rawData[rowKey];
    detailInputInfo.setValues(headerRow);
    if (targetType !== 'cell' || !headerRow?.prod_uuid) return;
    handleSearchDetailData(headerRow);
  };

  const handleSearchDetailData = async ({ prod_uuid }) => {
    if (!prod_uuid) return;
    const _inspType = JSON.parse(headerSearchInfo?.values?.['insp_type']);

    const uriPath = detailSearchUriPath;

    getData(
      { prod_uuid, insp_type_uuid: _inspType.insp_type_uuid },
      uriPath,
      'raws',
    ).then(async res => {
      detailGrid.setGridData(res || []);

      if (res.length === 0) {
        setInspInfo({});
        detailSubInputInfo?.setValues({});
        detailSubGrid?.setGridData([]);
      } else {
        handleSearchDetailSubData(res[0]);
      }
    });
  };

  /** 디테일 클릭 이벤트 */
  const handleDetailClick = ev => {
    const { targetType, rowKey, instance, columnName } = ev;
    if (columnName === 'apply_fg' || targetType !== 'cell') return;

    const detailRow = instance?.store?.data?.rawData[rowKey];

    handleSearchDetailSubData(detailRow);
  };

  const handleSearchDetailSubData = async inspData => {
    const _inspData = cloneDeep(inspData);

    if (!_inspData) {
      setInspInfo({});
      detailSubInputInfo?.setValues({});
      detailSubGrid.setGridData([]);
      return;
    }

    _inspData.insp_type = JSON.stringify({
      insp_type_uuid: _inspData.insp_type_uuid,
      insp_type_cd: _inspData.insp_type_cd,
    });

    const uriPath = detailSubSearchUriPath?.replace(
      '{uuid}',
      _inspData?.insp_uuid,
    );

    getData(
      {
        insp_detail_type: detailSubSearchInfo?.values?.insp_detail_type_cd,
      },
      uriPath,
      'raws',
    ).then(res => {
      detailSubGrid.setGridData(res || []);

      detailSubInputInfo.setValues(_inspData);

      setInspInfo(_inspData);
    });
  };

  const handleSearchHeader = async values => {
    const _inspType = JSON.parse(values?.['insp_type']);

    let data = [];

    await getHeaderData(_inspType?.insp_type_cd).then(res => (data = res));

    return data;
  };

  const getHeaderParams = async (inspTypeCd: string) => {
    const _inspFg = {
      qms_receive_insp_fg: inspTypeCd === 'RECEIVE_INSP' || null,
      qms_proc_insp_fg: inspTypeCd === 'PROC_INSP' || null,
      qms_final_insp_fg: inspTypeCd === 'FINAL_INSP' || null,
    };

    return {
      ..._inspFg,
      use_fg: true,
    };
  };

  const getHeaderData = async (inspTypeCd: string) => {
    const _params = await getHeaderParams(inspTypeCd);

    let data = [];

    await handleReset();

    await getData(_params, headerSearchUriPath).then(res => {
      headerGrid.setGridData(res);
    });

    return data;
  };

  const handleSave = () => {
    const { gridRef, setGridMode } = detailSubGrid;
    const { columns, saveUriPath } = detailSubGrid?.gridInfo;
    const _headerData = { uuid: detailSubInputInfo.values.insp_uuid };

    if (!isModified(detailSubGrid?.gridRef, detailSubGrid?.gridInfo?.columns)) {
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
      _headerData,
      modal,
      async res => {
        // 헤더 그리드 재조
        handleSearchHeader(headerSearchInfo?.values);
      },
      true,
    );
  };

  const handleCheckUuid = (): boolean => {
    if (!inspInfo?.insp_uuid) {
      message.warn('검사기준서를 선택하신 후 다시 시도해 주세요.');
      return false;
    }
    return true;
  };

  const handleAmendInsp = (
    gridRef: any,
    type: '개정' | '수정',
    popupType: TPopup,
  ) => {
    gridRef.current.getInstance().finishEditing();
    const grid =
      popupType === 'add'
        ? addDataPopupGrid
        : popupType === 'edit'
        ? editDataPopupGrid
        : popupType === 'amend'
        ? amendDataPopupGrid
        : null;

    const inputInfoValues =
      popupType === 'add'
        ? addDataPopupInputInfo.ref.current.values
        : popupType === 'edit'
        ? editDataPopupInputInfo.ref.current.values
        : popupType === 'amend'
        ? amendDataPopupInputInfo.ref.current.values
        : null;

    const setVisible =
      popupType === 'add'
        ? setAddDataPopupGridVisible
        : popupType === 'edit'
        ? setEditDataPopupGridVisible
        : popupType === 'amend'
        ? setAmendDataPopupGridVisible
        : null;

    if (!grid) {
      message.error(
        '기준서 ' + type + '중 문제가 발생했습니다. 관리자에게 문의해주세요.',
      );
    }

    const methodType =
      popupType === 'add' ? 'post' : type === '개정' ? 'post' : 'put';
    const optionSaveParams = cloneDeep(inputInfoValues);

    let rawData = null;
    let detailData = null;
    if (methodType === 'post' && type === '개정') {
      // post로 저장할 경우 uuid키를 제거
      delete optionSaveParams['uuid'];
      delete optionSaveParams['insp_no'];

      // 바로 적용
      optionSaveParams['apply_fg'] = true;

      // 행 삭제 체크되어 있는 행은 제거
      rawData = cloneDeep(
        gridRef.current.getInstance().store.data.rawData,
      ).filter(raw => {
        return raw['delete_row'] === false;
      });
      detailData = {
        createdRows: rawData,
      };
    } else {
      if (popupType === 'add') {
        // delete optionSaveParams.insp_no
      } else if (popupType === 'edit') {
        detailData = {
          updatedRows: cloneDeep(
            gridRef.current.getInstance().store.data.rawData,
          ),
        };
      }
      optionSaveParams.uuid = optionSaveParams.insp_uuid;
    }

    dataGridEvents.onSave(
      'headerInclude',
      {
        gridRef: gridRef,
        setGridMode: null,
        columns: grid?.gridInfo?.columns,
        saveUriPath: grid?.gridInfo?.saveUriPath,
        methodType: methodType,
        modifiedData: detailData ? detailData : null,
      },
      optionSaveParams,
      modal,
      async ({ success, datas }) => {
        if (success) {
          setVisible(false);

          handleSearchHeader(headerSearchInfo?.values);
        }
      },
      true,
    );
  };

  const handleAfterSaveNewData = async (isSuccess, savedData?) => {
    if (!isSuccess) return;

    await handleSearchHeader(headerSearchInfo?.values);

    setNewDataPopupGridVisible(false);
  };

  /** 세부 저장 이후 수행될 함수 ✅ */
  const handleAfterSaveAddData = async (isSuccess, savedData?) => {
    if (!isSuccess) return;

    await handleReset();

    setAddDataPopupGridVisible(false);
  };

  /** 세부항목 수정 이후 수행될 함수 ✅ */
  const handleAfterSaveEditData = async (isSuccess, savedData?) => {
    if (!isSuccess) return;

    await handleReset();

    setEditDataPopupGridVisible(false);
  };

  const handleAfterChangeInspType = value => {
    const _inspType = JSON.parse(value);
    setInspectorInspFg(true);
    if (_inspType.insp_type_cd === 'PROC_INSP') {
      setWorkerInspFg(true);
    } else {
      setWorkerInspFg(false);
    }

    getHeaderData(_inspType.insp_type_cd);
  };

  const popupFooter = () => {
    const popupType: TPopup = addDataPopupGridVisible
      ? 'add'
      : editDataPopupGridVisible
      ? 'edit'
      : null;
    const setVisible =
      popupType === 'add'
        ? setAddDataPopupGridVisible
        : popupType === 'edit'
        ? setEditDataPopupGridVisible
        : null;

    const gridRef =
      popupType === 'add'
        ? addDataPopupGrid.gridRef
        : popupType === 'edit'
        ? editDataPopupGrid.gridRef
        : null;

    if (!setVisible) return null;

    const onCancel = () => {
      setVisible(false);
    };

    const onEdit = () => {
      handleAmendInsp(gridRef, '수정', popupType);
    };

    return (
      <div>
        <Button
          widthSize="small"
          heightSize="small"
          fontSize="small"
          onClick={onCancel}
        >
          취소
        </Button>
        <Button
          btnType="buttonFill"
          widthSize="medium"
          heightSize="small"
          fontSize="small"
          colorType="basic"
          onClick={onEdit}
        >
          저장하기
        </Button>
      </div>
    );
  };

  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', null);
  const detailSearchInfo = null;
  const detailSubSearchInfo = null;

  const headerGridColumns: IGridColumn[] = [
    {
      header: '품목UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '품목유형',
      name: 'item_type_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '제품유형',
      name: 'prod_type_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    { header: '품번', name: 'prod_no', width: ENUM_WIDTH.L, filter: 'text' },
    { header: '품명', name: 'prod_nm', width: ENUM_WIDTH.L, filter: 'text' },
    { header: '규격', name: 'prod_std', width: ENUM_WIDTH.L, filter: 'text' },
  ];

  const detailGridColumns: IGridColumn[] = [
    {
      header: '파일첨부',
      name: 'files',
      width: ENUM_WIDTH.M,
      format: 'file',
      options: {
        file_mgmt_type_cd: 'FIL_QMS_INSP',
        ok_type: 'save',
        reference_col: 'insp_uuid',
      },
    },
    {
      header: '기준서유형코드',
      name: 'insp_type_cd',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: '기준서유형',
      name: 'insp_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
      align: 'center',
    },
    {
      header: '적용',
      name: 'apply_fg',
      width: ENUM_WIDTH.S,
      format: 'button',
      options: {
        formatter: handleDetailGridApplyFormatter,
        onClick: handleApplyInsp,
      },
    },
    {
      header: '기준서UUID',
      name: 'insp_uuid',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: '제품UUID',
      name: 'prod_uuid',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    },
    {
      header: '기준서번호',
      name: 'insp_no',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '개정내용',
      name: 'contents',
      width: ENUM_WIDTH.XL,
      filter: 'text',
    },
    { header: '비고', name: 'remark', width: ENUM_WIDTH.L, filter: 'text' },
  ];

  const deatilSubGridColumns: IGridColumn[] = [
    {
      header: '세부기준서UUID',
      name: 'insp_detail_uuid',
      alias: 'uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '세부기준서번호',
      name: 'insp_no_sub',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '검사기준UUID',
      name: 'insp_item_type_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '검사유형',
      name: 'insp_item_type_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '검사항목UUID',
      name: 'insp_item_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '검사항목',
      name: 'insp_item_nm',
      width: ENUM_WIDTH.M,
      filter: 'text',
      requiredField: true,
    },
    {
      header: '상세검사내용',
      name: 'insp_item_desc',
      width: ENUM_WIDTH.XL,
      filter: 'text',
    },
    {
      header: '위치번호',
      name: 'position_no',
      width: ENUM_WIDTH.M,
      format: 'number',
      filter: 'number',
    },
    {
      header: '기준',
      name: 'spec_std',
      width: ENUM_WIDTH.M,
      filter: 'text',
      requiredField: true,
    },
    {
      header: 'MIN',
      name: 'spec_min',
      width: ENUM_WIDTH.M,
      format: 'number',
      filter: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: 'MAX',
      name: 'spec_max',
      width: ENUM_WIDTH.M,
      format: 'number',
      filter: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
    },
    {
      header: '검사방법UUID',
      name: 'insp_method_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '검사방법',
      name: 'insp_method_nm',
      width: ENUM_WIDTH.M,
      format: 'popup',
      filter: 'text',
      editable: true,
    },
    {
      header: '검사구UUID',
      name: 'insp_tool_uuid',
      width: ENUM_WIDTH.M,
      hidden: true,
    },
    {
      header: '검사구',
      name: 'insp_tool_nm',
      width: ENUM_WIDTH.M,
      format: 'popup',
      filter: 'text',
      editable: true,
    },
    {
      header: '시료수',
      name: 'worker_sample_cnt',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: !workerInspFg,
    },
    {
      header: '검사주기',
      name: 'worker_insp_cycle',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: !workerInspFg,
    },
    {
      header: '시료수',
      name: 'inspector_sample_cnt',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: !inspectorInspFg,
    },
    {
      header: '검사주기',
      name: 'inspector_insp_cycle',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: !inspectorInspFg,
    },
    { header: '비고', name: 'remark', width: ENUM_WIDTH.L, filter: 'text' },
  ];

  const newDataPopupGridColumns: IGridColumn[] = cloneDeep(
    deatilSubGridColumns,
  )?.map(el => {
    if (['insp_item_type_nm', 'insp_item_nm'].includes(el?.name) == false) {
      el['editable'] = true;
    }
    return el;
  });

  const detailSubGridComplexColumns: OptComplexColumnInfo[] = [
    {
      header: '작업자',
      name: '_group_worker',
      childNames: ['worker_sample_cnt', 'worker_insp_cycle'],
    },
    {
      header: '검사원',
      name: '_group_inspector',
      childNames: ['inspector_sample_cnt', 'inspector_insp_cycle'],
    },
  ];

  const headerGrid = useGrid('HEADER_GRID', headerGridColumns, {
    searchUriPath: headerSearchUriPath,
    searchParams: {
      use_fg: true,
    },
    saveUriPath: null,
    gridMode: headerDefaultGridMode,
  });

  const detailGrid = useGrid('DETAIL_GRID', detailGridColumns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridMode: detailDefaultGridMode,
  });

  const detailSubGrid = useGrid('DETAIL_SUB_GRID', deatilSubGridColumns, {
    searchUriPath: detailSubSearchUriPath,
    saveUriPath: detailSubSaveUriPath,
    gridMode: detailDefaultGridMode,
    header: { complexColumns: detailSubGridComplexColumns },
  });

  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    newDataPopupGridColumns,
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      saveParams: { apply_fg: true },
      header: detailSubGrid?.gridInfo?.header,
      rowAddPopupInfo: {
        columnNames: [
          { original: 'insp_item_type_uuid', popup: 'insp_item_type_uuid' },
          { original: 'insp_item_type_nm', popup: 'insp_item_type_nm' },
          { original: 'insp_item_uuid', popup: 'insp_item_uuid' },
          { original: 'insp_item_nm', popup: 'insp_item_nm' },
        ],
        columns: INSP_POPUP?.datagridProps?.columns,
        dataApiSettings: {
          uriPath: INSP_POPUP?.uriPath,
          params: { type: 'qms' },
        },
        gridMode: 'multi-select',
      },
      gridPopupInfo: [
        {
          //검사방법관리
          columnNames: [
            { original: 'insp_method_uuid', popup: 'insp_method_uuid' },
            { original: 'insp_method_nm', popup: 'insp_method_nm' },
          ],
          popupKey: '검사방법관리',
          gridMode: 'select',
        },
        {
          //검사구관리
          columnNames: [
            { original: 'insp_tool_uuid', popup: 'insp_tool_uuid' },
            { original: 'insp_tool_nm', popup: 'insp_tool_nm' },
          ],
          popupKey: '검사구관리',
          gridMode: 'select',
        },
      ],
    },
  );

  const addDataPopupGrid = useGrid(
    'ADD_DATA_POPUP_GRID',
    newDataPopupGridColumns,
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      header: detailSubGrid?.gridInfo?.header,
      rowAddPopupInfo: newDataPopupGrid?.gridInfo?.rowAddPopupInfo,
      gridPopupInfo: newDataPopupGrid?.gridInfo?.gridPopupInfo,
    },
  );

  const editDataPopupGrid = useGrid(
    'EDIT_DATA_POPUP_GRID',
    newDataPopupGridColumns,
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      header: detailSubGrid?.gridInfo?.header,
      rowAddPopupInfo: newDataPopupGrid?.gridInfo?.rowAddPopupInfo,
      gridPopupInfo: newDataPopupGrid?.gridInfo?.gridPopupInfo,
    },
  );

  const amendDataPopupGrid = useGrid(
    'AMEND_DATA_POPUP_GRID',
    [
      {
        header: '행 삭제',
        name: 'delete_row',
        width: ENUM_WIDTH.S,
        format: 'check',
        editable: true,
      },
      ...newDataPopupGridColumns,
    ],
    {
      searchUriPath: detailSearchUriPath,
      saveUriPath: detailSaveUriPath,
      header: detailSubGrid?.gridInfo?.header,
      rowAddPopupInfo: newDataPopupGrid?.gridInfo?.rowAddPopupInfo,
      gridPopupInfo: newDataPopupGrid?.gridInfo?.gridPopupInfo,
    },
  );

  const detailInputInfoItems: IInputGroupboxItem[] = [
    {
      type: 'text',
      id: 'prod_uuid',
      label: '품목UUID',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'prod_no',
      label: '품번',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'prod_nm',
      label: '품명',
      disabled: true,
      hidden: true,
    },
    {
      type: 'text',
      id: 'prod_std',
      label: '규격',
      disabled: true,
      hidden: true,
    },
  ];

  const detailInputInfo = useInputGroup(
    'DETAIL_INPUTBOX',
    detailInputInfoItems,
  );

  const detailSubInputInfo = useInputGroup('DETAIL_SUB_INPUTBOX', []);

  const newDataPopupInputInfo = useInputGroup('NEW_DATA_POPUP_INPUTBOX', []);

  const addDataPopupInputInfo = useInputGroup('ADD_DATA_POPUP_INPUTBOX', []);

  const editDataPopupInputInfo = useInputGroup('EDIT_DATA_POPUP_INPUTBOX', []);

  const amendDataPopupInputInfo = useInputGroup(
    'AMEND_DATA_POPUP_INPUTBOX',
    [],
  );

  useLayoutEffect(() => {
    const _inspType: object[] = [];
    getData({}, URL_PATH_ADM.INSP_TYPE.GET.INSP_TYPES, 'raws').then(
      async res => {
        res.forEach(item => {
          _inspType.push({
            code: JSON.stringify({
              insp_type_uuid: item.insp_type_uuid,
              insp_type_cd: item.insp_type_cd,
            }),
            text: item.insp_type_nm,
          });
        });
        setInspType(_inspType);
      },
    );
  }, []);

  useLayoutEffect(() => {
    detailSubGrid.setGridColumns(deatilSubGridColumns);
  }, [inspectorInspFg, workerInspFg]);

  useLayoutEffect(() => {
    newDataPopupGrid.setGridColumns(newDataPopupGridColumns);
  }, [newDataPopupInputInfo?.values?.insp_type]);

  useLayoutEffect(() => {
    addDataPopupGrid.setGridColumns(newDataPopupGridColumns);
  }, [addDataPopupInputInfo?.values?.insp_type]);

  useLayoutEffect(() => {
    editDataPopupGrid.setGridColumns(newDataPopupGridColumns);
  }, [editDataPopupInputInfo?.values?.insp_type]);

  useLayoutEffect(() => {
    amendDataPopupGrid.setGridColumns([
      {
        header: '행 삭제',
        name: 'delete_row',
        width: ENUM_WIDTH.S,
        format: 'check',
        editable: true,
      },
      ...cloneDeep(newDataPopupGridColumns),
    ]);
  }, [amendDataPopupInputInfo?.values?.insp_type]);

  useLayoutEffect(() => {
    if (!inspType) return;

    let _defaultInspType: string;

    if (inspType.length > 0) {
      _defaultInspType = inspType[0].code;
    }

    const prodApiSettings = ev => {
      const values = ev?.values;
      const params = {};

      if (!values.insp_type) {
        return {
          onInterlock: () => {
            message.warning('기준서 유형을 먼저 선택해주세요.');
            return false;
          },
        };
      }

      if (typeof values.insp_type !== 'string') {
        consoleLogLocalEnv(
          `%c기준서 유형의 자료 형이 문자열이 아님! 기준서 유형 값 : ${values.insp_type}`,
          'color: red; font-size: 20px;',
        );
        return {
          onInterlock: () => {
            message.warning('팝업을 호출하던 중 에러가 발생했습니다.');
            return false;
          },
        };
      } else {
        if (
          values.insp_type.substr(0, 1) === '{' &&
          values.insp_type.substr(
            values.insp_type.length - 1,
            values.insp_type.length,
          ) === '}'
        ) {
          try {
            const _inspType: { insp_type_cd } = JSON.parse(
              values?.['insp_type'] ?? '{}',
            );
            if (_inspType?.insp_type_cd === 'RECEIVE_INSP') {
              params['qms_receive_insp_fg'] = true;
            } else if (_inspType.insp_type_cd === 'PROC_INSP') {
              params['qms_proc_insp_fg'] = true;
            } else if (_inspType.insp_type_cd === 'FINAL_INSP') {
              params['qms_final_insp_fg'] = true;
            }
          } catch (error) {
            consoleLogLocalEnv(
              `%c기준서 유형의 자료를 json 형식으로 변환하는 과정에서 error가 발생함! 기준서 유형 값 : ${values.insp_type}`,
              'color: red; font-size: 20px;',
            );
            return {
              onInterlock: () => {
                message.warning('팝업을 호출하던 중 에러가 발생했습니다.');
                return false;
              },
            };
          }
        } else {
          consoleLogLocalEnv(
            `%c이 기준서 유형의 json 형식으로 변환하기 위한 블록 구조가 아님! 기준서 유형 값 : ${values.insp_type}`,
            'color: red; font-size: 20px;',
          );
          return {
            onInterlock: () => {
              message.warning('팝업을 호출하던 중 에러가 발생했습니다.');
              return false;
            },
          };
        }
      }

      return {
        uriPath: PROD_POPUP.uriPath,
        params: params,
      };
    };

    const prodPopupButtonSettings = {
      dataApiSettings: prodApiSettings,
      datagridSettings: PROD_POPUP.datagridProps,
      modalSettings: {
        title: '품목관리',
      },
    };

    const _originSearchItems: ISearchItem[] = [
      {
        type: 'combo',
        id: 'insp_type',
        label: '기준서 유형',
        firstItemType: 'none',
        options: inspType,
        default: _defaultInspType,
        onAfterChange: handleAfterChangeInspType,
      },
    ];

    headerSearchInfo.setSearchItems(_originSearchItems);
    if (headerSearchInfo?.setValues) {
      const value = { insp_type: _defaultInspType };
      handleAfterChangeInspType(JSON.stringify(value));
      headerSearchInfo?.setValues(value);
    }

    const _originInputItems: IInputGroupboxItem[] = [
      {
        type: 'combo',
        id: 'insp_type',
        label: '기준서 유형',
        disabled: true,
        firstItemType: 'none',
        options: inspType,
      },
      {
        type: 'text',
        id: 'insp_uuid',
        alias: 'uuid',
        label: '검사기준서UUID',
        disabled: true,
        hidden: true,
      },
      {
        type: 'text',
        id: 'prod_uuid',
        label: '품목UUID',
        disabled: true,
        hidden: true,
      },
      {
        type: 'text',
        id: 'prod_no',
        label: '품번',
        disabled: true,
        usePopup: true,
        popupKeys: ['prod_uuid', 'prod_no', 'prod_nm'],
        popupButtonSettings: prodPopupButtonSettings,
      },
      {
        type: 'text',
        id: 'prod_nm',
        label: '품명',
        disabled: true,
        usePopup: true,
        // popupKey: '품목관리',
        popupKeys: ['prod_uuid', 'prod_no', 'prod_nm'],
        popupButtonSettings: prodPopupButtonSettings,
      },
      { type: 'text', id: 'insp_no', label: '기준서 번호', disabled: true },
      { type: 'date', id: 'reg_date', label: '생성일자', disabled: true },
      { type: 'text', id: 'contents', label: '개정내역', disabled: true },
      { type: 'text', id: 'remark', label: '비고', disabled: true },
      {
        type: 'text',
        id: 'apply_fg',
        label: '적용여부',
        disabled: true,
        hidden: true,
      },
    ];

    detailSubInputInfo.setInputItems(_originInputItems);

    newDataPopupInputInfo.setInputItems(
      cloneDeep(_originInputItems)?.map(el => {
        if (!['insp_no'].includes(el?.id)) {
          el['disabled'] = false;
        }
        if (['apply_fg'].includes(el?.id)) {
          el['default'] = true;
        }

        if (el.id === 'reg_date') {
          el['default'] = getToday();
        }
        if (el.id === 'insp_type') {
          el['onAfterChange'] = ev => {
            const _inspType = JSON.parse(ev);
            newDataPopupInputInfo.setFieldValue(
              'insp_type_uuid',
              _inspType.insp_type_uuid,
            );
            newDataPopupInputInfo.setFieldValue(
              'insp_type_cd',
              _inspType.insp_type_cd,
            );
            newDataPopupGrid.setGridColumns(
              cloneDeep(newDataPopupGridColumns).map(el => {
                if (
                  el.name === 'worker_sample_cnt' ||
                  el.name === 'worker_insp_cycle'
                ) {
                  el['hidden'] = _inspType.insp_type_cd !== 'PROC_INSP';
                }
                if (
                  el.name === 'inspector_sample_cnt' ||
                  el.name === 'inspector_insp_cycle'
                ) {
                  el['hidden'] = false;
                }
                return el;
              }),
            );
          };
        }
        return el;
      }),
    );

    addDataPopupInputInfo.setInputItems(
      cloneDeep(_originInputItems)?.map(el => {
        if (['contents', 'remark'].includes(el?.id)) el['disabled'] = false;
        return el;
      }),
    );

    editDataPopupInputInfo.setInputItems(
      cloneDeep(_originInputItems)?.map(el => {
        if (['contents', 'remark'].includes(el?.id)) el['disabled'] = false;
        return el;
      }),
    );

    amendDataPopupInputInfo.setInputItems(
      cloneDeep(_originInputItems)?.map(el => {
        if (['reg_date', 'contents', 'remark'].includes(el?.id))
          el['disabled'] = false;
        return el;
      }),
    );
  }, [inspType]);

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
      addDataPopupInputInfo?.setValues(cloneDeep(detailSubInputInfo?.values));
    } else {
      addDataPopupInputInfo?.setValues({});
    }
  }, [addDataPopupGridVisible, detailSubInputInfo?.values]);

  useLayoutEffect(() => {
    if (editDataPopupGridVisible === true) {
      // ❗ 수정 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      const inputInfoValues = cloneDeep(detailSubInputInfo?.values);
      editDataPopupInputInfo?.setValues(inputInfoValues);
      editDataPopupGrid?.setGridData(detailSubGrid?.gridInfo?.data);
    } else {
      editDataPopupInputInfo?.setValues({});
      editDataPopupGrid?.setGridData([]);
    }
  }, [
    editDataPopupGridVisible,
    detailSubInputInfo.values,
    detailSubGrid.gridInfo.data,
  ]);

  useLayoutEffect(() => {
    if (amendDataPopupGridVisible === true) {
      // ❗ 개정 팝업이 켜진 후, detailInfo 데이터를 삽입합니다.
      // 개정 팝업 시 생성일자 항목을 오늘 날짜로 변경
      const inputInfoValues = cloneDeep(detailSubInputInfo?.values);
      inputInfoValues.reg_date = getToday();
      amendDataPopupInputInfo?.setValues(inputInfoValues);
      amendDataPopupGrid?.setGridData(detailSubGrid?.gridInfo?.data);
    } else {
      amendDataPopupInputInfo?.setValues({});
      amendDataPopupGrid?.setGridData([]);
    }
  }, [
    amendDataPopupGridVisible,
    detailSubInputInfo.values,
    detailSubGrid.gridInfo.data,
  ]);

  const buttonActions = {
    /** 조회 */
    search: () => {
      handleSearchHeader(headerSearchInfo?.values);
    },

    /** 수정 */
    update: () => {
      if (!handleCheckUuid()) return;
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: ev => {
      if (
        getModifiedRows(
          detailSubGrid?.gridRef,
          detailSubGrid?.gridInfo?.columns,
        )?.deletedRows?.length === 0
      ) {
        message.warn('편집된 데이터가 없습니다.');
        return;
      }
      handleSave();
    },

    /** 신규 추가 */
    create: () => {
      setNewDataPopupGridVisible(true);
    },

    /** 상세 신규 추가 */
    createDetail: () => {
      if (!handleCheckUuid()) return;
      setAddDataPopupGridVisible(true);
    },

    /** 저장(수정, 삭제) */
    save: () => {
      handleSave();
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
            // this function will be called when user press ok
          },
          onCancel: () => {
            // this function will be called when user press cancel
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
  const QMS_INSP_EXTRA_POPUP: IGridPopupProps = {
    ...amendDataPopupGrid?.gridInfo,
    title: '검사기준서 관리 - 개정',
    gridId: 'EXTRA_GRID_QMS_INSP',
    popupId: 'EXTRA_GRID_QMS_INSP_POPUP',
    columns: amendDataPopupGrid?.gridInfo.columns,
    defaultVisible: false,
    visible: amendDataPopupGridVisible,
    okText: '개정하기',
    onOk: gridRef => handleAmendInsp(gridRef, '개정', 'amend'),
    cancelText: '취소',
    onCancel: () => setAmendDataPopupGridVisible(false),
    ref: amendDataPopupGrid?.gridRef,
    parentGridRef: detailGrid?.gridRef,
    gridMode: 'create',
    defaultData: detailGrid?.gridInfo.data,
    data: amendDataPopupGrid?.gridInfo.data,
    saveType: 'headerInclude',
    searchUriPath: amendDataPopupGrid?.gridInfo.searchUriPath,
    searchParams: amendDataPopupGrid?.gridInfo.searchParams,
    saveUriPath: amendDataPopupGrid?.gridInfo.saveUriPath,
    saveParams: amendDataPopupGrid?.gridInfo.saveParams,
    searchProps: amendDataPopupSearchInfo?.props,
    inputProps: amendDataPopupInputInfo?.props,
    gridComboInfo: amendDataPopupGrid?.gridInfo.gridComboInfo,
    gridPopupInfo: amendDataPopupGrid?.gridInfo.gridPopupInfo,
    rowAddPopupInfo: amendDataPopupGrid?.gridInfo.rowAddPopupInfo,
  };
  // 버튼
  const QMS_INSP_EXTRA_BUTTON: IExtraButton = {
    text: '개정',
    ImageType: 'edit',
    onClick: () => {
      if (handleCheckUuid() === false) return;
      setAmendDataPopupGridVisible(true);
    },
  };

  const extraGridPopups: TExtraGridPopups = [QMS_INSP_EXTRA_POPUP];
  const headerExtraButtons = [QMS_INSP_EXTRA_BUTTON];

  //#region 🔶템플릿에 값 전달
  const props: ITpTripleGridProps = {
    title,
    dataSaveType: 'headerInclude',
    templateOrientation: 'filledLayoutRight',
    gridRefs: [
      headerGrid?.gridRef,
      detailGrid?.gridRef,
      detailSubGrid?.gridRef,
    ],
    gridInfos: [
      {
        ...headerGrid?.gridInfo,
        onAfterClick: handleHeaderClick,
      },
      {
        ...detailGrid?.gridInfo,
        onAfterClick: handleDetailClick,
      },
      detailSubGrid?.gridInfo,
    ],
    popupGridRefs: [
      newDataPopupGrid?.gridRef,
      addDataPopupGrid?.gridRef,
      editDataPopupGrid?.gridRef,
    ],
    popupGridInfos: [
      newDataPopupGrid?.gridInfo,
      {
        ...addDataPopupGrid?.gridInfo,
        saveParams: {
          p_prod_uuid: addDataPopupInputInfo?.values?.prod_uuid,
        },
        footer: popupFooter(),
      },
      {
        ...editDataPopupGrid?.gridInfo,
        footer: popupFooter(),
      },
    ],
    searchProps: [
      {
        ...headerSearchInfo?.props,
        onSearch: values => handleSearchHeader(values),
      },
      {
        ...detailSearchInfo?.props,
      },
      {
        ...detailSubSearchInfo?.props,
      },
    ],
    inputProps: [null, detailInputInfo?.props, detailSubInputInfo?.props],
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

    onAfterOkNewDataPopup: handleAfterSaveNewData,
    onAfterOkEditDataPopup: handleAfterSaveEditData,
    onAfterOkAddDataPopup: handleAfterSaveAddData,

    btnProps: {
      create: {
        text: '신규 기준서 등록',
      },
      edit: {
        text: '수정',
        widthSize: 'auto',
      },
    },
    headerExtraButtons,
    extraGridPopups,
  };
  //#endregion

  return <TpTripleGrid {...props} />;
};
