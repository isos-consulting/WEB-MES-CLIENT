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

describe('엑셀 업로드 메뉴 선택 테스트', () => {
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

describe('엑셀 데이터 행 없는 경우 데이터 검증과 저장 버튼은 비활성화 된다', () => {
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
