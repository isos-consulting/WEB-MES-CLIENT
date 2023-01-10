import { IInputGroupboxItem } from '~/components/UI/input-groupbox';

export default <IInputGroupboxItem[]>[
  { id: 'order_no', label: '지시번호', type: 'text', disabled: true },
  { id: 'reg_date', label: '지시일', type: 'date', disabled: true },
  { id: 'prod_no', label: '품번', type: 'text', disabled: true },
  { id: 'prod_nm', label: '품명', type: 'text', disabled: true },
  { id: 'rev', label: '리비전', type: 'text', disabled: true },
  { id: 'prod_std', label: '규격', type: 'text', disabled: true },
  { id: 'qty', label: '입하수량', type: 'number', disabled: true },
];
