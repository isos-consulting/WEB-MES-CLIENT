export default [
  {
    header: '공통',
    name: '_prod_group',
    childNames: [
      'prod_no',
      'prod_no_pre',
      'prod_nm',
      'item_type_nm',
      'prod_type_nm',
      'model_nm',
      'rev',
      'prod_std',
      'unit_nm',
      'lot_fg',
      'use_fg',
      'active_fg',
      'bom_type_cd',
      'bom_type_nm',
    ],
  },
  {
    header: '자재/구매',
    name: '_mat_order_group',
    childNames: ['mat_order_fg', 'mat_order_min_qty', 'mat_supply_days'],
  },
  {
    header: '재고',
    name: '_stock_group',
    childNames: [
      'inv_use_fg',
      'inv_safe_qty',
      'inv_package_qty',
      'inv_to_store_nm',
      'inv_to_location_nm',
    ],
  },
  {
    header: '영업',
    name: '_sal_group',
    childNames: ['sal_order_fg'],
  },
  {
    header: '품질',
    name: '_qms_group',
    childNames: [
      'qms_receive_insp_fg',
      'qms_proc_insp_fg',
      'qms_final_insp_fg',
    ],
  },
  {
    header: '생산',
    name: '_prd_group',
    childNames: [
      'prd_plan_type_cd',
      'prd_plan_type_nm',
      'prd_active_fg',
      'prd_min',
      'prd_max',
    ],
  },
];
