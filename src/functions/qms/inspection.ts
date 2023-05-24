import dayjs from 'dayjs';
import { IGridColumn } from '~/components/UI';
import { ColumnStore } from '~/constants/columns';
import { isEmpty, isNil, isNull, isString } from '~/helper/common';
import { isNumber } from '../number';

type ColumnNames = { columnName: string }[];
type InspectionItem = { [key: string]: any };
type InspectionItemEntries = [string, any][];
export type SampleRange = { min: string; max: string };
type InspectionResult = boolean | null;
type InspectResults = InspectionResult[][];
type InspectResultText = '합격' | '불합격';

export const isColumnNamesNotEndWith_insp_value = (columnNames: ColumnNames) =>
  columnNames.some(({ columnName }) => !columnName.endsWith('_insp_value'));

export const isColumnNameEndWith_insp_value = (columnName: string) =>
  columnName.endsWith('_insp_value');

export const extract_insp_ItemEntriesAtCounts = (
  inspectionItems: InspectionItem[],
): InspectionItemEntries[] =>
  inspectionItems.map(inspectionItem =>
    Object.entries(inspectionItem)
      .filter(([key, _value]) => key.includes('_insp_value'))
      .slice(0, inspectionItem.sample_cnt),
  );

export const getInspectSamples = (
  inspections: InspectionItemEntries[][],
  ranges: SampleRange[],
) =>
  inspections.map((items, index) => {
    const isNumberMinMaxFlags = getRangeNumberResults(ranges[index]);
    const inspectType = getInspectTool(isNumberMinMaxFlags);
    return items.map(([_key, sample]) => {
      if (isNil(sample)) return null;

      if (typeof sample !== 'string' && typeof sample !== 'number')
        throw new Error('unexpected type of inspection sample');

      if (isString(sample) && isEmpty(sample)) return null;

      if (inspectType === 'string') return `${sample}`.toUpperCase() === 'OK';

      const { value, min, max } = {
        value: Number(sample),
        min: Number(ranges[index].min),
        max: Number(ranges[index].max),
      };

      if (isRangeAllNumber(isNumberMinMaxFlags))
        return isInnerRange({ value, min, max });

      if (isMinOnlyNumber(isNumberMinMaxFlags))
        return isOverMin({ value, min });

      if (isMaxOnlyNumber(isNumberMinMaxFlags))
        return isUnderMax({ value, max });

      return false;
    });
  });

export const getInspectItems = (inspectResults: InspectResults) =>
  inspectResults.map(item => {
    if (item.every(result => isNull(result))) return null;
    if (item.some(result => result === false)) return false;
    return true;
  });

export const getInspectResult = (inspectItems: InspectionResult[]) => {
  if (inspectItems.some(item => isNull(item))) return null;
  if (inspectItems.some(item => item === false)) return false;
  return true;
};

export const getSampleIndex = (sample: string) => {
  const index = sample.replace('_insp_value', '').slice(1).match(/\d+$/);
  if (isNil(index)) throw new Error('unexpected sample format');
  return Number(index[0]) - 1;
};

export const getInspectResultText = (
  result: InspectionResult,
): InspectResultText => {
  if (isNull(result)) return null;
  if (result === false) return '불합격';
  return '합격';
};

export const getInspectTool = (minMaxFlags: boolean[]) => {
  if (isMinOrMaxNumber(minMaxFlags)) return 'number';
  return 'string';
};

export const getRangeNumberResults = ({ min, max }: SampleRange) => [
  isNumber(min),
  isNumber(max),
];

export const isRangeAllNumber = (minMaxFlags: boolean[]) =>
  minMaxFlags.every(flag => flag === true);

export const isMinOrMaxNumber = (minMaxFlags: boolean[]) =>
  minMaxFlags.some(flag => flag === true);

export const isInnerRange = ({
  value,
  min,
  max,
}: {
  value: number;
  min: number;
  max: number;
}) => value >= min && value <= max;

export const isMinOnlyNumber = (minMaxFlags: boolean[]) =>
  minMaxFlags[0] === true && minMaxFlags[1] === false;

export const isOverMin = ({ value, min }: { value: number; min: number }) =>
  value >= min;

export const isMaxOnlyNumber = (minMaxFlags: boolean[]) =>
  minMaxFlags[0] === false && minMaxFlags[1] === true;

export const isUnderMax = ({ value, max }: { value: number; max: number }) =>
  value <= max;

export const isRangeAllNotNumber = (minMaxFlags: boolean[]) =>
  minMaxFlags.every(flag => flag === false);

export const getEyeInspectionValueText = (result: boolean) => {
  if (result === true) return 'OK';
  if (result === false) return 'NG';
  return null;
};

export const getDateFormat = (date: string) => {
  if (dayjs(date).isValid()) {
    return dayjs(date).format('YYYY-MM-DD');
  }

  return date;
};

export const getTimeFormat = (timeIncludedDate: string) => {
  if (dayjs(timeIncludedDate).isValid()) {
    return dayjs(timeIncludedDate).format('HH:mm:ss');
  }

  return timeIncludedDate;
};

export const getDateTimeFormat = (dateTime: string) => {
  if (dayjs(dateTime).isValid()) {
    return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
  }

  return dateTime;
};

export const getMissingValueInspectResult = (result: InspectionResult[]) => {
  if (isNil(result[0])) return true;

  for (let index = 1; index < result.length; index++) {
    if (isNil(result[index - 1]) && !isNil(result[index])) return true;
  }

  return false;
};

export const getSampleOkOrNgOrDefaultSampleValue = (sample: string) => {
  if (sample === 'OK') return 1;
  if (sample === 'NG') return 0;
  return sample;
};

const createInspectionSamples = sampleCount => {
  const samples: IGridColumn[] = [];

  for (let sampleIndex = 1; sampleIndex <= sampleCount; sampleIndex++) {
    const sampleColumns = ColumnStore.INSP_CHECK_CELL.map(
      ({ header, name, ...restedSample }) => {
        return createSample({ header, name, ...restedSample }, sampleIndex);
      },
    );

    samples.push(...sampleColumns);
  }

  return samples;
};

const createSample = (
  { header, name, ...restedSample },
  sampleIndex,
): IGridColumn => ({
  ...restedSample,
  header: `x${sampleIndex}${header}`,
  name: `x${sampleIndex}${name}`,
});

export const createInspectionReportColumns = (
  columns: IGridColumn[],
  max: number,
) => {
  const samples = createInspectionSamples(max);

  return [...columns, ...samples, ...ColumnStore.INSP_ITEM_RESULT];
};

export const getInspSampleResultState = (value: boolean, index: number) => {
  return [
    [`x${index + 1}_insp_result_fg`, value],
    [`x${index + 1}_insp_result_state`, getInspectResultText(value)],
  ];
};

export const getInspectionHandlingTypeCode = (value: boolean) => {
  if (value === true) {
    return 'INCOME';
  }

  if (value === false) {
    return 'RETURN';
  }

  return '';
};
