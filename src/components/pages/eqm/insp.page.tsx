import { message, Modal } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useLayoutEffect, useState } from 'react';
import { Button, useGrid, useSearchbox } from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { URL_PATH_EQM, URL_PATH_STD } from '~/enums';
import {
  cleanupKeyOfObject,
  dataGridEvents,
  executeData,
  getData,
  getModifiedRows,
  getPageName,
  isModified,
  onAsyncFunction,
} from '~/functions';
import { EqmInspDetail } from './insp/detail/eqm-insp-detail';
import eqmInspDetailColumns from './insp/detail/eqm-insp-detail-columns';
import eqmInspDetailInputboxes from './insp/detail/eqm-insp-detail-inputboxes';
import { EqmInspDetailSub } from './insp/detail/sub/eqm-insp-detail-sub';
import eqmInspDetailSubColumns from './insp/detail/sub/eqm-insp-detail-sub-columns';
import eqmInspDetailSubInputboxes from './insp/detail/sub/eqm-insp-detail-sub-inputboxes';
import { EqmInspHeader } from './insp/header/eqm-insp-header';
import eqmInspHeaderColumns from './insp/header/eqm-insp-header-columns';
import eqmInspDetailSubModalInputboxes from './insp/modal/eqm-insp-detail-sub-modal-inputboxes';
import eqmInspModalGridComboboxes from './insp/modal/eqm-insp-modal-grid-comboboxes';
import eqmInspModalGridPopups from './insp/modal/eqm-insp-modal-grid-popups';
import eqmInspModalGridRowaddpopups from './insp/modal/eqm-insp-modal-grid-rowaddpopups';
import eqmInspNewModalInputboxes from './insp/modal/eqm-insp-new-modal-inputboxes';
import { EquipInspDetailEditModal } from './insp/modal/equip-insp-detail-edit-modal';
import { EquipInspDetailNewModal } from './insp/modal/equip-insp-detail-new-modal';
import { EquipInspNewModal } from './insp/modal/equip-insp-new-modal';

type TPopup = 'new' | 'add' | 'edit' | null;

