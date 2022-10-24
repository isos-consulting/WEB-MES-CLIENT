import React from 'react';
import Colors from '~styles/color.style.module.scss';
import Sizes from '~styles/size.style.module.scss';
import styled from 'styled-components';
import { Card } from 'antd';
import Props, { IContainerStyles } from './container.ui.type';

const BaseCard: React.FC<IContainerStyles & Props> = props => {
  // 커스텀으로 사용될 속성들을 제외한 기본 속성만 button 컴포넌트에 넣어야 합니다.
  const { boxShadow, marginTop, ...otherProps } = props;

  return <Card {...otherProps} />;
};

/* 컨테이너 스타일 */
export const ScContainer = styled(BaseCard)`
  background-color: ${Colors.bg_container_default};
  width: ${props => (props?.width ? props.width + 'px' : '100%')};
  height: ${props => (props?.height ? props.height + 'px' : 'auto')};
  border-radius: ${Sizes.borderRadius_container_default};
  border-color: ${Colors.bg_container_border};
  margin-top: ${props => (props?.marginTop ? props.marginTop + 'px' : '8px')};
  box-shadow: ${props =>
    props.boxShadow === false
      ? 'none'
      : 'rgb(17 17 26 / 10%) 0px 4px 16px, rgb(17 17 26 / 5%) 0px 8px 32px'};

  &.size-auto {
    & .ag-center-cols-container {
      width: ${Sizes.width_container_md};
    }
  }
`;
