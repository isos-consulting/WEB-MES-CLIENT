import React, { useState } from 'react';
import styled from 'styled-components';
import { isNil } from '~/helper/common';

const StarButton = (props: SubscribeButtonProps) => {
  return <span {...props}>★</span>;
};

const StarButtonWrapper = styled(StarButton)`
  color: ${({ checked }) => (checked ? '#f7cc07' : 'white')};
  -webkit-text-stroke: 1px black;
  cursor: pointer;
  font-size: 1.5em;
  user-select: none;
  padding: 10px;
`;

interface SubscribeButtonProps {
  checked?: boolean;
  onClick?: (clickEvent: React.MouseEvent<HTMLElement>) => void;
  key: string;
}

const SubscribeButton = (buttonProps: SubscribeButtonProps) => {
  const [checked, toggle] = useState<boolean>(buttonProps.checked ?? false);

  const onClick = () => {
    if (!isNil(buttonProps.onClick)) {
      buttonProps.onClick({
        checked,
        toggle,
      } as unknown as React.MouseEvent<HTMLElement>);
    } else {
      toggle(!checked);
    }
  };

  return <StarButtonWrapper {...{ checked, onClick }} />;
};

export default SubscribeButton;
