import React, { useRef, useState, useMemo, useLayoutEffect } from 'react';
import Grid from '@toast-ui/react-grid';
import { TReceiveInspDetail, TReceiveInspHeader } from './types';
import { getPopupForm, GridPopup, IGridColumn } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';
import {
  IInputGroupboxItem,
  useInputGroup,
} from '~/components/UI/input-groupbox';
import {
  blankThenNull,
  executeData,
  getData,
  getToday,
  getUserFactoryUuid,
  isNumber,
} from '~/functions';
import {
  URI_PATH_GET_QMS_RECEIVE_INSP_RESULT_INCLUDE_DETAILS,
  URI_PATH_PUT_QMS_RECEIVE_INSP_RESULTS,
} from './constants';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';

export const INSP_RESULT_EDIT_POPUP = (props: {
  inspResultUuid: string;
  inspHandlingType: any;
  popupVisible: boolean;
  setPopupVisible: (value?) => void;
  onAfterCloseSearch?: (insp_result_uuid: string) => void;
}) => {
  const gridRef = useRef<Grid>();
  const [changeIncomeQtyFg, setChangeIncomeQtyFg] = useState(false);
  const [changeRejectQtyFg, setChangeRejectQtyFg] = useState(false);
  const [receiveInspHeaderData, setReceiveInspHeaderData] =
    useState<TReceiveInspHeader>({});
  const [receiveInspDetailData, setReceiveInspDetailData] = useState<
    TReceiveInspDetail[]
  >([]);

  const INSP_DETAIL_COLUMNS: IGridColumn[] = [
    {
      header: '검사성적서 상세UUID',
      name: 'insp_result_detail_info_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사기준서 상세UUID',
      name: 'insp_detail_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사항목 유형UUID',
      name: 'insp_item_type_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사항목 유형명',
      name: 'insp_item_type_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '검사항목UUID',
      name: 'insp_item_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사항목명',
      name: 'insp_item_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '검사 기준',
      name: 'spec_std',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '최소 값',
      name: 'spec_min',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '최대 값',
      name: 'spec_max',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '검사방법UUID',
      name: 'insp_method_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사방법명',
      name: 'insp_method_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '검사구UUID',
      name: 'insp_tool_uuid',
      width: ENUM_WIDTH.L,
      filter: 'text',
      hidden: true,
    },
    {
      header: '검사구명',
      name: 'insp_tool_nm',
      width: ENUM_WIDTH.L,
      filter: 'text',
    },
    {
      header: '정렬',
      name: 'sortby',
      width: ENUM_WIDTH.S,
      filter: 'text',
      hidden: true,
    },
    {
      header: '시료 수량',
      name: 'sample_cnt',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
    {
      header: '검사 주기',
      name: 'insp_cycle',
      width: ENUM_WIDTH.M,
      filter: 'text',
    },
  ];

  const CREATE_POPUP_DETAIL_COLUMNS = useMemo(() => {
    let items: IGridColumn[] = INSP_DETAIL_COLUMNS;

    if (receiveInspHeaderData?.max_sample_cnt > 0) {
      for (let i = 1; i <= receiveInspHeaderData?.max_sample_cnt; i++) {
        items.push({
          header: 'x' + i + '_insp_result_detail_value_uuid',
          name: 'x' + i + '_insp_result_detail_value_uuid',
          width: ENUM_WIDTH.L,
          filter: 'text',
          hidden: true,
        });
        items.push({
          header: 'x' + i + '_sample_no',
          name: 'x' + i + '_sample_no',
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        items.push({
          header: 'x' + i,
          name: 'x' + i + '_insp_value',
          width: ENUM_WIDTH.L,
          filter: 'text',
          editable: true,
        });
        items.push({
          header: 'x' + i + '_판정',
          name: 'x' + i + '_insp_result_fg',
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
        items.push({
          header: 'x' + i + '_판정',
          name: 'x' + i + '_insp_result_state',
          width: ENUM_WIDTH.M,
          filter: 'text',
          hidden: true,
        });
      }
    }

    items.push({
      header: '합격여부',
      name: 'insp_result_fg',
      width: ENUM_WIDTH.M,
      filter: 'text',
      hidden: true,
    });
    items.push({
      header: '판정',
      name: 'insp_result_state',
      width: ENUM_WIDTH.M,
      filter: 'text',
    });
    items.push({
      header: '비고',
      name: 'remark',
      width: ENUM_WIDTH.XL,
      filter: 'text',
    });

    return items;
  }, [receiveInspHeaderData]);

  const INFO_INPUT_ITEMS: IInputGroupboxItem[] = [
    {
      id: 'receive_detail_uuid',
      label: '입하상세UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'stmt_no_sub',
      label: '세부입하전표번호',
      type: 'text',
      disabled: true,
    },
    { id: 'partner_nm', label: '거래처', type: 'text', disabled: true },
    { id: 'receive_date', label: '입하일', type: 'text', disabled: true },
    {
      id: 'insp_detail_type_uuid',
      label: '입하구분코드',
      type: 'text',
      hidden: true,
    },
    {
      id: 'insp_detail_type_nm',
      label: '입하구분',
      type: 'text',
      disabled: true,
    },
    { id: 'prod_uuid', label: '품목UUID', type: 'text', hidden: true },
    { id: 'prod_no', label: '품번', type: 'text', disabled: true },
    { id: 'prod_nm', label: '품명', type: 'text', disabled: true },
    { id: 'prod_std', label: '규격', type: 'text', disabled: true },
    {
      id: 'unit_uuid',
      label: '단위UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    { id: 'unit_nm', label: '단위', type: 'text', disabled: true },
    { id: 'lot_no', label: 'LOT NO', type: 'text', disabled: true },
    { id: 'qty', label: '입하수량', type: 'number', disabled: true },
  ];

  const INPUT_ITEMS_INSP_RESULT: IInputGroupboxItem[] = [
    {
      id: 'insp_uuid',
      label: '검사기준서UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'insp_result_uuid',
      label: '검사성적서UUID',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'insp_result_fg',
      label: '최종판정',
      type: 'text',
      disabled: true,
      hidden: true,
    },
    {
      id: 'insp_result_state',
      label: '최종판정',
      type: 'text',
      disabled: true,
    },
    { id: 'reg_date', label: '검사일자', type: 'date', default: getToday() },
    { id: 'reg_date_time', label: '검사시간', type: 'time' },
    { id: 'emp_uuid', label: '검사자UUID', type: 'text', hidden: true },
    {
      id: 'emp_nm',
      label: '검사자',
      type: 'text',
      usePopup: true,
      popupKey: '사원관리',
      popupKeys: ['emp_nm', 'emp_uuid'],
      params: { emp_status: 'incumbent' },
    },
    {
      id: 'insp_handling_type',
      label: '처리결과',
      type: 'combo',
      firstItemType: 'empty',
      options: props.inspHandlingType,
      disabled: false,
      onAfterChange: stringifiedInspectionHandlingType => {
        const selectedInspHandlingType =
          stringifiedInspectionHandlingType === ''
            ? { insp_handling_type_cd: '' }
            : JSON.parse(stringifiedInspectionHandlingType);
        const inputQty = inputInputItems.ref.current.values.qty;

        let incomeDisabled: boolean = true;
        let rejectDisabled: boolean = true;
        let qtyDisabled: boolean = true;
        if (
          ['INCOME', 'SELECTION'].includes(
            selectedInspHandlingType.insp_handling_type_cd,
          )
        ) {
          incomeDisabled = false;
        }
        if (
          ['RETURN', 'SELECTION'].includes(
            selectedInspHandlingType.insp_handling_type_cd,
          )
        ) {
          rejectDisabled = false;
        }

        if (incomeDisabled) {
          inputInspResultIncome.setFieldValue('qty', 0);
        }
        if (rejectDisabled) {
          inputInspResultReject.setFieldValue('reject_qty', 0);
        }

        if (!incomeDisabled) {
          inputInspResultIncome.setFieldValue('qty', inputQty);
          inputInspResultReject.setFieldValue('reject_qty', 0);
        } else if (!rejectDisabled) {
          inputInspResultReject.setFieldValue('reject_qty', inputQty);
        }

        if (selectedInspHandlingType.insp_handling_type_cd === 'SELECTION') {
          qtyDisabled = false;
        }

        inputInspResultIncome.setFieldDisabled({
          qty: qtyDisabled,
          to_store_uuid: incomeDisabled,
          to_location_uuid: incomeDisabled,
        });
        inputInspResultReject.setFieldDisabled({
          reject_qty: true,
          reject_nm: rejectDisabled,
          reject_store_uuid: rejectDisabled,
          reject_location_uuid: rejectDisabled,
        });
      },
    },
    { id: 'remark', label: '비고', type: 'text' },
  ];

  const INPUT_ITEMS_INSP_RESULT_INCOME: IInputGroupboxItem[] = [
    {
      id: 'qty',
      label: '입고수량',
      type: 'number',
      disabled: true,
      onAfterChange: () => {
        setChangeIncomeQtyFg(true);
      },
    },
    {
      id: 'to_store_uuid',
      label: '입고창고',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'store_uuid',
        textName: 'store_nm',
        uriPath: getPopupForm('창고관리')?.uriPath,
        params: {
          store_type: 'available',
        },
      },
      onAfterChange: ev => {},
    },
    {
      id: 'to_location_uuid',
      label: '입고위치',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'location_uuid',
        textName: 'location_nm',
        uriPath: getPopupForm('위치관리')?.uriPath,
      },
      onAfterChange: ev => {},
    },
  ];

  const INPUT_ITEMS_INSP_RESULT_RETURN: IInputGroupboxItem[] = [
    {
      id: 'reject_qty',
      label: '부적합수량',
      type: 'number',
      disabled: true,
      onAfterChange: () => {
        setChangeRejectQtyFg(true);
      },
    },
    { id: 'reject_uuid', label: '불량유형UUID', type: 'text', hidden: true },
    {
      id: 'reject_nm',
      label: '불량유형',
      type: 'text',
      usePopup: true,
      popupKey: '부적합관리',
      popupKeys: ['reject_nm', 'reject_uuid'],
    },
    {
      id: 'reject_store_uuid',
      label: '반출창고',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'store_uuid',
        textName: 'store_nm',
        uriPath: getPopupForm('창고관리')?.uriPath,
        params: {
          store_type: 'return',
        },
      },
    },
    {
      id: 'reject_location_uuid',
      label: '반출위치',
      type: 'combo',
      firstItemType: 'empty',
      dataSettingOptions: {
        codeName: 'location_uuid',
        textName: 'location_nm',
        uriPath: getPopupForm('위치관리')?.uriPath,
      },
      onAfterChange: ev => {},
    },
  ];

  const inputInputItems = useInputGroup(
    'INPUT_EDIT_POPUP_INFO',
    INFO_INPUT_ITEMS,
    { title: '입하정보' },
  );
  const inputInspResult = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: '검사정보' },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT_INCOME',
    INPUT_ITEMS_INSP_RESULT_INCOME,
    { title: '입고정보' },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT_REJECT',
    INPUT_ITEMS_INSP_RESULT_RETURN,
    { title: '부적합정보' },
  );

  const onClear = () => {
    inputInputItems?.ref?.current?.resetForm();
    inputInspResult?.ref?.current?.resetForm();
    inputInspResultIncome?.ref?.current?.resetForm();
    inputInspResultReject?.ref?.current?.resetForm();
    setReceiveInspHeaderData({});
    setReceiveInspDetailData([]);
  };

  const changeInspResult = (inspResult?: string, firstLoadingFg?: boolean) => {
    let incomeDisabled: boolean = true;
    let rejectDisabled: boolean = true;
    let qtyDisabled: boolean = true;
    if (inspResult) {
      if (['INCOME', 'SELECTION'].includes(inspResult)) {
        incomeDisabled = false;
      }
      if (['RETURN', 'SELECTION'].includes(inspResult)) {
        rejectDisabled = false;
      }
    }
    if (!firstLoadingFg) {
      if (incomeDisabled) {
        inputInspResultIncome.setFieldValue('qty', 0);
      }
      if (rejectDisabled) {
        inputInspResultReject.setFieldValue('reject_qty', 0);
      }

      if (!incomeDisabled) {
        inputInspResultIncome.setFieldValue(
          'qty',
          inputInputItems?.ref?.current?.values?.qty,
        );
        inputInspResultReject.setFieldValue('reject_qty', 0);
      } else if (!rejectDisabled) {
        inputInspResultReject.setFieldValue(
          'reject_qty',
          inputInputItems?.ref?.current?.values?.qty,
        );
      }
    }

    if (inspResult === 'SELECTION') {
      qtyDisabled = false;
    }

    inputInspResultIncome.setFieldDisabled({
      qty: qtyDisabled,
      to_store_uuid: incomeDisabled,
      to_location_uuid: incomeDisabled,
    });
    inputInspResultReject.setFieldDisabled({
      reject_qty: qtyDisabled,
      reject_nm: rejectDisabled,
      reject_store_uuid: rejectDisabled,
      reject_location_uuid: rejectDisabled,
    });
  };

  interface InspectionChecker {
    check: (...arg: any) => boolean;
  }

  interface InspectionConcreate {
    new (): InspectionChecker;
  }

  class EmptyInspectionChecker implements InspectionChecker {
    check(arg: any) {
      return null;
    }
  }

  class NumberInspectionChecker implements InspectionChecker {
    check(arg: any) {
      return this.innerRange(arg);
    }
    innerRange({
      value,
      min,
      max,
    }: {
      value: number;
      min: number;
      max: number;
    }) {
      return value >= min && value <= max;
    }
  }

  class EyeInspectionChecker implements InspectionChecker {
    check(arg: any) {
      return this.isOK(arg);
    }

    isOK({ value }) {
      return value.toUpperCase() === 'OK';
    }
  }

  const inspectionCheck = <T extends InspectionConcreate>(
    checker: T,
    arg: any,
  ) => {
    return new checker().check(arg);
  };

  const cellKeys = (
    records: Array<any>,
    cellKey: string,
  ): Array<Array<string>> =>
    records.map(record =>
      Object.keys(record).filter(key => key.includes(cellKey)),
    );

  const sliceKeys = (keys: Array<string>, at: number): Array<string> =>
    keys.slice(0, at);

  const recordChecker = (record: Array<Array<boolean>>): Array<boolean> =>
    record.map(cellCheckList => {
      if (cellCheckList.every(checkItem => checkItem === null)) {
        return null;
      }

      if (cellCheckList.some(checkItem => checkItem === false)) {
        return false;
      }

      return true;
    });

  const totalChecker = (records: Array<boolean>): boolean => {
    if (records.some(key => key === null)) {
      return null;
    }

    if (records.some(key => key === false)) {
      return false;
    }

    return true;
  };

  const checkUIProtocol = (check: boolean): string =>
    check === null ? null : check === true ? '합격' : '불합격';

  const eyeCellUIProtocol = (check: boolean): string =>
    check === null ? null : check === true ? 'OK' : 'NG';

  const onAfterChange = (ev: any) => {
    const { changes, instance } = ev;
    const datas = instance.getData();

    if (changes.some(change => !change.columnName.includes('_insp_value')))
      return;

    const keys = cellKeys(datas, '_insp_value');

    const definedCountKeys = keys.map((item: Array<string>, index: number) =>
      sliceKeys(item, datas[index].sample_cnt),
    );

    const cellCheckers = definedCountKeys.map((inspections, index) =>
      inspections.map(inspectionKey =>
        datas[index][inspectionKey] == null ||
        datas[index][inspectionKey] === ''
          ? inspectionCheck(EmptyInspectionChecker, null)
          : isNumber(datas[index].spec_min) && isNumber(datas[index].spec_max)
          ? inspectionCheck(NumberInspectionChecker, {
              value: datas[index][inspectionKey] * 1,
              min: datas[index].spec_min * 1,
              max: datas[index].spec_max * 1,
            })
          : inspectionCheck(EyeInspectionChecker, {
              value: datas[index][inspectionKey],
            }),
      ),
    );

    const records = recordChecker(cellCheckers);

    const finalChecker = totalChecker(records);

    changes.forEach((change: any) => {
      if (change.columnName.includes('_insp_value')) {
        const changedCellIndex = keys[change.rowKey].findIndex(
          inspValue => inspValue === change.columnName,
        );

        instance.setValue(
          change.rowKey,
          change.columnName.replace('_insp_value', '_insp_result_fg'),
          cellCheckers[change.rowKey][changedCellIndex],
        );
        instance.setValue(
          change.rowKey,
          change.columnName.replace('_insp_value', '_insp_result_state'),
          checkUIProtocol(cellCheckers[change.rowKey][changedCellIndex]),
        );
        if (
          !(
            isNumber(datas[change.rowKey].spec_min) &&
            isNumber(datas[change.rowKey].spec_min)
          )
        ) {
          instance.setValue(
            change.rowKey,
            change.columnName,
            eyeCellUIProtocol(cellCheckers[change.rowKey][changedCellIndex]),
          );
        }
      }
    });

    datas.forEach((data: any, index: number) => {
      instance.setValue(index, 'insp_result_fg', records[index]);
      instance.setValue(
        index,
        'insp_result_state',
        checkUIProtocol(records[index]),
      );
    });

    inputInspResult.setFieldValue('insp_result_fg', finalChecker);
    inputInspResult.setFieldValue(
      'insp_result_state',
      checkUIProtocol(finalChecker),
    );

    if (finalChecker === null || finalChecker === true) {
      inputInspResult.setFieldDisabled({ insp_handling_type: true });
    } else {
      inputInspResult.setFieldDisabled({ insp_handling_type: false });
    }

    let _inspHandlingCd: string;

    if (finalChecker === true) {
      _inspHandlingCd = 'INCOME';
      changeInspResult('INCOME');
    } else if (finalChecker === false) {
      _inspHandlingCd = 'RETURN';
      changeInspResult('RETURN');
    } else {
      _inspHandlingCd = '';
      changeInspResult('');
    }
    if (_inspHandlingCd === '') {
      inputInspResult.setFieldValue('insp_handling_type', '');
    } else {
      props.inspHandlingType.forEach(el => {
        if (JSON.parse(el.code).insp_handling_type_cd === _inspHandlingCd) {
          inputInspResult.setFieldValue('insp_handling_type', el.code);
          return;
        }
      });
    }
  };

  const saveData = async inspectionGridInstance => {
    const inspectionDatas = inspectionGridInstance.getData();
    const inputInputItemsValues = inputInputItems?.ref?.current?.values;
    const inputInspResultValues = inputInspResult?.ref?.current?.values;
    const inputInspResultIncomeValues =
      inputInspResultIncome?.ref?.current?.values;
    const inputInspResultRejectValues =
      inputInspResultReject?.ref?.current?.values;

    const inspectionHeader = {
      uuid: inputInspResultValues?.insp_result_uuid,
      insp_handling_type_uuid: JSON.parse(
        inputInspResultValues.insp_handling_type,
      ).insp_handling_type_uuid,
      emp_uuid: inputInspResultValues?.emp_uuid,
      unit_uuid: inputInputItemsValues?.unit_uuid,
      reg_date: `${inputInspResultValues?.reg_date} ${dayjs(
        inputInspResultValues?.reg_date_time,
      ).format('HH:mm:ss')}`,
      insp_result_fg: inputInspResultValues?.insp_result_fg,
      insp_detail_type_uuid: inputInputItemsValues?.insp_detail_type_uuid,
      insp_qty: inputInputItemsValues?.qty,
      pass_qty: inputInspResultIncomeValues?.qty,
      reject_qty: inputInspResultRejectValues?.reject_qty,
      reject_uuid: blankThenNull(inputInspResultRejectValues?.reject_uuid),
      to_store_uuid: blankThenNull(inputInspResultIncomeValues?.to_store_uuid),
      to_location_uuid: blankThenNull(
        inputInspResultIncomeValues?.to_location_uuid,
      ),
      reject_store_uuid: blankThenNull(
        inputInspResultRejectValues?.reject_store_uuid,
      ),
      reject_location_uuid: blankThenNull(
        inputInspResultRejectValues?.reject_location_uuid,
      ),
      remark: inputInspResultValues?.remark,
    };

    const inspectionItems = cellKeys(inspectionDatas, '_insp_value')
      .map((item: Array<string>, index: number) =>
        sliceKeys(item, inspectionDatas[index].sample_cnt),
      )
      .map((definedCountKeys, index) => ({
        factory_uuid: getUserFactoryUuid(),
        uuid: inspectionDatas[index].insp_result_detail_info_uuid,
        insp_detail_uuid: inspectionDatas[index].insp_detail_uuid,
        insp_result_fg: inspectionDatas[index].insp_result_fg,
        remark: inspectionDatas[index].remark,
        values: definedCountKeys
          .map((key, keyIndex) => {
            const result = {
              uuid: inspectionDatas[index][
                key.replace('_insp_value', '_insp_result_detail_value_uuid')
              ],
              delete_fg:
                inspectionDatas[index][
                  key.replace('_insp_value', '_insp_result_fg')
                ] === null
                  ? true
                  : false,
              sample_no: keyIndex + 1,
            };

            if (
              inspectionDatas[index][
                key.replace('_insp_value', '_insp_result_fg')
              ] !== null
            ) {
              return {
                ...result,
                insp_result_fg:
                  inspectionDatas[index][
                    key.replace('_insp_value', '_insp_result_fg')
                  ],
                insp_value:
                  inspectionDatas[index][key] === 'OK'
                    ? 1
                    : inspectionDatas[index][key] === 'NG'
                    ? 0
                    : inspectionDatas[index][key],
              };
            }
            return result;
          })
          .filter(inspectionCell => {
            if (inspectionCell.uuid != null) {
              return true;
            }

            return inspectionCell.delete_fg === false ? true : false;
          }),
      }));

    const saveData: object = {
      header: inspectionHeader,
      details: inspectionItems,
    };

    await executeData(
      saveData,
      URI_PATH_PUT_QMS_RECEIVE_INSP_RESULTS,
      'put',
      'success',
    )
      .then(value => {
        if (!value) return;
        message.info('저장되었습니다.');
        props.onAfterCloseSearch(props.inspResultUuid);
        props.setPopupVisible(false);
        onClear();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const onSave = async inspectionGridRef => {
    const inputInspResultValues = inputInspResult?.ref?.current?.values;

    if (inputInspResultValues.insp_handling_type === '') {
      return message.warn('처리결과를 등록해주세요.');
    } else if (!inputInspResultValues?.emp_uuid) {
      return message.warn('검사자를 등록해주세요.');
    } else if (!inputInspResultValues?.reg_date_time) {
      return message.warn('검사시간을 등록해주세요.');
    }

    const inspectionDatas = inspectionGridRef.current.getInstance().getData();
    const cellCheckers = cellKeys(inspectionDatas, '_insp_value')
      .map((item: Array<string>, index: number) =>
        sliceKeys(item, inspectionDatas[index].sample_cnt),
      )
      .map((inspections, index) =>
        inspections.map(inspectionKey =>
          inspectionDatas[index][inspectionKey] == null ||
          inspectionDatas[index][inspectionKey] === ''
            ? inspectionCheck(EmptyInspectionChecker, null)
            : isNumber(inspectionDatas[index].spec_min) &&
              isNumber(inspectionDatas[index].spec_max)
            ? inspectionCheck(NumberInspectionChecker, {
                value: inspectionDatas[index][inspectionKey] * 1,
                min: inspectionDatas[index].spec_min * 1,
                max: inspectionDatas[index].spec_max * 1,
              })
            : inspectionCheck(EyeInspectionChecker, {
                value: inspectionDatas[index][inspectionKey],
              }),
        ),
      );

    const sequencialMissingValueState = cellCheckers.some(
      (cells: Array<boolean>) => {
        if (cells[0] === null) return true;

        if (cells.length > 1) {
          for (let index = 1; index < cells.length; index++) {
            if (cells[index - 1] === null && cells[index] !== null) return true;
          }
        }
      },
    );

    if (sequencialMissingValueState === true) {
      message.warn('결측치가 존재합니다. 확인 후 다시 저장해주세요');
      return;
    }

    const userInputAllCell = cellCheckers.every(cells =>
      cells.every(cell => cell !== null),
    );

    if (userInputAllCell === false) {
      const userDefinedInspectionSaveOption = await getData(
        { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
        '/std/tenant-opts',
      );

      if (userDefinedInspectionSaveOption.length > 0) {
        if (userDefinedInspectionSaveOption[0].value === 1) {
          message.warn('검사 결과 값을 시료 수 만큼 입력해주세요');
          return;
        } else if (userDefinedInspectionSaveOption[0].value === 2) {
          return Modal.confirm({
            title: '',
            content:
              '검사 결과 시료 수 만큼 등록되지 않았습니다. 저장 하시겠습니까?',
            onOk: close => {
              saveData(inspectionGridRef.current.getInstance());
              close();
            },
            onCancel: () => {},
          });
        }
      }
    }
    saveData(inspectionGridRef.current.getInstance());
  };

  const onCancel = ev => {
    onClear();
    props.setPopupVisible(false);
  };

  useLayoutEffect(() => {
    const searchUriPath =
      URI_PATH_GET_QMS_RECEIVE_INSP_RESULT_INCLUDE_DETAILS.replace(
        '{uuid}',
        props.inspResultUuid,
      );

    if (props.inspResultUuid && props.popupVisible) {
      getData({}, searchUriPath, 'header-details')
        .then((res: any) => {
          setReceiveInspHeaderData(res.header);
          setReceiveInspDetailData(res.details);
          inputInputItems.setValues({
            ...res.header,
            receive_date: dayjs(res.header.receive_date)
              .add(-6, 'day')
              .format('YYYY-MM-DD'),
            qty: res.header.insp_qty,
          });

          inputInspResult.setValues({
            ...res.header,
            reg_date: dayjs(res.header.reg_date).format('YYYY-MM-DD'),
            reg_date_time: `${res.header.reg_date}`
              .replace('T', ' ')
              .slice(0, -5),
            insp_handling_type: JSON.stringify({
              insp_handling_type_uuid: res.header.insp_handling_type_uuid,
              insp_handling_type_cd: res.header.insp_handling_type_cd,
            }),
          });
          inputInspResultIncome.setValues({
            ...res.header,
            qty: res.header.pass_qty,
          });
          inputInspResultReject.setValues({ ...res.header });

          changeInspResult(res.header.insp_handling_type_cd, true);
          inputInspResult.setFieldDisabled({
            insp_handling_type: res.header.insp_result_fg,
          });
          res.details.forEach((detail, idx) => {
            for (
              let cell = detail.sample_cnt;
              cell < res.header.max_sample_cnt;

            ) {
              cell++;
              gridRef.current
                .getInstance()
                .disableCell(idx, `x${cell}_insp_value`);
              gridRef.current
                .getInstance()
                .removeCellClassName(idx, `x${cell}_insp_value`, 'editor');
            }
          });
        })
        .catch(err => {
          onClear();
          message.error('에러');
        });
    } else {
      onClear();
    }
  }, [props.popupVisible, props.inspResultUuid]);

  useLayoutEffect(() => {
    changeInspResult(inputInspResult?.values?.insp_handling_type_cd, false);
  }, [inputInspResult?.values?.insp_handling_type_cd]);

  useLayoutEffect(() => {
    if (changeIncomeQtyFg === false) return;
    const inputInputItemsInstance =
      inputInputItems.ref.current ?? inputInputItems;
    const inputInspResultIncomeInstance =
      inputInspResultIncome.ref.current ?? inputInspResultIncome;
    const inputInspResultRejectInstance =
      inputInspResultReject.ref.current ?? inputInspResultReject;

    let receiveQty: number = Number(inputInputItemsInstance?.values?.qty);
    let incomeQty: number = Number(inputInspResultIncomeInstance?.values?.qty);
    let rejectQty: number = Number(
      inputInspResultRejectInstance?.values?.reject_qty,
    );

    if (receiveQty - incomeQty < 0) {
      message.warn(
        '입하수량보다 판정수량이 많습니다. 확인 후 다시 입력해주세요.',
      );
      inputInspResultIncome.setFieldValue('qty', receiveQty - rejectQty);
    } else {
      inputInspResultReject.setFieldValue('reject_qty', receiveQty - incomeQty);
    }

    setChangeIncomeQtyFg(false);
  }, [changeIncomeQtyFg]);

  useLayoutEffect(() => {
    if (!changeRejectQtyFg) return;
    let receiveQty: number = Number(inputInputItems?.values?.qty);
    let incomeQty: number = Number(inputInspResultIncome?.values?.qty);
    let rejectQty: number = Number(inputInspResultReject?.values?.reject_qty);

    if (receiveQty - rejectQty < 0) {
      message.warn(
        '입하수량보다 판정수량이 많습니다. 확인 후 다시 입력해주세요.',
      );
      inputInspResultReject.setFieldValue('reject_qty', receiveQty - incomeQty);
    } else {
      inputInspResultIncome.setFieldValue('qty', receiveQty - rejectQty);
    }
    setChangeRejectQtyFg(false);
  }, [changeRejectQtyFg]);

  return (
    <GridPopup
      title="수입검사 성적서 수정"
      onOk={onSave}
      okText="저장"
      cancelText="취소"
      onCancel={onCancel}
      gridMode="update"
      popupId={'INSP_EDIT_POPUP'}
      gridId={'INSP_EDIT_POPUP_GRID'}
      ref={gridRef}
      columns={CREATE_POPUP_DETAIL_COLUMNS}
      inputProps={[
        inputInputItems.props,
        inputInspResult.props,
        inputInspResultIncome.props,
        inputInspResultReject.props,
      ]}
      onAfterChange={onAfterChange}
      saveUriPath={null}
      searchUriPath={null}
      data={receiveInspDetailData}
      hiddenActionButtons={true}
      saveType="basic"
      visible={props.popupVisible}
    />
  );
};
