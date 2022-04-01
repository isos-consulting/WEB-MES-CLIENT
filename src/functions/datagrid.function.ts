import React from 'react';
import {IGridModifiedRows} from '../components/UI/datagrid-new/datagrid.ui.type';
import {getUserInfoKeys, getUserFactoryUuid} from './storage.function';
import {cleanupKeyOfObject, getObjectKeyDuplicateCheck, getToday, isNumber} from './util.function';
import {executeData, getData} from './comm.function';
import {message} from 'antd';
import { MutableRefObject } from 'react';
import Grid from '@toast-ui/react-grid';
import { COLUMN_CODE, EDIT_ACTION_CODE, IGridColumn, TGridMode } from '~/components/UI/datagrid-new';
import dayjs from 'dayjs';
import { ModalStaticFunctions } from 'antd/lib/modal/confirm';
import _ from 'lodash';



/**
 * ✅그리드에서 조작한 데이터를 저장합니다.
 * @param data 저장할 데이터
 * @param uriPath 도메인 뒤에 붙는 URL
 * @param id grid id (recoil key값으로 사용) - 현재 사용안함
 * @param disableResultMessage 결과 메시지 비허용 여부 (기본값:false)
 * @returns 
 */
export const saveGridData = async (
  data: IGridModifiedRows,
  columns: IGridColumn[],
  uriPath: string,
  optionParams?: object,
  disableResultMessage: boolean = false,
  methodType?:{create?:string, update?:string, delete?:string},

):Promise<{success:boolean, count:number, savedData: any[]}> => {
  
  let resultChk:boolean = true;
  let resultCount:number = 0;
  let saveData = _.cloneDeep(data);

  const editType = ['createdRows', 'updatedRows', 'deletedRows'];
  const _methodType = [
    methodType?.create || 'post', 
    methodType?.update || 'put', 
    methodType?.delete || 'delete'
  ];
  
  try {
    // 추가,수정,삭제한 데이터 이력을 순서대로 저장합니다.
    for (let i = 0; i < editType.length; i++) {
      if (saveData[editType[i]]?.length > 0) {
        // alias 변경
        for (let z = 0; z < saveData[editType[i]]?.length; z++) {
          for (let y = 0; y < columns?.length; y++) {
            if (columns[y]?.alias != null) {
              saveData[editType[i]][z][columns[y]?.alias] = saveData[editType[i]][z][columns[y].name];
              delete saveData[editType[i]][z][columns[y].name];
            }
          }
        }


        for (let z = 0; z < saveData[editType[i]]?.length; z++) {
          for (let y = 0; y < columns?.length; y++) {
            // empty 허용하는 셀인지 확인 (비허용이면 해당 컬럼의 내용만 지우고 서버에 전달함)
            if ((columns[y]?.disableStringEmpty === true || columns[y]?.format !== 'text') && saveData[editType[i]][z][columns[y].name] === '') {
              delete saveData[editType[i]][z][columns[y].name];
            }

            // datetime 형식은 로케일 형식 변경해서 전달
            if (columns[y]?.format === 'datetime') {
              const temp = saveData[editType[i][z][columns[y].name]];
              if (dayjs(temp).isValid) {
                saveData[editType[i][z][columns[y].name]] = dayjs(temp).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
              }
            }
          }
        }

        // 필수값 삽입
        await saveData[editType[i]]?.forEach((value) => {
          // value['uid'] = getUserUid();

          // session 유저 정보의 키와 params로 넘길 키가 중복되는게 있는지 확인 (중복이면 유저 정보에 있는 키는 사용안함)
          if (saveData[editType[i]] != null && getUserInfoKeys() != null) {
            if (getObjectKeyDuplicateCheck(Object.keys(saveData[editType[i]]), getUserInfoKeys()) === false) {
              value['factory_uuid'] = getUserFactoryUuid();
            }
          }
        });

        saveData = saveData[editType[i]];
        
        // 다른 값 덧붙이기
        if (optionParams != null) {
          if (Object.keys(optionParams).length > 0) {
            let tempData = _.cloneDeep(saveData);
            saveData = [];

            for (let z = 0; z < tempData.length; z++) {
              saveData.push({...tempData[z], ...optionParams});
            }
          }
        };


        // 저장
        await executeData(saveData, uriPath, _methodType[i] as 'post' | 'put' | 'patch' | 'delete').then((res) => {
          const {datas, success} = res;
          const {value} = datas;
          if (!success)
            resultChk = false;

          resultCount += value?.count || 0;
          
        }).catch(e => {console.log(e); resultChk = false});
      }

      if (!resultChk) {
        break;
      }
    }

    if (resultCount <= 0) resultChk = false;
      
  } catch(error) {
    // 에러발생
    resultChk = false;
    console.log(error);

  } finally {
    // 저장실패시
    if (!resultChk) {
        if (!disableResultMessage) message.error('저장에 실패하였습니다. 관리자에게 문의하세요.');
        return {
          success: resultChk,
          count: null,
          savedData: null,
        };
    }

    // 저장 성공시
    if (!disableResultMessage) message.info((resultCount !== 0 ? resultCount + '건의 데이터 ' : '') + '저장이 완료되었습니다.');

    // 초기화 후 결과 개수 반환
    return {
      success: resultChk,
      count: resultCount,
      savedData: saveData,
    };
  }
}


