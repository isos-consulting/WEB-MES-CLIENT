import { injectClassNameAttributesInColumn } from '../../src/functions/tui-grid/class-name';
import { ColumnStore } from '../../src/constants/columns';

test('class-names 단위 테스트', () => {
  const classNamesInAttributes = injectClassNameAttributesInColumn(
    ColumnStore.NAJS_PROD_ORDER,
    'create',
  );

  expect(classNamesInAttributes).toEqual({
    column: {
      order_uuid: ['create'],
      order_state: ['create'],
      priority: ['create', 'editor'],
      reg_date: ['create', 'editor'],
      order_no: ['create', 'editor'],
      workings_uuid: ['create'],
      workings_nm: ['create', 'editor', 'popup'],
      proc_uuid: ['create'],
      proc_no: ['create'],
      proc_nm: ['create'],
      prod_uuid: ['create'],
      prod_no: ['create'],
      prod_nm: ['create'],
      prod_type_uuid: ['create'],
      prod_type_nm: ['create'],
      item_type_uuid: ['create'],
      item_type_nm: ['create'],
      model_uuid: ['create'],
      monthly_balance: ['create'],
      model_nm: ['create'],
      rev: ['create'],
      prod_std: ['create'],
      unit_uuid: ['create'],
      unit_nm: ['create'],
      plan_qty: ['create'],
      qty: ['create', 'editor'],
      seq: ['create', 'editor'],
      shift_uuid: ['create'],
      shift_nm: ['create', 'editor'],
      worker_group_uuid: ['create'],
      worker_group_nm: ['create', 'editor'],
      worker_nm: ['create', 'editor'],
      equip_uuid: ['create'],
      equip_nm: ['create', 'editor', 'popup'],
      sal_order_detail_uuid: ['create'],
      remark: ['create', 'editor'],
      complete_fg: ['create'],
    },
  });
});
