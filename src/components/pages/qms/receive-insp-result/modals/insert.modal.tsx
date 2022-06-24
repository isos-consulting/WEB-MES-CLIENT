import React, { useRef, useState, useMemo, useLayoutEffect } from 'react';
import Grid from '@toast-ui/react-grid';
import {
  InspectionHandlingTypeCodeSet,
  InspectionHandlingTypeUuidSet,
  InspectionPostAPIPayload,
  InspectionPostPayloadDetails,
  InspectionPostPayloadHeader,
  TReceiveDetail,
  TReceiveInspDetail,
  TReceiveInspHeader,
} from './types';
import { getPopupForm, GridPopup, IGridColumn } from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { URI_PATH_POST_QMS_RECEIVE_INSP_RESULTS } from './constants';
import {
  blankThenNull,
  executeData,
  getData,
  getToday,
  getUserFactoryUuid,
  isNumber,
} from '~/functions';
import { message, Modal } from 'antd';
import { InputForm, QuantityField } from '../models/fields';
import InspectionHandlingServiceImpl from './service/inspection-handling.service.impl';
import {
  INFO_INPUT_ITEMS,
  INPUT_ITEMS_INSP_RESULT,
  INPUT_ITEMS_INSP_RESULT_INCOME,
  INPUT_ITEMS_INSP_RESULT_RETURN,
  inspectionCheckCells,
  inspectionItemResultCells,
  INSP_DETAIL_COLUMNS,
} from './constants/columns';
import {
  EmptyInspectionChecker,
  EyeInspectionChecker,
  InspectionConcreate,
  NumberInspectionChecker,
} from '../models/inspection-checker';

