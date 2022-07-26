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
import Excel, { CellValue } from 'exceljs';
import { getData } from '~/functions';

interface ExcelDownloadApiResponse {
  data: Blob;
  headers: { [key: string]: string };
}

const importXLSXFile = async (
  uploadExcelBuffer: Excel.Buffer,
  start: number,
) => {
  const workBook = new Excel.Workbook();
  const uploadData = await workBook.xlsx.load(uploadExcelBuffer);
  const sheet = uploadData.getWorksheet(1);
  const columns = sheet.getRow(start).values;
  const list = new Array<Map<string, CellValue>>();

  for (let i = start + 2; i < sheet.rowCount; i++) {
    const row = sheet.getRow(i);

    if (Array.isArray(row.values) === true) {
      if (row.values.length > 0) {
        const data = new Map<string, Excel.CellValue>();

        columns.forEach((column, index) => {
          data.set(column, row.getCell(index).value);
        });
        list.push(data);
      }
    }
  }
  return list.map(datas => Object.fromEntries(datas.entries()));
};

const gridColumns = async (excelFormCode: string) => {
  if (excelFormCode === '') {
    return [];
  }

  const columns = await await getData(
    [{ excel_form_cd: excelFormCode }],
    'adm/excel-forms',
  );

  return columns.map(
    ({
      excel_form_column_cd,
      excel_form_column_nm,
      excel_form_type,
      column_fg,
    }) => ({
      header: excel_form_column_nm,
      name: excel_form_column_cd,
      editable: true,
      format: excel_form_type,
      requiredField: column_fg,
    }),
  );
};

export const PgStdExcelUpload: React.FC = () => {
  const menus = getData({}, 'adm/excel-form/items');
  const [uploadGridProps, setGridProps] = useState({
    columns: [],
    data: [],
  });
  const [menuCode, setMenuCode] = useState<string>('');
  const menuCombobox: ISearchItem = {
    type: 'combo',
    id: 'menu_id',
    label: '메뉴',
    default: '',
    firstItemType: 'empty',
    widthSize: '160px',
    onAfterChange: async menuCode => {
      setMenuCode(menuCode);
      setGridProps({
        columns: await gridColumns(menuCode),
        data: [],
      });
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
          options: menu.map(({ excel_form_cd, menu_nm }) => ({
            code: excel_form_cd,
            text: menu_nm,
          })),
        },
      ]);
    });
  }, []);

  const downloadFile = async () => {
    const blob: ExcelDownloadApiResponse = await getData(
      { excel_form_cd: menuCode },
      '/adm/excel-forms/download',
      'blob',
    );

    const contentDisposition = blob.headers['content-disposition'];
    let fileName = 'unknown';
    if (contentDisposition) {
      const [fileNameMatch] = contentDisposition
        .split(';')
        .filter(str => str.includes('filename'));
      if (fileNameMatch) [, fileName] = fileNameMatch.split('=');
    }

    const url = URL.createObjectURL(blob.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = decodeURIComponent(fileName);
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blob.toString());
  };

  return (
    <>
      <Button
        onClick={() => {
          downloadFile();
        }}
      >
        다운로드
      </Button>
      <Button.Upload
        text="업로드 파일 선택하기"
        beforeUpload={async uploadFile => {
          const converted = await importXLSXFile(uploadFile, 9);

          setGridProps({
            columns: uploadGridProps.columns,
            data: converted,
          });
          return false;
        }}
      />
      <Searchbox {...props} />
      <Container>
        {uploadGridProps.columns.length === 0 ? (
          <div style={{ height: 'Calc(100vh - 217px)', minHeight: '750px' }}>
            메뉴 선택하세요
          </div>
        ) : (
          <Datagrid
            title="선택 메뉴"
            gridId="menu_id"
            gridMode="update"
            data={uploadGridProps.data}
            columns={uploadGridProps.columns}
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
