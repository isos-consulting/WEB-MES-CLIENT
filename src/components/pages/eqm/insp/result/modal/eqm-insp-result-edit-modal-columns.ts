import { IGridColumn } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';
import { getInspCheckResultValue, isNumber } from '~/functions';

export default [
  {
    header: '설비검사 성적서UUID',
    name: 'insp_result_uuid',
    alias: 'uuid',
    width: ENUM_WIDTH.L,
    hidden: true,
    noSave: false,
    editable: true,
  },
  {
    header: '설비검사 기준서 번호',
    name: 'insp_no',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '설비검사 기준서 상세UUID',
    name: 'insp_detail_uuid',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '상세기준서번호',
    name: 'insp_no_sub',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '검사항목 유형UUID',
    name: 'insp_item_type_uuid',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '검사항목 유형코드',
    name: 'insp_item_type_cd',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '검사항목 유형',
    name: 'insp_item_type_nm',
    width: ENUM_WIDTH.M,
    filter: 'text',
    noSave: true,
  },
  {
    header: '검사항목 상세내용',
    name: 'insp_item_desc',
    width: ENUM_WIDTH.XL,
    filter: 'text',
    noSave: true,
  },
  {
    header: '검사 기준',
    name: 'spec_std',
    width: ENUM_WIDTH.L,
    filter: 'text',
    noSave: true,
  },
  {
    header: '최소 값',
    name: 'spec_min',
    width: ENUM_WIDTH.M,
    filter: 'text',
    noSave: true,
  },
  {
    header: '최대 값',
    name: 'spec_max',
    width: ENUM_WIDTH.M,
    filter: 'text',
    noSave: true,
  },
  {
    header: '검사구UUID',
    name: 'insp_tool_uuid',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '검사구코드',
    name: 'insp_tool_cd',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '검사구',
    name: 'insp_tool_nm',
    width: ENUM_WIDTH.M,
    filter: 'text',
    noSave: true,
  },
  {
    header: '검사방법UUID',
    name: 'insp_method_uuid',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '검사방법코드',
    name: 'insp_method_cd',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '검사방법',
    name: 'insp_method_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
    noSave: true,
  },
  {
    header: '일상점검주기UUID',
    name: 'daily_insp_cycle_uuid',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '일상점검주기코드',
    name: 'daily_insp_cycle_cd',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '일상점검주기',
    name: 'daily_insp_cycle_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
    noSave: true,
  },
  {
    header: '주기단위UUID',
    name: 'cycle_unit_uuid',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '주기단위코드',
    name: 'cycle_unit_cd',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '주기단위',
    name: 'cycle_unit_nm',
    width: ENUM_WIDTH.M,
    filter: 'text',
    noSave: true,
  },
  {
    header: '주기 기준일',
    name: 'base_date',
    width: ENUM_WIDTH.L,
    filter: 'text',
    noSave: true,
  },
  {
    header: '점검주기',
    name: 'cycle',
    width: ENUM_WIDTH.M,
    filter: 'text',
    noSave: true,
  },
  {
    header: '설비유형UUID',
    name: 'equip_type_uuid',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '설비유형코드',
    name: 'equip_type_cd',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '설비유형',
    name: 'equip_type_nm',
    width: ENUM_WIDTH.L,
    filter: 'text',
    noSave: true,
    hidden: false,
  },
  {
    header: '설비UUID',
    name: 'equip_uuid',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '설비코드',
    name: 'equip_cd',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '설비',
    name: 'equip_nm',
    width: ENUM_WIDTH.XL,
    filter: 'text',
    noSave: true,
    hidden: false,
  },
  {
    header: '검사자UUID',
    name: 'emp_uuid',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: false,
    editable: true,
  },
  {
    header: '검사자코드',
    name: 'emp_cd',
    width: ENUM_WIDTH.M,
    hidden: true,
    noSave: true,
  },
  {
    header: '검사자',
    name: 'emp_nm',
    width: ENUM_WIDTH.M,
    format: 'popup',
    filter: 'text',
    noSave: false,
    editable: true,
    requiredField: true,
  },
  {
    header: '등록일시',
    name: 'reg_date',
    width: ENUM_WIDTH.L,
    format: 'date',
    filter: 'text',
    noSave: false,
    editable: false,
    requiredField: true,
  },
  {
    header: '검사 값',
    name: 'insp_ui_value',
    width: ENUM_WIDTH.M,
    filter: 'text',
    noSave: false,
    editable: true,
    requiredField: true,
    formula: {
      targetColumnNames: ['spec_min', 'spec_max'],
      resultColumnName: 'insp_value',
      formula: params => {
        const { value, targetValues } = params;

        const specMin = targetValues['spec_min'];
        const specMax = targetValues['spec_max'];

        if (!isNumber(specMin) && !isNumber(specMax)) {
          if (value === '') {
            return value;
          }
          if (value?.toLowerCase() === 'ok') {
            return 1;
          }
          return 0;
        }

        return value;
      },
    },
  },
  {
    header: '실제 검사 값(UI에 보이지 않음)',
    name: 'insp_value',
    width: ENUM_WIDTH.M,
    filter: 'text',
    noSave: false,
    editable: true,
    requiredField: true,
    hidden: true,
    formula: {
      targetColumnNames: ['spec_min', 'spec_max'],
      resultColumnName: 'insp_result_fg',
      formula: params => {
        const { value, targetValues } = params;

        const specMin = targetValues['spec_min'];
        const specMax = targetValues['spec_max'];
        const isNotNumber = !isNumber(specMin) && !isNumber(specMax);

        if (isNotNumber) {
          const inspValue = value === 1 ? 'OK' : value === 0 ? 'NG' : value;
          const [nullFg, resultFg] = getInspCheckResultValue(inspValue, {
            specMin,
            specMax,
          });

          const cellFlagResultValue = nullFg ? null : resultFg;

          return cellFlagResultValue;
        } else {
          const [nullFg, resultFg] = getInspCheckResultValue(value, {
            specMin,
            specMax,
          });

          const cellFlagResultValue = nullFg ? null : resultFg;

          return cellFlagResultValue;
        }
      },
    },
  },
  {
    header: '합격여부',
    name: 'insp_result_fg',
    width: ENUM_WIDTH.M,
    format: 'tag',
    options: {
      conditions: [
        {
          value: false,
          text: '불합격',
          color: 'red',
        },
        {
          value: true,
          text: '합격',
          color: 'blue',
        },
      ],
    },
    filter: 'text',
    noSave: false,
    editable: false,
    requiredField: true,
  },
  {
    header: '비고',
    name: 'remark',
    width: ENUM_WIDTH.M,
    filter: 'text',
    noSave: false,
    editable: true,
  },
] as IGridColumn[];