type TGridErrorType = 'emptyCell' | 'emptyDatas' | 'dataType' | 'syntax';

/**
* ✅그리드에서 조작한 데이터를 검사합니다.
* @param column 그리드 컬럼
* @param data 저장할 데이터
* @param disableResultMessage 결과 메시지 비허용 여부 (기본값:false)
* @returns 
*/
export const checkGridData = async (
  column: IGridColumn[],
  data: IGridModifiedRows,
  disableResultMessage: boolean = false,
  disabledErrorType: TGridErrorType[] = [],
):Promise<boolean> => {
  let resultChk:boolean = true;
  let errorType:TGridErrorType;
  let chkColumn = _.cloneDeep(column);
  let chkData:IGridModifiedRows = _.cloneDeep(data);
  let errorColName = '';
  // let errorRow = -1;

  const editType = ['createdRows', 'updatedRows'];
  
  try {
    // 저장할 데이터 개수 체크
    if (!!chkData['createdRows']?.length || !!chkData['updatedRows']?.length || !!chkData['deletedRows']?.length) {
      for (let y = 0; y < editType.length; y++) {
        if (chkData[editType[y]]?.length > 0) {
          for (let i = 0; i < chkColumn?.length; i++) {
            // 필수 값 체크
            if (chkColumn[i]?.requiredField === true) {
              for (let z = 0; z < chkData[editType[y]]?.length; z++) {
                let cellValue = chkData[editType[y]][z][chkColumn[i].name];
                if (cellValue == null || String(cellValue)?.replace(/(\s*)/g, "")?.length === 0) {
                  resultChk = false;
                  errorType = 'emptyCell';
                  errorColName = chkColumn[i].header;
                  // errorRow = chkData[editType[y]][z]?._attributes?._rowNum;
                  break;
                }
              }
            }

            // 데이터 타입 체크
            if (chkColumn[i]?.format === 'number') {
              for (let z = 0; z < chkData[editType[y]]?.length; z++) {
                const value = chkData[editType[y]][z][chkColumn[i].name];

                if (value == null || String(value).length === 0) {
                  // 숫자 타입이지만 빈 값이면 저장 데이터에 미포함
                  // ❗ 극단적으로 인자값 자체를 바꾸는 형태라 나중에 수정해야할 수도 있음
                  delete data[editType[y]][z][chkColumn[i].name];

                } else if (isNumber(value) === false) {
                  // 숫자가 아니면 에러
                  resultChk = false;
                  errorType = 'dataType';
                  errorColName = chkColumn[i].header;
                  // errorRow = chkData[editType[y]][z]?._attributes?._rowNum;
                  break;
                }
              }
            }

            if (resultChk === false) break;
          }
        }
      }
    } else {
      // 저장할 데이터가 없는 경우
      resultChk = false;
      errorType = 'emptyDatas';
    }

  } catch (e) {
    resultChk = false;
    errorType = 'syntax';
    console.log(e);
      
  } finally {
    if (!disableResultMessage && resultChk === false) {
      switch (errorType) {
        case 'emptyDatas': 
          if (!disabledErrorType.includes('emptyDatas')) {
            message.warn('저장할 데이터가 없습니다.');
          } else resultChk = true;
          break;

        case 'emptyCell':
          if (!disabledErrorType.includes('emptyCell')) {
            // message.error(errorColName + ' ' + errorRow + '행의 값을 입력하지 않았습니다.');
            message.error(errorColName + '의 값을 입력하지 않았습니다.');
          } else resultChk = true;
          break;
  
        case 'dataType':
          if (!disabledErrorType.includes('dataType')) {
            // message.error(errorColName + ' ' + errorRow + '행의 값 형식이 올바르지 않습니다.');
            message.error(errorColName + '의 값 형식이 올바르지 않습니다.');
          } else resultChk = true;
          break;

        default:
          message.error('오류가 발생했습니다. 관리자에게 문의하세요.');
          break;
      }
    }
  }

  return resultChk;
}



