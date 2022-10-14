import { UserSelectableMenu } from '../../src/components/pages/std/excel-upload/models';
import { useButtonDisableWhenMenuSelectablePolicy } from '../../src/components/pages/std/excel-upload/hooks';

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
