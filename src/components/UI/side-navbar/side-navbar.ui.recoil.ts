import { atom } from 'recoil';

/** 사이드 네비게이션 바 메뉴 recoil atom */
export const atSideNavMenuContent = atom({
  key: 'atSideNavMenuContent',
  default: {},
});

/** 사이드 네비게이션 바 메뉴 recoil atom */
export const atSideNavMenuRawData = atom<any[]>({
  key: 'atSideNavMenuRawData',
  default: null,
});
