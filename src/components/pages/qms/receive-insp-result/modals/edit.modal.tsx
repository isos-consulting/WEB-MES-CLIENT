import Grid from '@toast-ui/react-grid';
import { message, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getPopupForm, GridPopup, IGridColumn } from '~/components/UI';
import {
  IInputGroupboxItem,
  useInputGroup,
} from '~/components/UI/input-groupbox';
import { WORD } from '~/constants/lang/ko';
import { ENUM_WIDTH } from '~/enums';
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
import {
  URI_PATH_GET_QMS_RECEIVE_INSP_RESULT_INCLUDE_DETAILS,
  URI_PATH_PUT_QMS_RECEIVE_INSP_RESULTS,
} from './constants';
import { TReceiveInspDetail, TReceiveInspHeader } from './types';

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
    const receiveInspectionReportColumns = createInspectionReportColumns(
      INSP_DETAIL_COLUMNS,
      receiveInspHeaderData?.max_sample_cnt,
    );

    return receiveInspectionReportColumns;
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
      onAfterChange: ev => {
        // this function is called when the value of the combo is changed
      },
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
      onAfterChange: ev => {
        // this function is called when the value of the combo is changed
      },
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
      onAfterChange: ev => {
        // this function is called when the value of the combo is changed
      },
    },
  ];

  const inputInputItems = useInputGroup(
    'INPUT_EDIT_POPUP_INFO',
    INFO_INPUT_ITEMS,
    { title: WORD.RECEIVE_INFO },
  );
  const inputInspResult = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT',
    INPUT_ITEMS_INSP_RESULT,
    { title: WORD.INSP_INFO },
  );
  const inputInspResultIncome = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT_INCOME',
    INPUT_ITEMS_INSP_RESULT_INCOME,
    { title: WORD.INCOME_INFO },
  );
  const inputInspResultReject = useInputGroup(
    'INPUT_EDIT_POPUP_INSP_RESULT_REJECT',
    INPUT_ITEMS_INSP_RESULT_RETURN,
    { title: WORD.REJECT_INFO },
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

    let _inspHandlingCd: string;

    if (inspectionResult === true) {
      _inspHandlingCd = 'INCOME';
      changeInspResult('INCOME');
    } else if (inspectionResult === false) {
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
        }
      });
    }
  };

  const saveData = async inspectionGridInstance => {
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

    const inspectionDatas = inspectionGridInstance.getData();
    const inspectionItemRanges = inspectionDatas.map((item: any) => ({
      min: item.spec_min,
      max: item.spec_max,
    }));

    const inspectionSampleResults = getInspectSamples(
      extract_insp_ItemEntriesAtCounts(inspectionDatas),
      inspectionItemRanges,
    );

    const inspectionItems = inspectionSampleResults.map((item, itemIndex) => {
      const editedSamples = item.reduce(
        (samples, currentSample, sampleIndex) => {
          const sampleUuid =
            inspectionDatas[itemIndex][
              `x${sampleIndex + 1}_insp_result_detail_value_uuid`
            ];
          if (sampleUuid == null && currentSample == null) return samples;
          if (currentSample == null)
            return [
              ...samples,
              {
                uuid: sampleUuid,
                delete_fg: true,
                sample_no: sampleIndex + 1,
              },
            ];

          return [
            ...samples,
            {
              uuid: sampleUuid,
              delete_fg: false,
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
        uuid: inspectionDatas[itemIndex].insp_result_detail_info_uuid,
        insp_detail_uuid: inspectionDatas[itemIndex].insp_detail_uuid,
        insp_result_fg: inspectionDatas[itemIndex].insp_result_fg,
        remark: inspectionDatas[itemIndex].remark,
        values: editedSamples,
      };
    });

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

    if (isUserInputAllCell === true) {
      saveData(inspectionGridRef.current.getInstance());
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
      saveData(inspectionGridRef.current.getInstance());
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
        onOk: close => {
          saveData(inspectionGridRef.current.getInstance());
          close();
        },
        onCancel: () => {
          // this function will be executed when cancel button is clicked
        },
      });
      return;
    }
    throw new Error('알 수 없는 수입 검사 성적서 수정 API 예외가 발생했습니다');
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
