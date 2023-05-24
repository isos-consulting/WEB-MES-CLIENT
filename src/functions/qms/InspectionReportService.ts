import {
  getEyeInspectionValueText,
  getInspectResultText,
  getInspSampleResultState,
  getRangeNumberResults,
  getSampleIndex,
  isColumnNameEndWith_insp_value,
  isRangeAllNotNumber,
  SampleRange,
} from './inspection';
import { InspectionDataGridChange } from './InspectionReportViewController';

type InspectionSampleArgs = {
  changes: InspectionDataGridChange[];
  samples: boolean[][];
  ranges: SampleRange[];
};

type InspectionSampleValueArgs = {
  rowKey: number;
  columnName: string;
  range: SampleRange;
  value: boolean;
};

class InspectionReportService {
  private datagrid: any;
  private form: any;

  constructor(grid, form) {
    this.datagrid = grid;
    this.form = form;
  }

  public getInspections() {
    return this.datagrid.getData();
  }

  public setSampleResultFlag({
    changes,
    samples,
    ranges,
  }: InspectionSampleArgs) {
    for (const { rowKey, columnName } of changes) {
      if (isColumnNameEndWith_insp_value(columnName)) {
        const sampleIndex = getSampleIndex(columnName);
        const sampleValue = samples[rowKey][sampleIndex];
        const sampleResultsState = getInspSampleResultState(
          sampleValue,
          sampleIndex,
        );

        for (const [key, value] of sampleResultsState) {
          this.datagrid.setValue(rowKey, key, value);
        }

        this.setSampleValue({
          rowKey,
          columnName,
          range: ranges[rowKey],
          value: sampleValue,
        });
      }
    }
  }

  private setSampleValue({
    rowKey,
    columnName,
    range,
    value,
  }: InspectionSampleValueArgs) {
    const isNumberMinMaxFlags = getRangeNumberResults(range);
    const eyeInsectValueText = getEyeInspectionValueText(value);

    if (isRangeAllNotNumber(isNumberMinMaxFlags) && eyeInsectValueText) {
      this.datagrid.setValue(rowKey, columnName, eyeInsectValueText);
    }
  }

  public setItemResultFlag(items: boolean[]) {
    items.forEach((item, index) => {
      this.datagrid.setValue(index, 'insp_result_fg', item);
      this.datagrid.setValue(
        index,
        'insp_result_state',
        getInspectResultText(item),
      );
    });
  }

  public setReportResultFlag(result: boolean) {
    this.form.setFieldValue('insp_result_fg', result);
    this.form.setFieldValue('insp_result_state', getInspectResultText(result));
  }

  public disableHandlingType(value: boolean) {
    this.form.setFieldDisabled({ insp_handling_type: value });
  }
}

export default InspectionReportService;
