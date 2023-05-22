import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import dayjs from 'dayjs';
import React, {
  MouseEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { Datagrid } from '~/components/UI/datagrid-new';
import { Searchbox } from '~/components/UI/searchbox';
import {
  checkGridData,
  executeData,
  getModifiedRows,
  getUserFactoryUuid,
  saveGridData,
  setGridFocus,
} from '~/functions';
import { isEmpty, isNil, isString } from '~/helper/common';
import { useLoadingState } from '~/hooks';
import {
  IInputGroupboxProps,
  InputGroupbox,
} from '../input-groupbox/input-groupbox.ui';
import { Modal } from '../modal';
import { afPopupVisible } from './popup-datagrid.ui.recoil';
import Props from './popup-datagrid.ui.type';

/** ⛔그리드 팝업 */
const BaseGridPopup = forwardRef<Grid, Props>((props, ref) => {
  const gridRef = useRef<Grid>();
  useImperativeHandle(ref, () => gridRef.current);
  const [loading, setLoading] = useLoadingState();
  const [visible, setVisible] = useRecoilState(afPopupVisible(props.popupId));
  const [data, setData] = useState(props.data ?? props.defaultData);

  const onSave = useMemo(() => {
    return async function () {
      try {
        const instance = gridRef?.current?.getInstance();
        instance?.finishEditing();
        // 단순 수정 이력 배열을 저장
        if (props.saveType === 'basic') {
          const modifiedRows = getModifiedRows(
            gridRef,
            props.columns,
            gridRef?.current?.getInstance()?.getData(),
          );
          // 저장 가능한지 체크
          const chk: boolean = await checkGridData(props.columns, modifiedRows);

          if (chk === false) return;

          // 신규 추가된 데이터들을 api에 전송
          setLoading(true);

          let optionValues: object = {};

          if (props.inputProps) {
            if (Array.isArray(props.inputProps)) {
              props.inputProps?.forEach(el => {
                optionValues = { ...optionValues, ...el };
              });
            } else {
              optionValues = props.inputProps?.innerRef?.current?.values;
            }
          } else {
            optionValues = props.saveOptionParams;
          }

          let inputDatas = {};

          if (optionValues) {
            const optionKeys = Object.keys(optionValues);

            optionKeys.forEach(optionKey => {
              const inputProps = props.inputProps as IInputGroupboxProps;

              const alias = inputProps?.inputItems?.find(
                el => el?.id === optionKey,
              )?.alias;
              if (alias) inputDatas[alias] = optionValues[optionKey];
              else inputDatas[optionKey] = optionValues[optionKey];
            });
          }

          saveGridData(
            modifiedRows,
            props.columns,
            props.saveUriPath,
            inputDatas,
          )
            .then(result => {
              const { success, savedData } = result;

              if (success === false) return;
              if (isNil(props?.visible)) setVisible(false);
              if (props?.onAfterOk) props.onAfterOk(true, savedData);
            })
            .catch(e => {
              console.trace('Error', e);

              if (props?.onAfterOk) props.onAfterOk(false, null);
            });

          // {header, detail} 형식으로 저장
        } else if (props.saveType === 'headerInclude') {
          let methodType: 'delete' | 'post' | 'put' | 'patch' = 'post';
          let detailDatas = [];

          const modifiedRows = getModifiedRows(
            gridRef,
            props.columns,
            gridRef?.current?.getInstance()?.getData(),
          );

          const { createdRows, updatedRows, deletedRows } = modifiedRows;

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

          const chk: boolean = await checkGridData(props.columns, modifiedRows);

          if (chk !== true) {
            return;
          }
          // 옵션 데이터 추가
          setLoading(true);
          for (let i = 0; i < detailDatas.length; i++) {
            detailDatas[i]['factory_uuid'] = getUserFactoryUuid();

            // alias에 따라 키값 변경
            props.columns?.forEach(column => {
              if (column?.format === 'datetime') {
                const temp = detailDatas[i][column?.name];
                if (dayjs(temp).isValid) {
                  detailDatas[i][column?.name] = dayjs(temp).format(
                    'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]',
                  );
                }
              }

              if (
                column?.disableStringEmpty === true ||
                column?.format !== 'text'
              ) {
                if (
                  isString(detailDatas[i][column?.name]) &&
                  isEmpty(detailDatas[i][column?.name])
                ) {
                  delete detailDatas[i][column?.name];
                }
              } else if (!isNil(column?.alias)) {
                detailDatas[i][column?.alias] = detailDatas[i][column?.name];
                delete detailDatas[i][column?.name];
              }
            });
          }
          let optionValues: object = {};
          // 헤더 데이터 추가
          if (props.inputProps) {
            if (Array.isArray(props.inputProps)) {
              props.inputProps?.forEach(el => {
                optionValues = { ...optionValues, ...el };
              });
            } else {
              optionValues = props.inputProps?.innerRef?.current?.values;
            }
          } else {
            optionValues = props.saveOptionParams;
          }
          const optionKeys = Object.keys(optionValues);

          let headerData: { [key: string]: any } = {};

          optionKeys.forEach(optionKey => {
            const inputProps = props.inputProps as IInputGroupboxProps;

            const alias = inputProps?.inputItems?.find(
              el => el?.id === optionKey,
            )?.alias;

            if (alias) headerData[alias] = optionValues[optionKey];
            else headerData[optionKey] = optionValues[optionKey];
          });

          headerData['factory_uuid'] = getUserFactoryUuid();

          // 최종적으로 저장될 데이터
          const saveData = {
            header: headerData,
            details: detailDatas,
          };

          if (!isNil(headerData?._saveType)) {
            methodType = headerData['_saveType'];
          }

          let response = null;
          // 저장
          await executeData(saveData, props.saveUriPath, methodType, 'data')
            .then(res => {
              const { success, datas } = res;
              response = datas?.raws;

              if (success === true) {
                // 팝업 닫기
                if (isNil(props?.visible)) setVisible(false);

                if (props?.onAfterOk) props.onAfterOk(true, response);

                message.info('저장이 완료되었습니다.');
              }
            })
            .catch(e => {
              console.log('Error', e);

              if (props?.onAfterOk) props.onAfterOk(false, response);
            });
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    };
  }, [
    props.saveParams,
    props.onOk,
    props.gridMode,
    gridRef,
    props.columns,
    props.saveUriPath,
    props.searchParams,
    props.saveOptionParams,
    props?.setParentData,
    props.parentGridRef,
    props.inputProps,
  ]);

  /** ⛔긍정 버튼 액션 처리 */
  const onOk = useMemo(() => {
    if (props.onOk) {
      // 사용자 지정 액션 적용
      return () => {
        const instance = gridRef?.current?.getInstance();
        instance?.finishEditing();
        props.onOk(gridRef as unknown as MouseEvent<HTMLElement>);
      };
    } else {
      // 기본 동작 액션
      switch (props.gridMode) {
        // ✅api에 신규 데이터 추가 요청 보내기
        case 'create':
          return onSave;

        // 🚫api에 삭제 요청 보내기
        case 'delete':
          return function () {
            if (isNil(props?.visible)) setVisible(false);
          };

        // ✅선택된 로우가 하나인지 확인 후 부모 그리드에게 row append
        case 'select':
          return function (close) {
            // 체크(선택)된 row data 가져오기
            const selectedRowDatas = gridRef.current
              .getInstance()
              .getCheckedRows();

            // 체크(선택)된 row의 개수 확인하기
            if (selectedRowDatas?.length === 1) {
              // 선택된 항목 부모 그리드에게 전달
              props.parentGridRef?.current
                .getInstance()
                ?.appendRow(selectedRowDatas[0]);
              close();
            } else if (selectedRowDatas?.length > 1) {
              message.warn('하나만 선택해주세요.');
            } else {
              message.warn('항목을 선택해주세요.');
            }
          };

        // ✅선택된 로우가 있는지 확인 후 부모 그리드에게 row append
        case 'multi-select':
          return function (close) {
            // 체크(선택)된 row data 가져오기
            const selectedRowDatas = gridRef.current
              .getInstance()
              .getCheckedRows();

            // 체크(선택)된 row의 개수 확인하기
            if (selectedRowDatas?.length > 1) {
              // 선택된 항목 부모 그리드에게 전달
              props.parentGridRef?.current
                .getInstance()
                ?.appendRows(selectedRowDatas);
              close();
            } else {
              message.warn('항목을 선택해주세요.');
            }
          };

        // 🚫api에 수정 요청 보내기
        case 'update':
          return onSave;

        // ✅그냥 팝업 닫기
        default:
          return function () {
            if (isNil(props?.visible)) setVisible(false);
          };
      }
    }
  }, [
    props.onOk,
    props.gridMode,
    gridRef,
    props.columns,
    props.saveUriPath,
    props.searchParams,
    props.saveOptionParams,
    props?.setParentData,
    props.parentGridRef,
    props.inputProps,
    props.data,
    data,
  ]);

  /** ✅부정 버튼 액션 처리 */
  const onCancel = useMemo(() => {
    if (props.onCancel) {
      // 사용자 지정 액션 적용
      return props.onCancel;
    } else {
      // 기본 동작 액션
      switch (props.gridMode) {
        default:
          // 그냥 팝업 닫기
          return function () {
            if (isNil(props?.visible)) setVisible(false);
          };
      }
    }
  }, [
    props.onCancel,
    props.gridMode,
    props.data,
    data,
    props.parentGridRef,
    props.inputProps,
  ]);

  /** 엔터 버튼 클릭시 onOk 동작되도록 함 */
  const onAfterKeyDown = useCallback(
    ev => {
      if (!['select', 'multi-select'].includes(props.gridMode)) return;

      if (props?.onAfterKeyDown) {
        props.onAfterKeyDown(ev);
        return;
      }

      const { keyboardEvent } = ev;

      if (keyboardEvent?.keyCode !== 13) return;

      onOk(ev);
    },
    [props.onAfterKeyDown, onOk, props.gridMode],
  );

  /** ⛔WILL MOUNT : 외부 데이터가 변경되면 state data에 적용 */
  useLayoutEffect(() => {
    const _visible = props.visible ?? visible;
    const data = props.defaultData?.length > 0 ? props.defaultData : props.data;

    if (_visible === true) {
      setData(data);
    } else {
      setData([]);
    }
  }, [props.visible, visible]);

  useLayoutEffect(() => {
    setData(props.data);
  }, [props.data]);

  /** 데이터가 리셋될때 포커스를 잡는 용도 */
  useLayoutEffect(() => {
    if (!(props.visible || visible)) return;
    if (!data) return;

    const instance = gridRef?.current?.getInstance();
    const columnName = instance
      ?.getColumns()
      ?.find(el => el?.hidden !== true && el?.name !== '_edit')?.name;

    setGridFocus(gridRef, { rowKey: 0, columnName });
  }, [data]);

  return (
    <Modal
      title={props.title}
      okButtonProps={props.okButtonProps}
      okText={props.okText}
      onOk={onOk}
      cancelButtonProps={props.cancelButtonProps}
      cancelText={props.cancelText}
      onCancel={onCancel}
      visible={props.visible ?? visible}
      maskClosable={false}
      confirmLoading={loading}
      footer={props.footer}
      destroyOnClose={true}
    >
      <div>
        {!isNil(props?.searchProps) ? (
          <Searchbox boxShadow={false} {...props.searchProps} />
        ) : null}
        {!isNil(props?.inputProps) ? (
          Array.isArray(props?.inputProps) ? (
            <div style={{ marginTop: -10 }}>
              {props?.inputProps?.map((el, index) => {
                return (
                  <div
                    key={el.id + index}
                    style={{
                      borderStyle: 'solid',
                      borderWidth: 1,
                      borderColor: '#f0f0f0',
                      marginTop: 10,
                      paddingBottom: 5,
                      paddingLeft: 5,
                      paddingRight: 5,
                    }}
                  >
                    <div style={{ marginTop: -6 }}>
                      <InputGroupbox boxShadow={false} {...el} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <InputGroupbox boxShadow={false} {...props.inputProps} />
          )
        ) : null}

        <Datagrid
          {...props}
          ref={gridRef}
          gridId={props.gridId}
          gridMode={props.gridMode}
          columns={props.columns}
          data={data}
          gridComboInfo={props.gridComboInfo}
          gridPopupInfo={props.gridPopupInfo}
          rowAddPopupInfo={props.rowAddPopupInfo}
          onAfterClick={props.onAfterClick}
          onAfterChange={props.onAfterChange}
          onAfterKeyDown={onAfterKeyDown}
        />
      </div>
    </Modal>
  );
});

export default React.memo(BaseGridPopup);
