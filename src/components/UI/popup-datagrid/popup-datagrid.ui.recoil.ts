import { atomFamily } from "recoil";


/** 팝업 visible관리 recoil state */
export const afPopupVisible = atomFamily({
  key: 'atPopupVisible',
  default: false
});