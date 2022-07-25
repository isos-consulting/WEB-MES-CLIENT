import React from 'react';
import { Container, Datagrid } from '~/components/UI';
import { WORD } from '~/constants/lang/ko';

import Header, { FlexBox, Button } from './excel-upload-type/components/Header';

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
      <Header>
        <Header.FlexBox justifyContent="space-between">
          <FlexBox.Col>
            <Button
              primary="true"
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="search"
            >
              {WORD.SEARCH}
            </Button>
          </FlexBox.Col>
        </Header.FlexBox>
      </Header>
      <Container>
        <Datagrid columns={columns} />
      </Container>
    </>
  );
};
