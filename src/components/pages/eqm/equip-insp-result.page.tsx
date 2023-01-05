import { message } from 'antd';
import { Modal } from 'antd';
import React, { useLayoutEffect, useState } from 'react';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import {
  EDIT_ACTION_CODE,
  TGridMode,
  useGrid,
  useSearchbox,
} from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { URL_PATH_EQM } from '~/enums';
import {
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
} from '~/functions';
import eqmInspResultColumns from './insp/result/eqm-insp-result-columns';
import eqmInspResultGridComboboxes from './insp/result/eqm-insp-result-grid-comboboxes';
import eqmInspResultGridPopups from './insp/result/eqm-insp-result-grid-popups';
import eqmInspResultSearchboxes from './insp/result/eqm-insp-result-searchboxes';
import eqmInspResultEditModalColumns from './insp/result/modal/eqm-insp-result-edit-modal-columns';
import eqmInspResultNewModalColumns from './insp/result/modal/eqm-insp-result-new-modal-columns';
import eqmInspResultNewModalInputboxes from './insp/result/modal/eqm-insp-result-new-modal-inputboxes';

export const PgEqmInspResult = () => {
  const title = getPageName();

  const [modal, modalContext] = Modal.useModal();

  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = URL_PATH_EQM.INSP_RESULT.GET.INSP_RESULTS;
  const saveUriPath = URL_PATH_EQM.INSP_RESULT.POST.INSP_RESULTS;

  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);

  const grid = useGrid('GRID', eqmInspResultColumns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    gridMode: defaultGridMode,
    gridPopupInfo: eqmInspResultGridPopups,
    gridComboInfo: eqmInspResultGridComboboxes,
  });

  const [newDataSaveParams, setNewDataSaveParams] = useState();

  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    eqmInspResultNewModalColumns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: eqmInspResultGridPopups,
      gridComboInfo: eqmInspResultGridComboboxes,
      saveParams: newDataSaveParams,
      hiddenActionButtons: true,
    },
  );

  const editDataPopupGrid = useGrid(
    'EDIT_POPUP_GRID',
    eqmInspResultEditModalColumns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridPopupInfo: eqmInspResultGridPopups,
      gridComboInfo: eqmInspResultGridComboboxes,
      hiddenActionButtons: true,
    },
  );

  const searchInfo = useSearchbox('SEARCH_INPUTBOX', eqmInspResultSearchboxes);

  const inputInfo = null;
  const newDataPopupInputInfo = useInputGroup(
    'EDOT_DATA_POPUP_INPUT_BOX',
    eqmInspResultNewModalInputboxes,
  );

  const changeNewDataPopupInputValues = async values => {
    if (values == null) return;
    if (values.equip_uuid == null) return;
    if (values.insp_type == null) return;

    const data = (await getData(
      values,
      '/eqm/insps/include-details-by-equip',
      'header-details',
    )) as { details?: any[] };

    const details = data?.details.map(row => ({
      ...row,
      _edit: EDIT_ACTION_CODE.CREATE,
    }));

    newDataPopupGrid?.setGridData(details);
  };

  useLayoutEffect(() => {
    setNewDataSaveParams(newDataPopupInputInfo.values);
    changeNewDataPopupInputValues(newDataPopupInputInfo.values);
  }, [newDataPopupInputInfo.values]);

  const onSearch = values => {
    const searchParams = { ...values };

    if (searchParams.equip_uuid === 'all') {
      searchParams.equip_uuid = null;
    }

    getData(searchParams, searchUriPath).then(res => {
      inputInfo?.instance?.resetForm();
      grid.setGridData(res);
    });
  };

  const onSave = () => {
    const { gridRef, setGridMode } = grid;
    const { columns, saveUriPath } = grid.gridInfo;

    dataGridEvents.onSave(
      'basic',
      {
        gridRef,
        setGridMode,
        columns,
        saveUriPath,
        defaultGridMode,
      },
      inputInfo?.values,
      modal,
      () => onSearch(searchInfo?.values),
    );
  };

  const buttonActions = {
    search: () => {
      onSearch(searchInfo?.values);
    },

    update: () => {
      setEditDataPopupGridVisible(true);
    },

    delete: () => {
      const { deletedRows } = getModifiedRows(
        grid.gridRef,
        grid.gridInfo.columns,
      );

      if (deletedRows?.length === 0) {
        message.warn('편집된 데이터가 없습니다.');
        return;
      }
      onSave();
    },

    create: () => {
      newDataPopupInputInfo?.instance?.resetForm();
      newDataPopupGrid?.setGridData([]);
      setNewDataPopupGridVisible(true);
    },

    save: () => {
      onSave();
    },

    cancelEdit: () => {
      const { gridRef, setGridMode } = grid;
      const { columns } = grid.gridInfo;
      dataGridEvents.onCancel(gridRef, setGridMode, columns, modal);
    },

    printExcel: dataGridEvents.printExcel,
  };

  const props: ITpSingleGridProps = {
    title,
    dataSaveType: 'basic',
    gridRef: grid.gridRef,
    gridInfo: grid.gridInfo,
    searchProps: {
      ...searchInfo?.props,
      onSearch,
    },
    inputProps: null,

    popupGridRef: [newDataPopupGrid.gridRef, editDataPopupGrid.gridRef],
    popupGridInfo: [newDataPopupGrid.gridInfo, editDataPopupGrid.gridInfo],
    popupVisible: [newDataPopupGridVisible, editDataPopupGridVisible],
    setPopupVisible: [setNewDataPopupGridVisible, setEditDataPopupGridVisible],
    popupInputProps: [newDataPopupInputInfo?.props],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props} />;
};
