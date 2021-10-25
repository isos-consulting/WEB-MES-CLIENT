/** 사이드바 속성 인터페이스 */
export default interface ISideBarProps {
  /** 위쪽 여백 */
  top: number;

  /** 너비 */
  width: number;
}


/** 2레벨 메뉴 속성 인터페이스 */
export interface ILevel2Props {
  /** 활성 여부 */
  active: boolean;
}


/** 메뉴 구성용 인터페이스 */
export interface IMenuInfo extends ILevel1Info {}



/** 1레벨 메뉴 인터페이스 */
export interface ILevel1Info {
  /** 레벨(단계) */
  lv: number;

  /** 메뉴 uuid */
  menu_uuid: string;

  /** 메뉴 유형 */
  menu_type: string;

  /** route경로 */
  menu_uri: string;

  /** 화면명 & 메뉴명 */
  menu_nm: string;

  /** 호출될 컴포넌트 명칭 */
  component_nm: string;

  /** 대표 아이콘 */
  icon?: string;

  /** 데이터 생성 권한 */
  create_fg?: boolean;

  /** 읽기(조회) 권한 */
  read_fg?: boolean;

  /** 데이터 수정 권한 */
  update_fg?: boolean;

  /** 데이터 삭제 권한 */
  delete_fg?: boolean;
  
  /** 하위 메뉴 배열 */
  sub_menu?: IMenuInfo[];
}


/** 2레벨 메뉴 인터페이스 */
export interface ILevel2Info {
  /** 레벨(단계) */
  lv: number;

  /** 메뉴 uuid */
  menu_uuid: string;

  /** 메뉴 유형 */
  menu_type: string;

  /** route경로 */
  menu_uri: string;

  /** 화면명 & 메뉴명 */
  menu_nm: string;

  /** 호출될 컴포넌트 명칭 */
  component_nm: string;

  /** 대표 아이콘 */
  icon: string;

  /** 데이터 생성 권한 */
  create_fg: boolean;

  /** 읽기(조회) 권한 */
  read_fg: boolean;

  /** 데이터 수정 권한 */
  update_fg: boolean;

  /** 데이터 삭제 권한 */
  delete_fg: boolean;
  
  /** 하위 메뉴 배열 */
  sub_menu?: IMenuInfo[];
}


/** 3레벨 메뉴 인터페이스 */
export interface ILevel3Info {
  /** 레벨(단계) */
  lv: number;

  /** 메뉴 uuid */
  menu_uuid: string;
  
  /** 메뉴 유형 */
  menu_type: string;

  /** route경로 */
  menu_uri: string;

  /** 화면명 & 메뉴명 */
  menu_nm: string;

  /** 호출될 컴포넌트 명칭 */
  component_nm: string;

  /** 대표 아이콘 */
  icon: string;

  /** 데이터 생성 권한 */
  create_fg: boolean;

  /** 읽기(조회) 권한 */
  read_fg: boolean;

  /** 데이터 수정 권한 */
  update_fg: boolean;

  /** 데이터 삭제 권한 */
  delete_fg: boolean;
}

export interface TPermission {
  /** 데이터 생성 권한 */
  create_fg: boolean;
  /** 읽기 권한 */
  read_fg: boolean;
  /** 수정 권한 */
  update_fg: boolean;
  /** 삭제 권한 */
  delete_fg: boolean;
}

// /** 1레벨 메뉴 인터페이스 */
// export interface ILevel1Info {
//   /** 레벨(단계) */
//   level: 1;

//   /** 메뉴 유형 */
//   type: 'page' | 'menu';

//   /** 호출될 컴포넌트 명칭 */
//   componentName: string;

//   /** 변경될 route경로 */
//   routePath: string;

//   /** 화면명 */
//   pageName: string;

//   /** 대표 아이콘 */
//   icon: string;

//   /** 하위 메뉴 배열 */
//   subMenu?: ILevel2Info[];
// }


// /** 2레벨 메뉴 인터페이스 */
// export interface ILevel2Info {
//   /** 레벨(단계) */
//   level: 2;
  
//   /** 메뉴 유형 */
//   type: 'page' | 'menu';
  
//   /** 호출될 컴포넌트 명칭 */
//   componentName: string;

//   /** 변경될 route경로 */
//   routePath: string;

//   /** 화면명 */
//   pageName: string;

//   /** 대표 아이콘 */
//   icon: string;

//   /** 하위 메뉴 배열 */
//   subMenu?: ILevel3Info[];
// }


// /** 3레벨 메뉴 인터페이스 */
// export interface ILevel3Info {
//   /** 레벨(단계) */
//   level: 3;

//   /** 메뉴 유형 */
//   type: 'page';

//   /** 호출될 컴포넌트 명칭 */
//   componentName: string;

//   /** 변경될 route경로 */
//   routePath: string;

//   /** 화면명 */
//   pageName: string;

//   /** 대표 아이콘 */
//   icon: string;
// }