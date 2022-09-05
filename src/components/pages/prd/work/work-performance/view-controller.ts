import TuiGrid from 'tui-grid';
import { message } from 'antd';
import { GridInstanceReference } from '~/components/UI';
import Grid from '@toast-ui/react-grid';

export const showWorkPerformanceErrorMessage = type => {
  switch (type) {
    case '하위이력작업시도':
      return message.warn('작업이력을 선택한 후 다시 시도해주세요.');
    case '공정순서이력작업시도':
      return message.warn('공정순서를 선택한 후 다시 시도해주세요.');
    case '완료된작업시도':
      return message.warn('이미 완료된 작업은 수정할 수 없습니다.');
    default:
      break;
  }
};

const enableWorkPerformanceRegDate = ({
  rowKey,
  prodOrderDataGrid,
}: {
  rowKey: number;
  prodOrderDataGrid: TuiGrid;
}) => {
  const rowData = prodOrderDataGrid.getData()[rowKey];

  prodOrderDataGrid.setRow(rowKey, { ...rowData, complete_fg: false });
  if (rowData.order_date == null)
    prodOrderDataGrid.setValue(rowKey, 'order_date', rowData.reg_date);

  prodOrderDataGrid.enableCell(rowKey, 'reg_date');
};

const disableWorkPerformanceRegDate = ({
  rowKey,
  prodOrderDataGrid,
}: {
  rowKey: number;
  prodOrderDataGrid: TuiGrid;
}) => {
  prodOrderDataGrid.disableCell(rowKey, 'reg_date');
};

export const toggleWorkStartButton = ({
  value,
  rowKey,
  gridRef,
}: {
  value: boolean;
  rowKey: number;
  gridRef: GridInstanceReference<Grid>;
}) => {
  value === true
    ? enableWorkPerformanceRegDate({
        rowKey: rowKey,
        prodOrderDataGrid: gridRef.current.getInstance(),
      })
    : disableWorkPerformanceRegDate({
        rowKey: rowKey,
        prodOrderDataGrid: gridRef.current.getInstance(),
      });
};

export const toggleWorkCompleteButton = ({
  value,
  rowKey,
  gridRef,
}: {
  value: boolean;
  rowKey: number;
  gridRef: GridInstanceReference<Grid>;
}) => {
  const prodOrderDataGrid = gridRef.current.getInstance();
  const rowData = prodOrderDataGrid.getData()[rowKey];

  if (value === true)
    prodOrderDataGrid.setRow(rowKey, { ...rowData, _work_start: false });
};
