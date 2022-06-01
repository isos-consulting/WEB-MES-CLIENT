import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  IGridComboColumnInfo,
  IGridComboInfo,
  IGridPopupInfo,
  TGridComboItems,
} from './datagrid.ui.type';
import {
  executeData,
  getData,
  setGridFocus,
  setNumberToDigit,
} from '~/functions';
import { message, Modal, Space } from 'antd';
import TuiGrid from 'tui-grid';
import Grid from '@toast-ui/react-grid';
import { useMemo } from 'react';
import {
  DatagridComboboxEditor,
  DatagridNumberEditor,
  DatagridNumberRenderer,
  DatagridDateEditor,
  DatagridDateRenderer,
  DatagridCheckboxEditor,
  DatagridCheckboxRenderer,
  DatagridTagRenderer,
  DatagridPercentEditor,
  DatagridPercentRenderer,
} from '~/components/UI/datagrid-ui';
import '~styles/grid.style.scss';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import Props, { COLUMN_CODE, EDIT_ACTION_CODE } from './datagrid.ui.type';
import { getPopupForm, IPopupItemsRetrunProps } from '../popup';
import { Result } from '../result';
import { DatagridButtonRenderer } from '../datagrid-ui/datagrid-button.ui';
import { Button } from '../button';
import TuiDatePicker from 'tui-date-picker';
import 'tui-grid/dist/tui-grid.css';
import Colors from '~styles/color.style.scss';
import { COLUMN_NAME } from '.';
import { layoutStore } from '../layout/layout.ui.hook';
import { useRecoilValue } from 'recoil';
import { ENUM_DECIMAL, ENUM_FORMAT, ENUM_WIDTH, URL_PATH_ADM } from '~/enums';
import dayjs from 'dayjs';
import { InputGroupbox } from '../input-groupbox';
import { Searchbox } from '../searchbox';
import { cloneDeep } from 'lodash';
import { DragDrop } from '../dragDrop';
import dotenv from 'dotenv';

dotenv.config();
//#region 🔶Tui-Grid 설정 관련
// 그리드 언어 설정
TuiGrid.setLanguage('ko', {
  filter: {
    contains: '포함',
    eq: '같음',
    ne: '같지 않음',
    start: '시작 문자',
    end: '끝 문자',
    clear: '초기화',
    apply: '적용',
    after: '초과',
    afterEq: '이상',
    before: '미만',
    beforeEq: '이하',
  },
});

// 그리드 일자 location 설정
TuiDatePicker.localeTexts['ko'];

// 그리드 테마 설정
TuiGrid.applyTheme('striped', {
  // 헤더부분 전체
  cell: {
    normal: {
      border: Colors.bg_gridCell_border,
      showVerticalBorder: true,
      showHorizontalBorder: false,
    },
    // 그리드 헤더부분
    header: {
      background: Colors.bg_gridHeader_default,
      border: Colors.bg_gridRowHeader_border,
      showVerticalBorder: true,
      showHorizontalBorder: false,
    },

    //NO.
    rowHeader: {
      background: Colors.bg_gridRowHeader_default,
      border: Colors.bg_gridRowHeader_border,
      showVerticalBorder: true,
      showHorizontalBorder: false,
    },

    evenRow: {
      background: Colors.bg_evenRow_default,
    },

    selectedHeader: {
      background: Colors.bg_grid_selectedHeader,
    },
  },
});

const rowHeight = 35;
const minRowHeight = 10;
//#endregion

/**
 * 그리드 모듈에서 호출될 팝업에 관한 정보를 기술하여 리턴시켜주는 함수입니다.
 * @param popupKey
 * @param option
 * @returns
 */
function getGridComboItem(
  comboInfo: IGridComboInfo,
  columnName: IGridComboColumnInfo,
): TGridComboItems {
  let returnValue: TGridComboItems = [];

  let tmp_code = '';

  // 고정 리스트로 콤보박스 아이템 생성
  if (comboInfo.itemList != null) {
    returnValue = comboInfo.itemList;

    // DB데이터 가져와서 동적으로 콤보박스 아이템 생성
  } else {
    let dataApiInfo = {
      uriPath: '',
      params: {},
    };

    if (typeof comboInfo?.dataApiSettings === 'function') {
      const apiSettings = comboInfo?.dataApiSettings();
      const uriPath = apiSettings?.uriPath;
      const params = apiSettings?.params;
      dataApiInfo = {
        uriPath,
        params,
      };
    } else {
      const uriPath = comboInfo?.dataApiSettings?.uriPath;
      const params = comboInfo?.dataApiSettings?.params;
      dataApiInfo = {
        uriPath,
        params,
      };
    }

    const { params, uriPath } = dataApiInfo;

    getData(params, uriPath).then(result => {
      result?.forEach(rowData => {
        if (rowData[columnName.textColName.popup]) {
          tmp_code = rowData[columnName.codeColName.popup];

          //중복인 데이터는 거름
          if (returnValue.findIndex(el => el.code === tmp_code) === -1)
            returnValue.push({
              code: rowData[columnName.codeColName.popup],
              text: rowData[columnName.textColName.popup],
            });
        }
      });
    });
  }

  return returnValue;
}

// interface IColumnComboState {
//   [key: string]: {
//     matchColumnName: string,
//     items: any[]
//   };
// }
interface IColumnComboState {
  columnName: string;
  matchColumnName: string;
  type: 'code' | 'text';
  values: any[];
}

