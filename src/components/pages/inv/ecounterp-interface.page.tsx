import React, { useState } from 'react';
import {
  ButtonGroup,
  Container,
  Datagrid,
  GridPopup,
  Searchbox,
} from '~/components/UI';
import { ButtonStore } from '~/constants/buttons';
import { ColumnStore } from '~/constants/columns';
import Excel from 'exceljs';

export const PgInvEcountERPInterface = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Container>
        <Searchbox></Searchbox>
        <ButtonGroup
          btnItems={[
            {
              ...ButtonStore.EXCEL_UPLOAD,
              ImageType: 'popup',
              children: `구매${ButtonStore.EXCEL_UPLOAD.children.replace(
                '엑셀',
                '',
              )}`,
              onClick: () => {
                setVisible(true);
              },
            },
            {
              ...ButtonStore.EXCEL_UPLOAD,
              ImageType: 'popup',
              children: `생산불출${ButtonStore.EXCEL_UPLOAD.children.replace(
                '엑셀',
                '',
              )}`,
              onClick: () => {},
            },
          ]}
        />
      </Container>
      <Container>
        <Datagrid
          columns={ColumnStore.INCOME_STORE_ECOUNT_INTERFACE}
          disabledAutoDateColumn={true}
        />
      </Container>
      <GridPopup
        visible={visible}
        title="입고 등록"
        columns={ColumnStore.INCOME_STORE_ECOUNT_INTERFACE}
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
        extraButtons={[
          {
            align: 'right',
            buttonProps: {
              text: '엑셀 파일 선택',
              imgtype: 'add',
            },
            buttonAction: (_event, buttonProps, gridProps) => {
              const file = document.createElement('input');
              file.type = 'file';
              file.click();
              file.addEventListener('change', async e => {
                const readFile = (file): Promise<ArrayBuffer> => {
                  return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as ArrayBuffer);
                    reader.onerror = reject;
                    reader.readAsArrayBuffer(file);
                  });
                };
                const file = (e.target as HTMLInputElement).files[0];
                const excelFileAsBuffer = await readFile(file);

                const workBook = new Excel.Workbook();
                const uploadData = await workBook.xlsx.load(excelFileAsBuffer);
                const sheets = uploadData.worksheets;
                const incomeSheet = sheets.filter(sheet =>
                  sheet.name.includes('구매'),
                );

                if (incomeSheet.length > 0) {
                  const incomeData = incomeSheet[0].getSheetValues();
                  const incomeDataWithoutHeader = incomeData.filter(
                    row => row.length === 31,
                  );

                  const filterdData = incomeDataWithoutHeader
                    .slice(1)
                    .map(row => {
                      const obj = {};
                      for (let i = 1; i < row.length; i++) {
                        obj[incomeDataWithoutHeader[0][i]] = row[i];
                      }

                      return obj;
                    });
                  gridProps.gridRef.current
                    .getInstance()
                    .appendRows(filterdData);
                }
              });
            },
          },
        ]}
        disabledAutoDateColumn={true}
      ></GridPopup>
    </>
  );
};