/**
 * ⛔서브토탈 데이터 추출 함수
 * @param datas 실제 테이블 데이터
 * @param key key는 데이터를 합산 시킬 기준 컬럼, name은 기준 컬럼과 같이 보여줘야 할 display 컬럼 (예를 들면 { key: equipmentCode, name: equipmentName })
 * @param values 기준 컬럼 이외 서브토탈에서 사용되는 컬럼명들
 */
export function createSubTotal(
  datas:object[] = [],
  key:any = {key:'', name:''},
  values:string[] = []
) {
  let sortOrder = [], resultArray = [];

  // Key Data To Array (기준컬럼 정리)
  datas.forEach(el => {
    sortOrder.push(el[key.key]);
    sortOrder.push(el[key.name]);
  });

  // JSON Data Loop
  datas.forEach(el => {
    let resultObject = {};

    // JSON Array Check Key Data
    let objFilter = (resultArray.filter(obj => obj[key.key] === el[key.key]).length ? resultArray.filter(obj => obj[key.key] === el[key.key])[0] : null);

    if (!objFilter) {
      resultObject[key.key] = el[key.key];
      resultObject[key.name] = el[key.name];
      values.forEach(v => resultObject[v] = el[v]);
      resultArray.push(resultObject);

    } else values.forEach(v => objFilter[v] += el[v]);
  });

  return resultArray.slice(0,10);
}



/**
* ⛔기준 테이블 컬럼을 가지고 서브토탈 컬럼을 생성
* @param columns 컬럼 데이터
* @param subTotalItems 서브 토탈에 사용될 컬럼명
* @param subTotalKey 데이터를 합산 시킬 기준 컬럼
* @param deleteOption (미사용)
*/
export function createSubTotalColumns(
  columns:any[],
  subTotalItems:any[],
  subTotalKey:any,
  deleteOption:string = 'filter'
) {
  try {
    let subColumns = _.cloneDeep(columns);

    //합계 기준 컬럼과 합산된 데이터 컬럼만 나오게 정리
    subColumns = subColumns.filter(value =>
      value.name === (
        subTotalItems.find(subValue => subValue === value.name) || subTotalKey.name
      )
    );

    //불필요한 필터 제거
    subColumns.forEach(element => {
      delete element[deleteOption]
    });
    
    return subColumns;
      
  } catch (error) {
    return columns;
  }
}



/**
 * ✅데이터 그리드 수정 이력을 반환합니다.
 * @param ref 그리드 reference
 * @param columns 그리드 컬럼
 * @returns 수정 이력 object 반환
 */
