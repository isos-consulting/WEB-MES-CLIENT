import React from 'react';

/** 입력박스 속성 인터페이스 */
export default interface ITextboxProps extends ITextboxStyles {
  /** 입력바스 아이디 */
  id?: string;

  /** 입력박스 name (form안에서 동작할때 key값처럼 사용됨) */
  name?: string;

  autoWidth?: boolean;
  width?: number;

  /** 입력 유형 */
  inputType?: 'text' | 'number' | 'password' | 'id';

  /** 말꼬리 */
  suffix?: string;

  /** 라벨 */
  label?: string;

  /** 숨은 값 */
  hiddenValue?: any;

  /** 보여질 값 */
  value?: any;

  defaultValue?: any;

  /** 빈 값일때 보여질 설명 */
  placeholder?: string;

  /** 읽기전용 여부 */
  readOnly?: boolean;

  /** 중요 여부 */
  important?: boolean;

  /** 비허용(잠금)여부 */
  disabled?: boolean;

  /** 입력박스 아이콘 */
  iconRender?: any;

  hidden?: boolean;

  type?: 'date' | 'time' | 'number';

  autoComplete?: string;

  /** 값 변경 이벤트 */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  /** 키보드 엔터 입력 이벤트 */
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/** 입력박스 스타일 인터페이스 */
export interface ITextboxStyles {
  /** 입력박스 선택기 너비 유형 */
  widthSize?: 'default' | 'auto' | 'flex' | number | string;
}
