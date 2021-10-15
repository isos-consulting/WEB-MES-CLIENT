import { atom, RecoilState } from "recoil";


/** 메뉴 구성 인터페이스 */
interface IMenuState {
  selectedLevel1?: string;
  selectedLevel2?: string[];
}


/** 레이아웃 상태 값 속성 인터페이스 */
interface ILayoutState {
  topSpacing: number;
  leftSpacing: number;
  bottomSpacing: number;
  contentSpacing: number;
  showResizeBtn: boolean;
}


/** 메뉴 상태 관리 클래스 */
export class ClsMenuStore {
  state: RecoilState<IMenuState>;
  constructor() {
    this.state = atom<IMenuState>({
      key: "menu_store",
      default: {
        // selectedLevel1: 1,
        // selectedLevel2: 2,
      },
    });
  }
}


/** 레이아웃 상태 관리 클래스 */
export class ClsLayoutStore {
  state: RecoilState<ILayoutState>;
  menu: ClsMenuStore;
  constructor() {
    this.menu = new ClsMenuStore();
    this.state = atom<ILayoutState>({
      key: "layout_store",
      default: {
        topSpacing: 45,  // 수정 전 : 58
        leftSpacing: 70, //사이드바 너비 (default:60, expanded:270)
        bottomSpacing: 100,
        contentSpacing: 16, //Body padding 수정 전 : 18
        //contentSpacing: 25,
        showResizeBtn: false //사이드바 2레벨 메뉴 접기/펴기 버튼 활성화 여부
      },
    });
  }
}

export const layoutStore = new ClsLayoutStore();
