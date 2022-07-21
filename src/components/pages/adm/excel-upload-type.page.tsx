import React from 'react';
import { Button, Container, Datagrid } from '~/components/UI';
import styled from 'styled-components';

const FlexboxWrapper = styled.div`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent};
`;

interface FlexboxProps {
  justifyContent?: string;
  children?: React.ReactNode;
}

interface ColProps {
  children?: React.ReactNode;
}

const Flexbox: React.FC<FlexboxProps> & {
  Col: typeof Col;
} = ({ justifyContent, children }): FlexboxProps => {
  return (
    <FlexboxWrapper justifyContent={justifyContent}>{children}</FlexboxWrapper>
  );
};

const Col: React.FC = ({ children }): ColProps => {
  return <div>{children}</div>;
};

const Section: React.FC & { Flexbox: typeof Flexbox } = props => {
  return <section>{props.children}</section>;
};

Flexbox.Col = Col;
Section.Flexbox = Flexbox;

const columns = [
  { header: '메뉴명', name: 'menu_nm' },
  { header: '컬럼코드', name: 'col_cd' },
  { header: '컬럼명', name: 'col_nm' },
  { header: '컬럼유형', name: 'col_type' },
  { header: '순서', name: 'sort_order' },
  { header: '사용여부', name: 'required' },
];

export const PgAdmExcelUploadType: React.FC = () => {
  return (
    <>
      <Section>
        <Section.Flexbox justifyContent="space-between">
          <Flexbox.Col>
            <Button>조회</Button>
          </Flexbox.Col>
          <Flexbox.Col>
            <Button>삭제</Button>
            <Button>수정</Button>
            <Button>신규항목추가</Button>
          </Flexbox.Col>
        </Section.Flexbox>
      </Section>
      <Container>
        <Datagrid columns={columns} />
      </Container>
    </>
  );
};
