import {
  extract_insp_ItemEntriesAtCounts,
  getInspectItems,
  getInspectResult,
  getInspectSamples,
  isColumnNamesNotEndWith_insp_value,
} from './inspection';
import InspectionReportService from './InspectionReportService';

export type InsepctionDataGridChange = {
  columnName: string;
  rowKey: number;
  value: any;
};
export type InspectionDataGrid = any;
export type InspectionInputForm = any;

class InspectionReportViewController {
  constructor() {}

  public dataGridChange(
    changes: InsepctionDataGridChange[],
    datagrid: InspectionDataGrid,
    inputform: InspectionInputForm,
  ) {
    if (isColumnNamesNotEndWith_insp_value(changes)) return;

    const service = new InspectionReportService(datagrid, inputform);
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
}

export default InspectionReportViewController;