export const PgEqmInsp = () => {
  const title = getPageName();

  const [modal, modalContext] = Modal.useModal();

  const headerSearchUriPath = URL_PATH_STD.EQUIP.GET.EQUIPS;

  const detailSearchUriPath = URL_PATH_EQM.INSP.GET.INSPS;
  const detailSaveUriPath = URL_PATH_EQM.INSP.POST.INSPS;

  const detailSubSearchUriPath = URL_PATH_EQM.INSP.GET.DETAILS;

  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [addDataPopupGridVisible, setAddDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  const [selectedHeaderRow, setSelectedHeaderRow] = useState(null);
  const [selectedDetailRow, setSelectedDetailRow] = useState(null);
  const [, setEditInspNo] = useState(null);

  const [applyFg, setApplyFg] = useState(false);

  const onApplyInsp = (ev, props) => {
    const { value, rowKey, grid } = props;
    const row = grid?.getRow(rowKey);

    const applyUriPath = URL_PATH_EQM.INSP.PUT.APPLY;
    const cancelApplyUriPath = URL_PATH_EQM.INSP.PUT.CANCEL_APPLY;
    const uuid = row?.insp_uuid;

    if (!uuid) {
      message.error('기준서 ' + (value ? '해제' : '적용') + ' 실패');
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
          '기준서가 ' + (value ? '해제' : '적용') + '되었습니다.',
        );

        await onReset();
        setApplyFg(true);
      } else {
        // this is a fail case
      }
    });
  };

  const eqmInspDetailColumnsWithApply = eqmInspDetailColumns.map(
    detailColumn => {
      if (detailColumn.name === 'apply_fg') {
        return {
          ...detailColumn,
          options: {
            ...detailColumn.options,
            onClick: onApplyInsp,
          },
        };
      }
      return detailColumn;
    },
  );

  const onAfterSaveApply = async () => {
    const headerRow = await cloneDeep(selectedHeaderRow);
    const detailRow = await cloneDeep(selectedDetailRow);

    onSearchHeader(headerSearchInfo?.values)
      .then(res => {
        onAsyncFunction(onClickHeader, {
          targetType: 'cell',
          rowKey: headerRow?.rowKey || 0,
          instance: headerGrid.gridRef.current.getInstance(),
        });
      })
      .finally(() => {
        setSelectedHeaderRow(headerRow);
        setSelectedDetailRow(detailRow);
      });
  };

  useLayoutEffect(() => {
    if (!applyFg) return;

    onAfterSaveApply();
    setApplyFg(false);
  }, [applyFg]);

  const headerGrid = useGrid('HEADER_GRID', eqmInspHeaderColumns, {
    searchUriPath: headerSearchUriPath,
    searchParams: {
      use_fg: true,
    },
    saveUriPath: null,
    gridMode: 'view',
  });

  const detailGrid = useGrid('DETAIL_GRID', eqmInspDetailColumnsWithApply, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    gridMode: 'delete',
  });

  const detailSubGrid = useGrid('DETAIL_SUB_GRID', eqmInspDetailSubColumns, {
    searchUriPath: detailSubSearchUriPath,
    saveUriPath: URL_PATH_EQM.INSP.POST.INSPS,
    gridMode: 'delete',
  });

  const dataPopupColumns = eqmInspDetailSubColumns.map(el => {
    if (['insp_item_type_nm', 'insp_item_nm'].includes(el?.name) === false) {
      el['editable'] = true;
    }
    return el;
  });

  const newDataPopupGrid = useGrid('NEW_DATA_POPUP_GRID', dataPopupColumns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    saveParams: { apply_fg: true },
    header: detailSubGrid?.gridInfo?.header,
    gridComboInfo: eqmInspModalGridComboboxes,
    rowAddPopupInfo: eqmInspModalGridRowaddpopups,
    gridPopupInfo: eqmInspModalGridPopups,
  });

  const addDataPopupGrid = useGrid('ADD_DATA_POPUP_GRID', dataPopupColumns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    header: detailSubGrid?.gridInfo?.header,
    gridComboInfo: eqmInspModalGridComboboxes,
    rowAddPopupInfo: eqmInspModalGridRowaddpopups,
    gridPopupInfo: eqmInspModalGridPopups,
  });

  const editDataPopupGrid = useGrid('EDIT_DATA_POPUP_GRID', dataPopupColumns, {
    searchUriPath: detailSearchUriPath,
    saveUriPath: detailSaveUriPath,
    header: detailSubGrid?.gridInfo?.header,
    gridComboInfo: eqmInspModalGridComboboxes,
    rowAddPopupInfo: eqmInspModalGridRowaddpopups,
    gridPopupInfo: eqmInspModalGridPopups,
  });

  const onClickHeader = ({ targetType, rowKey, instance, ...rest }) => {
    if (targetType !== 'cell') return;

    setSelectedHeaderRow(instance?.getRow(rowKey));
  };

  const onClickDetail = ({
    targetType,
    rowKey,
    instance,
    columnName,
    ...rest
  }) => {
    if (columnName === 'apply_fg') return;
    if (targetType !== 'cell') return;

    setSelectedDetailRow(instance?.getRow(rowKey));
  };

  const reloadDetailGrid = async uuid => {
    if (!uuid) return;

    const uriPath = detailSearchUriPath;
    getData({ equip_uuid: uuid }, uriPath, 'raws').then(async res => {
      detailGrid.setGridData(res || []);

      if (res?.length > 0) {
        if (selectedDetailRow?.insp_uuid === res[0]?.insp_uuid) {
          await onAsyncFunction(setSelectedDetailRow, null);
        }
        setSelectedDetailRow(res[0]);
      } else {
        detailSubInputInfo?.setValues({});
        detailSubGrid?.setGridData([]);
      }
    });
  };

  const reloadDetailSubGrid = async uuid => {
    if (!uuid) {
      detailSubGrid.setGridData([]);
      return;
    }

    const uriPath = detailSubSearchUriPath?.replace('{uuid}', uuid);

    getData({ insp_type: 'all' }, uriPath, 'raws').then(res => {
      detailSubGrid.setGridData(res || []);
    });
  };

  const headerSearchInfo = useSearchbox('HEADER_SEARCH_INPUTBOX', []);

  const newDataPopupSearchInfo = null;
  const addDataPopupSearchInfo = null;
  const editDataPopupSearchInfo = null;

  const onSearchHeader = async values => {
    const searchParams: any = cleanupKeyOfObject(
      values,
      headerSearchInfo?.searchItemKeys,
    );

    let data = [];
    await getData(
      {
        ...searchParams,
        use_fg: true,
      },
      headerSearchUriPath,
    )
      .then(res => {
        data = res;
      })
      .finally(async () => {
        await onReset();
        headerGrid.setGridData(data);
      });

    return data;
  };

  const onSearchDetail = async uuid => {
    if (uuid == null) return;
    reloadDetailGrid(uuid);
  };

  const onSearchDetailSub = uuid => {
    if (uuid == null) return;
    reloadDetailSubGrid(uuid);
  };

  const detailInputInfo = useInputGroup(
    'DETAIL_INPUTBOX',
    eqmInspDetailInputboxes,
  );

  const detailSubInputInfo = useInputGroup(
    'DETAIL_SUB_INPUTBOX',
    eqmInspDetailSubInputboxes,
  );

  const newDataPopupInputInfo = useInputGroup(
    'NEW_DATA_POPUP_INPUTBOX',
    eqmInspNewModalInputboxes,
  );
  const addDataPopupInputInfo = useInputGroup(
    'ADD_DATA_POPUP_INPUTBOX',
    eqmInspDetailSubModalInputboxes,
  );
  const editDataPopupInputInfo = useInputGroup(
    'EDIT_DATA_POPUP_INPUTBOX',
    eqmInspDetailSubModalInputboxes,
  );

  const onReset = async () => {
    headerGrid?.setGridData([]);
    detailGrid?.setGridData([]);
    detailSubGrid?.setGridData([]);
    detailInputInfo?.setValues({});
    detailSubInputInfo?.setValues({});
  };

  useLayoutEffect(() => {
    if (selectedHeaderRow == null) return;
    detailInputInfo.setValues(selectedHeaderRow);
    onSearchDetail(selectedHeaderRow?.equip_uuid);
  }, [selectedHeaderRow]);

  useLayoutEffect(() => {
    if (selectedDetailRow == null) return;
    detailSubInputInfo.setValues(selectedDetailRow);
    onSearchDetailSub(selectedDetailRow?.insp_uuid);
  }, [selectedDetailRow]);

  useLayoutEffect(() => {
    if (newDataPopupGridVisible === true) {
      // 신규 등록 팝업 나타났을 때 기능 추가할 것
    } else {
      newDataPopupInputInfo?.instance?.resetForm();
    }
  }, [newDataPopupGridVisible]);

  useLayoutEffect(() => {
    if (addDataPopupGridVisible === true) {
      addDataPopupInputInfo?.setValues({
        ...detailSubInputInfo.ref.current.values,
      });
    } else {
      addDataPopupInputInfo?.setValues({});
    }
  }, [addDataPopupGridVisible, detailSubInputInfo?.values]);

  useLayoutEffect(() => {
    if (editDataPopupGridVisible === true) {
      editDataPopupInputInfo?.setValues({
        ...detailSubInputInfo.ref.current.values,
      });
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

  const onSave = () => {
    const { gridRef, setGridMode } = detailSubGrid;
    const { columns, saveUriPath } = detailSubGrid?.gridInfo;

    if (
      !detailSubInputInfo.isModified &&
      !isModified(detailSubGrid?.gridRef, detailSubGrid?.gridInfo?.columns)
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
      detailSubInputInfo.props.innerRef.current.values,
      modal,
      async res => {
        const headerRow = cloneDeep(selectedHeaderRow);
        const detailRow = cloneDeep(selectedDetailRow);

        await onReset();
        onSearchHeader(headerSearchInfo?.values).then(async searchResult => {
          await onAfterSaveAction(
            searchResult,
            headerRow?.equip_uuid,
            detailRow?.insp_uuid,
          );
        });
      },
      true,
    );
  };

  const onCheckUuid = (): boolean => {
    if (detailSubInputInfo?.values?.insp_uuid == null) {
      message.warn('기준서를 선택하신 후 다시 시도해 주세요.');
      return false;
    }
    return true;
  };

  const buttonActions = {
    search: () => {
      onSearchHeader(headerSearchInfo?.values);
    },

    update: () => {
      if (!onCheckUuid()) return;
      setEditInspNo(detailSubInputInfo?.values?.insp_no);
      setEditDataPopupGridVisible(true);
    },

    delete: () => {
      if (
        getModifiedRows(
          detailSubGrid?.gridRef,
          detailSubGrid?.gridInfo?.columns,
        )?.deletedRows?.length === 0
      ) {
        message.warn('편집된 데이터가 없습니다.');
        return;
      }
      onSave();
    },

    create: () => {
      setNewDataPopupGridVisible(true);
    },

    createDetail: () => {
      if (!onCheckUuid()) return;
      setAddDataPopupGridVisible(true);
    },

    save: () => {
      onSave();
    },

    cancelEdit: () => {
      const { gridRef, setGridMode } = detailGrid;
      const { columns } = detailGrid.gridInfo;

      if (detailInputInfo.isModified || isModified(gridRef, columns)) {
        modal.confirm({
          title: '편집 취소',
          content: '편집된 이력이 있습니다. 편집을 취소하시겠습니까?',
          onOk: () => {
            detailInputInfo.setValues(selectedHeaderRow);
            setGridMode('view');
          },
          onCancel: () => {
            // this function will not be executed
          },
          okText: '예',
          cancelText: '아니오',
        });
      } else {
        setGridMode('view');
      }
    },

    printExcel: dataGridEvents.printExcel,

    cancelNewDataPopup: () => {
      setNewDataPopupGridVisible(false);
    },
  };

  const onAfterSaveNewData = async (isSuccess, savedData?) => {
    if (!isSuccess) return;

    await onReset();
    const headerRow = newDataPopupInputInfo?.values;

    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(searchResult, headerRow?.qeuip_uuid, null);
    });
    setNewDataPopupGridVisible(false);
  };

  const onAfterSaveAddData = async (isSuccess, savedData?) => {
    if (!isSuccess) return;

    await onReset();
    const headerRow = cloneDeep(selectedHeaderRow);
    const detailRow = cloneDeep(selectedDetailRow);

    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(
        searchResult,
        headerRow?.equip_uuid,
        detailRow?.insp_uuid,
      );
    });
    setAddDataPopupGridVisible(false);
  };

  const onAfterSaveEditData = async (isSuccess, savedData?) => {
    if (!isSuccess) return;

    await onReset();
    const headerRow = cloneDeep(selectedHeaderRow);
    const detailRow = cloneDeep(selectedDetailRow);

    onSearchHeader(headerSearchInfo?.values).then(searchResult => {
      onAfterSaveAction(
        searchResult,
        headerRow?.equip_uuid,
        detailRow?.insp_uuid,
      );
    });
    setEditDataPopupGridVisible(false);
  };

  const onAfterSaveAction = async (searchResult, header_uuid, detail_uuid) => {
    let selectedHeaderRow = searchResult?.find(
      el => el?.equip_uuid === header_uuid,
    );

    if (!selectedHeaderRow) {
      selectedHeaderRow = searchResult[0];
    }
    onAsyncFunction(setSelectedHeaderRow, cloneDeep(selectedHeaderRow)).then(
      () => {
        let selectedDetailRow = searchResult?.find(
          el => el?.insp_uuid === detail_uuid,
        );
        setSelectedDetailRow(selectedDetailRow);
      },
    );
  };

  const onAmendInsp = (type: '개정' | '수정', popupType: TPopup) => {
    const grid =
      popupType === 'add'
        ? addDataPopupGrid
        : popupType === 'edit'
        ? editDataPopupGrid
        : null;

    const inputInfo =
      popupType === 'add'
        ? addDataPopupInputInfo
        : popupType === 'edit'
        ? editDataPopupInputInfo
        : null;

    const setVisible =
      popupType === 'add'
        ? setAddDataPopupGridVisible
        : popupType === 'edit'
        ? setEditDataPopupGridVisible
        : null;

    if (!grid) {
      message.error(
        '기준서 ' + type + '중 문제가 발생했습니다. 관리자에게 문의해주세요.',
      );
    }

    const methodType =
      popupType === 'add' ? 'post' : type === '개정' ? 'post' : 'put';

    const optionSaveParams = cloneDeep(inputInfo?.values);

    let modifiedData: any = {
      createdRows: [],
      updatedRows: [],
      deletedRows: [],
    };

    if (methodType === 'post') {
      modifiedData.createdRows = grid?.gridRef?.current
        ?.getInstance()
        ?.getData();
    } else {
      modifiedData = null;
    }

    dataGridEvents.onSave(
      'headerInclude',
      {
        gridRef: grid?.gridRef,
        setGridMode: null,
        columns: grid?.gridInfo?.columns,
        saveUriPath: grid?.gridInfo?.saveUriPath,
        methodType: methodType,
        modifiedData,
      },
      optionSaveParams,
      modal,
      async ({ success, datas }) => {
        if (success) {
          setVisible(false);

          // 데이터 재조회
          const headerRow = cloneDeep(selectedHeaderRow);
          const detailRow = cloneDeep(selectedDetailRow);

          await onReset();
          onSearchHeader(headerSearchInfo?.values).then(async searchResult => {
            await onAfterSaveAction(
              searchResult,
              headerRow?.equip_uuid,
              detailRow?.insp_uuid,
            );
          });
        }
      },
      true,
    );
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

    if (!setVisible) return null;

    const onCancel = () => {
      setVisible(false);
    };
    const onAmend = () => {
      onAmendInsp('개정', popupType);
    };
    const onEdit = () => {
      onAmendInsp('수정', popupType);
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
          colorType="delete"
          onClick={onAmend}
        >
          개정하기
        </Button>
        <Button
          btnType="buttonFill"
          widthSize="medium"
          heightSize="small"
          fontSize="small"
          colorType="basic"
          onClick={onEdit}
        >
          수정하기
        </Button>
      </div>
    );
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ width: 'Calc(30% - 10px)' }}>
          <EqmInspHeader
            gridRef={headerGrid.gridRef}
            columns={headerGrid.gridInfo.columns}
            data={headerGrid.gridInfo.data}
            gridMode={headerGrid.gridInfo.gridMode}
            onAfterClick={onClickHeader}
            onSearch={buttonActions.search}
            onCreate={buttonActions.create}
          />
          <EqmInspDetail
            inputProps={detailInputInfo.props}
            gridRef={detailGrid.gridRef}
            columns={detailGrid.gridInfo.columns}
            data={detailGrid.gridInfo.data}
            gridMode={detailGrid.gridInfo.gridMode}
            onAfterClick={onClickDetail}
          />
        </div>
        <div style={{ width: '70%' }}>
          <EqmInspDetailSub
            inputProps={detailSubInputInfo.props}
            gridRef={detailSubGrid.gridRef}
            columns={detailSubGrid.gridInfo.columns}
            data={detailSubGrid.gridInfo.data}
            gridMode={detailSubGrid.gridInfo.gridMode}
            onCreateDetail={buttonActions.createDetail}
            onUpdate={buttonActions.update}
            onDelete={buttonActions.delete}
          />
        </div>
      </div>
      <EquipInspNewModal
        gridId={newDataPopupGrid.gridInfo.gridId}
        title={`${title} - 신규 항목 추가`}
        visible={newDataPopupGridVisible}
        onAfterApiExecuted={onAfterSaveNewData}
        onCancel={buttonActions.cancelNewDataPopup}
        modalRef={newDataPopupGrid?.gridRef}
        parentGridRef={headerGrid?.gridRef}
        gridMode="create"
        defaultData={[]}
        columns={newDataPopupGrid.gridInfo.columns}
        searchUriPath={newDataPopupGrid.gridInfo.searchUriPath}
        searchParams={newDataPopupGrid.gridInfo.searchParams}
        saveUriPath={newDataPopupGrid.gridInfo.saveUriPath}
        saveParams={newDataPopupGrid.gridInfo.saveParams}
        searchProps={newDataPopupSearchInfo?.props}
        inputProps={newDataPopupInputInfo.props}
        gridComboInfo={newDataPopupGrid.gridInfo.gridComboInfo}
        gridPopupInfo={newDataPopupGrid.gridInfo.gridPopupInfo}
        rowAddPopupInfo={newDataPopupGrid.gridInfo.rowAddPopupInfo}
      />
      <EquipInspDetailNewModal
        gridId={addDataPopupGrid.gridInfo.gridId}
        title={`${title} -세부 항목 추가`}
        visible={addDataPopupGridVisible}
        onAfterApiExecuted={onAfterSaveAddData}
        onCancel={() => {
          setAddDataPopupGridVisible(false);
        }}
        modalRef={addDataPopupGrid?.gridRef}
        parentGridRef={detailGrid?.gridRef}
        gridMode="create"
        defaultData={[]}
        columns={addDataPopupGrid.gridInfo.columns}
        searchUriPath={addDataPopupGrid.gridInfo.searchUriPath}
        searchParams={addDataPopupGrid.gridInfo.searchParams}
        saveUriPath={addDataPopupGrid.gridInfo.saveUriPath}
        saveParams={{}}
        searchProps={addDataPopupSearchInfo?.props}
        inputProps={addDataPopupInputInfo.props}
        gridComboInfo={addDataPopupGrid.gridInfo.gridComboInfo}
        gridPopupInfo={addDataPopupGrid.gridInfo.gridPopupInfo}
        rowAddPopupInfo={addDataPopupGrid.gridInfo.rowAddPopupInfo}
        popupFooter={popupFooter()}
      />
      <EquipInspDetailEditModal
        gridId={editDataPopupGrid.gridInfo.gridId}
        title={`${title} -수정 / 개정`}
        visible={editDataPopupGridVisible}
        onAfterApiExecuted={onAfterSaveEditData}
        onCancel={() => {
          setEditDataPopupGridVisible(false);
        }}
        modalRef={editDataPopupGrid?.gridRef}
        parentGridRef={detailGrid?.gridRef}
        gridMode="update"
        defaultData={detailSubGrid.gridInfo.data}
        columns={editDataPopupGrid.gridInfo.columns}
        searchUriPath={editDataPopupGrid.gridInfo.searchUriPath}
        searchParams={editDataPopupGrid.gridInfo.searchParams}
        saveUriPath={editDataPopupGrid.gridInfo.saveUriPath}
        saveParams={{}}
        searchProps={editDataPopupSearchInfo?.props}
        inputProps={editDataPopupInputInfo.props}
        gridComboInfo={editDataPopupGrid.gridInfo.gridComboInfo}
        gridPopupInfo={editDataPopupGrid.gridInfo.gridPopupInfo}
        rowAddPopupInfo={editDataPopupGrid.gridInfo.rowAddPopupInfo}
        popupFooter={popupFooter()}
      />
      {modalContext}
    </>
  );
};
