import React from 'react';

/** 플렉스 박스 속성 인터페이스 */
export default interface IFlexboxProps {
  /** 클래스명 */
  className?: string;

  /** 박스 고정 너비 */
  width?: string;

  /** 박스 고정 높이 */
  height?: string;

  /** 방향 유형 */
  direction?: 'column' | 'row' | 'row wrap';

  /** 정렬 유형 */
  alignItems?: 'center' | 'flex-start' | 'flex-end';

  /** 자식 정렬 유형 */
  justifyContent?:
    | 'center'
    | 'space-between'
    | 'flex-start'
    | 'flex-end'
    | 'space-around';

  /** 스타일 정적 지정 */
  currentStyles?: React.CSSProperties;

  /** 클릭 이벤트 */
  onClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
