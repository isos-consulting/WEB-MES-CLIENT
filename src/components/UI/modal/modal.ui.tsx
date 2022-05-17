import React, { useMemo } from 'react';
import Props from './modal.ui.type';
import { ScModal } from './modal.ui.styled';

/** 모달 */
const Modal: React.FC<Props> = props => {
  const modelWidthSize = useMemo(() => {
    return props.width === 'sm'
      ? '50%'
      : props.width === 'md'
      ? '70%'
      : props.width === 'lg'
      ? '90%'
      : props.width;
  }, [props.width]);

  return (
    <ScModal
      width={modelWidthSize}
      {...props}
      maskClosable={props.maskClosable ? props.maskClosable : false}
    >
      {props.children}
    </ScModal>
  );
};

export default Modal;
