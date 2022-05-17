import { atomFamily } from 'recoil';

export const afPopupReponseRow = atomFamily<object, string>({
  key: 'afPopupReponseRow',
  default: null,
});
