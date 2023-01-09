import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import { MutableRefObject } from 'react';
import {
  checkGridData,
  executeData,
  getModifiedRows,
  getUserFactoryUuid,
  isModified,
  saveGridData,
} from '~/functions';

export const TAB_CODE = {
  투입품목관리: 'TUIP_PROD',
  투입인원관리: 'TUIP_WORKER',
  공정순서: 'PROC_ORDER',
};

export const onErrorMessage = type => {
  if (type === '하위이력작업시도') {
    message.warn('지시이력을 선택한 후 다시 시도해주세요.');
    return;
  }

  return;
};

//#region 🔶그리드 공통 이벤트 함수 정의 (나중에 옮길거임)
export const onDefaultGridSave = async (
  saveType: 'basic' | 'headerInclude',
  ref: MutableRefObject<Grid>,
  columns,
  saveUriPath,
  optionParams,
  modal,
  saveAfterFunc?: Function,
  methodType?,
  inputInfo?,
) => {
  // 그리드의 데이터를 편집한 이력이 있는지 체크
  if (
    isModified(ref, columns) ||
    (optionParams && saveType === 'headerInclude')
  ) {
    // 편집 이력이 있는 경우
    modal.confirm({
      icon: null,
      title: '저장',
      // icon: <ExclamationCircleOutlined />,
      content: '편집된 내용을 저장하시겠습니까?',
      onOk: async () => {
        let modifiedRows = null;

        // 기본 저장 방식
        if (saveType === 'basic') {
          modifiedRows = getModifiedRows(ref, columns);

          // 저장 가능한지 체크
          const chk: boolean = await checkGridData(columns, modifiedRows);

          if (chk === false) return;

          saveGridData(
            modifiedRows,
            columns,
            saveUriPath,
            optionParams,
            false,
            methodType,
          ).then(({ success, count, savedData }) => {
            if (saveAfterFunc) saveAfterFunc({ success, count, savedData });
          });

          // (header / detail 형식으로 변환 후 저장)
        } else if (saveType === 'headerInclude') {
          let _methodType: 'delete' | 'post' | 'put' | 'patch' = 'post';
          let detailDatas = [];

          const modifiedRows = getModifiedRows(ref, columns);

          const { createdRows, updatedRows, deletedRows } = modifiedRows;

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

          const chk: boolean = await checkGridData(columns, modifiedRows);

          if (chk !== true) {
            return;
          }

          // 옵션 데이터 추가
          for (let i = 0; i < detailDatas.length; i++) {
            detailDatas[i]['factory_uuid'] = getUserFactoryUuid();

            // alias에 따라 키값 변경
            columns?.forEach(column => {
              if (column?.alias != null) {
                detailDatas[i][column?.alias] = detailDatas[i][column?.name];
                delete detailDatas[i][column?.name];
              }
            });
          }

          // 헤더 데이터 추가
          const optionKeys = Object.keys(optionParams);

          let headerData = {};
          optionKeys.forEach(optionKey => {
            headerData[optionKey] = optionParams[optionKey];
          });

          headerData['factory_uuid'] = getUserFactoryUuid();

          // 최종적으로 저장될 데이터
          const saveData = {
            header: headerData,
            details: detailDatas,
          };

          if ((headerData as any)?._saveType != null) {
            _methodType = headerData['_saveType'];
          }

          // 저장
          await executeData(saveData, saveUriPath, methodType || _methodType)
            .then(({ success, count, savedData }) => {
              if (success === true) {
                if (saveAfterFunc) saveAfterFunc({ success, count, savedData });
              }
            })
            .catch(e => {
              console.log('Error', e);
            });
        }
      },
      onCancel: () => {
        // this function will be executed when cancel button is clicked
      },
      okText: '예',
      cancelText: '아니오',
    });
  } else {
    // 편집 이력이 없는 경우
    message.warn('편집된 데이터가 없습니다.');
  }
};

/** 편집 취소 */
export const onDefaultGridCancel = (
  ref: MutableRefObject<Grid>,
  columns,
  modal,
  afterCancelFunc?: Function,
) => {
  // 그리드의 데이터를 편집한 이력이 있는지 체크
  if (isModified(ref, columns)) {
    // 편집 이력이 있는 경우
    modal.confirm({
      title: '편집 취소',
      content: '편집된 이력이 있습니다. 편집을 취소하시겠습니까?',
      onOk: () => {
        if (afterCancelFunc) afterCancelFunc();
      },
      onCancel: () => {
        // this function will be executed when cancel button is clicked
      },
      okText: '예',
      cancelText: '아니오',
    });
  } else {
    // 편집 이력이 없는 경우
    if (afterCancelFunc) afterCancelFunc();
  }
};
//#endregion
