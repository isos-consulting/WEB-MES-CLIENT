import React, { useState } from 'react';
import {
  Datagrid,
  getPopupForm,
  TGridMode,
  useGrid,
  useSearchbox,
} from '~/components/UI';
import {
  dataGridEvents,
  getData,
  getModifiedRows,
  getPageName,
} from '~/functions';
import Modal from 'antd/lib/modal/Modal';
import { TpSingleGrid } from '~/components/templates';
import ITpSingleGridProps from '~/components/templates/grid-single/grid-single.template.type';
import {
  ENUM_DECIMAL,
  ENUM_WIDTH,
  URL_PATH_EQM,
  URL_PATH_PRD,
  URL_PATH_STD,
} from '~/enums';
import { message } from 'antd';
import { cloneDeep } from 'lodash';
import dayjs from 'dayjs';
import { isNil } from '~/helper/common';

/** 설비수리이력관리 */
export const PgEqmRepairHistory = () => {
  /** 페이지 제목 */
  const title = getPageName();

  /** 모달 DOM */
  const [modal, modalContext] = Modal.useModal();

  /** INIT */
  const defaultGridMode: TGridMode = 'delete';
  const searchUriPath = URL_PATH_EQM.REPAIR_HISTORY.GET.REPAIR_HISTORIES;
  const saveUriPath = URL_PATH_EQM.REPAIR_HISTORY.POST.REPAIR_HISTORIES;

  const [newDataPopupGridVisible, setNewDataPopupGridVisible] =
    useState<boolean>(false);
  const [editDataPopupGridVisible, setEditDataPopupGridVisible] =
    useState<boolean>(false);
  /** 그리드 상태를 관리 */
  const grid = useGrid(
    'GRID',
    [
      {
        header: '설비수리이력UUID',
        name: 'repair_history_uuid',
        alias: 'uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '설비UUID',
        name: 'equip_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
        requiredField: true,
      },
      {
        header: '설비',
        name: 'equip_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
        requiredField: true,
      },
      {
        header: '발생시작일',
        name: 'occur_start_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        editable: true,
        requiredField: true,
      },
      {
        header: '발생시작시간',
        name: 'occur_start_time',
        width: ENUM_WIDTH.M,
        format: 'time',
        editable: true,
        requiredField: true,
      },
      {
        header: '발생종료일',
        name: 'occur_end_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        editable: true,
      },
      {
        header: '발생종료시간',
        name: 'occur_end_time',
        width: ENUM_WIDTH.M,
        format: 'time',
        editable: true,
      },
      {
        header: '발생확인자UUID',
        name: 'occur_emp_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '발생확인자',
        name: 'occur_emp_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
      {
        header: '발생원인',
        name: 'occur_reason',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
      {
        header: '발생내용',
        name: 'occur_contents',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
      {
        header: '수리시작일',
        name: 'repair_start_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        editable: true,
      },
      {
        header: '수리시작시간',
        name: 'repair_start_time',
        width: ENUM_WIDTH.M,
        format: 'time',
        editable: true,
      },
      {
        header: '수리종료일',
        name: 'repair_end_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        editable: true,
      },
      {
        header: '수리종료시간',
        name: 'repair_end_time',
        width: ENUM_WIDTH.M,
        format: 'time',
        editable: true,
      },
      {
        header: '수리시간',
        name: 'repair_time',
        width: ENUM_WIDTH.S,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_NOMAL,
      },
      {
        header: '수리장소',
        name: 'repair_place',
        width: ENUM_WIDTH.L,
        filter: 'text',
        editable: true,
      },
      {
        header: '수리금액',
        name: 'repair_price',
        width: ENUM_WIDTH.L,
        filter: 'number',
        decimal: ENUM_DECIMAL.DEC_NOMAL,
        editable: true,
      },
      {
        header: '점검일',
        name: 'check_date',
        width: ENUM_WIDTH.M,
        format: 'date',
        editable: true,
      },
      {
        header: '점검시간',
        name: 'check_time',
        width: ENUM_WIDTH.M,
        format: 'time',
        editable: true,
      },
      {
        header: '점검자UUID',
        name: 'check_emp_uuid',
        width: ENUM_WIDTH.M,
        filter: 'text',
        hidden: true,
      },
      {
        header: '점검자',
        name: 'check_emp_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
        format: 'popup',
        editable: true,
      },
    ],
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      gridMode: defaultGridMode,
      rowAddPopupInfo: {
        columnNames: [
          { original: 'equip_uuid', popup: 'equip_uuid' },
          { original: 'equip_nm', popup: 'equip_nm' },
        ],
        columns: getPopupForm('설비관리').datagridProps.columns,
        dataApiSettings: {
          uriPath: URL_PATH_STD.EQUIP.GET.EQUIPS,
          params: {},
        },
        gridMode: 'multi-select',
      },
      gridPopupInfo: [
        {
          columnNames: [
            { original: 'equip_uuid', popup: 'equip_uuid' },
            { original: 'equip_nm', popup: 'equip_nm' },
          ],
          columns: getPopupForm('설비관리').datagridProps.columns,
          dataApiSettings: {
            uriPath: getPopupForm('설비관리').uriPath,
            params: {},
          },
          gridMode: 'select',
        },
        {
          columnNames: [
            { original: 'occur_emp_uuid', popup: 'emp_uuid' },
            { original: 'occur_emp_nm', popup: 'emp_nm' },
          ],
          columns: getPopupForm('사원관리').datagridProps?.columns,
          dataApiSettings: {
            uriPath: getPopupForm('사원관리').uriPath,
            params: { emp_status: 'incumbent' },
          },
          gridMode: 'select',
        },
        {
          columnNames: [
            { original: 'check_emp_uuid', popup: 'emp_uuid' },
            { original: 'check_emp_nm', popup: 'emp_nm' },
          ],
          columns: getPopupForm('사원관리').datagridProps?.columns,
          dataApiSettings: {
            uriPath: getPopupForm('사원관리').uriPath,
            params: { emp_status: 'incumbent' },
          },
          gridMode: 'select',
        },
      ],
    },
  );
  const newDataPopupGrid = useGrid(
    'NEW_DATA_POPUP_GRID',
    grid.gridInfo.columns,
    {
      searchUriPath: searchUriPath,
      saveUriPath: saveUriPath,
      onOk: gridRef => {
        const instance = gridRef.current.getInstance();

        instance.blur();
        const data = () => {
          const getModifiedRows = instance.getModifiedRows();

          function MixDateTime(el, dateString, timeString) {
            if (!isNil(el[dateString]) && !isNil(el[timeString])) {
              let time = el[timeString];

              if (String(time)?.length !== 5) {
                time = dayjs(time).format('HH:mm');
              }

              const dateTime =
                dayjs(el[dateString]).format('YYYY-MM-DD') + ' ' + time;
              el[dateString] = dayjs(dateTime)
                .locale('ko')
                .format('YYYY-MM-DDTHH:mm:ssZ');
            }
          }
          getModifiedRows.createdRows.forEach(el => {
            MixDateTime(el, 'occur_start_date', 'occur_start_time');
            MixDateTime(el, 'occur_end_date', 'occur_end_time');
            MixDateTime(el, 'repair_start_date', 'repair_start_time');
            MixDateTime(el, 'repair_end_date', 'repair_end_time');
            MixDateTime(el, 'check_date', 'check_time');
          });

          return getModifiedRows;
        };
        const modifiedRows = data();
        dataGridEvents.onSave(
          'basic',
          {
            gridRef,
            columns: grid.gridInfo.columns,
            saveUriPath: saveUriPath,
            methodType: 'post',
            modifiedData: modifiedRows,
          },
          null,
          modal,
          ({ success }) => {
            if (success) {
              setNewDataPopupGridVisible(false);
              onSearch();
            }
          },
        );
      },
      rowAddPopupInfo: grid.gridInfo.rowAddPopupInfo,
      gridPopupInfo: grid.gridInfo.gridPopupInfo,
      extraButtons: [
        {
          buttonProps: { text: '비가동 이력' },
          buttonAction: (ev, props, options) => {
            const { childGridRef, modal, onAppendRow } = options;
            const updateColumns: { original: string; popup: string }[] = [
              { original: 'equip_uuid', popup: 'equip_uuid' },
              { original: 'equip_nm', popup: 'equip_nm' },
              { original: 'occur_start_date', popup: 'start_date' },
              { original: 'occur_start_time', popup: 'start_time' },
              { original: 'occur_end_date', popup: 'end_date' },
              { original: 'occur_end_time', popup: 'end_time' },
            ];

            getData({}, URL_PATH_PRD.WORK_DOWNTIME.GET.DOWNTIMES).then(res => {
              modal.confirm({
                title: '비가동 이력',
                width: '80%',
                content: (
                  <>
                    <Datagrid
                      ref={childGridRef}
                      gridId={'GRID_POPUP_DOWNTIMES'}
                      columns={[
                        {
                          header: '생산부적합UUID',
                          name: 'work_downtime_uuid',
                          alias: 'uuid',
                          width: 200,
                          hidden: true,
                          format: 'text',
                        },
                        {
                          header: '생산실적UUID',
                          name: 'work_uuid',
                          width: 200,
                          hidden: true,
                          format: 'text',
                        },
                        {
                          header: '공정순서UUID',
                          name: 'work_routing_uuid',
                          width: 200,
                          hidden: true,
                          format: 'text',
                        },
                        {
                          header: '공정UUID',
                          name: 'proc_uuid',
                          width: 200,
                          hidden: true,
                          format: 'text',
                        },
                        {
                          header: '공정',
                          name: 'proc_nm',
                          width: 120,
                          format: 'popup',
                          editable: true,
                        },
                        {
                          header: '공정순서',
                          name: 'proc_no',
                          width: 120,
                          format: 'popup',
                          editable: true,
                        },
                        {
                          header: '설비UUID',
                          name: 'equip_uuid',
                          width: 200,
                          hidden: true,
                          format: 'text',
                        },
                        {
                          header: '설비',
                          name: 'equip_nm',
                          width: 120,
                          format: 'popup',
                          editable: true,
                        },
                        {
                          header: '비가동 유형UUID',
                          name: 'downtime_type_uuid',
                          width: 200,
                          hidden: true,
                          format: 'text',
                        },
                        {
                          header: '비가동 유형',
                          name: 'downtime_type_nm',
                          width: 120,
                          hidden: false,
                          format: 'text',
                        },
                        {
                          header: '비가동UUID',
                          name: 'downtime_uuid',
                          width: 200,
                          hidden: true,
                          format: 'text',
                        },
                        {
                          header: '비가동',
                          name: 'downtime_nm',
                          width: 120,
                          hidden: false,
                          format: 'text',
                        },
                        {
                          header: '시작일자',
                          name: 'start_date',
                          width: 100,
                          hidden: false,
                          format: 'date',
                          editable: true,
                        },
                        {
                          header: '시작시간',
                          name: 'start_time',
                          width: 100,
                          hidden: false,
                          format: 'time',
                          editable: true,
                        },
                        {
                          header: '종료일자',
                          name: 'end_date',
                          width: 100,
                          hidden: false,
                          format: 'date',
                          editable: true,
                        },
                        {
                          header: '종료시간',
                          name: 'end_time',
                          width: 100,
                          hidden: false,
                          format: 'time',
                          editable: true,
                        },
                        {
                          header: '비가동 시간',
                          name: 'downtime',
                          width: 100,
                          hidden: true,
                          format: 'time',
                        },
                        {
                          header: '비고',
                          name: 'remark',
                          width: 150,
                          hidden: false,
                          format: 'text',
                          editable: true,
                        },
                      ]}
                      gridMode="multi-select"
                      data={res}
                    />
                  </>
                ),
                icon: null,
                okText: '선택',
                onOk: close => {
                  const child = childGridRef.current;
                  const rows = child.getInstance().getCheckedRows();

                  rows?.forEach(row => {
                    let newRow = {};
                    if (typeof row === 'object') {
                      updateColumns.forEach(columnName => {
                        // 값 설정
                        newRow[columnName.original] = !isNil(
                          row[columnName.popup],
                        )
                          ? row[columnName.popup]
                          : null;
                      });

                      // 행 추가
                      onAppendRow(newRow);
                    }
                  });
                  close();
                },
                cancelText: '취소',
                maskClosable: false,
              });
            });
          },
        },
      ],
    },
  );

  const editDataPopupGrid = useGrid('EDIT_POPUP_GRID', grid.gridInfo.columns, {
    searchUriPath: searchUriPath,
    saveUriPath: saveUriPath,
    onOk: gridRef => {
      const instance = gridRef.current.getInstance();

      instance.blur();
      const data = () => {
        const getModifiedRows = instance.getModifiedRows();

        function MixDateTime(el, dateString, timeString) {
          if (!isNil(el[dateString]) && !isNil(el[timeString])) {
            let time = el[timeString];

            if (String(time)?.length !== 5) {
              time = dayjs(time).format('HH:mm');
            }

            const dateTime =
              dayjs(el[dateString]).format('YYYY-MM-DD') + ' ' + time;
            el[dateString] = dayjs(dateTime)
              .locale('ko')
              .format('YYYY-MM-DDTHH:mm:ssZ');
          }
        }
        getModifiedRows.updatedRows.forEach(el => {
          MixDateTime(el, 'occur_start_date', 'occur_start_time');
          MixDateTime(el, 'occur_end_date', 'occur_end_time');
          MixDateTime(el, 'repair_start_date', 'repair_start_time');
          MixDateTime(el, 'repair_end_date', 'repair_end_time');
          MixDateTime(el, 'check_date', 'check_time');
        });
        return getModifiedRows;
      };
      const modifiedRows = data();

      dataGridEvents.onSave(
        'basic',
        {
          gridRef,
          columns: grid.gridInfo.columns,
          saveUriPath: saveUriPath,
          methodType: 'put',
          modifiedData: modifiedRows,
        },
        null,
        modal,
        ({ success }) => {
          if (success) {
            setEditDataPopupGridVisible(false);
            onSearch();
          }
        },
      );
    },
    rowAddPopupInfo: grid.gridInfo.rowAddPopupInfo,
    gridPopupInfo: grid.gridInfo.gridPopupInfo,
  });

  /** 조회조건 관리 */
  const searchInfo = useSearchbox('SEARCH_INPUTBOX', null);

  /** 입력상자 관리 */
  const inputInfo = null;
  const newDataPopupInputInfo = null;
  const editDataPopupInputInfo = null;

  /** 검색 */
  const onSearch = () => {
    const searchParams = {};
    let data = [];
    getData(searchParams, searchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        const datas = data.map(el => {
          let data = cloneDeep(el);
          data.occur_start_time = data.occur_start_date;
          data.occur_end_time = data.occur_end_date;
          data.repair_start_time = data.repair_start_date;
          data.repair_end_time = data.repair_end_date;
          data.check_time = data.check_date;
          return data;
        });
        inputInfo?.instance?.resetForm();
        grid.setGridData(datas);
      });
  };

  /** UPDATE / DELETE 저장 기능 */
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
      () => onSearch(),
    );
  };

  /** 템플릿에서 작동될 버튼들의 기능 정의 */
  const buttonActions = {
    /** 조회 */
    search: () => {
      onSearch();
    },

    /** 수정 */
    update: () => {
      setEditDataPopupGridVisible(true);
    },

    /** 삭제 */
    delete: () => {
      if (
        getModifiedRows(grid.gridRef, grid.gridInfo.columns)?.deletedRows
          ?.length === 0
      ) {
        message.warn('편집된 데이터가 없습니다.');
        return;
      }
      onSave();
    },

    /** 신규 추가 */
    create: () => {
      newDataPopupInputInfo?.instance?.resetForm();
      newDataPopupGrid?.setGridData([]);
      setNewDataPopupGridVisible(true);
    },

    /** 저장 */
    save: () => {
      onSave();
    },

    /** 편집 취소 */
    cancelEdit: () => {
      const { gridRef, setGridMode } = grid;
      const { columns } = grid.gridInfo;
      dataGridEvents.onCancel(gridRef, setGridMode, columns, modal);
    },

    printExcel: dataGridEvents.printExcel,
  };

  /** 템플릿에 전달할 값 */
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
    popupInputProps: [
      newDataPopupInputInfo?.props,
      editDataPopupInputInfo?.props,
    ],

    buttonActions,
    modalContext,
  };

  return <TpSingleGrid {...props} />;
};
