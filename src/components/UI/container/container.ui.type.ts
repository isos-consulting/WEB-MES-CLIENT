import React from 'react';

/** 컨테이너 속성 인터페이스 */
export default interface IContainerProps extends IContainerStyles {
  id?: string;

  /** 컨테이너 제목 */
  title?: string;

  /** 컨테이너 내용 */
  children?: any;

  style?: React.CSSProperties;

  className?: string;
}

/** 컨테이너 스타일 인터페이스 */
export interface IContainerStyles {
  /** 컨테이너 너비 */
  width?: string | number;

  /** 컨테이너 높이 */
  height?: string | number;

  /** 컨테이너 그림자 유무 */
  boxShadow?: boolean;

  marginTop?: number;
}
