import dayjs from 'dayjs';
import { isNumber } from '~/functions/number';

type ColumnNames = { columnName: string }[];
type InspectionItem = { [key: string]: any };
type InspectionItemEntries = [string, any][];
type SampleRange = { min: string; max: string };
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
      if (sample == null) return null;

      if (typeof sample !== 'string')
        throw new Error('unexpected type of inpsection sample');

      if (sample === '') return null;

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
    if (item.every(result => result === null)) return null;
    if (item.some(result => result === false)) return false;
    return true;
  });

export const getInspectResult = (inspectItems: InspectionResult[]) => {
  if (inspectItems.some(item => item === null)) return null;
  if (inspectItems.some(item => item === false)) return false;
  return true;
};

export const getSampleIndex = (sample: string) => {
  const index = sample.replace('_insp_value', '').slice(1).match(/\d+$/);
  if (index == null) throw new Error('unexpected sample format');
  return Number(index[0]) - 1;
};

export const getInspectResultText = (
  result: InspectionResult,
): InspectResultText => {
  if (result === null) return null;
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

export const getTimeFormat = (tiemIncludedDate: string) => {
  if (dayjs(tiemIncludedDate).isValid()) {
    return dayjs(tiemIncludedDate).format('HH:mm:ss');
  }

  return tiemIncludedDate;
};

export const getDateTimeFormat = (dateTime: string) => {
  if (dayjs(dateTime).isValid()) {
    return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss');
  }

  return dateTime;
};

export const getMissingValueInspectResult = (result: InspectionResult[]) => {
  if (result[0] == null) return true;

  for (let index = 1; index < result.length; index++) {
    if (result[index - 1] == null && result[index] != null) return true;
  }

  return false;
};