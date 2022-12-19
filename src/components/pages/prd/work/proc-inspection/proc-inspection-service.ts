import { isNumber } from '~/functions/number';

type ColumnNames = { columnName: string }[];
type InspectionItem = { [key: string]: any };
type InspectionItemEntries = [string, any][];
type SampleRange = { min: string; max: string };
type InspectResults = (boolean | null)[][];

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
    const inspectType =
      isNumber(ranges[index].min) && isNumber(ranges[index].max)
        ? 'number'
        : 'string';
    return items.map(([_key, sample]) => {
      if (sample == null) return null;

      if (typeof sample !== 'string')
        throw new Error('unexpected type of inpsection sample');

      if (sample === '') return null;

      if (inspectType === 'number') {
        const sampleNumber = Number(sample);
        const { min, max } = {
          min: Number(ranges[index].min),
          max: Number(ranges[index].max),
        };

        if (sampleNumber >= min && sampleNumber <= max) return true;

        return false;
      }

      return null;
    });
  });

export const getInspectItems = (inspectResults: InspectResults) =>
  inspectResults.map(item => {
    if (item.every(result => result === null)) return null;
    if (item.some(result => result === false)) return false;
    return true;
  });

export const getInspectResult = (inspectItems: (boolean | null)[]) => {
  if (inspectItems.some(item => item === null)) return null;
  if (inspectItems.some(item => item === false)) return false;
  return true;
};

export const getSampleIndex = (sample: string) => {
  const index = sample.replace('_insp_value', '').slice(1).match(/\d+$/);
  if (index == null) throw new Error('unexpected sample format');
  return Number(index[0]) - 1;
};
