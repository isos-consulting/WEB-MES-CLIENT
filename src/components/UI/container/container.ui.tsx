import React from 'react';
import Props from './container.ui.type';
import { ScContainer } from './container.ui.styled';

/** 컨테이너 (컴포넌트 박스) */
const Container: React.FC<Props> = props => {
  const className = 'container ' + (props.className ?? '');
  return (
    <ScContainer
      {...props}
      className={props?.title ? 'title ' + className : className}
    />
  );
};

export default Container;