export const INSP_RESULT_CREATE_POPUP = (props: {
  inspHandlingType: InspectionHandlingTypeCodeSet<InspectionHandlingTypeUuidSet>[];
  popupVisible: boolean;
  setPopupVisible: (value?) => void;
  onAfterCloseSearch?: () => void;
}) => {
  const gridRef = useRef<Grid>();
  const [changeIncomeQtyFg, setChangeIncomeQtyFg] = useState(false);
  const [changeRejectQtyFg, setChangeRejectQtyFg] = useState(false);
  const [receiveInputData, setReceiveInputData] = useState<TReceiveDetail>({});
  const [receiveInspHeaderData, setReceiveInspHeaderData] =
    useState<TReceiveInspHeader>({});
  const [receiveInspDetailData, setReceiveInspDetailData] = useState<
    TReceiveInspDetail[]
  >([]);

  const initialize = () => {
    const stmtNoSubField = INFO_INPUT_ITEMS.find(
      inputItemsField => inputItemsField.id === 'stmt_no_sub',
    );

    const regDateField = INPUT_ITEMS_INSP_RESULT.find(
      inspectionResultField => inspectionResultField.id === 'reg_date',
    );

    const inspectionHandlingTypeField = INPUT_ITEMS_INSP_RESULT.find(
      inspectionResultField =>
        inspectionResultField.id === 'insp_handling_type',
    );

    const inspectionIncomeQuantityField = INPUT_ITEMS_INSP_RESULT_INCOME.find(
      inspectionIncomeField => inspectionIncomeField.id === 'qty',
    );

    const inspectionIncomeStoreField = INPUT_ITEMS_INSP_RESULT_INCOME.find(
      inspectionIncomeField => inspectionIncomeField.id === 'to_store_uuid',
    );

    const inspectionIncomeLocationField = INPUT_ITEMS_INSP_RESULT_INCOME.find(
      inspectionIncomeField => inspectionIncomeField.id === 'to_location_uuid',
    );

    const inspectionRejectQuantityField = INPUT_ITEMS_INSP_RESULT_RETURN.find(
      inspectionRejectField => inspectionRejectField.id === 'reject_qty',
    );

    const inspectionRejectStoreField = INPUT_ITEMS_INSP_RESULT_RETURN.find(
      inspectionRejectField => inspectionRejectField.id === 'reject_store_uuid',
    );

    const inspectionRejectLocationField = INPUT_ITEMS_INSP_RESULT_RETURN.find(
      inspectionRejectField =>
        inspectionRejectField.id === 'reject_location_uuid',
    );

    stmtNoSubField.handleChange = values => setReceiveInputData(values);
    regDateField.default = getToday();
    inspectionHandlingTypeField.options = props.inspHandlingType;

    inspectionHandlingTypeField.onAfterChange = (
      inspectionHandlingTypeCode: string,
    ) => {
      const { insp_handling_type_cd }: InspectionHandlingTypeUuidSet =
        inspectionHandlingTypeCode === ''
          ? { insp_handling_type_cd: null }
          : JSON.parse(inspectionHandlingTypeCode);
      const inputQty = inputInputItems.ref.current.values.qty;

      handleInspectionHandlingTypeChange(insp_handling_type_cd, inputQty);
    };

    inspectionIncomeQuantityField.onAfterChange = () =>
      setChangeIncomeQtyFg(true);

    inspectionIncomeStoreField.dataSettingOptions['uriPath'] =
      getPopupForm('창고관리')?.uriPath;

    inspectionIncomeLocationField.dataSettingOptions['uriPath'] =
      getPopupForm('위치관리')?.uriPath;

    inspectionRejectQuantityField.onAfterChange = () =>
      setChangeRejectQtyFg(true);

    inspectionRejectStoreField.dataSettingOptions['uriPath'] =
      getPopupForm('창고관리')?.uriPath;

    inspectionRejectLocationField.dataSettingOptions['uriPath'] =
      getPopupForm('위치관리')?.uriPath;
  };

  initialize();

  const handleInspectionHandlingTypeChange = (
    handlingTypeCode: string,
    inputQuantity: number,
  ) => {
    const incomeFormService = new InspectionHandlingServiceImpl(
      new InputForm(),
    );
    const rejectFormService = new InspectionHandlingServiceImpl(
      new InputForm(),
    );

    incomeFormService.addFields(inputInspResultIncome.inputItemKeys);
    rejectFormService.addFields(inputInspResultReject.inputItemKeys);

    const incomeQuantity = new QuantityField(incomeFormService.getField('qty'));
    const rejectQuantity = new QuantityField(
      rejectFormService.getField('reject_qty'),
    );

    if ('INCOME' === handlingTypeCode) {
      incomeQuantity.setQuantity(inputQuantity);

      incomeQuantity.toggle();
      rejectFormService.toggle();
    } else if ('RETURN' === handlingTypeCode) {
      rejectQuantity.setQuantity(inputQuantity);

      incomeFormService.toggle();
      rejectQuantity.toggle();
    } else if ('SELECTION' === handlingTypeCode) {
      incomeQuantity.setQuantity(inputQuantity);

      rejectQuantity.toggle();
    } else {
      incomeFormService.toggle();
      rejectFormService.toggle();
    }

    inputInspResultIncome.setFieldValue('qty', incomeQuantity.info().quantity);
    inputInspResultReject.setFieldValue(
      'reject_qty',
      rejectQuantity.info().quantity,
    );

    const incomeEnabled = incomeFormService.attributes();
    const rejectEnabled = rejectFormService.attributes();

    inputInspResultIncome.setFieldDisabled({ ...incomeEnabled });
    inputInspResultReject.setFieldDisabled({ ...rejectEnabled });
  };

  const CREATE_POPUP_DETAIL_COLUMNS = useMemo(() => {
    let items: IGridColumn[] = INSP_DETAIL_COLUMNS;

    if (receiveInspHeaderData?.max_sample_cnt > 0) {
      for (let i = 1; i <= receiveInspHeaderData?.max_sample_cnt; i++) {
        const inspectionCheckCellColumns = inspectionCheckCells.map(cell => ({
          ...cell,
          header: `x${i}${cell.header}`,
          name: `x${i}${cell.name}`,
        }));

        items.push(...inspectionCheckCellColumns);
      }
    }

    items.push(...inspectionItemResultCells);

    return items;
  }, [receiveInspHeaderData]);

  const inputInputItems = useInputGroup(
    'INPUT_CREATE_POPUP_INFO',
    INFO_INPUT_ITEMS,
    { title: '입하정보' },
  );
  const inputInspResult = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: '검사정보' },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT_INCOME',
    INPUT_ITEMS_INSP_RESULT_INCOME,
    { title: '입고정보' },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT_REJECT',
    INPUT_ITEMS_INSP_RESULT_RETURN,
    { title: '부적합정보' },
  );

  const resetInspectionDatas = () => {
    inputInputItems.ref.current.resetForm();
    inputInspResult.ref.current.resetForm();
    inputInspResultIncome.ref.current.resetForm();
    inputInspResultReject.ref.current.resetForm();
    setReceiveInspHeaderData({});
    setReceiveInspDetailData([]);
  };

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

    if (finalChecker === null) {
      inputInspResult.setFieldDisabled({ insp_handling_type: true });
    } else {
      inputInspResult.setFieldDisabled({ insp_handling_type: false });
    }

    const inspectionHandlingTypeCode: string =
      finalChecker === true ? 'INCOME' : finalChecker === false ? 'RETURN' : '';

    handleInspectionHandlingTypeChange(
      inspectionHandlingTypeCode,
      receiveInputData?.qty,
    );
    const { code } = props.inspHandlingType.find(
      el =>
        JSON.parse(el.code).insp_handling_type_cd ===
        inspectionHandlingTypeCode,
    ) ?? { code: '' };

    inputInspResult.setFieldValue('insp_handling_type', code);
  };

  const saveInspectionData = inspectionGridInstance => {
    const inspectionDatas = inspectionGridInstance.getData();
    const inputInputItemsValues = inputInputItems?.ref?.current?.values;
    const inputInspResultValues = inputInspResult?.ref?.current?.values;
    const inputInspResultIncomeValues =
      inputInspResultIncome?.ref?.current?.values;
    const inputInspResultRejectValues =
      inputInspResultReject?.ref?.current?.values;

    const inspectionHeader: InspectionPostPayloadHeader = {
      factory_uuid: getUserFactoryUuid(),
      receive_detail_uuid: inputInputItemsValues?.receive_detail_uuid,
      insp_type_uuid: inputInputItemsValues?.insp_type_uuid,
      insp_detail_type_uuid: inputInputItemsValues?.insp_detail_type_uuid,
      insp_handling_type_uuid: JSON.parse(
        inputInspResultValues.insp_handling_type,
      ).insp_handling_type_uuid,
      insp_uuid: receiveInspHeaderData?.insp_uuid,
      unit_uuid: inputInputItemsValues?.unit_uuid,
      prod_uuid: receiveInspHeaderData?.prod_uuid,
      lot_no: inputInputItemsValues?.lot_no,
      emp_uuid: inputInspResultValues?.emp_uuid,
      reg_date:
        inputInspResultValues?.reg_date +
        ' ' +
        inputInspResultValues?.reg_date_time +
        ':00',
      insp_result_fg: inputInspResultValues?.insp_result_fg,
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

    const inspectionItems: InspectionPostPayloadDetails[] = cellKeys(
      inspectionDatas,
      '_insp_value',
    )
      .map((item: Array<string>, index: number) =>
        sliceKeys(item, inspectionDatas[index].sample_cnt),
      )
      .map((definedCountKeys, index) => ({
        factory_uuid: getUserFactoryUuid(),
        insp_detail_uuid: inspectionDatas[index].insp_detail_uuid,
        insp_result_fg: inspectionDatas[index].insp_result_fg,
        remark: inspectionDatas[index].remark,
        values: definedCountKeys
          .map((key, keyIndex) => ({
            sample_no: keyIndex + 1,
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
          }))
          .filter(inspectionCell => inspectionCell.insp_result_fg !== null),
      }));

    return {
      header: inspectionHeader,
      details: inspectionItems,
    };
  };

  const callInspectionCreateAPI = async (saveData: InspectionPostAPIPayload) =>
    await executeData(
      saveData,
      URI_PATH_POST_QMS_RECEIVE_INSP_RESULTS,
      'post',
      'success',
    )
      .then(value => {
        if (!value) return;
        message.info('저장되었습니다.');
        props.onAfterCloseSearch();
        resetInspectionDatas();
        props.setPopupVisible(false);
      })
      .catch(e => {
        console.log(e);
      });

  const onSave = async inspectionGridRef => {
    const inputInspResultValues = inputInspResult?.ref?.current?.values;

    if (inputInspResultValues.insp_handling_type === '') {
      return message.warn('처리결과를 등록해주세요.');
    } else if (!inputInspResultValues?.emp_uuid) {
      return message.warn('검사자를 등록해주세요.');
    } else if (!inputInspResultValues?.reg_date_time) {
      return message.warn('검사시간을 등록해주세요.');
    }

    if (
      inputInspResultValues.insp_result_fg === true &&
      JSON.parse(inputInspResultValues.insp_handling_type)
        .insp_handling_type_cd !== 'INCOME'
    ) {
      return message.warn('최종 판정이 합격일 경우 입고만 처리 할 수 있습니다');
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

    const isUserInputAllCell = cellCheckers.every(cells =>
      cells.every(cell => cell !== null),
    );

    const userDefinedInspectionSaveOption = await getData(
      { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
      '/std/tenant-opts',
    );

    const saveData = saveInspectionData(
      inspectionGridRef.current.getInstance(),
    );

    if (userDefinedInspectionSaveOption.length === 0) {
      return await callInspectionCreateAPI(saveData);
    }

    if (
      isUserInputAllCell === false &&
      userDefinedInspectionSaveOption[0].value === 1
    ) {
      message.warn('검사 결과 값을 시료 수 만큼 입력해주세요');
      return;
    } else if (
      isUserInputAllCell === false &&
      userDefinedInspectionSaveOption[0].value === 2
    ) {
      Modal.confirm({
        title: '',
        content:
          '검사 결과 시료 수 만큼 등록되지 않았습니다. 저장 하시겠습니까?',
        onOk: async close => {
          const saveData = saveInspectionData(
            inspectionGridRef.current.getInstance(),
          );
          await callInspectionCreateAPI(saveData);
          close();
        },
        onCancel: () => {},
      });
    }

    return await callInspectionCreateAPI(saveData);
  };

  const onCancel = ev => {
    resetInspectionDatas();
    props.setPopupVisible(false);
  };

  useLayoutEffect(() => {
    const inspDetailTypeCd = receiveInputData.insp_detail_type_cd;
    const inspDetailType =
      inspDetailTypeCd === 'MAT_RECEIVE'
        ? 'matReceive'
        : inspDetailTypeCd === 'OUT_RECEIVE'
        ? 'outReceive'
        : '';

    inputInspResult.ref.current.resetForm();
    inputInspResultIncome.ref.current.resetForm();
    inputInspResultReject.ref.current.resetForm();

    inputInspResultIncome.setFieldValue(
      'to_store_uuid',
      receiveInputData.to_store_uuid,
    );

    if (inspDetailType && receiveInputData.receive_detail_uuid) {
      getData(
        {
          insp_detail_type_uuid: receiveInputData.insp_detail_type_uuid,
          receive_detail_uuid: receiveInputData.receive_detail_uuid,
        },
        '/qms/receive/insp/include-details',
        'header-details',
      )
        .then(res => {
          setReceiveInspHeaderData(res.header);
          setReceiveInspDetailData(res.details);
          inputInspResult.setFieldValue('reg_date', getToday());

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
          resetInspectionDatas();
          message.error('에러');
        });
    }
  }, [receiveInputData]);

  useLayoutEffect(() => {
    const inspectionHandlingTypeCode =
      inputInspResult?.values?.insp_handling_type != null
        ? JSON.parse(inputInspResult?.values?.insp_handling_type)
            .insp_handling_type_cd
        : null;

    handleInspectionHandlingTypeChange(
      inspectionHandlingTypeCode,
      receiveInputData?.qty,
    );
  }, [inputInspResult?.values?.insp_handling_type]);

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
      title="데이터 추가하기"
      onOk={onSave}
      okText="저장"
      cancelText="취소"
      onCancel={onCancel}
      gridMode="update"
      popupId={'INSP_CREATE_POPUP'}
      gridId={'INSP_CREATE_POPUP_GRID'}
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
