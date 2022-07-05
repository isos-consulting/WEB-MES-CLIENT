import React, { useState } from 'react';
import styled from 'styled-components';

type SubscribeButtonClickFunction = () => void;

interface SubscribeButtonProps {
  checked?: boolean;
  onClick?: SubscribeButtonClickFunction;
}

const StarButton = props => {
  return <span {...props}>★</span>;
};

const StarButtonWrapper = styled(StarButton)`
  & {
    color: ${({ checked }) => (checked ? 'yellow' : 'white')};
    -webkit-text-stroke: 1px black;
    cursor: pointer;
    font-size: 1.5em;
    user-select: none;
    padding: 10px;
  }
`;

const SubscribeButton = (buttonProps: SubscribeButtonProps) => {
  const [checked, toggle] = useState<boolean>(false);

  if (buttonProps.checked !== undefined) {
    if (checked !== buttonProps.checked) {
      toggle(buttonProps.checked);
    }
  }

  const handleClick = () => {
    toggle(!checked);
    buttonProps.onClick?.();
  };

  const subscribeButtonProps: SubscribeButtonProps = {
    checked: checked,
    onClick: handleClick,
  };

  return <StarButtonWrapper {...subscribeButtonProps} />;
};

export default SubscribeButton;