export const getModifiedRows = (ref:MutableRefObject<Grid>, columns, datas?) => {
  const _columns = ref.current.props.columns
  const _datas = ref.current.gridInst.getData()
  const instance = ref?.current?.getInstance()?.getModifiedRows();
  console.log(_columns, _datas)
  const modifiedData = {
    createdRows: _datas?.filter(el => el[COLUMN_CODE.EDIT] === EDIT_ACTION_CODE.CREATE) ?? instance?.createdRows,
    deletedRows: _datas?.filter(el => el[COLUMN_CODE.EDIT] === EDIT_ACTION_CODE.DELETE) ?? instance?.deletedRows,
    updatedRows: _datas?.filter(el => el[COLUMN_CODE.EDIT] === EDIT_ACTION_CODE.UPDATE) ?? instance?.updatedRows,
  }
  
  // 생성
  const createdRows = (modifiedData?.createdRows as any)?.filter(el => {
    _columns.forEach(column => {
      if (
        column?.noSave === true ||
        (column.name === COLUMN_CODE.EDIT || column.name === COLUMN_CODE.ATTRIBUTE)
      ) {
        delete el[column.name];
      }
    });
    return el;
  });

  

  // 삭제
  const deletedRows = (modifiedData?.updatedRows as any)?.filter(el => {
    let columnNames = [COLUMN_CODE.EDIT];
    _columns.forEach(column => {
      if (
        column?.noSave === true ||
        (column.name === COLUMN_CODE.EDIT || column.name === COLUMN_CODE.ATTRIBUTE)
      ) {
        delete el[column.name];
      }

      columnNames.push(column.name);
    });

    Object.keys(el).forEach(elName => {
      if (columnNames.includes(elName) === false) {
        delete el[elName];
      }
    });

    return el[COLUMN_CODE.EDIT] === EDIT_ACTION_CODE.DELETE;
  });

  // 수정
  const updatedRows = (modifiedData?.updatedRows as any)?.filter(el => {
    let columnNames = [COLUMN_CODE.EDIT];
    _columns.forEach(column => {
      if (
        column?.noSave === true ||
        (column.name === COLUMN_CODE.EDIT || column.name === COLUMN_CODE.ATTRIBUTE)
      ) {
        delete el[column.name];
      }

      columnNames.push(column.name);
    });

    Object.keys(el).forEach(elName => {
      if (columnNames.includes(elName) === false) {
        delete el[elName];
      }
    });

    return el[COLUMN_CODE.EDIT] === EDIT_ACTION_CODE.UPDATE;
  });

  return {
    createdRows,
    deletedRows,
    updatedRows,
  };
}



/**
 * ✅데이터 그리드 수정 이력 여부를 반환합니다.
 * @param ref 그리드 reference
 * @param columns 그리드 컬럼
 * @returns 수정 이력 여부 반환 (true/false)
 */
export const isModified = (ref:MutableRefObject<Grid>, columns) => {
  const modifiedRows = getModifiedRows(ref, columns)

  if (
    modifiedRows.createdRows?.length === 0 &&
    modifiedRows.updatedRows?.length === 0 &&
    modifiedRows.deletedRows?.length === 0
  ) {
    return false;

  } else {
    return true;
  }
}



