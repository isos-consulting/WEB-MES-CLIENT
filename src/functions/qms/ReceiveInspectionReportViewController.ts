import {
  extract_insp_ItemEntriesAtCounts,
  getInspectItems,
  getInspectResult,
  getInspectSamples,
} from './inspection';
import InspectionReportService from './InspectionReportService';
import InspectionReportViewController, {
  InsepctionDataGridOnChange,
  InspectionDataGrid,
  InspectionInputForm,
} from './InspectionReportViewController';

class ReceiveInspectionReportViewController extends InspectionReportViewController {
  constructor() {
    super();
  }

  public dataGridChange(
    changes: InsepctionDataGridOnChange[],
    datagrid: InspectionDataGrid,
    inputform: InspectionInputForm,
  ) {
    super.dataGridChange(changes, datagrid, inputform);

    const result = this.getReportResult(datagrid, inputform);
    const service = new InspectionReportService(datagrid, inputform);

    if (result === null || result === true) {
      service.disableHandlingType(true);
    } else {
      service.disableHandlingType(false);
    }
  }

  public getReportResult(datagrid, inputform) {
    const service = new InspectionReportService(datagrid, inputform);

    const inspections = service.getInspections();

    const ranges = inspections.map((item: any) => ({
      min: item.spec_min,
      max: item.spec_max,
    }));

    const extractedInspections = extract_insp_ItemEntriesAtCounts(inspections);
    const samples = getInspectSamples(extractedInspections, ranges);
    const items = getInspectItems(samples);

    return getInspectResult(items);
  }
}

export default ReceiveInspectionReportViewController;
