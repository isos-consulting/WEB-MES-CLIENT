import React from 'react';
import Props from './modal.ui.type';
import { ScModal } from './modal.ui.styled';

/** 모달 */
const Modal: React.FC<Props> = props => {
  return (
    <ScModal
      {...props}
      maskClosable={props.maskClosable ? props.maskClosable : false}
    >
      {props.children}
    </ScModal>
  );
};

export default Modal;
