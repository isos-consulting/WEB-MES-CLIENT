import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Datagrid,
  ISearchItem,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

const mockMenuList = async () => {
  return [
    {
      code: '01',
      text: '품목관리',
    },
    {
      code: '02',
      text: '발주관리',
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

const mockMenuColumns = async (menuCode: string) => {
  if (menuCode === '01') {
    return [
      {
        header: '품목코드',
        name: 'item_code',
        editable: true,
        requiredField: true,
      },
      {
        header: '품목명',
        name: 'item_name',
        editable: true,
        requiredField: true,
      },
    ];
  } else if (menuCode === '02') {
    return [
      {
        header: '입고창고',
        name: 'to_store_nm',
        format: 'popup',
        requiredField: false,
        width: 120,
        editable: true,
      },
      {
        header: '입고위치',
        name: 'to_location_nm',
        format: 'popup',
        requiredField: false,
        width: 120,
        editable: true,
      },
    ];
  }
};

export const PgStdExcelUpload: React.FC = () => {
  const [uploadColumns, setColumns] = useState([]);
  const menus = mockMenuList();
  const menuCombobox: ISearchItem = {
    type: 'combo',
    id: 'menu_id',
    label: '메뉴',
    default: '',
    firstItemType: 'empty',
    widthSize: '160px',
    onAfterChange: async menuCode => {
      if (menuCode === '') {
        return setColumns([]);
      }

      return setColumns(await mockMenuColumns(menuCode));
    },
  };

  const { props, setSearchItems } = useSearchbox('SEARCH_INPUTBOX', [
    {
      ...menuCombobox,
    },
  ]);

  useEffect(() => {
    menus.then(menu => {
      setSearchItems([
        {
          ...menuCombobox,
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
          <div style={{ height: 'Calc(100vh - 217px)', minHeight: '750px' }}>
            메뉴 선택하세요
          </div>
        ) : (
          <Datagrid
            title="선택 메뉴"
            gridId="menu_id"
            gridMode="update"
            data={[{ item_code: '01', item_name: '5mm 나사' }]}
            columns={uploadColumns}
            gridPopupInfo={[
              {
                // 창고팝업
                columnNames: [
                  { original: 'to_store_uuid', popup: 'store_uuid' },
                  { original: 'to_store_cd', popup: 'store_cd' },
                  { original: 'to_store_nm', popup: 'store_nm' },
                ],
                columns: [
                  {
                    header: '창고UUID',
                    name: 'store_uuid',
                    width: ENUM_WIDTH.L,
                    filter: 'text',
                    hidden: true,
                  },
                  {
                    header: '창고코드',
                    name: 'store_cd',
                    width: ENUM_WIDTH.M,
                    filter: 'text',
                  },
                  {
                    header: '창고명',
                    name: 'store_nm',
                    width: ENUM_WIDTH.L,
                    filter: 'text',
                  },
                ],
                dataApiSettings: ev => {
                  const { rowKey, instance } = ev;
                  const { rawData } = instance?.store?.data;

                  return {
                    uriPath: '/std/stores',
                    params: { store_type: 'available' },
                    onAfterOk: () => {
                      rawData[rowKey].to_location_uuid = '';
                      rawData[rowKey].to_location_nm = '';
                    },
                  };
                },
                gridMode: 'select',
              },
              {
                // 위치팝업
                columnNames: [
                  { original: 'to_location_uuid', popup: 'location_uuid' },
                  { original: 'to_location_cd', popup: 'location_cd' },
                  { original: 'to_location_nm', popup: 'location_nm' },
                ],
                columns: [
                  {
                    header: '위치UUID',
                    name: 'location_uuid',
                    width: ENUM_WIDTH.L,
                    filter: 'text',
                    hidden: true,
                  },
                  {
                    header: '위치코드',
                    name: 'location_cd',
                    width: ENUM_WIDTH.M,
                    filter: 'text',
                  },
                  {
                    header: '위치명',
                    name: 'location_nm',
                    width: ENUM_WIDTH.L,
                    filter: 'text',
                  },
                ],
                dataApiSettings: ev => {
                  const { rowKey, instance } = ev;
                  const { rawData } = instance?.store?.data;

                  const storeUuid = rawData[rowKey]?.to_store_uuid;
                  return {
                    uriPath: '/std/locations',
                    params: { store_uuid: storeUuid ?? '' },
                  };
                },
                gridMode: 'select',
              },
            ]}
          />
        )}
      </Container>
    </>
  );
};
