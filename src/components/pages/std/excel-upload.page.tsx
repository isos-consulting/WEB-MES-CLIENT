import React, { createRef, useState, useEffect } from 'react';
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
import { executeData, getData, getStorageValue } from '~/functions';
import Grid from '@toast-ui/react-grid';

interface DataGridColumns {
  header: string;
  name: string;
  format: string;
}

interface DataGridDatas {
  [key: string]: string | number | boolean;
}

const importXLSXFile = async (
  uploadExcelBuffer: Excel.Buffer,
  start: number,
  columns: DataGridColumns[],
) => {
  const workBook = new Excel.Workbook();
  const uploadData = await workBook.xlsx.load(uploadExcelBuffer);
  const sheet = uploadData.getWorksheet(1);
  const list = new Array<Map<string, CellValue>>();
  const columnNames: string[] = uploadData.model.keywords.split(', ');

  const convertCellValue = (format: string, value: Excel.CellValue) => {
    if (value == null) return null;
    if (['text', 'popup'].includes(format) === true) return value.toString();
    if (format === 'number') return Number(value);

    return !Boolean(value);
  };

  for (let i = start; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);

    if (Array.isArray(row.values) === true) {
      if (row.values.length > 0) {
        const data = new Map<string, string | number | boolean>();

        columnNames.forEach((columnName: string, index: number) => {
          const { format } = columns.find(({ name }) => name === columnName);

          data.set(
            columnName,
            convertCellValue(format, row.getCell(index + 1).value),
          );
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

  const columns = await getData(
    { menu_uuid: excelFormCode },
    'adm/excel-forms',
  );

  return [
    {
      header: '에러내역',
      name: 'error',
      editable: false,
      format: 'text',
      requiredField: false,
      hidden: true,
      width: ENUM_WIDTH.XXL,
    },
  ].concat(
    columns.map(
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
        hidden: false,
        width: ENUM_WIDTH.M,
      }),
    ),
  );
};

interface MenuStore {
  file_extension: string;
  file_name: string;
  file_type: string;
  menu_file_uuid: string;
  menu_nm: string;
  menu_uuid: string;
}

const menus = getData({ file_type: 'excel', use_fg: true }, 'adm/menu-files');
export const PgStdExcelUpload: React.FC = () => {
  const [uploadGridProps, setGridProps] = useState<{
    columns: DataGridColumns[];
    data: DataGridDatas[];
  }>({
    columns: [],
    data: [],
  });
  const [menuStore, setMenuStore] = useState<MenuStore>({
    file_extension: '',
    file_name: '',
    file_type: '',
    menu_file_uuid: '',
    menu_nm: '',
    menu_uuid: '',
    menu_uri: '',
  });
  const dataGridRef = createRef<Grid>(null);
  const menuCombobox: ISearchItem = {
    type: 'combo',
    id: 'menu_id',
    label: '메뉴',
    default: '',
    firstItemType: 'empty',
    widthSize: '160px',
    onAfterChange: async (menuCode: string) => {
      setMenuStore(
        (await menus).find(
          ({ menu_uuid }: MenuStore) => menu_uuid === menuCode,
        ),
      );
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
          options: menu.map(({ menu_uuid, menu_nm }) => ({
            code: menu_uuid,
            text: menu_nm,
          })),
        },
      ]);
    });
  }, []);

  const downloadFile = async () => {
    const blob: Blob | MediaSource = await executeData(
      {},
      `tenant/${getStorageValue({
        storageName: 'tenantInfo',
        keyName: 'tenantUuid',
      })}/file/${menuStore.menu_file_uuid}/download`,
      'post',
      'blob',
      false,
      process.env.FILE_SERVER_URL,
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${menuStore.file_name}.${menuStore.file_extension}`;
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
          const converted = await importXLSXFile(
            uploadFile,
            11,
            uploadGridProps.columns,
          );

          setGridProps({
            columns: uploadGridProps.columns,
            data: converted,
          });
          return false;
        }}
      />
      <Button
        onClick={async () => {
          const validatedDatas = await executeData(
            dataGridRef.current.getInstance().getData(),
            'std/partners/excel-validation',
            'post',
          );
          if (validatedDatas == null) return;
          setGridProps({
            columns: [{ ...uploadGridProps.columns[0], hidden: false }].concat(
              ...uploadGridProps.columns.slice(1),
            ),
            data: validatedDatas.datas.raws,
          });
        }}
      >
        데이터 검증
      </Button>
      <Button
        onClick={async () => {
          const validatedDatas = await executeData(
            dataGridRef.current.getInstance().getData(),
            menuStore.menu_uri,
            'post',
          );
          if (validatedDatas == null) return;
          setGridProps({
            columns: [{ ...uploadGridProps.columns[0], hidden: false }].concat(
              ...uploadGridProps.columns.slice(1),
            ),
            data: validatedDatas.datas.raws,
          });
        }}
      >
        저장
      </Button>
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
            ref={dataGridRef}
            disabledAutoDateColumn={true}
            gridPopupInfo={[
              {
                // 거래처유형 팝업
                columnNames: [
                  { original: 'partner_type_uuid', popup: 'partner_type_uuid' },
                  { original: 'partner_type_cd', popup: 'partner_type_cd' },
                  { original: 'partner_type_nm', popup: 'partner_type_nm' },
                ],
                columns: [
                  {
                    header: '거래처유형UUID',
                    name: 'partner_type_uuid',
                    width: ENUM_WIDTH.L,
                    filter: 'text',
                    hidden: true,
                  },
                  {
                    header: '거래처유형코드',
                    name: 'partner_type_cd',
                    width: ENUM_WIDTH.M,
                    filter: 'text',
                  },
                  {
                    header: '거래처유형명',
                    name: 'partner_type_nm',
                    width: ENUM_WIDTH.L,
                    filter: 'text',
                  },
                ],
                dataApiSettings: {
                  uriPath: '/std/partner-types',
                  params: null,
                },
                gridMode: 'select',
              },
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
