import { atomFamily } from 'recoil';

export const afPopupResponseRow = atomFamily<object, string>({
  key: 'afPopupResponseRow',
  default: null,
});
