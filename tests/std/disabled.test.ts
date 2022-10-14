import {
  ExcelDataGrid,
  UserSelectableMenu,
} from '../../src/components/pages/std/excel-upload/models';
import {
  useButtonDisableWhenMenuSelectablePolicy,
  useExcelUploadDataGrid,
} from '../../src/components/pages/std/excel-upload/hooks';

jest.mock('../../src/components/pages/std/excel-upload/hooks', () => {
  const originalModule = jest.requireActual(
    '../../src/components/pages/std/excel-upload/hooks',
  );

  return {
    ...originalModule,
    useButtonDisableWhenMenuSelectablePolicy: jest.fn(() => {
      const selectableMenu = new UserSelectableMenu();

      selectableMenu.allocateSelectMenu(item => {
        selectableMenu.item = item;
      });
      return { selectableMenu };
    }),
    useExcelUploadDataGrid: jest.fn(() => {
      const excelDataGrid = new ExcelDataGrid(new Set(), function (
        arr: unknown[],
      ) {
        this.data = new Set(arr);
      });

      return { excelDataGrid };
    }),
  };
});

describe('메뉴를 선택하면 다운로드, 업로드 버튼은 활성화 된다', () => {
  test('메뉴를 선택하지 않으면 메뉴 항목이 null이 된다', () => {
    const { selectableMenu } = useButtonDisableWhenMenuSelectablePolicy();

    selectableMenu.selectMenu(null);

    expect(selectableMenu.isSelected()).toBe(false);
  });

  test('메뉴를 선택하면 메뉴의 항목이 변경된다', () => {
    const { selectableMenu } = useButtonDisableWhenMenuSelectablePolicy();
    selectableMenu.selectMenu({
      menu_uuid: 'uuid',
      menu_nm: '메뉴1',
      menu_file_uuid: 'mfuuid',
      file_extension: 'xlsx',
      file_name: '메뉴1.xlsx',
      file_type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    expect(selectableMenu.isSelected()).toEqual(true);
  });
});

describe('엑셀 데이터 행 존재하면 데이터 검증이 활성화 된다', () => {
  test('엑셀 데이터 행이 없으면 true를 반환한다', () => {
    const { excelDataGrid } = useExcelUploadDataGrid();

    const isEmptyWillTruty = excelDataGrid.isExcelDataEmpty();

    expect(isEmptyWillTruty).toBe(true);
  });

  test('엑셀 데이터 행이 있으면 false를 반환한다', () => {
    const { excelDataGrid } = useExcelUploadDataGrid();

    excelDataGrid.setData([{ foo: 'bar' }]);
    const isNotEmptyWillFalsy = excelDataGrid.isExcelDataEmpty();

    expect(isNotEmptyWillFalsy).toBe(false);
  });

  test('배열 반환 테스트', () => {
    const { excelDataGrid } = useExcelUploadDataGrid();

    excelDataGrid.setData([{ foo: 'bar' }, { zoo: 'keeper' }]);

    const fooBarList = excelDataGrid.asList();

    expect(fooBarList).toEqual([{ foo: 'bar' }, { zoo: 'keeper' }]);
  });
});

describe('엑셀 데이터 검증이 통과하면 저장 버튼이 활성화 된다', () => {
  test('엑셀 데이터 검증이 통과하면 true를 반환한다', () => {
    const { excelDataGrid } = useExcelUploadDataGrid();

    excelDataGrid.setData([
      { foo: 'bar', error: [] },
      { zoo: 'keeper', error: [] },
    ]);

    const validateWillTruty = excelDataGrid.isValidate();

    expect(validateWillTruty).toBe(true);
  });

  test('검증할 데이터가 없는 경우 false를 반환한다', () => {
    const { excelDataGrid } = useExcelUploadDataGrid();

    const emptyStateWillFalsy = excelDataGrid.isValidate();

    expect(emptyStateWillFalsy).toBe(false);
  });

  test('엑셀 데이터 검증을 아직 진행하지 않은 경우 false를 반환한다', () => {
    const { excelDataGrid } = useExcelUploadDataGrid();

    excelDataGrid.setData([{ foo: 'bar' }, { zoo: 'keeper' }]);
    const notYetValidateWillFalsy = excelDataGrid.isValidate();

    expect(notYetValidateWillFalsy).toBe(false);
  });

  test('엑셀 데이터 검증을 실패하면 false를 반환한다', () => {
    const { excelDataGrid } = useExcelUploadDataGrid();

    excelDataGrid.setData([
      { foo: 'bar', error: ['foo는 Boolean 타입입니다'] },
      { zoo: 'keeper', error: [''] },
    ]);

    const inValidateWillFalsy = excelDataGrid.isValidate();

    expect(inValidateWillFalsy).toBe(false);
  });
});

describe('엑셀 업로드 데이터 저장 API 호출 후 UI에 표시되는 데이터는 초기화 된다 ', () => {
  test('데이터 초기화 후 isExcelDataEmpty 함수 실행의 결과는 true를 반환한다', () => {
    const { excelDataGrid } = useExcelUploadDataGrid();

    excelDataGrid.setData([
      { foo: 'bar', error: ['foo는 Boolean 타입입니다'] },
      { zoo: 'keeper', error: [''] },
    ]);

    excelDataGrid.clear();
    const emptyWillTruthy = excelDataGrid.isExcelDataEmpty();

    expect(emptyWillTruthy).toBe(true);
  });
});
