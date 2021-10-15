import React from "react";

/* 일분할 화면에서 사용되는 버튼 스타일 (View, Update, Delete 타입을 나누어 적용 ) */
export interface ISingleGridProps {
  singleGridtype?: 'view' | 'update' | 'delete';
}


/* 이분할 화면에서 사용되는 버튼,그리드 스타일 (Update2, Delete2, editSingleGrid, rightButton, leftButton 타입을 나누어 적용 ) */
export interface IDoubleGridProps {
  doubleGridtype?: 'update' | 'delete' | 'editSingleGrid' | 'rightButton' | 'leftButton';
}

export interface IDivGridProps extends ISingleGridProps, IDoubleGridProps {}


export default interface IDivProps {
  id?: string;
  divType: 'singleGridButtonsDiv' | 'doubleGridButtonsDiv';
  optionType: IDivGridProps;
  children?: React.ReactNode;
}