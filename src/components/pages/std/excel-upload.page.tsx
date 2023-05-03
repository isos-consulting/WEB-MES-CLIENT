import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import Excel, { CellValue } from 'exceljs';
import React, { createRef, useEffect, useState } from 'react';
import { GridEventProps } from 'tui-grid/types/event';
import {
  Button,
  Container,
  Datagrid,
  IGridColumn,
  ISearchItem,
  Searchbox,
  TGridPopupInfos,
  useSearchbox,
} from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';
import { executeData, getData, getStorageValue } from '~/functions';
import { isEmpty, isNil } from '~/helper/common';
import {
  useButtonDisableWhenMenuSelectablePolicy,
  useExcelUploadDataGrid,
} from './excel-upload/hooks';
import {
  DataGridDatas,
  ExcelSample,
  SampleUploadableMenu,
} from './excel-upload/models';

const importXLSXFile = async (
  uploadExcelBuffer: Excel.Buffer,
  start: number,
  columns: IGridColumn[],
) => {
  const workBook = new Excel.Workbook();
  const uploadData = await workBook.xlsx.load(uploadExcelBuffer);
  const sheet = uploadData.getWorksheet(1);
  const list = new Array<Map<string, CellValue>>();
  const columnNames: string[] = uploadData.model.keywords.split(', ');

  const convertCellValue = (format: string, value: Excel.CellValue) => {
    if (isNil(value)) return null;
    if (['text', 'popup'].includes(format) === true) return value.toString();
    if (format === 'number') return Number(value);

    return value == '1';
  };

  for (let i = start; i <= sheet.rowCount; i++) {
    const row = sheet.getRow(i);

    if (Array.isArray(row.values) === true) {
      if ((row.values.length as number) > 0) {
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
  if (isEmpty(excelFormCode)) {
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
        format: excel_form_type === 'boolean' ? 'check' : excel_form_type,
        requiredField: column_fg,
        hidden: false,
        width: ENUM_WIDTH.M,
      }),
    ),
  ) as IGridColumn[];
};

const menus = () =>
  getData({ file_type: 'excel', use_fg: true }, 'adm/menu-files');

export const PgStdExcelUpload: React.FC = () => {
  const [uploadGridProps, setGridProps] = useState<{
    columns: IGridColumn[];
  }>(INITIAL_UPLOAD_GRID_PROPS);

  const { selectableMenu } = useButtonDisableWhenMenuSelectablePolicy();
  const { excelDataGrid } = useExcelUploadDataGrid();

  const dataGridRef = createRef<Grid>();

  const menuCombobox: ISearchItem = {
    type: 'combo',
    id: 'menu_id',
    label: '메뉴',
    default: '',
    firstItemType: 'empty',
    widthSize: '160px',
    onAfterChange: async (menuCode: string) => {
      selectableMenu.selectMenu(
        (await menus()).find(
          ({ menu_uuid }: ExcelSample & SampleUploadableMenu) =>
            menu_uuid === menuCode,
        ),
      );

      setGridProps({
        columns: await gridColumns(menuCode),
      });
      excelDataGrid.clear();
    },
  };

  const { props, setSearchItems } = useSearchbox('SEARCH_INPUTBOX', [
    {
      ...menuCombobox,
    },
  ]);

  useEffect(() => {
    menus().then(menu => {
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
    if (selectableMenu.isSelected() === false) {
      return message.warn('메뉴를 선택해주세요.');
    }

    const blob: Blob | MediaSource = await executeData(
      {},
      `tenant/${getStorageValue({
        storageName: 'tenantInfo',
        keyName: 'tenantUuid',
      })}/file/${selectableMenu.item.menu_file_uuid}/download`,
      'post',
      'blob',
      false,
      import.meta.env.VITE_FILE_SERVER_URL,
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectableMenu.item.menu_nm}_업로드 양식.${selectableMenu.item.file_extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blob.toString());
  };

  const activeDialog = clickEvent => {
    clickEvent.preventDefault();
    if (selectableMenu.isSelected() === false) {
      return message.warn('메뉴를 선택해주세요.');
    }
  };

  const beforeSelecedExcelFile = async uploadFile => {
    const converted = await importXLSXFile(
      uploadFile,
      11,
      uploadGridProps.columns,
    );

    excelDataGrid.setData(converted as DataGridDatas[]);

    return false;
  };

  const validateData = async () => {
    if (
      excelDataGrid.isExcelDataEmpty() === true ||
      selectableMenu.isSelected() === false
    ) {
      return message.warn('엑셀파일을 업로드해주세요.');
    }

    const validatedDatas = await executeData(
      dataGridRef.current.getInstance().getData(),
      'std/partners/excel-validation',
      'post',
    );
    if (isNil(validatedDatas)) return;
    setGridProps({
      columns: [
        { ...uploadGridProps.columns[0], hidden: false } as IGridColumn,
      ].concat(...uploadGridProps.columns.slice(1)),
    });

    excelDataGrid.setData(validatedDatas.datas.raws);
  };

  const saveData = async () => {
    if (selectableMenu.isSelected() === false) {
      return message.warn('메뉴를 선택해주세요.');
    }

    if (
      excelDataGrid.isExcelDataEmpty() === true ||
      excelDataGrid.isValidate() === false ||
      dataGridRef.current.getInstance().getModifiedRows().updatedRows.length > 0
    ) {
      return message.warn('데이터 검증을 실행해주세요');
    }

    const validatedDatas = await executeData(
      dataGridRef.current.getInstance().getData(),
      selectableMenu.item.menu_uri,
      'post',
    );
    if (isNil(validatedDatas)) return;
    setGridProps({
      columns: [
        { ...uploadGridProps.columns[0], hidden: false } as IGridColumn,
      ].concat(...uploadGridProps.columns.slice(1)),
    });
    excelDataGrid.clear();
  };

  const notificationExcelDataGridChanged = () =>
    message.warn('수정된 데이터가 있습니다. 데이터 검증 버튼을 눌러주세요.');

  return (
    <>
      <Button onClick={downloadFile}>다운로드</Button>
      <Button.Upload
        text="업로드 파일 선택하기"
        beforeUpload={beforeSelecedExcelFile}
        onClick={activeDialog}
        openFileDialogOnClick={selectableMenu.isSelected() === true}
      />
      <Button onClick={validateData}>데이터 검증</Button>
      <Button onClick={saveData}>저장</Button>
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
            data={excelDataGrid.asList()}
            columns={uploadGridProps.columns}
            ref={dataGridRef}
            disabledAutoDateColumn={true}
            gridPopupInfo={POPUP_COLUMN_INFO}
            onAfterChange={notificationExcelDataGridChanged}
          />
        )}
      </Container>
    </>
  );
};

const INITIAL_UPLOAD_GRID_PROPS = {
  columns: [],
};

const POPUP_COLUMN_INFO: TGridPopupInfos = [
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
    dataApiSettings: (ev: GridEventProps & { instance: any }) => {
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
    dataApiSettings: (ev: GridEventProps & { instance: any }) => {
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
];
