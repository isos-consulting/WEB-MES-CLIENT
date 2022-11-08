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

const columns = {
  구매: ColumnStore.INCOME_STORE_ECOUNT_INTERFACE,
  생산불출: ColumnStore.OUT_STORE_ECOUNT_INTERFACE,
};

const extractModalContext = name => {
  return {
    title: `${name} 등록`,
    columns: columns[name],
    extraButtons: [
      {
        align: 'right',
        buttonProps: {
          text: '파일 선택',
          imgtype: 'add',
        },
        buttonAction: (_event, _buttonProps, gridProps) => {
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
              sheet.name.includes(name),
            );

            if (incomeSheet.length > 0) {
              const incomeData = incomeSheet[0].getSheetValues();
              const incomeDataWithoutHeader = incomeData.filter(
                row => row.length > columns[name].length,
              );

              const filterdData = incomeDataWithoutHeader.slice(1).map(row => {
                const obj = {};
                for (let i = 1; i < row.length; i++) {
                  obj[incomeDataWithoutHeader[0][i]] = row[i];
                }

                return obj;
              });
              gridProps.gridRef.current.getInstance().appendRows(filterdData);
            }
          });
        },
      },
    ],
  };
};

export const PgInvEcountERPInterface = () => {
  const [visible, setVisible] = useState(false);
  const [modalContext, setModalContext] = useState({
    ...extractModalContext('구매'),
  });
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
                setModalContext(extractModalContext('구매'));
              },
            },
            {
              ...ButtonStore.EXCEL_UPLOAD,
              ImageType: 'popup',
              children: `생산불출${ButtonStore.EXCEL_UPLOAD.children.replace(
                '엑셀',
                '',
              )}`,
              onClick: () => {
                setVisible(true);
                setModalContext(extractModalContext('생산불출'));
              },
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
        onOk={() => {
          setVisible(false);
        }}
        onCancel={() => {
          setVisible(false);
        }}
        {...modalContext}
        disabledAutoDateColumn={true}
      ></GridPopup>
    </>
  );
};