/** 데이터 그리드 */
const BaseDatagrid = forwardRef<Grid, Props>((props, ref) => {
  const gridRef = useRef<Grid>();
  useImperativeHandle(ref, () => gridRef.current);

  const [originData, setOriginData] = useState<any[]>([]);

  const childFileGridRef = useRef<Grid>();
  const childGridRef = useRef<Grid>();
  const [modal, contextHolder] = Modal.useModal();
  const [columnComboState, setColumnComboState] = useState<IColumnComboState[]>(
    [],
  );
  // const [loading, setLoading] = useLoadingState();
  let chkCreateAtColumn = false;
  let chkUpdateAtColumn = false;

  //#region 🔶컬럼 세팅
  const columns = useMemo(() => {
    let newColumns = cloneDeep(props.columns);

    newColumns.forEach((el, colIndex) => {
      if (el?.name === 'created_at') {
        chkCreateAtColumn = true;
      } else if (el?.name === 'updated_at') {
        chkUpdateAtColumn = true;
      }

      // 필수 입력 컬럼 *표시
      if (el?.requiredField === true) {
        el['header'] = '* ' + el?.header;

        if (['create', 'update'].includes(props.gridMode)) {
          el['validation'] = { required: true };
        }
      }

      // sort 설정
      if (el?.sortable == null) {
        el['sortable'] = true;
      }

      // resizable 설정
      if (el?.resizable == null) {
        el['resizable'] = true;
      }

      // format 설정하기
      switch (el?.format) {
        case 'button': // 버튼 세팅
          // 렌더러
          el['renderer'] = {
            type: DatagridButtonRenderer,
            options: {
              gridId: props.gridId,
              // disabled: !el?.editable,
              ...props.columns[colIndex]?.options,
              // ...el?.options,
            },
          };

          // 정렬
          if (el?.align == null) {
            el['align'] = 'center';
          }
          break;

        case 'file':
          // 렌더러
          const fileUploadGridId = uuidv4();

          if (el?.options?.ok_type == null) {
            if (props.gridMode === 'delete') {
              el['options']['ok_type'] = 'save';
            } else if (props.gridMode === 'create') {
              el['options']['ok_type'] = 'json';
            } else {
            }
          }
          const okType: 'save' | 'json' = el.options.ok_type;
          const reference_col = el.options.reference_col;

          el['renderer'] = {
            type: DatagridButtonRenderer,
            options: {
              gridId: props.gridId,
              value: '파일첨부',
              onClick: async (ev, clickProps) => {
                const rowData = clickProps.grid.getRow(clickProps.rowKey);
                const addData = rowData[el.name];
                const searchParams = {};

                searchParams['reference_uuid'] = rowData[reference_col];
                let result;
                if (okType === 'save') {
                  await getData(
                    searchParams,
                    URL_PATH_ADM.FILE_MGMT.GET.FILE_MGMTS,
                    'raws',
                  ).then(res => {
                    result = cloneDeep(res);
                  });
                }
                modal.confirm({
                  title: '파일첨부',
                  width: '80%',
                  content: (
                    <div>
                      <Space
                        size={[5, null]}
                        style={{
                          width:
                            props.extraButtons?.filter(
                              el => el?.align !== 'right',
                            )?.length > 0
                              ? '50%'
                              : '100%',
                          justifyContent: 'right',
                        }}
                      >
                        <DragDrop ref={childFileGridRef} />
                      </Space>
                      <Datagrid
                        ref={childFileGridRef}
                        gridId={fileUploadGridId}
                        columns={[
                          {
                            header: 'uuid',
                            name: 'uuid',
                            hidden: true,
                          },
                          {
                            header: 'save_type',
                            name: 'save_type',
                            hidden: true,
                          },
                          {
                            header: '삭제',
                            name: 'delete',
                            width: ENUM_WIDTH.S,
                            format: 'button',
                            options: {
                              value: '삭제',
                              onClick: async (subEv, { grid, rowKey }) => {
                                const { save_type, uuid, file_mgmt_uuid } =
                                  grid.getRow(rowKey);

                                if (
                                  okType === 'json' ||
                                  (okType === 'save' && save_type === 'CREATE')
                                ) {
                                  await executeData(
                                    {},
                                    '/temp/file/{uuid}'.replace(
                                      '{uuid}',
                                      uuid ?? file_mgmt_uuid,
                                    ),
                                    'delete',
                                    'data',
                                    false,
                                    process.env.FILE_SERVER_URL,
                                  );

                                  grid.removeRow(rowKey);
                                } else {
                                  if (save_type === 'DELETE') {
                                    grid.setValue(rowKey, COLUMN_CODE.EDIT, '');
                                    grid.setValue(rowKey, 'save_type', '');
                                  } else {
                                    grid.setValue(
                                      rowKey,
                                      COLUMN_CODE.EDIT,
                                      EDIT_ACTION_CODE.DELETE,
                                    );
                                    grid.setValue(
                                      rowKey,
                                      'save_type',
                                      'DELETE',
                                    );
                                  }
                                }
                              },
                            },
                          },
                          {
                            header: '파일상세유형UUID',
                            name: 'file_mgmt_detail_type_uuid',
                            width: ENUM_WIDTH.S,
                            hidden: true,
                          },
                          {
                            header: '파일상세유형',
                            name: 'file_mgmt_detail_type_nm',
                            format: 'combo',
                            width: ENUM_WIDTH.S,
                            editable: true,
                            requiredField: true,
                          },
                          {
                            header: '파일명',
                            name: 'file_nm',
                            width: ENUM_WIDTH.L,
                          },
                          {
                            header: '파일확장자',
                            name: 'file_extension',
                            width: ENUM_WIDTH.S,
                          },
                          {
                            header: '파일사이즈',
                            name: 'file_size',
                            width: ENUM_WIDTH.M,
                          },
                          {
                            header: '비고',
                            name: 'remark',
                            editable: true,
                          },
                        ]}
                        gridComboInfo={[
                          {
                            // 투입단위 콤보박스
                            columnNames: [
                              {
                                codeColName: {
                                  original: 'file_mgmt_detail_type_uuid',
                                  popup: 'file_mgmt_detail_type_uuid',
                                },
                                textColName: {
                                  original: 'file_mgmt_detail_type_nm',
                                  popup: 'file_mgmt_detail_type_nm',
                                },
                              },
                            ],
                            dataApiSettings: {
                              uriPath:
                                URL_PATH_ADM.FILE_MGMT_DETAIL_TYPE.GET
                                  .FILE_MGMT_DETAIL_TYPES,
                              params: {
                                file_mgmt_type_cd:
                                  el?.options?.file_mgmt_type_cd,
                              },
                            },
                          },
                        ]}
                        gridMode="create"
                        data={okType === 'json' ? addData : result}
                        disabledAutoDateColumn={true}
                        hiddenActionButtons={true}
                      />
                    </div>
                  ),
                  icon: null,
                  okText: '확인',
                  onOk: async close => {
                    const METHODS = {
                      CREATE: 'post',
                      UPDATE: 'put',
                      DELETE: 'delete',
                    };
                    const { createdRows, updatedRows } =
                      childFileGridRef?.current
                        ?.getInstance()
                        ?.getModifiedRows();

                    const fileData = []
                      .concat(...createdRows)
                      .concat(...updatedRows);

                    if (okType === 'json') {
                      clickProps.grid.setValue(
                        clickProps.rowKey,
                        el.name,
                        fileData,
                      );
                    } else if (okType === 'save') {
                      fileData.forEach(el => {
                        el.uuid ??= el.file_mgmt_uuid;
                        el.reference_uuid ??= rowData[reference_col];
                        el.save_type ??= 'UPDATE';

                        return el;
                      });

                      const groupDatas = fileData.reduce(
                        (group, current) => (
                          (group[current.save_type] = [
                            ...(group[current.save_type] ?? []),
                            current,
                          ]),
                          group
                        ),
                        {},
                      );

                      const typedApiCaller = () =>
                        Object.keys(groupDatas).map(saveType =>
                          executeData(
                            groupDatas[saveType],
                            '/adm/file-mgmts',
                            METHODS[saveType],
                            'data',
                          ),
                        );
                      await typedApiCaller();

                      close();
                    }
                  },
                  okCancel: true,
                  cancelText: '취소',
                  maskClosable: false,
                });
              },
            },
          };

          // 정렬
          if (el?.align == null) {
            el['align'] = 'center';
          }
          break;

        case 'combo': // 콤보박스 세팅
          if (el?.editable === true) {
            // 에디터
            const comboId = uuidv4();
            const comboItem = columnComboState?.find(
              item => item.columnName === el.name,
            );
            const listItems = comboItem?.values;

            if (comboItem) {
              el['editor'] = {
                type: DatagridComboboxEditor,
                options: {
                  id: comboId,
                  gridId: props.id,
                  listItems,
                  codeColName:
                    comboItem.type === 'code'
                      ? comboItem.columnName
                      : comboItem.matchColumnName,
                  textColName:
                    comboItem.type === 'text'
                      ? comboItem.columnName
                      : comboItem.matchColumnName,
                },
              };
            }
          }
          break;

        case 'popup': // 팝업 세팅
          // ⛔글자 옆에 이미지 출력하는 렌더러인데 제대로 작동하지 않아 일단 바탕색을 변경하여 팝업을 표시하는 것으로 임시 적용함

          // if (el?.editable == true) {
          //   // 렌더러
          //   el['renderer'] = {
          //     type:DatagridTextIconRenderer,
          //     options: {
          //       gridId: props.gridId,
          //       placeHolder: 'click',
          //       imageSrc: ico_popup,
          //     }
          //   }
          // }

          // 정렬
          if (el?.align == null) {
            el['align'] = 'left';
          }
          break;

        case 'number': // 숫자 타입 세팅
          if (el?.editable == true) {
            // 에디터
            el['editor'] = {
              type: DatagridNumberEditor,
              options: {
                ...el?.options,
                decimal: el?.decimal || ENUM_DECIMAL.DEC_NOMAL,
              },
            };
          }

          // 렌더러
          el['renderer'] = {
            type: DatagridNumberRenderer,
            options: {
              ...el?.options,
              unit: el?.unit, // 단위 설정
              decimal: el?.decimal || ENUM_DECIMAL.DEC_NOMAL,
            },
          };

          // 정렬
          if (el?.align == null) {
            el['align'] = 'right';
          }
          break;

        case 'percent': // 퍼센트 타입 세팅
          if (el?.editable == true) {
            // 에디터
            el['editor'] = {
              type: DatagridPercentEditor,
              options: {
                ...el?.options,
                decimal: el?.decimal,
              },
            };
          }

          // 렌더러
          el['renderer'] = {
            type: DatagridPercentRenderer,
            options: {
              ...el?.options,
              unit: el?.unit, // 단위 설정
              decimal: el?.decimal,
            },
          };

          // 정렬
          if (el?.align == null) {
            el['align'] = 'right';
          }
          break;

        case 'date': // 날짜 타입 세팅
          if (el?.editable == true) {
            // 에디터
            el['editor'] = {
              type: DatagridDateEditor,
              options: {
                type: 'date',
                dateFormat: ENUM_FORMAT.DATE,
              },
            };

            // el['validation'] = {...el['validation'], reqExp:/^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/};
          }

          // 렌더러
          el['renderer'] = {
            type: DatagridDateRenderer,
            options: {
              type: 'date',
              dateFormat: ENUM_FORMAT.DATE,
            },
          };

          // 정렬
          if (el?.align == null) {
            el['align'] = 'center';
          }
          break;

        case 'time': // 시간 타입 세팅
          if (el?.editable == true) {
            // 에디터
            el['editor'] = {
              type: DatagridDateEditor,
              options: {
                type: 'time',
                dateFormat: ENUM_FORMAT.TIME,
              },
            };

            // el['validation'] = {...el['validation'], reqExp:/^([1-9]|[01][0-9]|2[0-3]):([0-5][0-9])$/};
          }

          // 렌더러
          el['renderer'] = {
            type: DatagridDateRenderer,
            options: {
              type: 'time',
              dateFormat: ENUM_FORMAT.TIME,
            },
          };

          // 정렬
          if (el?.align == null) {
            el['align'] = 'center';
          }
          break;

        case 'datetime': // 날짜/시간 타입 세팅
          // if (el?.editable == true) {
          //   // 에디터
          //   el['editor'] = {
          //     type:DatagridDateEditor,
          //   }
          // }

          if (el?.editable == true) {
            // 에디터
            el['editor'] = {
              type: DatagridDateEditor,
              options: {
                type: 'datetime',
                dateFormat: ENUM_FORMAT.DATE_TIMEZONE,
                timepicker: {
                  layoutType: 'tab',
                  inputType: 'spinbox',
                },
              },
            };
          }

          // 렌더러
          el['renderer'] = {
            type: DatagridDateRenderer,
            options: {
              type: 'datetime',
              dateFormat: ENUM_FORMAT.DATE_TIME,
            },
          };

          // 정렬
          if (el?.align == null) {
            el['align'] = 'center';
          }
          break;

        case 'check': // 체크박스 세팅
          // if (el?.editable == true) {
          //   // 에디터
          //   el['editor'] = {
          //     type:DatagridCheckboxEditor,
          //     options: {
          //       gridId: props.gridId
          //     }
          //   }
          // }

          // 렌더러 (체크박스만 에디터 작업을 렌더러가 합니다.)
          el['renderer'] = {
            type: DatagridCheckboxRenderer,
            options: {
              gridId: props.gridId,
              gridMode: props.gridMode,
              editable: el?.editable,
            },
          };

          el['defaultValue'] = false;

          // 정렬
          if (el?.align == null) {
            el['align'] = 'center';
          }
          break;

        case 'tag': // 태그 세팅
          // 렌더러
          el['renderer'] = {
            type: DatagridTagRenderer,
            options: el?.options,
          };

          // 정렬
          if (el?.align == null) {
            el['align'] = 'center';
          }
          break;

        case 'text': // 텍스트 세팅
        // format 설정 안하면 'text'로 취급
        default:
          // 에디터
          if (el?.editable === true) {
            el['editor'] = 'text';
          }

          // 정렬
          if (el?.align == null) {
            el['align'] = 'left';
          }
          break;
      }

      // gridMode에 따라 editor 모드 제거
      if (
        el?.editable === true &&
        !['create', 'update'].includes(props.gridMode)
      ) {
        el['editor'] = null;
      }

      // 숨김 처리 조건
      if (props.columns[colIndex]?.hiddenCondition) {
        el['hidden'] = props.columns[colIndex]?.hiddenCondition(props);
      }

      // 입력 비허용 처리 조건
      if (props.columns[colIndex]?.editableCondition) {
        el['editable'] = props.columns[colIndex]?.editableCondition(props);
      }

      // 입력 비허용 처리 조건
      if (props.columns[colIndex]?.disableCondition) {
        el['disabled'] = props.columns[colIndex]?.disableCondition(props);
      }

      // filter 기본 세팅
      if (el?.filter != null && typeof el?.filter === 'string') {
        switch (el?.filter) {
          case 'text':
          case 'number':
          case 'select':
            el['filter'] = {
              type: el?.filter,
              showClearBtn: true,
            };
            break;

          case 'date':
            el['filter'] = {
              type: el?.filter,
              showClearBtn: true,
              options: {
                language: 'ko',
                format: 'yyyy-MM-dd',
              },
            };
            break;

          default:
            break;
        }
      } else {
        el['filter'] = {
          type: 'text',
          showClearBtn: true,
        };
      }

      // 기본 값 세팅
      if (props.columns[colIndex]?.defaultValue) {
        const defaultValue = props.columns[colIndex]?.defaultValue;
        el['defaultValue'] = defaultValue; //typeof defaultValue === 'function' ? defaultValue(props): defaultValue;
      }

      // 컬럼간 계산식 세팅
      if (props.columns[colIndex]?.formula) {
        const formula = props.columns[colIndex]?.formula;
        el['formula'] = formula;
      }
    });

    // COLUMN_CODE 추가후 숨기기
    newColumns = [
      {
        name: COLUMN_CODE.EDIT,
        header: COLUMN_NAME.EDIT,
        editable: false,
        format: 'text',
        hidden: !['create', 'update'].includes(props.gridMode),
        width: 70,
        align: 'center',
        renderer: {
          type: DatagridTagRenderer,
          options: {
            conditions: [
              {
                value: 'C',
                text: '신규',
                color: 'blue',
              },
              {
                value: 'U',
                text: '수정',
                color: 'orange',
              },
              {
                value: 'D',
                text: '삭제',
                color: 'red',
              },
            ],
          },
        },
      },
      ...newColumns,
    ];

    if (!props?.disabledAutoDateColumn) {
      if (chkCreateAtColumn === false) {
        newColumns.push({
          header: '등록일시',
          name: 'created_at',
          width: 160,
          editable: false,
          noSave: true,
          align: 'center',
          resizable: true,
          sortable: true,
          filter: {
            type: 'date',
            showClearBtn: true,
            options: {
              language: 'ko',
              format: 'yyyy-MM-dd',
            },
          },
          renderer: {
            type: DatagridDateRenderer,
            options: {
              type: 'datetime',
              dateFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
        });
        newColumns.push({
          header: '등록자',
          name: 'created_nm',
          width: 100,
          editable: false,
          noSave: true,
          align: 'center',
          format: 'text',
          resizable: true,
          sortable: true,
          filter: {
            type: 'text',
            showClearBtn: true,
          },
        });
      }

      if (chkUpdateAtColumn === false) {
        newColumns.push({
          header: '수정일시',
          name: 'updated_at',
          width: 160,
          editable: false,
          noSave: true,
          align: 'center',
          resizable: true,
          sortable: true,
          filter: {
            type: 'date',
            showClearBtn: true,
            options: {
              language: 'ko',
              format: 'yyyy-MM-dd',
            },
          },
          renderer: {
            type: DatagridDateRenderer,
            options: {
              type: 'datetime',
              dateFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
        });
        newColumns.push({
          header: '수정자',
          name: 'updated_nm',
          width: 100,
          editable: false,
          noSave: true,
          align: 'center',
          format: 'text',
          resizable: true,
          sortable: true,
          filter: {
            type: 'text',
            showClearBtn: true,
          },
        });
      }
    }

    if (props?.hiddenColumns?.length > 0) {
      newColumns = newColumns?.map(el => ({
        ...el,
        hidden: props.hiddenColumns.includes(el?.name) || el?.hidden || false,
      }));
    }

    return newColumns;
  }, [
    props.columns,
    props.gridComboInfo,
    props.gridMode,
    props.data,
    columnComboState,
    props.hiddenColumns,
    props.disabledAutoDateColumn,
  ]);
  //#endregion

  //#region 🔶헤더 세팅
  useLayoutEffect(() => {
    let header = props.header || {};

    if (props.header?.complexColumns) {
      header['height'] = 60;
      header['columns'] = columns;
    } else {
      header['height'] = 30;
    }

    if (header) gridRef?.current?.getInstance().setHeader(header);
  }, [props.header, columns]);
  //#endregion

  //#region 🔶컬럼 옵션 세팅
  const columnOptions = useMemo(() => {
    let result = {};

    if (props.columnOptions == null) {
      if (['create', 'update'].includes(props.gridMode)) {
        result = {
          frozenCount: 1,
          frozenBorderWidth: 2,
        };
      }
    } else {
      result = {
        ...props.columnOptions,
        frozenCount: props.columnOptions?.frozenCount
          ? props.columnOptions?.frozenCount + 1
          : null,
      };
    }

    return result;
  }, [props.columnOptions, columns, props.gridMode]);
  //#endregion

  //#region 🔶SUMMARY 옵션 세팅
  const summary = useMemo(() => {
    if (props.summary) return props.summary;
    if (!props.summaryOptions) return undefined;

    const position = props.summaryOptions.position || 'bottom';
    const avgs = props.summaryOptions.avgColumns || [];
    const cnts = props.summaryOptions.cntColumns || [];
    const filtereds = props.summaryOptions.filteredColumns || [];
    const maxs = props.summaryOptions.maxColumns || [];
    const mins = props.summaryOptions.minColumns || [];
    const sums = props.summaryOptions.sumColumns || [];
    const texts = props.summaryOptions.textColumns || [];

    let result = {
      height: rowHeight,
      position,
    };

    let columnContent: object = {};

    type TItems = { mapKey: string; contetns: string[] }[];
    const items: TItems = [
      { mapKey: 'avg', contetns: avgs },
      { mapKey: 'cnt', contetns: cnts },
      { mapKey: 'filtered', contetns: filtereds },
      { mapKey: 'max', contetns: maxs },
      { mapKey: 'min', contetns: mins },
      { mapKey: 'sum', contetns: sums },
    ];

    items?.forEach(el => {
      const { mapKey, contetns } = el;
      contetns?.forEach(columnName => {
        const decimal: number =
          columns?.find(el => el?.name === columnName)?.decimal | 0;
        columnContent[columnName] = {
          template: valueMap => {
            const value = valueMap[mapKey];
            return `<div style='text-align:right;'>${setNumberToDigit(
              value.toFixed(decimal),
            )}</div>`;
          },
        };
      });
    });

    texts?.forEach(el => {
      const { columnName, content } = el;

      columnContent[columnName] = {
        template: valueMap => {
          return `<center>${content}</center>`;
        },
      };
    });

    result['columnContent'] = columnContent;
    return result;
  }, [props.summary, props.summaryOptions, columns]);
  //#endregion

  const defaultDataSetting = (datas, columns) => {
    // 클래스명 삽입 하기
    datas?.forEach(el => {
      let classNames = { column: {} };
      columns?.forEach(column => {
        if (!el['_attributes']?.disabled) {
          if (column.name !== COLUMN_CODE.EDIT)
            classNames['column'][column.name] = [props.gridMode];

          // editor 클래스명 삽입
          if (column?.editable === true && column.name !== COLUMN_CODE.EDIT) {
            classNames['column'][column.name] = [
              ...classNames['column'][column.name],
              'editor',
            ];
          }

          // popup 클래스명 삽입
          if (column?.editable === true && column?.format === 'popup') {
            classNames['column'][column.name] = [
              ...classNames['column'][column.name],
              'popup',
            ];
          }

          // 기본값 삽입
          if (column?.defaultValue != null) {
            el[column.name] =
              el[column.name] != null
                ? el[column.name]
                : typeof column?.defaultValue === 'function'
                ? column?.defaultValue(props, el)
                : column?.defaultValue;
          }
        }
      });
      // 최종적으로 데이터 _attributes에 클래스명을 삽입
      if (Object.keys(classNames['column']).length > 0) {
        el['_attributes'] = {
          ...el['_attributes'],
          className: classNames,
        };
      }
      defaultDataSetting(el['_children'] ? el['_children'] : null, columns);
    });
  };

  //#region 🔶데이터 세팅
  const data = useMemo(() => {
    const data = props?.data?.length > 0 ? props?.data : [];
    if (data) {
      const newData = data?.length > 0 ? cloneDeep(data) : [];
      // create모드나 update모드일 때, 클래스명 넣기 (입력 가능한 컬럼/ 불가능한 컬럼을 구분하기 위함)
      if (['create', 'update'].includes(props.gridMode)) {
        defaultDataSetting(newData, columns);
      }
      setOriginData(newData);
      return newData;
    } else {
      setOriginData(data || []);
      return data || [];
    }
  }, [props.data, props.gridMode, columns, props.columns]);
  //#endregion

  //#region 🔶로우 헤더 세팅
  /** ⛔로우 헤더 (drag-drop, checkbox, rowNum) */
  // const rowHeaders = useMemo(() => {
  //   switch (props.gridMode) {
  //     case 'select':
  //     case 'multi-select':
  //     case 'delete':
  //       return [
  //         'checkbox',
  //         'rowNum'
  //       ];

  //     default:
  //       return [
  //         'rowNum'
  //       ];
  //   }
  // }, [props.gridMode]);
  //#endregion

  //#region 🔶그리드 액션
  /** ✅행 추가 : 1행에 행을 하나 추가합니다. */
  const onPrepentRow = useCallback(
    (newRow: object = {}) => {
      // 클래스명 삽입 하기
      let classNames = { column: {} };

      columns?.forEach(column => {
        if (column.name !== COLUMN_CODE.EDIT)
          classNames['column'][column.name] = [props.gridMode];

        // editor 클래스명 삽입
        if (column?.editable === true && column.name !== COLUMN_CODE.EDIT) {
          classNames['column'][column.name] = [
            ...classNames['column'][column.name],
            'editor',
          ];
        }

        // popup 클래스명 삽입
        if (column?.editable === true && column?.format === 'popup') {
          classNames['column'][column.name] = [
            ...classNames['column'][column.name],
            'popup',
          ];
        }

        // 기본값 삽입
        if (column?.defaultValue != null) {
          newRow[column.name] =
            newRow[column.name] != null
              ? newRow[column.name]
              : typeof column?.defaultValue === 'function'
              ? column?.defaultValue(props)
              : column?.defaultValue;
        }
      });
      // 행 추가할때 코드 값과 클래스명 넣어주기
      gridRef.current.getInstance().prependRow(
        {
          ...newRow,
          [COLUMN_CODE.EDIT]: EDIT_ACTION_CODE.CREATE,
          _attributes: { className: classNames },
        },
        { focus: true },
      );
    },
    [gridRef, columns],
  );

  /** ✅행 추가 : 마지막행에 행을 하나 추가합니다. */
  const onAppendRow = useCallback(
    (newRow: object = {}) => {
      // 클래스명 삽입 하기
      let classNames = { column: {} };

      columns?.forEach(column => {
        if (column.name !== COLUMN_CODE.EDIT)
          classNames['column'][column.name] = [props.gridMode];

        // editor 클래스명 삽입
        if (column?.editable === true && column.name !== COLUMN_CODE.EDIT) {
          classNames['column'][column.name] = [
            ...classNames['column'][column.name],
            'editor',
          ];
        }

        // editor 클래스명 삽입
        if (column?.editable === true && column?.format === 'popup') {
          classNames['column'][column.name] = [
            ...classNames['column'][column.name],
            'popup',
          ];
        }

        // 기본값 삽입
        if (column?.defaultValue != null) {
          newRow[column.name] =
            newRow[column.name] != null
              ? newRow[column.name]
              : typeof column?.defaultValue === 'function'
              ? column?.defaultValue(props, newRow)
              : column?.defaultValue;
        }
      });

      // 행 추가할때 코드 값과 클래스명 넣어주기
      gridRef.current.getInstance().appendRow(
        {
          ...newRow,
          [COLUMN_CODE.EDIT]: EDIT_ACTION_CODE.CREATE,
          _attributes: { className: classNames },
        },
        { focus: true },
      );
    },
    [gridRef, columns],
  );

  /** ✅행 취소 : 포커스된 행을 하나 제거합니다. (기존 데이터에 영향 없음) */
  const onCancelRow = useCallback(() => {
    const instance = gridRef.current.getInstance();
    const { rowKey, columnName } = instance.getFocusedCell();
    const rowIndex = instance?.getIndexOfRow(rowKey);
    const columns = instance?.store?.column?.visibleColumns;
    const columnIndex = columns?.findIndex(el => el?.name === columnName);

    if (rowKey === null) {
      message.warn('취소할 행을 선택해주세요.');
    }

    // 행 제거
    instance.removeRow(rowKey, { removeOriginalData: false });

    // 다음 행으로 포커스 이동
    try {
      if (instance.getRowCount() <= 0) return;

      let nextRowIndex = Number(rowIndex) - 1;

      if (nextRowIndex < 0) {
        nextRowIndex = 0;
      }

      instance.focusAt(nextRowIndex, columnIndex);
    } catch (e) {
      console.error('onCancelRow', e);
    }
  }, [gridRef]);

  //#region ⛔그리드 더블클릭 액션
  type TDblPopup = {
    popupId: string;
    gridRef: any;
    data: any[];
  };
  const [dblPopupInfo, setDblPopupInfo] = useState<TDblPopup>({});

  /** ⛔그리드 더블클릭 액션 */
  const onDblClick = useCallback(
    ev => {
      onLoadPopup(ev);
    },
    [props.gridMode, props.columns, props.gridPopupInfo, gridRef, childGridRef],
  );

  useLayoutEffect(() => {
    if (!dblPopupInfo?.gridRef) return;

    const instance = childGridRef?.current?.getInstance();
    const columnName = instance
      ?.getColumns()
      ?.find(el => el?.hidden !== true && el?.name !== '_edit')?.name;
    const columnIndex = instance?.getIndexOfColumn(columnName);
    const rowIndex = instance?.getIndexOfRow(0);

    if (!columnName || columnIndex === -1 || rowIndex === -1) return;

    instance?.focus(rowIndex, columnName);
  }, [dblPopupInfo]);
  //#endregion

  /** ✅AFTER 체인지 액션 */
  const onAfterChange = useCallback(
    ev => {
      const { origin, changes } = ev;
      const instance = gridRef.current.getInstance();

      let editChk: boolean = true;

      const { rowKey, columnName, prevValue, value } = changes[0];
      const formula = props.columns.filter(el => el.name === columnName)[0]
        ?.formula;

      if (formula) {
        const { targetColumnName, targetColumnNames } = formula;
        const targetValue = instance.getValue(rowKey, targetColumnName);

        let targetValues = { _array: [] };
        targetColumnNames?.forEach(targetColumnName => {
          targetValues[targetColumnName] = instance.getValue(
            rowKey,
            targetColumnName,
          );
          targetValues['_array'] = [
            ...targetValues?._array,
            instance.getValue(rowKey, targetColumnName),
          ];
        });

        if (typeof formula?.formula === 'function') {
          const formulaValue = formula?.formula(
            {
              columnName,
              value,
              targetColumnName,
              targetValue,
              targetColumnNames,
              targetValues,
              rowKey,
              gridRef,
            },
            props,
          );
          instance.setValue(rowKey, formula.resultColumnName, formulaValue);
        }
      }

      if (origin === 'cell' && props.gridMode !== 'create') {
        //직접 입력시

        if (columnName === COLUMN_CODE.EDIT) return;

        if (editChk && prevValue !== value) {
          instance.setValue(rowKey, COLUMN_CODE.EDIT, EDIT_ACTION_CODE.UPDATE);
          ev.stop();
        }
      } else if (origin === 'paste' || origin === 'delete') {
        //복붙 수행시

        for (let i = 0; i < changes?.length; i++) {
          const { rowKey, columnName, prevValue, value } = changes[i];
          const chk = props.columns.findIndex(
            el => el.name === columnName && el.format === 'combo',
          );

          if (props.gridMode === 'create') {
            editChk = false;
          } else if (chk !== -1) {
            const comboInfo = columnComboState?.find(
              el => el.columnName === columnName,
            );
            const matchColumnName = comboInfo?.matchColumnName;
            const comboIndex = comboInfo?.values?.findIndex(el =>
              comboInfo.type === 'code' ? el.code === value : el.text === value,
            );

            if (comboIndex !== -1) {
              instance.setValue(
                rowKey,
                matchColumnName,
                comboInfo?.values[comboIndex][
                  comboInfo.type === 'code' ? 'text' : 'code'
                ],
              );
            } else {
              instance.setValue(rowKey, columnName, prevValue);
              editChk = false;
            }
          }

          // 전에 값과 다른 값이면 edit처리
          if (editChk && prevValue !== value) {
            instance.setValue(
              rowKey,
              COLUMN_CODE.EDIT,
              EDIT_ACTION_CODE.UPDATE,
            );
            ev.stop();
          }
        }
      }

      if (props?.onAfterChange) {
        props?.onAfterChange(ev);
      }
    },
    [
      gridRef,
      props.columns,
      props.gridMode,
      props?.onAfterChange,
      columnComboState,
    ],
  );

  /** 체크박스가 체크된 row를 전부 해제합니다.
   *
   * 파라메터 값으로 rowKey를 하나 넣으면 해당 row를 제외한 나머지 row만 해제됩니다.
   */
  const onUncheckRows = async (rowKey?: number) => {
    const checkRowKeys = gridRef.current.getInstance().getCheckedRowKeys();
    if (rowKey != null) {
      for (let i = 0; i < checkRowKeys?.length; i++) {
        const checkedRowKey = checkRowKeys[i];
        if (rowKey != checkedRowKey)
          gridRef.current.getInstance().uncheck(checkedRowKey);
      }
    } else if (checkRowKeys?.length > 0) {
      gridRef.current.getInstance().uncheckAll();
    }
  };

  /** 단일 선택 함수 입니다. */
  const onSelect = async (rowKey: number) => {
    const instance = gridRef.current.getInstance();
    const editValue = instance.getValue(rowKey, COLUMN_CODE.EDIT);

    if (instance.getCheckedRowKeys().length >= 1) await onUncheckRows(rowKey);

    if (editValue == null || editValue === '') {
      // _edit 컬럼이 빈 값인 경우
      instance.setValue(rowKey, COLUMN_CODE.EDIT, EDIT_ACTION_CODE.SELECT);
    } else {
      instance.uncheck(rowKey);
    }
  };

  /** 다중 선택 함수 입니다. */
  const onMultiSelect = async (rowKey: number) => {
    const instance = gridRef.current.getInstance();
    const editValue = instance.getValue(rowKey, COLUMN_CODE.EDIT);

    if (editValue == null || editValue === '') {
      // _edit 컬럼이 빈 값인 경우
      instance.setValue(rowKey, COLUMN_CODE.EDIT, EDIT_ACTION_CODE.SELECT);
    } else {
      instance.uncheck(rowKey);
    }
  };

  /** 단일 선택 해제 함수 입니다. */
  const onUnselect = async (rowKey?: number) => {
    const instance = gridRef.current.getInstance();
    instance.setValue(rowKey, COLUMN_CODE.EDIT, '');
  };

  /** ✅그리드 클릭 이벤트 */
  const onClick = useCallback(
    async ev => {
      const { targetType, rowKey } = ev;
      const instance = gridRef.current.getInstance();

      if (targetType === 'cell') {
        if (rowKey != null) {
          const editValue = instance.getValue(rowKey, COLUMN_CODE.EDIT);
          if (editValue == null || editValue === '') {
            // _edit 컬럼이 빈 값인 경우
            switch (
              props.gridMode // 현재 모드에 따라 _edit 값을 다르게 삽입
            ) {
              case 'select':
                instance.check(rowKey);
                break;

              case 'multi-select':
                instance.check(rowKey);
                break;

              default:
                break;
            }
          } else {
            // _edit 컬럼이 빈 값이 아닌 경우
            switch (
              props.gridMode // 현재 모드에 따라 _edit 값을 다르게 삽입
            ) {
              case 'select':
                await onUncheckRows(rowKey);
                break;

              case 'multi-select':
                instance.uncheck(rowKey);
                break;

              default:
                break;
            }
          }
        }

        if (props?.onAfterClick) props?.onAfterClick(ev);
      }
    },
    [gridRef, props.gridMode, columns, props.columns, props?.onAfterClick],
  );

  /** ✅체크박스(_checked)에 체크 */
  const onCheck = useCallback(
    async ev => {
      const { rowKey } = ev;
      const rawData = ev?.instance?.store?.data?.rawData[rowKey];

      if (rowKey != null) {
        switch (props.gridMode) {
          case 'delete':
            gridRef.current
              .getInstance()
              .setValue(rowKey, COLUMN_CODE.EDIT, EDIT_ACTION_CODE.DELETE);
            break;

          case 'select':
            onSelect(rowKey);
            break;

          case 'multi-select':
            onMultiSelect(rowKey);
            break;

          default:
            break;
        }

        // 선택된 로우에 클래스네임 적용 (색상 표시 용도)
        // row에 특정 클래스네임이 있는 경우 추가
        const className = rawData?._attributes?.className?.row;
        if (Array.isArray(className) || className == null) {
          if (className?.includes('selected-row') === false) {
            gridRef.current
              .getInstance()
              .addRowClassName(rowKey, 'selected-row');
          }
        } else {
          gridRef.current.getInstance().addRowClassName(rowKey, 'selected-row');
        }
      }
    },
    [gridRef, props.gridMode],
  );

  /** ✅체크박스(_checked)에 체크 해제 */
  const onUncheck = useCallback(
    ev => {
      const { rowKey } = ev;
      const rawData = ev?.instance?.store?.data?.rawData[rowKey];

      if (rowKey != null) {
        onUnselect(rowKey);

        const classNameRow = rawData?._attributes?.className?.row;
        if (Array.isArray(classNameRow)) {
          if (classNameRow?.includes('selected-row')) {
            gridRef.current
              .getInstance()
              .removeRowClassName(rowKey, 'selected-row');
          }
        }
      }
    },
    [gridRef, props.gridMode],
  );

  /** ✅체크박스(_checked)에 전체 체크 */
  const onCheckAll = useCallback(
    ev => {
      // const rawDatas = ev?.instance?.store?.data?.rawData;
      const filterdDatas: any[] = ev?.instance?.store?.data?.filteredRawData;
      const rowCount: number = filterdDatas?.length;

      if (props.gridMode === 'select') {
        onUncheckRows();
        return;
      }

      if (rowCount > 0) {
        for (let i = 0; i < rowCount; i++) {
          const rowKey = filterdDatas[i]?.rowKey;
          switch (props.gridMode) {
            case 'delete':
              gridRef.current
                .getInstance()
                .setValue(rowKey, COLUMN_CODE.EDIT, EDIT_ACTION_CODE.DELETE);
              break;

            case 'multi-select':
              gridRef.current
                .getInstance()
                .setValue(rowKey, COLUMN_CODE.EDIT, EDIT_ACTION_CODE.SELECT);
              break;

            default:
              break;
          }

          // row에 특정 클래스네임이 있는 경우 추가
          const className = filterdDatas[i]?._attributes?.className?.row;
          if (Array.isArray(className) || className == null) {
            if (className?.includes('selected-row') === false) {
              gridRef.current
                .getInstance()
                .addRowClassName(rowKey, 'selected-row');
            }
          }
        }
      }
    },
    [gridRef, props.gridMode],
  );

  /** ✅체크박스(_checked)에 전체 체크 해제 */
  const onUncheckAll = useCallback(
    ev => {
      // const rawDatas:any[] = ev?.instance?.store?.data?.rawData;
      const filterdDatas: any[] = ev?.instance?.store?.data?.filteredRawData;
      const rowCount: number = filterdDatas?.length;

      if (rowCount > 0) {
        for (let i = 0; i < rowCount; i++) {
          const rowKey = filterdDatas[i]?.rowKey;
          if (rowKey != null) {
            switch (props.gridMode) {
              case 'delete':
              case 'select':
              case 'multi-select':
                gridRef?.current?.getInstance()?.uncheck(rowKey);
                break;

              default:
                break;
            }
          }
        }
      }
    },
    [gridRef, props.gridMode],
  );

  /** ✅멀티팝업 행추가 */
  const onAddPopupRow = async () => {
    const { rowAddPopupInfo } = props;
    // 팝업 부르기
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
      popupContent['datagridProps']['columns'] = rowAddPopupInfo.columns;
    } else {
      popupContent = getPopupForm(rowAddPopupInfo.popupKey);
      popupContent['params'] = {};
    }

    if (typeof rowAddPopupInfo.dataApiSettings === 'function') {
      const apiSettings = rowAddPopupInfo.dataApiSettings();
      popupContent = { ...popupContent, ...rowAddPopupInfo, ...apiSettings };
      // popupContent['uriPath'] = apiSettings?.uriPath;
      // popupContent['params'] = apiSettings?.params;
      // popupContent['searchProps'] = apiSettings?.searchProps;
      // popupContent['inputGroupProps'] = apiSettings?.inputGroupProps;

      // 전처리 함수 실행
      if (apiSettings?.onInterlock != null) {
        const showModal: boolean = apiSettings?.onInterlock();
        if (!showModal) return;
      }

      // beforeOk
      if (apiSettings?.onBeforeOk != null) {
        onBeforeOk = apiSettings.onBeforeOk;
      }

      // afterOk
      if (apiSettings?.onAfterOk != null) {
        onAfterOk = apiSettings.onAfterOk;
      }
    } else {
      popupContent = {
        ...popupContent,
        ...rowAddPopupInfo,
        ...rowAddPopupInfo.dataApiSettings,
      };
      // popupContent['uriPath'] = rowAddPopupInfo.dataApiSettings.uriPath;
      // popupContent['params'] = rowAddPopupInfo.dataApiSettings.params;

      // 전처리 함수 실행
      if (rowAddPopupInfo.dataApiSettings?.onInterlock != null) {
        const showModal: boolean =
          rowAddPopupInfo.dataApiSettings?.onInterlock();
        if (!showModal) return;
      }

      // beforeOk
      if (rowAddPopupInfo.dataApiSettings?.onBeforeOk != null) {
        onBeforeOk = rowAddPopupInfo.dataApiSettings.onBeforeOk;
      }

      // afterOk
      if (rowAddPopupInfo.dataApiSettings?.onAfterOk != null) {
        onAfterOk = rowAddPopupInfo.dataApiSettings.onAfterOk;
      }
    }

    const updateColumns: { original: string; popup: string }[] =
      rowAddPopupInfo.columnNames;
    const childGridId = uuidv4();

    // setLoading(true);
    let title = popupContent?.modalProps?.title;
    const word = '다중선택';

    if (title != null && String(title).length > 0) {
      title += ' - ' + word;
    } else {
      title = word;
    }

    await getData(popupContent.params, popupContent.uriPath)
      .then(res => {
        // 데이터를 불러온 후 모달을 호출합니다.
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
                  { popupGrid: { ...child }, parentGrid: { ...$this }, ev: {} },
                  rows,
                )
              )
                return;
            }

            rows?.forEach(row => {
              let newRow = {};
              if (typeof row === 'object') {
                updateColumns.forEach(columnName => {
                  // 기본값 불러오기
                  const column = columns.filter(
                    el => el.name === columnName.original,
                  )[0];

                  // 값 설정
                  newRow[columnName.original] =
                    row[columnName.popup] != null
                      ? row[columnName.popup]
                      : typeof column?.defaultValue === 'function'
                      ? column?.defaultValue(props, row)
                      : column?.defaultValue;
                });

                // 행 추가
                onAppendRow(newRow);
              }
            });

            if (onAfterOk != null) {
              onAfterOk(
                { popupGrid: { ...child }, parentGrid: { ...$this }, ev: {} },
                rows,
              );
            }
          },
          cancelText: '취소',
          maskClosable: false,
        });
      })
      .catch(e => {
        // 에러 발생시
        modal.error({
          icon: null,
          content: <Result type="loadFailed" />,
        });
      }); //.finally(() => setLoading(false));
  };

  const onLoadPopup = (ev, info?: { rowKey: number; columnName: string }) => {
    const { targetType } = ev;
    const rowKey = ev?.rowKey === 0 ? 0 : ev?.rowKey || info?.rowKey;
    const columnName = ev?.columnName || info?.columnName;

    // 팝업키는 여부 결정
    if (targetType !== 'cell') return;

    if (['create', 'update'].includes(props.gridMode)) {
      props.columns.forEach(column => {
        if (column.name === columnName) {
          if (column?.format === 'popup' && column?.editable === true) {
            // 팝업 부르기
            let popupInfo: IGridPopupInfo = null;
            let updateColumns: { original: string; popup: string }[] = [];

            for (let i = 0; i < props.gridPopupInfo?.length; i++) {
              const columns = props.gridPopupInfo[i].columnNames;
              updateColumns = columns;

              for (let z = 0; z < columns.length; z++) {
                if (columns[z].original === columnName) {
                  popupInfo = props.gridPopupInfo[i];
                  break;
                }
              }
              if (popupInfo != null) {
                break;
              }
            }

            if (popupInfo == null) return;
            let popupContent: IPopupItemsRetrunProps = {
              datagridProps: {
                gridId: null,
                columns: null,
              },
              uriPath: null,
              params: null,
              searchProps: null,
              inputGroupProps: null,
            };

            let onBeforeOk = null;
            let onAfterOk = null;

            // 전처리 함수 실행
            if (popupInfo?.popupKey == null) {
              popupContent['datagridProps']['columns'] = popupInfo.columns;

              if (typeof popupInfo.dataApiSettings === 'function') {
                const apiSettings = popupInfo.dataApiSettings(ev);
                popupContent['uriPath'] = apiSettings?.uriPath;
                popupContent['params'] = apiSettings?.params;
                // popupContent['searchProps'] = apiSettings?.searchProps;
                // popupContent['inputGroupProps'] = apiSettings?.inputGroupProps;

                // 전처리 함수 실행
                if (apiSettings?.onInterlock != null) {
                  const showModal: boolean = apiSettings?.onInterlock();
                  if (!showModal) return;
                }

                // beforeOk
                if (apiSettings?.onBeforeOk != null) {
                  onBeforeOk = apiSettings.onBeforeOk;
                }

                // afterOk
                if (apiSettings?.onAfterOk != null) {
                  onAfterOk = apiSettings.onAfterOk;
                }
              } else {
                popupContent['uriPath'] = popupInfo.dataApiSettings.uriPath;
                popupContent['params'] = popupInfo.dataApiSettings.params;

                // 전처리 함수 실행
                if (popupInfo.dataApiSettings?.onInterlock != null) {
                  const showModal: boolean =
                    popupInfo.dataApiSettings?.onInterlock();
                  if (!showModal) return;
                }

                // beforeOk
                if (popupInfo.dataApiSettings?.onBeforeOk != null) {
                  onBeforeOk = popupInfo.dataApiSettings.onBeforeOk;
                }

                // afterOk
                if (popupInfo.dataApiSettings?.onAfterOk != null) {
                  onAfterOk = popupInfo.dataApiSettings.onAfterOk;
                }
              }
            } else {
              popupContent = getPopupForm(popupInfo.popupKey);
              popupContent['params'] = {};
            }

            const childGridId = uuidv4();

            // 이것 때문에 리렌더링이 발생하면서 하위 그리드의 데이터가 날아가는 것처럼 보이는 현상이 발생함 (행추가 같은 멀티 팝업은 이런 현상이 없던데 여기만 그럼)
            // setLoading(true);

            getData<any[]>(popupContent.params, popupContent.uriPath)
              .then(res => {
                // 데이터를 불러온 후 모달을 호출합니다.
                if (typeof res === 'undefined') {
                  throw new Error('에러가 발생되었습니다.');
                }

                let title = popupContent?.modalProps?.title;
                const word = '단일선택';

                if (title != null && String(title).length > 0) {
                  title = title + ' - ' + word;
                } else {
                  title = word;
                }

                if (column?.name === columnName && !column?.requiredField) {
                  if (res?.length > 0) {
                    const keys = Object.keys(res);
                    let emptyValue = {};
                    keys?.forEach(key => {
                      emptyValue[key] = null;
                    });

                    res?.unshift(emptyValue);
                  }
                }

                modal.confirm({
                  title,
                  width: '80%',
                  content: (
                    <>
                      {/* {popupContent?.searchProps ? <Searchbox {...popupContent.searchProps}/> : null}
                    {popupContent?.inputGroupProps ? <InputGroupbox {...popupContent.inputGroupProps}/> : null} */}
                      <Datagrid
                        ref={childGridRef}
                        gridId={childGridId}
                        {...popupContent.datagridProps}
                        gridMode="select"
                        data={res}
                      />
                    </>
                  ),
                  icon: null,
                  okText: '선택',
                  onOk: close => {
                    const instance = gridRef.current.getInstance();
                    const child = childGridRef.current.getInstance();
                    const row = child.getCheckedRows()[0];
                    let isClose: boolean = false;

                    if (onBeforeOk != null) {
                      if (
                        !onBeforeOk(
                          { popupGrid: child, parentGrid: instance, ev: ev },
                          [row],
                        )
                      )
                        return;
                    }

                    if (typeof row === 'object') {
                      updateColumns.forEach(column => {
                        instance.setValue(
                          rowKey,
                          column.original,
                          row[column.popup],
                        );
                      });
                      isClose = true;
                    } else {
                      message.warn('항목을 선택해주세요.');
                    }

                    instance.refreshLayout();

                    if (onAfterOk != null) {
                      onAfterOk(
                        { popupGrid: child, parentGrid: instance, ev: ev },
                        [row],
                      );
                    }

                    if (isClose) {
                      close();
                    }
                  },
                  onCancel: () => setGridFocus(gridRef),
                  cancelText: '취소',
                  maskClosable: false,
                });

                setDblPopupInfo({
                  popupId: null,
                  gridRef: childGridRef,
                  data: res,
                });
              })
              .catch(e => {
                // 에러 발생시
                modal.error({
                  icon: null,
                  content: <Result type="loadFailed" />,
                });
              }); //.finally(() => setLoading(false));
          }
        }
      });
    }
  };

  /** ✅그리드 키보드 액션 이벤트 */
  const onKeyDown = useCallback(
    async ev => {
      const { columnName, rowKey, keyboardEvent } = ev;
      const value = ev?.instance?.getValue(rowKey, columnName);
      const column = props.columns.find(column => column.name === columnName);

      if (columnName === COLUMN_CODE.CHECK) return;

      if (keyboardEvent?.keyCode === 32 || keyboardEvent?.keyCode === 13) {
        // Space
        // 셀 값 수정 가능한 상태일 떼, popup타입의 셀에서 space를 누른 경우 팝업 호출
        if (
          ['create', 'update']?.includes(props.gridMode) &&
          column?.editable == true
        ) {
          switch (column?.format) {
            case 'check':
              ev?.instance?.setValue(rowKey, columnName, !!!value);
              break;

            case 'popup':
              onLoadPopup(
                { ...ev, targetType: 'cell' },
                { rowKey, columnName },
              );
              break;
          }
          return;
        }

        if (props.gridMode !== 'select' && props.gridMode !== 'multi-select')
          return;

        if (rowKey == null) return;
        const editValue = gridRef.current
          .getInstance()
          .getValue(rowKey, COLUMN_CODE.EDIT);

        if (editValue == null || editValue === '') {
          // _edit 컬럼이 빈 값인 경우
          switch (
            props.gridMode // 현재 모드에 따라 _edit 값을 다르게 삽입
          ) {
            case 'select':
            case 'multi-select':
              gridRef.current.getInstance().check(rowKey);
              break;

            default:
              break;
          }
        } else {
          // _edit 컬럼이 빈 값이 아닌 경우
          switch (
            props.gridMode // 현재 모드에 따라 _edit 값을 다르게 삽입
          ) {
            case 'select':
              await onUncheckRows(rowKey);
              break;

            case 'multi-select':
              gridRef.current.getInstance().uncheck(rowKey);
              break;

            default:
              break;
          }
        }
      }

      if (props?.onAfterKeyDown) {
        props.onAfterKeyDown(ev);
      }
    },
    [gridRef, props.gridMode, props?.onAfterKeyDown],
  );
  //#endregion

  //#region 🔶 필터 핸들링
  const [filterInfo, setFilterInfo] = useState<any[]>(null);
  // const [previousFilterData, setPreviousFilterData] = useState<any[]>(null);
  /** 필터 핸들링 */
  const onBeforeFilter = useCallback(
    ev => {
      const instance = gridRef?.current?.getInstance();
      const { columnFilterState, type, columnName } = ev;
      const { code, value } = columnFilterState[0];

      if (!['date', 'datetime'].includes(type)) return;

      const chk =
        filterInfo?.findIndex(el => el?.columnName === columnName) || -1;
      if (chk > -1) return;

      const format = ENUM_FORMAT.DATE;

      const data = ev?.instance?.store?.data?.rawData;
      const filterdData = data?.filter(el => {
        let compValue = el[columnName];

        compValue = dayjs(compValue).locale('ko').format(format);

        switch (code) {
          case 'eq':
            return compValue === value;

          case 'ne':
            return compValue !== value;

          case 'after':
            return compValue > value;

          case 'afterEq':
            return compValue >= value;

          case 'before':
            return compValue < value;

          case 'beforeEq':
            return compValue <= value;

          default:
            break;
        }
      });

      // filter state 값 (데이터를 리셋해도 필터 효과가 남아있게 합니다.)
      const filterState = { columnName, columnFilterState };
      instance.resetData(filterdData, { filterState });

      ev.stop();

      setFilterInfo(null);
      // setUnfilterTrigger(data);
      // setPreviousFilterData(data);
    },
    [gridRef, props.gridMode],
  );

  /** ⛔필터 초기화 이벤트 */
  // const [unfilterTrigger, setUnfilterTrigger] = useState<any>(null);
  const onBeforeUnfilter = useCallback(
    ev => {
      if (filterInfo) return;
      const instance = gridRef?.current?.getInstance();
      const { filterState, columnName } = ev;

      const columnInfo = columns?.find(el => el?.name === columnName);
      if (!['date', 'datetime'].includes(columnInfo?.filter?.type)) return;

      const _filterState = filterState?.filter(
        el => el.columnName !== columnName,
      );
      const _filterInfo = _filterState?.map(el => {
        return {
          columnName: el?.columnName,
          columnFilterState: el?.state,
        };
      });

      // const rawData:any[] = ev?.instance?.store?.data?.rawData;

      instance.resetData(originData);
      ev.stop();

      setFilterInfo(_filterInfo);
      // setUnfilterTrigger(rawData);
    },
    [gridRef, props.gridMode, originData, columns],
  );

  // useLayoutEffect(() => {
  //   if (!unfilterTrigger) return;

  //   const instance = gridRef?.current?.getInstance();
  //   // const rawData = instance?.store?.data?.rawData;
  //   console.log('unfilterTrigger', unfilterTrigger);
  //   previousFilterData?.forEach(row => {
  //     const currentRow = unfilterTrigger?.find(rawEl => rawEl?.rowKey === row?.rowKey);
  //     if (currentRow?._attributes?.checked) {
  //       instance.check(currentRow?.rowKey);

  //     } else if (row?._attributes?.checked) {
  //       instance.check(row?.rowKey);
  //     }
  //   });

  //   setPreviousFilterData(null);
  //   setUnfilterTrigger(null);
  // }, [gridRef, unfilterTrigger]);

  useLayoutEffect(() => {
    if (!filterInfo) return;
    filterInfo?.forEach(el => {
      gridRef?.current
        ?.getInstance()
        .filter(el?.columnName, el?.columnFilterState);
    });

    setFilterInfo(null);
  }, [gridRef, filterInfo, originData]);
  //#endregion

  /** ✅rowHeader 세팅 */
  const rowHeaders = useMemo<any[]>(() => {
    if (['select', 'multi-select', 'delete'].includes(props.gridMode)) {
      return ['checkbox', 'rowNum'];
    } else {
      return ['rowNum'];
    }
  }, []);

  //#region 🔶 ⛔그리드 사이즈 조정
  // 그리드 사이즈 재조정 ❗그리드 위아래로 출력되는 화면에선 clientHeight 관련 에러 발생함 (자세한 에러 내용은 현황화면에서 console 확인바람)
  const layoutState = useRecoilValue(layoutStore.state);
  useLayoutEffect(() => {
    gridRef?.current?.getInstance().refreshLayout();
  }, [layoutState, gridRef?.current]);
  //#endregion

  /** ✅WILL MOUNT : 기본 값 세팅 */
  useLayoutEffect(() => {
    // 이벤트 세팅
    const instance = gridRef?.current?.getInstance();
    instance.on('afterChange', onAfterChange);

    return () => {
      instance.off('afterChange');
    };
  }, [gridRef, onAfterChange]);

  useLayoutEffect(() => {
    // 이벤트 세팅
    const instance = gridRef?.current?.getInstance();
    instance.on('keydown', onKeyDown);

    return () => {
      instance.off('keydown');
    };
  }, [gridRef, onKeyDown]);

  useLayoutEffect(() => {
    // 이벤트 세팅
    const instance = gridRef.current.getInstance();
    instance.on('beforeFilter', onBeforeFilter);

    return () => {
      instance.off('beforeFilter');
    };
  }, [gridRef, onBeforeFilter]);

  useLayoutEffect(() => {
    // 이벤트 세팅
    const instance = gridRef.current.getInstance();
    instance.on('beforeUnfilter', onBeforeUnfilter);

    return () => {
      instance.off('beforeUnfilter');
    };
  }, [gridRef, onBeforeUnfilter]);

  useLayoutEffect(() => {
    // 이벤트 세팅
    const instance = gridRef.current.getInstance();
    instance.on('afterUnfilter', props.onAfterUnfilter);

    return () => {
      instance.off('afterUnfilter');
    };
  }, [gridRef, props.onAfterUnfilter]);

  useLayoutEffect(() => {
    // 이벤트 세팅
    const instance = gridRef.current.getInstance();
    if (props.onAfterFilter) {
      instance.on('afterFilter', props.onAfterFilter);
    }
    return () => {
      instance.off('afterFilter');
    };
  }, [gridRef, props.onAfterFilter]);

  useLayoutEffect(() => {
    // combo 포맷을 사용하는 컬럼에 적용하기 위해 콤보리스트를 세팅
    if (columnComboState?.length > 0) return;
    if (!props.columns) return;
    if (!props.gridComboInfo) return;

    const columns = props.columns;
    const comboInfos = props.gridComboInfo;

    // 콤보 리스트 상태 값 저장
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];

      if (column.format === 'combo') {
        let matchColumnName: string = null;
        let columnName: IGridComboColumnInfo = null;
        let type = null;

        const comboInfo = comboInfos.find(
          el =>
            el.columnNames.findIndex(subEl => {
              if (subEl.codeColName.original === column.name) type = 'code';
              else if (subEl.textColName.original === column.name)
                type = 'text';

              if (type) {
                columnName = subEl;
                matchColumnName =
                  subEl[type === 'code' ? 'textColName' : 'codeColName']
                    .original;
              }

              return type != null;
            }) !== -1,
        );

        if (comboInfo && columnName && matchColumnName && type) {
          const comboList = getGridComboItem(comboInfo, columnName);
          setColumnComboState(crr => [
            ...crr,
            {
              columnName: column.name,
              matchColumnName,
              type,
              values: comboList,
            },
          ]);
        }
      }
    }
  }, [props.columns, props.gridComboInfo]);

  useLayoutEffect(() => {
    gridRef?.current?.getInstance()?.refreshLayout();
  }, [gridRef, data]);

  const leftAlignExtraButtons = useMemo(() => {
    return props.extraButtons
      ?.filter(el => el?.align !== 'right')
      ?.map((el, index) => {
        const { buttonAction, buttonProps } = el;
        return (
          <Button
            key={buttonProps.text + index}
            btnType="buttonFill"
            heightSize="small"
            fontSize="small"
            {...buttonProps}
            onClick={ev =>
              buttonAction(ev, props, {
                gridRef,
                childGridRef,
                columns,
                data,
                modal,
                onAppendRow,
              })
            }
          >
            {buttonProps.text}
          </Button>
        );
      });
  }, [props.extraButtons]);

  const rightAlignExtraButtons = useMemo(() => {
    return props.extraButtons
      ?.filter(el => el?.align === 'right')
      ?.map((el, index) => {
        const { buttonAction, buttonProps } = el;
        return (
          <Button
            key={buttonProps.text + index}
            btnType="buttonFill"
            heightSize="small"
            fontSize="small"
            {...buttonProps}
            onClick={ev =>
              buttonAction(ev, props, {
                gridRef,
                childGridRef,
                columns,
                data,
                modal,
                onAppendRow,
              })
            }
          >
            {buttonProps.text}
          </Button>
        );
      });
  }, [props.extraButtons]);

  return (
    <div>
      {props.gridMode === 'create' && props.hiddenActionButtons !== true ? (
        <div className="modalButton">
          {props?.extraButtons ? (
            <Space
              size={[5, null]}
              style={{
                width:
                  props.extraButtons?.filter(el => el?.align !== 'right')
                    ?.length > 0
                    ? '50%'
                    : null,
                justifyContent: 'left',
              }}
            >
              {leftAlignExtraButtons}
            </Space>
          ) : null}
          <Space
            size={[5, null]}
            style={{
              width:
                props.extraButtons?.filter(el => el?.align !== 'right')
                  ?.length > 0
                  ? '50%'
                  : '100%',
              justifyContent: 'right',
            }}
          >
            {rightAlignExtraButtons}
            {props?.rowAddPopupInfo ? (
              <Button
                btnType="buttonFill"
                widthSize="medium"
                heightSize="small"
                fontSize="small"
                ImageType="plus"
                onClick={onAddPopupRow}
              >
                행 추가
              </Button>
            ) : (
              <Button
                btnType="buttonFill"
                widthSize="medium"
                heightSize="small"
                fontSize="small"
                ImageType="plus"
                onClick={() => onPrepentRow()}
              >
                행 추가
              </Button>
            )}
            <Button
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="cancel"
              onClick={onCancelRow}
            >
              행 취소
            </Button>
          </Space>
        </div>
      ) : props?.extraButtons ? (
        <div className="modalButton">
          {
            <>
              <Space
                size={[5, null]}
                style={{
                  width:
                    props.extraButtons?.filter(el => el?.align !== 'right')
                      ?.length > 0
                      ? '50%'
                      : null,
                  justifyContent: 'left',
                }}
              >
                {leftAlignExtraButtons}
              </Space>
              <Space
                size={[5, null]}
                style={{
                  width:
                    props.extraButtons?.filter(el => el?.align !== 'right')
                      ?.length > 0
                      ? '50%'
                      : '100%',
                  justifyContent: 'right',
                }}
              >
                {rightAlignExtraButtons}
              </Space>
            </>
          }
        </div>
      ) : null}

      <Grid
        id={props.gridId}
        ref={gridRef}
        columns={columns}
        columnOptions={columnOptions}
        summary={summary}
        data={data}
        rowHeaders={rowHeaders}
        rowHeight={rowHeight}
        minRowHeight={minRowHeight}
        width={props.width || 'auto'}
        bodyHeight={props.height || 500}
        onClick={props.onClick || onClick}
        onDblclick={props.onDblclick || onDblClick}
        onCheck={props.onCheck || onCheck}
        onUncheck={props.onUncheck || onUncheck}
        onCheckAll={props.onCheckAll || onCheckAll}
        onUncheckAll={props.onUncheckAll || onUncheckAll}
        treeColumnOptions={props.treeColumnOptions}
        // onFilter={props.onFilter || onFilter}
        // onGridBeforeDestroy={onGridBeforeDestroy}
        // onGridMounted={onGridMounted}
        // onKeyDown={onKeyDown}
        draggable={props.draggable}
      />
      {contextHolder}
    </div>
  );
});

const Datagrid = React.memo(BaseDatagrid);

const ColumnManager = class {
  private isChecked: boolean;

  constructor() {
    this.isChecked = false;
  }

  toggle() {
    this.isChecked != this.isChecked;
  }
};

export default Datagrid;
