import { Dispatch, MutableRefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IDatagridProps, TGridMode } from '~components/UI/datagrid-new';
import { checkGridData, executeData, getData, getModifiedRows, getUserFactoryUuid, isModified, saveGridData } from '~/functions';
import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import { ISearchItem } from '~/components/UI/searchbox';
import { IInputUiGroupItem } from '~/components/UI/input-ui-groupbox';
import { IInputGroupboxItem } from '~/components/UI/input-groupbox/input-groupbox.ui';


//#region 싱글 그리드 페이지 관련 리듀서
export const singleGridReducer = (state, action) => {
  switch (action.type) {
    case 'setData':
      return {...state, data: action.data};

    case 'resetData':
      return {...state, data:[]};

    case 'setGridMode':
      return {...state, gridMode: action.gridMode};
    
    case 'setVisible':
      return {...state, visible: action.visible};

    case 'setFocusedCell':
      return {...state, focusedCell: action.focusedCell};

    case 'setFocusedRowKey':
      return {...state, focusedRowKey: action.focusedRowKey};

    case 'setSearchParams':
      return {...state, searchParams: action.searchParams};
  
    default:
      return state;
  }
}

export interface IInitialGridState extends IDatagridProps {
  searchParams?: object;
  searchUriPath?: string;
  saveParams?: object;
  saveUriPath?: string;

  searchItems?: ISearchItem[];
  inputItems?: IInputGroupboxItem[];
}


/** 신규 생성 팝업 그리드의 상태 초기값 */
export const createGridInit:IInitialGridState = {
  gridId: uuidv4(),
  /** 페이지에서 사용할 때 값을 반드시 오버라이드해서 세팅해주세요!! */
  columns: null,
  gridMode:'create' as TGridMode,
  data: [],
}


/** 싱글 그리드 페이지 기본 액션 */
export const singleGridEvents = {
  /** 삭제 모드로 전환 */
  onDeleteMode: (dispatch:Dispatch<any>) => {
    dispatch({type:'setGridMode', gridMode:'delete'});

  },

  /** 수정 모드로 전환 */
  onUpdateMode: (dispatch:Dispatch<any>) => {
    dispatch({type:'setGridMode', gridMode:'update'});
  },


  /** 편집 취소 */
  onCancel:(ref:MutableRefObject<Grid>, dispatch:Dispatch<any>, columns, modal) => {
    // 그리드의 데이터를 편집한 이력이 있는지 체크
    if (isModified(ref, columns)) { // 편집 이력이 있는 경우
      modal.confirm({
        title: '편집 취소',
        // icon: <ExclamationCircleOutlined />,
        content: '편집된 이력이 있습니다. 편집을 취소하시겠습니까?',
        onOk:() => {
          dispatch({type:'setGridMode', gridMode:'view'});
        },
        onCancel:() => {
        },
        okText: '예',
        cancelText: '아니오',
      });

    } else { // 편집 이력이 없는 경우
      dispatch({type:'setGridMode', gridMode:'view'});
    }
  },


  /** 데이터 저장 */
  onSave: (saveType:'basic'|'headerInclude', ref:MutableRefObject<Grid>, dispatch:Dispatch<any>, columns, saveUriPath:string, optionParams:object={}, modal) => {
    // 그리드의 데이터를 편집한 이력이 있는지 체크
    if (isModified(ref, columns)) { // 편집 이력이 있는 경우
      modal.confirm({
        icon: null,
        title: '저장',
        // icon: <ExclamationCircleOutlined />,
        content: '편집된 내용을 저장하시겠습니까?',
        onOk: async () => {
          let modifiedRows = null;
          

          // 기본 저장 방식
          if (saveType == null || saveType === 'basic') {
            modifiedRows = getModifiedRows(ref, columns);

            // 저장 가능한지 체크
            const chk:boolean = await checkGridData(columns, modifiedRows);

            if (chk === false) return;

            saveGridData(modifiedRows, columns, saveUriPath, optionParams).then(() => {
              dispatch({type:'setGridMode', gridMode:'view'});
            });


          // (header / detail 형식으로 변환 후 저장)
          } else if (saveType === 'headerInclude') {
            let methodType:'delete' | 'post' | 'put' | 'patch' = 'post';
            let detailDatas = [];

            const modifiedRows = await getModifiedRows(ref, columns);

            const {createdRows, updatedRows, deletedRows} = modifiedRows;

            if (createdRows?.length > 0) {
              detailDatas = createdRows;
              methodType = 'post';

            } else if (updatedRows?.length > 0) {
              detailDatas = updatedRows;
              methodType = 'put';

            } else if (deletedRows?.length > 0) {
              detailDatas = deletedRows;
              methodType = 'delete';
            }

            const chk:boolean = await checkGridData(columns, modifiedRows);

            if (chk !== true) {
              return;
            }

            // 옵션 데이터 추가
            for (let i = 0; i < detailDatas.length; i++) {
              detailDatas[i]['factory_uuid'] = getUserFactoryUuid();
              
              // alias에 따라 키값 변경
              columns?.forEach((column) => {
                if (column?.alias != null) {
                  detailDatas[i][column?.alias] = detailDatas[i][column?.name];
                  delete detailDatas[i][column?.name];
                }
              });
              // const optionKeys = Object.keys(optionParams);

              // optionKeys.forEach((optionKey) => {
              //   detailDatas[i][optionKey] = optionParams[optionKey];
              // });
            }


            // 헤더 데이터 추가
            const optionKeys = Object.keys(optionParams);

            let headerData = {}
            optionKeys.forEach((optionKey) => {
              headerData[optionKey] = optionParams[optionKey];
            });

            headerData['factory_uuid'] = getUserFactoryUuid();

            // 최종적으로 저장될 데이터
            const saveData = {
              header: headerData,
              details: detailDatas,
            }

            if (headerData?._saveType != null) {
              methodType = headerData['_saveType'];
            }

            // 저장
            await executeData(saveData, saveUriPath, methodType, 'success').then((success) => {
              if (success === true) {
                dispatch({type:'setGridMode', gridMode:'view'});
              }

            }).catch(e => {
              console.log('Error',e);
        
            });
          }

        },
        onCancel: () => {
        },
        okText: '예',
        cancelText: '아니오',
      });

    } else { // 편집 이력이 없는 경우
      message.warn('편집된 데이터가 없습니다.');
    }
  },


  /** 데이터 검색 */
  onSearch: async (ref:MutableRefObject<Grid>, dispatch:Dispatch<any>, searchUriPath:string, searchParams:object, columns, setLoading, options:{dataReturnType?:'basic'|'report'}={}) => {
    setLoading(true);

    getData(searchParams, searchUriPath).then((res) => {
      // 데이터 적용
      if (options.dataReturnType === 'report') {
        dispatch({type:'setData', data:res[0]?.datas});

      } else {
        dispatch({type:'setData', data:res});
      }

      // 포커스 찾기
      for (let i = 0; i < columns?.length; i++) {
        let column = columns[i];
        if (column?.hidden !== true) {
          ref.current.getInstance().focus(0, column.name, true);
          break;
        }
      }
      setLoading(false);
    });
  },


  /** 신규 데이터 생성 팝업 */
  onShowCreatePopup: (setCreatePopupVisible) => {
    setCreatePopupVisible(true);
  }
}
//#endregion