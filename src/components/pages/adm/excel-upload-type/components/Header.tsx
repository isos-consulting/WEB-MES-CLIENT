import React from 'react';
import styled from 'styled-components';
import { COLOROURS } from '~/styles/palette';
import { Button } from '~/components/UI';

interface FlexBoxProps {
  justifyContent: string;
  children: React.ReactNode;
}

interface ColumnProps {
  children: React.ReactNode;
}

const ButtonWrapper = styled(Button)`
  ${({ primary, colorType }) => {
    const buttonColor = colorType == null ? COLOROURS.PRIMARY[900] : colorType;
    if (primary != null) {
      return `
        background-color: ${buttonColor};
            `;
    }
  }}
`;

const Column: React.FC<ColumnProps> = ({ children }): ColumnProps => {
  return <div>{children}</div>;
};

const FlexBoxWrapper = styled.div`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent};
`;

const FlexBox: React.FC<FlexBoxProps> & { Col: typeof Column } = ({
  justifyContent,
  children,
}) => {
  return (
    <FlexBoxWrapper justifyContent={justifyContent}>{children}</FlexBoxWrapper>
  );
};

const Header: React.FC & { FlexBox: typeof FlexBox } = props => {
  return <header>{props.children}</header>;
};

FlexBox.Col = Column;
Header.FlexBox = FlexBox;

export default Header;
export { FlexBox, ButtonWrapper as Button };
