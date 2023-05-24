import { message } from 'antd';
import { SENTENCE } from '~/constants/lang/ko';
import { isEmpty, isNull } from '~/helper/common';
import {
  extract_insp_ItemEntriesAtCounts,
  getInspectItems,
  getInspectResult,
  getInspectSamples,
  getMissingValueInspectResult,
  isColumnNamesNotEndWith_insp_value,
} from './inspection';
import InspectionReportService from './InspectionReportService';

export type InspectionDataGridChange = {
  columnName: string;
  rowKey: number;
  value: any;
};
export type InspectionDataGrid = any;
export type InspectionInputForm = any;
export type InspectionValidationResult = {
  isValid: boolean;
  invalidMessage: string;
};

class InspectionReportViewController {
  constructor() {
    // This is intentional
  }

  public dataGridChange(
    changes: InspectionDataGridChange[],
    datagrid: InspectionDataGrid,
    inputForm: InspectionInputForm,
  ) {
    if (isColumnNamesNotEndWith_insp_value(changes)) return;

    const service = new InspectionReportService(datagrid, inputForm);
    const inspections = service.getInspections();

    const ranges = inspections.map((item: any) => ({
      min: item.spec_min,
      max: item.spec_max,
    }));

    const extractedInspections = extract_insp_ItemEntriesAtCounts(inspections);
    const samples = getInspectSamples(extractedInspections, ranges);
    const items = getInspectItems(samples);
    const result = getInspectResult(items);

    service.setSampleResultFlag({
      changes,
      samples,
      ranges,
    });
    service.setItemResultFlag(items);
    service.setReportResultFlag(result);
  }

  public validate(fields, inspections, validateOption) {
    if (isEmpty(fields.emp_uuid)) {
      message.warn(SENTENCE.INPUT_INSPECTOR);
      throw new Error(SENTENCE.INPUT_INSPECTOR);
    }

    if (isEmpty(fields.reg_date_time)) {
      message.warn(SENTENCE.INPUT_INSPECT_TIME);
      throw new Error(SENTENCE.INPUT_INSPECT_TIME);
    }

    if (!fields.hasOwnProperty('reg_date')) {
      return;
    }

    if (isEmpty(fields.reg_date)) {
      message.warn(SENTENCE.INPUT_INSPECT_DATE);
      throw new Error(SENTENCE.INPUT_INSPECT_DATE);
    }

    const ranges = inspections.map(item => ({
      min: String(item.spec_min),
      max: String(item.spec_max),
    }));

    const extractedInspections = extract_insp_ItemEntriesAtCounts(inspections);
    const samples = getInspectSamples(extractedInspections, ranges);

    const isMissingValue = samples.some(getMissingValueInspectResult);

    if (isMissingValue) {
      message.warn(SENTENCE.EXIST_INSPECT_MISSING_VALUE);
      return;
    }

    const isFilledAllInspectionSample = samples.every(sampleResults =>
      sampleResults.every(result => !isNull(result)),
    );

    if (isFilledAllInspectionSample) {
      return;
    }

    if (validateOption.length === 0) {
      throw new Error(
        SENTENCE.CANNOT_FOUND_INSP_REPORT_RESULT_VALUE_TO_SAVE_OPTION,
      );
    }

    if (validateOption[0].value === 1) {
      message.warn(SENTENCE.INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT);
      throw new Error(
        SENTENCE.INPUT_INSPECT_RESULT_VALUE_AS_MUCH_AS_SAMPLE_COUNT,
      );
    }
  }
}

export default InspectionReportViewController;
