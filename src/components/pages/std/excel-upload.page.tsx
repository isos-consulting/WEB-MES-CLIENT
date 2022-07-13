import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Datagrid,
  Searchbox,
  useSearchbox,
} from '~/components/UI';

const mockMenuList = async () => {
  return [
    {
      code: '01',
      text: '품목관리',
    },
    {
      code: '02',
      text: '재고관리',
    },
    {
      code: '03',
      text: '공장관리',
    },
    {
      code: '04',
      text: '사용자관리',
    },
  ];
};

export const PgStdExcelUpload: React.FC = () => {
  const [uploadColumns, setColumns] = useState([]);
  const menus = mockMenuList();

  const { props, setSearchItems } = useSearchbox('SEARCH_INPUTBOX', [
    {
      type: 'combo',
      id: 'menu_id',
      label: '메뉴 목록',
      default: '',
      firstItemType: 'empty',
      widthSize: '160px',
      onAfterChange: () => {
        setColumns([{ header: '컬럼1' }, { header: '컬럼2' }]);
      },
    },
  ]);

  useEffect(() => {
    menus.then(menu => {
      setSearchItems([
        {
          type: 'combo',
          id: 'menu_id',
          label: '메뉴 목록',
          default: '',
          firstItemType: 'empty',
          widthSize: '160px',
          onAfterChange: () => {
            setColumns([{ header: '컬럼1' }, { header: '컬럼2' }]);
          },
          options: menu,
        },
      ]);
    });
  }, []);

  return (
    <>
      <Button
        btnType="buttonFill"
        widthSize="large"
        heightSize="small"
        fontSize="small"
        colorType="blue"
        onClick={() => {}}
      >
        업로드 파일 선택하기
      </Button>
      <Searchbox {...props} />
      <Container>
        {uploadColumns.length === 0 ? (
          <div style={{ height: '750px' }}>메뉴 선택하세요</div>
        ) : (
          <Datagrid
            title="선택 메뉴"
            gridId="menu_id"
            gridMode="update"
            data={[{ menu_id: '01' }]}
            columns={uploadColumns}
          />
        )}
      </Container>
    </>
  );
};
