import React from 'react';
import styled from 'styled-components';
import { COLOROURS } from '~/styles/palette';
import { Button } from '~/components/UI';
import { isNil } from '~/helper/common';

interface FlexBoxProps {
  justifyContent: string;
  gap: string;
  children: React.ReactNode;
}

const ButtonWrapper = styled(Button)`
  ${({ primary, colorType }) => {
    const buttonColor = isNil(colorType) ? COLOROURS.PRIMARY[900] : colorType;
    if (!isNil(primary)) {
      return `
        background-color: ${buttonColor};
            `;
    }
  }}
`;

const FlexBoxWrapper = styled.div`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent};
  gap: ${({ gap }) => gap};
`;

const FlexBox: React.FC<FlexBoxProps> = ({
  children,
  ...flexBoxProps
}: FlexBoxProps) => {
  return <FlexBoxWrapper {...flexBoxProps}>{children}</FlexBoxWrapper>;
};

const Header: React.FC & { FlexBox: typeof FlexBox } = props => {
  return <header>{props.children}</header>;
};

Header.FlexBox = FlexBox;

export default Header;
export { FlexBox, ButtonWrapper as Button };