/** 그리드 페이지 기준 기능별 액션 함수 */
export const dataGridEvents = {
  /** 삭제 모드로 전환 */
  onDeleteMode: (setGridMode:React.Dispatch<React.SetStateAction<TGridMode>>) => {
    setGridMode('delete');
  },

  /** 수정 모드로 전환 */
  onUpdateMode: (setGridMode:React.Dispatch<React.SetStateAction<TGridMode>>) => {
    setGridMode('update');
  },


  /** 편집 취소 */
  onCancel:(ref:MutableRefObject<Grid>, setGridMode:React.Dispatch<React.SetStateAction<TGridMode>>, columns, modal, defaultGridMode:TGridMode='view') => {
    // 그리드의 데이터를 편집한 이력이 있는지 체크
    if (isModified(ref, columns)) { // 편집 이력이 있는 경우
      modal.confirm({
        title: '편집 취소',
        // icon: <ExclamationCircleOutlined />,
        content: '편집된 이력이 있습니다. 편집을 취소하시겠습니까?',
        onOk:() => {
          setGridMode(defaultGridMode);
        },
        onCancel:() => {
        },
        okText: '예',
        cancelText: '아니오',
      });

    } else { // 편집 이력이 없는 경우
      setGridMode(defaultGridMode);
    }
  },


  /** 데이터 저장 */
  //saveType:'basic'|'headerInclude', ref:MutableRefObject<Grid>, setGridMode:React.Dispatch<React.SetStateAction<TGridMode>>, columns, saveUriPath:string, optionParams:object={}, modal
  onSave: (
    saveType:'basic'|'headerInclude', 
    gridObject:{
      gridRef: MutableRefObject<Grid>,
      columns: IGridColumn[],
      saveUriPath: string,
      setGridMode?:React.Dispatch<React.SetStateAction<TGridMode>>,
      defaultGridMode?: TGridMode,
      methodType?: 'post' | 'put' | 'patch' | 'delete',
      modifiedData?:object
    },
    optionParams:object={},
    modal: Omit<ModalStaticFunctions, "warn">,
    onAfterSave?:(values?)=>void,
    disableEditCheck?:boolean,
  ) => {
    const {gridRef, columns, saveUriPath, setGridMode, methodType} = gridObject;
    let {defaultGridMode} = gridObject;
    if (!defaultGridMode) defaultGridMode = 'view';

    if (!disableEditCheck) {
      if (!isModified(gridRef, columns)) { // 편집 이력이 없는 경우
        message.warn('편집된 데이터가 없습니다.');
        return;
      }
    }

    modal.confirm({
      icon: null,
      title: '저장',
      // icon: <ExclamationCircleOutlined />,
      content: '편집된 내용을 저장하시겠습니까?',
      onOk: async () => {
        let modifiedRows = null;

        // 기본 저장 방식
        if (saveType == null || saveType === 'basic') {
          if(gridObject.modifiedData){
            modifiedRows = gridObject.modifiedData;
          } else {
            modifiedRows = getModifiedRows(gridRef, columns);
          };
          
          // 저장 가능한지 체크
          const chk:boolean = await checkGridData(columns, modifiedRows, false, ['emptyDatas']);

          if (chk === false) return;

          let result;
          saveGridData(modifiedRows, columns, saveUriPath, optionParams).then((res) => {
            // message.info('저장이 완료되었습니다.');
            if ( setGridMode ) setGridMode(defaultGridMode);
            result = res;

          }).finally(() => {
            if (onAfterSave) {
              onAfterSave(result);
            }
          });


        // (header / detail 형식으로 변환 후 저장)
        } else if (saveType === 'headerInclude') {
          let _methodType:'delete' | 'post' | 'put' | 'patch' = 'post';
          let detailDatas = [];
          let modifiedRows
          if(gridObject.modifiedData){
            modifiedRows = gridObject.modifiedData
          } else {
            modifiedRows = await getModifiedRows(gridRef, columns);
          };
          

          const {createdRows, updatedRows, deletedRows} = modifiedRows;

          if (createdRows?.length > 0) {
            detailDatas = createdRows;
            _methodType = 'post';

          } else if (updatedRows?.length > 0) {
            detailDatas = updatedRows;
            _methodType = 'put';

          } else if (deletedRows?.length > 0) {
            detailDatas = deletedRows;
            _methodType = 'delete';
          }

          const chk:boolean = await checkGridData(columns, modifiedRows, false, ['emptyDatas']);

          if (chk !== true) {
            return;
          }

          // 옵션 데이터 추가
          for (let i = 0; i < detailDatas.length; i++) {
            detailDatas[i]['factory_uuid'] = getUserFactoryUuid();
            
            // alias에 따라 키값 변경
            columns?.forEach((column) => {
              if (column?.format === 'datetime') {
                const temp = detailDatas[i][column?.name]
                if (dayjs(temp).isValid) {
                  detailDatas[i][column?.name] = dayjs(temp).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                }
              }

              if ((column?.disableStringEmpty === true || column?.format !== 'text') && detailDatas[i][column?.name] === '') {
                delete detailDatas[i][column?.name];
              } else  if (column?.alias != null) {
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

          if (Object.values(saveData.header).length > 0 && saveData.details.length === 0)
            _methodType = 'put';

          if ((headerData as any)?._saveType != null) {
            _methodType = headerData['_saveType'];
          }

          // 저장
          let result;
          await executeData(saveData, saveUriPath, methodType || _methodType).then((res) => {
            const {datas, success} = res;
            const {value} = datas;
            result = res;
            if (success === true && value?.count > 0) {
              message.info('저장이 완료되었습니다.');
              if ( setGridMode ) setGridMode(defaultGridMode);
            }

          }).catch(e => {
            console.log('Error',e);

          }).finally(() => {
            
            if (onAfterSave) {
              onAfterSave(result);
            }
          });
        }

      },
      onCancel: () => {
      },
      okText: '예',
      cancelText: '아니오',
    });
  },


  /** 데이터 검색 */
  onSearch: async (ref:MutableRefObject<Grid>, setData:React.Dispatch<React.SetStateAction<any>>, searchUriPath:string, searchParams:object, columns, setLoading, options:{dataReturnType?:'basic'|'report'}={}) => {
    setLoading(true);

    getData(searchParams, searchUriPath).then((res) => {
      // 데이터 적용
      if (options.dataReturnType === 'report') {
        setData(res[0]?.datas);

      } else {
        setData(res);
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
  onShowCreatePopup: (setCreatePopupVisible:React.Dispatch<React.SetStateAction<boolean>>) => {
    setCreatePopupVisible(true);
  },

  printExcel: () => message.info('준비중 입니다.')
}
//#endregion



/** 그리드 포커스 잡는 용도 */
export const setGridFocus = (gridRef, info?:{columnName:string, rowKey:number}) => {
  if (!gridRef) return;

  const instance = gridRef?.current?.getInstance();
  if (!instance) return;

  const cell = instance?.getFocusedCell();
  const columnName = info?.columnName ?? cell?.columnName;
  const rowKey = info?.rowKey ?? cell?.rowKey;

  if (columnName == null || rowKey == null) return;

  instance?.focus(rowKey, columnName);
}


type TSubTotal = {
  subTotals: any[],
  total: object,
};
type TGroupInfos = {
  originalNames: string[];
  originalValues: any[];
  groupKey: string;
}[];
type TConvDataToSubTotalProps = {
  standardNames: string[],
  curculations: {
    names: string[],
    type: 'sum' | 'min' | 'max' | 'avg',
  }[],
  sortby?:{
    names?: string[],
    type?: 'asc' | 'desc',
  }
};
export const convDataToSubTotal = (data:any[]=[], options:TConvDataToSubTotalProps):TSubTotal => {
  let result:TSubTotal = {
    subTotals: [],
    total: {}
  }
  let groupInfos:TGroupInfos = [];
  const {standardNames, curculations, sortby} = options;

  if (data?.length <= 1) {
    const _data = _.cloneDeep(data);
    standardNames?.forEach((stdName) => {
      delete _data[stdName];
    });
    return {
      subTotals: data,
      total: _data[0],
    }
  }

  try {
    
    // 계산할 키 추출하기
    let curculationNames = [];
    _.cloneDeep(curculations).forEach((el) => {
      curculationNames = curculationNames.concat(el.names);
    });
    
    // 필요한 데이터만 추출
    let tempData:any[] = _.cloneDeep(data).map(el => {
      const keys = Object.keys(el);
      keys.forEach(key => {
        if ((standardNames.concat(curculationNames)).includes(key) === false) {
          delete el[key];
        }
      });
      return el;
    });
    console.log('tempData', tempData)

    // 연산될 기준명의 키 그룹을 생성
    const groupData:any[] = _.cloneDeep(tempData).map(el => cleanupKeyOfObject(el, standardNames));

    // 기준 컬럼을 바탕으로 그룹핑
    let cnt = 0;
    groupData.forEach((data) => {
      const values = Object.values(data);

      if (values == null) return;
      if (groupInfos.findIndex(el => el.originalValues.join('') === values.join('')) !== -1) return;

      groupInfos.push({
        originalNames: standardNames,
        originalValues: values,
        groupKey: cnt+'',
      });

      cnt++;
    });

    // 서브토탈 계산
    let sumData = {};
    let total = {};
    let chkData:any[] = _.cloneDeep(tempData.reverse());
    tempData.forEach((raw, index) => {
      const value = cleanupKeyOfObject(raw, standardNames);
      let groupKey = groupInfos.find(el => el.originalValues.join('') === Object.values(value).join(''))?.groupKey;
      let count:{groupKey:string, cnt:number}[] = [];
      
      curculationNames.forEach((curlName) => {
        if (!sumData[groupKey]) {
          sumData[groupKey] = {[curlName] : null};
        }
        
        const curlType = curculations.find(el => el.names.includes(curlName))?.type;
        const previousValue:number = Number(sumData[groupKey][curlName] || 0);
        const currentValue:number = Number(raw[curlName]);

        switch (curlType) {
          case 'max':
            sumData[groupKey][curlName] = (
              sumData[groupKey][curlName] == null ? currentValue
              : (
                previousValue > currentValue ? previousValue
                : currentValue
              )
            );
            
            total[curlName] = (
              total[curlName] == null ? currentValue
              : (
                Number(total[curlName]) > currentValue ? Number(total[curlName])
                : currentValue
              )
            );
            break;

          case 'min':
            sumData[groupKey][curlName] = (
              sumData[groupKey][curlName] == null ? currentValue
              : (
                previousValue < currentValue ? previousValue
                : currentValue
              )
            );

            total[curlName] = (
              total[curlName] == null ? currentValue
              : (
                Number(total[curlName]) < currentValue ? Number(total[curlName])
                : currentValue
              )
            );
            break;

          case 'avg':
          case 'sum':
          default:
            let countInfo = count.find((el) => el.groupKey === groupKey);
            if (countInfo) {
              countInfo.cnt += 1;
            } else {
              count.push({groupKey, cnt:1});
            }
            sumData[groupKey][curlName] = previousValue + currentValue;
            total[curlName] = (total[curlName] || 0) + (raw[curlName] || 0);
            break;
        }


        if (!chkData.find(el => {
          const stdObj = cleanupKeyOfObject(el, standardNames);
          const values = Object.values(stdObj);
          return JSON.stringify(values) === JSON.stringify(groupInfos?.find(el => el.groupKey === groupKey));
        })) {
          if (curlType === 'avg') {
            const cnt:number = count.find(el => el.groupKey === groupKey).cnt;
            sumData[groupKey][curlName] = sumData[groupKey][curlName] / cnt; //(Object.keys(sumData).length || 1);
            total[curlName] = (total[curlName] || 0) / Object.keys(sumData).length;
          }
        }
      });

      chkData.pop();
    });

    // 총합계
    result.total = total;

    // 계산 값 정형화
    groupInfos.forEach((groupInfo) => {
      let row = {}
      standardNames.forEach((value, index) => {
        const _key = groupInfo.originalNames[index];
        const _value = groupInfo.originalValues[index];

        row = {...row, [_key]: _value};
      });

      result.subTotals.push({...row, ...sumData[groupInfo.groupKey]});
    });

    // 정렬 작업    
    if (sortby?.names) {
      standardNames.forEach((stdName) => {
        result.subTotals.sort((a, b) => {
          let x = a[stdName].toLowerCase();
          let y = b[stdName].toLowerCase();
          if (x < y) {
              return -1;
          }
          if (x > y) {
              return 1;
          }
          return 0;
        })
      });
    }

    // switch (sortby.type) {
    //   case 'desc':
    //     curculationNames.forEach((curlName) => {
    //       result.subTotals.sort((a, b) => parseFloat(b[curlName]) - parseFloat(a[curlName]));
    //     });
    //     break;
    
    //   case 'asc':
    //   default:
    //     curculationNames.forEach((curlName) => {
    //       result.subTotals.sort((a, b) => parseFloat(a[curlName]) - parseFloat(b[curlName]));
    //     });
    //     break;
    // }
    

  } catch (error) {
    console.log(error);
  }

  return result;
}


export const getTestData = (count:number=10) => {
  const today = getToday();
  const USD = 0.00085;
  const KRW = 1182.00;

  const testData = {
    partner_uuid: 'awtwtawyadgdxg',
    partner_nm: '거래처',
    reg_date: today,
    prod_uuid: 'eatwat23534wyhg54y34',
    prod_no: 'P_CA',
    prod_nm: '품목',
    model_uuid: '142f34tgeojg34yge',
    model_nm: '모델',
    qty: 50,
    price: 1000, 
    exchange: 1181,
  }

  let result:any[] = [];
  for (let i = 1; i <= count; i++) {
    result[i-1] = [testData]?.map((el) => {
      const keys = Object.keys(el);
      const price = Math.floor(Math.random() * (100000 - 0)) + 0;
      const index = '_' + (Math.floor(Math.random() * (11 - 1)) + 1);
      const index2 = '_' + (Math.floor(Math.random() * (11 - 1)) + 1);
      let result = {};
      keys.forEach(key => {
        if (typeof el[key] === 'number') {
          if (key === 'qty')
            result[key] = Math.floor(Math.random() * (1000 - 0)) + 0;
          if (key === 'price')
            result[key] = price;
          if (key === 'exchange')
            result[key] = price * USD;
        } else {
          if (key === 'prod_uuid') result[key] = 'eatwat23534wyhg54y34' + index;
          if (key === 'prod_no') result[key] = 'P_CA' + index;
          if (key === 'prod_nm') result[key] = '품목' + index;
          if (key === 'partner_uuid') result[key] = 'awtwtawyadgdxg' + index2;
          if (key === 'partner_nm') result[key] = '거래처' + index2;
          // if (i % 3 === 0) {
          //   if (key === 'prod_uuid') result[key] = 'awtwtawyadgdxg' + index;
          //   if (key === 'prod_no') result[key] = 'P-CA-1' + index;
          //   if (key === 'prod_nm') result[key] = '품목1' + index;

          // } else {
          //   result[key] = el[key] + '_' + i;
          // }
        }
        
      });

      return result;
    })[0];
  }

  return result;
}

