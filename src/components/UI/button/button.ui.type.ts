import React from 'react';

/** 버튼 속성 인터페이스 */
export default interface IButtonProps extends IButtonStyles {
  /** 버튼 글자 */
  text?: string | any;

  /** 내용 */
  children?: any;

  /** 비허용(잠금) */
  disabled?: boolean;

  /** 버튼 숨김 */
  hidden?: boolean;

  type?: string;

  /** 버튼 클릭 이벤트 */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

/** 버튼 스타일 인터페이스 */
export interface IButtonStyles {
  /** 버튼 모양 유형 */
  btnType?: 'buttonFill' | 'buttonHover' | 'image';

  /** 버튼 너비 유형 */
  widthSize?: 'small' | 'medium' | 'large' | 'xlarge' | 'auto' | 'flex';

  /** 버튼 높이 유형 */
  heightSize?: 'small' | 'medium';

  /** 버튼 색상 유형 */
  colorType?: 'basic' | 'delete' | 'add' | 'cancel' | 'excel' | 'save' | 'blue';

  /** 버튼 폰트 사이즈 유형 */
  fontSize?: 'small' | 'medium' | 'large';

  /** 이미지 모양 유형 */
  ImageType?:
    | 'add'
    | 'cancel'
    | 'delete'
    | 'edit'
    | 'ok'
    | 'plus'
    | 'print'
    | 'search'
    | 'popup';

  hoverAnimation?: boolean;
  shape?: 'circle' | 'round';
  icon?: React.ReactNode;
}
