import Grid from '@toast-ui/react-grid';
import { message, Modal } from 'antd';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getPopupForm, GridPopup } from '~/components/UI';
import { useInputGroup } from '~/components/UI/input-groupbox';
import { ColumnStore } from '~/constants/columns';
import { InputGroupBoxStore } from '~/constants/input-groupboxes';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import {
  blankThenNull,
  executeData,
  getData,
  getToday,
  getUserFactoryUuid,
} from '~/functions';
import {
  createInspectionReportColumns,
  extract_insp_ItemEntriesAtCounts,
  getEyeInspectionValueText,
  getInspectItems,
  getInspectResult,
  getInspectResultText,
  getInspectSamples,
  getMissingValueInspectResult,
  getRangeNumberResults,
  getSampleIndex,
  getSampleOkOrNgOrDefaultSampleValue,
  isColumnNameEndWith_insp_value,
  isColumnNamesNotEndWith_insp_value,
  isRangeAllNotNumber,
} from '~/functions/qms/inspection';
import { InputForm, QuantityField } from '../models/fields';
import { URI_PATH_POST_QMS_RECEIVE_INSP_RESULTS } from './constants';
import InspectionHandlingServiceImpl from './service/inspection-handling.service.impl';
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
    const stmtNoSubField = InputGroupBoxStore.RECEIVE_INSP_ITEM.find(
      inputItemsField => inputItemsField.id === 'stmt_no_sub',
    );

    const regDateField = InputGroupBoxStore.RECEIVE_INSP_RESULT.find(
      inspectionResultField => inspectionResultField.id === 'reg_date',
    );

    const inspectionHandlingTypeField =
      InputGroupBoxStore.RECEIVE_INSP_RESULT.find(
        inspectionResultField =>
          inspectionResultField.id === 'insp_handling_type',
      );

    const inspectionIncomeQuantityField =
      InputGroupBoxStore.RECEIVE_INSP_RESULT_INCOME.find(
        inspectionIncomeField => inspectionIncomeField.id === 'qty',
      );

    const inspectionIncomeStoreField =
      InputGroupBoxStore.RECEIVE_INSP_RESULT_INCOME.find(
        inspectionIncomeField => inspectionIncomeField.id === 'to_store_uuid',
      );

    const inspectionIncomeLocationField =
      InputGroupBoxStore.RECEIVE_INSP_RESULT_INCOME.find(
        inspectionIncomeField =>
          inspectionIncomeField.id === 'to_location_uuid',
      );

    const inspectionRejectQuantityField =
      InputGroupBoxStore.RECEIVE_INSP_RESULT_RETURN.find(
        inspectionRejectField => inspectionRejectField.id === 'reject_qty',
      );

    const inspectionRejectStoreField =
      InputGroupBoxStore.RECEIVE_INSP_RESULT_RETURN.find(
        inspectionRejectField =>
          inspectionRejectField.id === 'reject_store_uuid',
      );

    const inspectionRejectLocationField =
      InputGroupBoxStore.RECEIVE_INSP_RESULT_RETURN.find(
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
    const receiveInspectionReportColumns = createInspectionReportColumns(
      ColumnStore.RECEIVE_INSP_DETAIL,
      receiveInspHeaderData?.max_sample_cnt,
    );

    return receiveInspectionReportColumns;
  }, [receiveInspHeaderData]);

  const inputInputItems = useInputGroup(
    'INPUT_CREATE_POPUP_INFO',
    InputGroupBoxStore.RECEIVE_INSP_ITEM,
    { title: WORD.RECEIVE_INFO },
  );
  const inputInspResult = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT',
    InputGroupBoxStore.RECEIVE_INSP_RESULT,
    { title: WORD.INSP_INFO },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT_INCOME',
    InputGroupBoxStore.RECEIVE_INSP_RESULT_INCOME,
    { title: WORD.INCOME_INFO },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_CREATE_POPUP_INSP_RESULT_REJECT',
    InputGroupBoxStore.RECEIVE_INSP_RESULT_RETURN,
    { title: WORD.REJECT_INFO },
  );

  const resetInspectionDatas = () => {
    inputInputItems.ref.current.resetForm();
    inputInspResult.ref.current.resetForm();
    inputInspResultIncome.ref.current.resetForm();
    inputInspResultReject.ref.current.resetForm();
    setReceiveInspHeaderData({});
    setReceiveInspDetailData([]);
  };

  const onAfterChange = ({ changes, instance }: any) => {
    if (isColumnNamesNotEndWith_insp_value(changes)) return;

    const receiveInspections = instance.getData();
    const inspectionItemRanges = receiveInspections.map((item: any) => ({
      min: item.spec_min,
      max: item.spec_max,
    }));
    const extractedInspections =
      extract_insp_ItemEntriesAtCounts(receiveInspections);
    const inspectionSampleResults = getInspectSamples(
      extractedInspections,
      inspectionItemRanges,
    );
    const inspectionItemResults = getInspectItems(inspectionSampleResults);
    const inspectionResult = getInspectResult(inspectionItemResults);

    changes.forEach(({ rowKey, columnName }: any) => {
      if (isColumnNameEndWith_insp_value(columnName)) {
        const sampleIndex = getSampleIndex(columnName);
        const sampleResult = inspectionSampleResults[rowKey][sampleIndex];
        const isNumberFlagsInItemRange = getRangeNumberResults(
          inspectionItemRanges[rowKey],
        );
        const eyeInspectValueText = getEyeInspectionValueText(sampleResult);

        const uiMappedSampleInfo = {
          [`x${sampleIndex + 1}_insp_result_fg`]: sampleResult,
          [`x${sampleIndex + 1}_insp_result_state`]:
            getInspectResultText(sampleResult),
        };

        for (const [key, value] of Object.entries(uiMappedSampleInfo)) {
          instance.setValue(rowKey, key, value);
        }

        if (
          isRangeAllNotNumber(isNumberFlagsInItemRange) &&
          eyeInspectValueText
        ) {
          instance.setValue(rowKey, columnName, eyeInspectValueText);
        }
      }
    });

    inspectionItemResults.forEach((item: any, index: number) => {
      instance.setValue(index, 'insp_result_fg', item);
      instance.setValue(index, 'insp_result_state', getInspectResultText(item));
    });

    inputInspResult.setFieldValue('insp_result_fg', inspectionResult);
    inputInspResult.setFieldValue(
      'insp_result_state',
      getInspectResultText(inspectionResult),
    );

    if (inspectionResult === null || inspectionResult === true) {
      inputInspResult.setFieldDisabled({ insp_handling_type: true });
    } else {
      inputInspResult.setFieldDisabled({ insp_handling_type: false });
    }

    const inspectionHandlingTypeCode: string =
      inspectionResult === true
        ? 'INCOME'
        : inspectionResult === false
        ? 'RETURN'
        : '';

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

    const inspectionDatas = inspectionGridInstance.getData();
    const inspectionItemRanges = inspectionDatas.map((item: any) => ({
      min: item.spec_min,
      max: item.spec_max,
    }));

    const inspectionSampleResults = getInspectSamples(
      extract_insp_ItemEntriesAtCounts(inspectionDatas),
      inspectionItemRanges,
    );

    const inspectionItems: InspectionPostPayloadDetails[] =
      inspectionSampleResults.map((item, itemIndex) => {
        const notNullSamples = item.reduce(
          (samples, currentSample, sampleIndex) => {
            if (currentSample === null) {
              return samples;
            }

            return [
              ...samples,
              {
                sample_no: sampleIndex + 1,
                insp_result_fg: currentSample,
                insp_value: getSampleOkOrNgOrDefaultSampleValue(
                  inspectionDatas[itemIndex][`x${sampleIndex + 1}_insp_value`],
                ),
              },
            ];
          },
          [],
        );

        return {
          factory_uuid: getUserFactoryUuid(),
          insp_detail_uuid: inspectionDatas[itemIndex].insp_detail_uuid,
          insp_result_fg: inspectionDatas[itemIndex].insp_result_fg,
          remark: inspectionDatas[itemIndex].remark,
          values: notNullSamples,
        };
      });

    return {
      header: inspectionHeader,
      details: inspectionItems,
    };
  };

  const callInspectionCreateAPI = async (saveData: InspectionPostAPIPayload) =>
    executeData(
      saveData,
      URI_PATH_POST_QMS_RECEIVE_INSP_RESULTS,
      'post',
      'success',
    )
      .then(value => {
        if (!value) return;
        message.info(SENTENCE.SAVE_COMPLETE);
        props.onAfterCloseSearch();
        resetInspectionDatas();
        props.setPopupVisible(false);
      })
      .catch(e => {
        console.log(e);
      });

  const onSave = async inspectionGridRef => {
    const { insp_handling_type, emp_uuid, reg_date_time, insp_result_fg } =
      inputInspResult?.ref?.current?.values;
    const { reject_qty, reject_uuid, reject_store_uuid } =
      inputInspResultReject?.ref?.current?.values;
    const { to_store_uuid } = inputInspResultIncome?.ref?.current?.values;

    if (insp_handling_type === '') {
      message.warn('처리결과를 등록해주세요.');
      return;
    }
    if (emp_uuid == null) {
      message.warn('검사자를 등록해주세요.');
      return;
    }
    if (reg_date_time == null) {
      message.warn('검사시간을 등록해주세요.');
      return;
    }

    const { insp_handling_type_cd } = JSON.parse(insp_handling_type);

    if (insp_result_fg === true && insp_handling_type_cd !== 'INCOME') {
      message.warn('최종 판정이 합격일 경우 입고만 처리 할 수 있습니다');
      return;
    }

    if (insp_handling_type_cd === 'INCOME') {
      if (to_store_uuid == null || to_store_uuid === '') {
        message.warn('입고창고를 등록해주세요.');
        return;
      }
    }

    if (insp_handling_type_cd === 'RETURN') {
      if (reject_uuid == null) {
        message.warn('불량유형을 등록해주세요.');
        return;
      }

      if (reject_store_uuid == null || reject_store_uuid === '') {
        message.warn('불량창고를 등록해주세요.');
        return;
      }
    }

    if (insp_handling_type_cd === 'SELECTION') {
      if (to_store_uuid == null || to_store_uuid === '') {
        message.warn('입고창고를 등록해주세요.');
        return;
      }

      if (reject_qty > 0) {
        if (reject_uuid == null) {
          message.warn('불량유형을 등록해주세요.');
          return;
        }

        if (reject_store_uuid == null || reject_store_uuid === '') {
          message.warn('불량창고를 등록해주세요.');
          return;
        }
      }
    }

    const inspectionDatas = inspectionGridRef.current.getInstance().getData();
    const inspectionItemRanges = inspectionDatas.map(item => ({
      min: item.spec_min,
      max: item.spec_max,
    }));

    const inspectionSampleResults = getInspectSamples(
      extract_insp_ItemEntriesAtCounts(inspectionDatas),
      inspectionItemRanges,
    );

    const isMissingValue = inspectionSampleResults.some(
      getMissingValueInspectResult,
    );

    if (isMissingValue === true) {
      message.warn('결측치가 존재합니다. 확인 후 다시 저장해주세요');
      return;
    }

    const isUserInputAllCell = inspectionSampleResults.every(cells =>
      cells.every(cell => cell !== null),
    );

    const saveData = saveInspectionData(
      inspectionGridRef.current.getInstance(),
    );

    if (isUserInputAllCell === true) {
      callInspectionCreateAPI(saveData);
      return;
    }

    const userDefinedInspectionSaveOption = await getData(
      { tenant_opt_cd: 'QMS_INSP_RESULT_FULL' },
      '/std/tenant-opts',
    );

    if (userDefinedInspectionSaveOption.length === 0) {
      throw new Error(
        '검사성적서 결과값 전체등록 여부 옵션을 찾을 수 없습니다.',
      );
    }

    if (userDefinedInspectionSaveOption[0].value === 0) {
      callInspectionCreateAPI(saveData);
      return;
    }

    if (userDefinedInspectionSaveOption[0].value === 1) {
      message.warn('검사 결과 값을 시료 수 만큼 입력해주세요');
      return;
    }

    if (userDefinedInspectionSaveOption[0].value === 2) {
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
        onCancel: () => {
          // this function will be executed when cancel button is clicked
        },
      });

      return;
    }

    throw new Error('알 수 없는 수입 검사 성적서 저장 API 예외가 발생했습니다');
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
          const headerDetailRes = res as unknown as {
            header: any;
            details: any;
          };
          setReceiveInspHeaderData(headerDetailRes.header);
          setReceiveInspDetailData(headerDetailRes.details);
          inputInspResult.setFieldValue('reg_date', getToday());

          headerDetailRes.details.forEach((detail, idx) => {
            for (
              let cell = detail.sample_cnt;
              cell < headerDetailRes.header.max_sample_cnt;

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
