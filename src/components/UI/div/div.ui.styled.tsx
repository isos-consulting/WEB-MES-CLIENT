import React from 'react';
import styled from 'styled-components';
import IDivProps, { ISingleGridProps, IDoubleGridProps } from './div.ui.type';

const BaseDiv: React.FC<IDivProps> = props => {
  const { divType, optionType, ...otherProps } = props;

  return <div {...otherProps} />;
};

// 일분할 화면에서 조회, 수정, 삭제했을 때 버튼 사이 간격과 위치 적용
export const ScSingleGridDiv = styled(BaseDiv)`
  ${({ optionType }) => {
    switch (optionType.singleGridtype as ISingleGridProps) {
      case 'view':
        return `
          width: 100%;

          // 신규, 수정, 삭제 버튼 적용
          div{
            float: right;
          }
          // 조회, 엑셀 버튼 적용
          div+div{
            float: left;
            
          }
        `;

      case 'update':
        return `
          margin-left: auto;
        `;

      case 'delete':
        return `
          margin-left: auto;
        `;
    }
  }}
`;

// 이분할 화면에서 조회, 수정, 삭제했을 때 버튼 사이 간격과 위치 적용, 그리드 스타일 적용
export const ScDoubleGridDiv = styled(BaseDiv)`
  ${({ optionType }) => {
    switch (optionType.doubleGridtype as IDoubleGridProps) {
      case 'update':
        return `
          text-align: end;
        `;

      case 'delete':
        return `
          text-align: end;
        `;

      case 'editSingleGrid':
        return `
          margin: '0 0 0 8px';
        `;

      // 이분할화면에서 왼쪽(엑셀출력, 조회, 신규 데이터 작성) 버튼
      case 'leftButton':
        return `
          position: absolute;
          right: 0;
          top: 0;
          padding-right: 12px;
        `;

      // 이분할화면에서 오른쪽(삭제, 수정, 세부 데이터 작성) 버튼
      case 'rightButton':
        return `
          position: inherit;
          text-align: end;
        `;
    }
  }}
`;
