import React, { useState } from 'react';
import {
  ButtonGroup,
  Container,
  Datagrid,
  GridPopup,
  Searchbox,
  useSearchbox,
} from '~/components/UI';
import { ButtonStore } from '~/constants/buttons';
import { ColumnStore } from '~/constants/columns';
import Excel from 'exceljs';
import { getToday } from '~/functions';
import { WORD } from '~/constants/lang/ko';

const readExcelFile = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

const importExcelFile = (excelFile: File, sheetName: string) => {
  return async gridProps => {
    const excelFileAsBuffer = await readExcelFile(excelFile);
    const sheets = await (
      await new Excel.Workbook().xlsx.load(excelFileAsBuffer)
    ).worksheets;
    const selectedSheet = sheets.filter(sheet =>
      sheet.name.includes(sheetName),
    );

    if (selectedSheet.length > 0) {
      const data = selectedSheet[0].getSheetValues();
      const dataWithoutHeader = data.filter(
        row => row.length > ColumnStore.OUT_STORE_ECOUNT_INTERFACE.length,
      );

      const filterdData = dataWithoutHeader.slice(1).map(row => {
        const obj = {};
        for (let i = 1; i < row.length; i++) {
          obj[dataWithoutHeader[0][i]] = row[i];
        }

        return obj;
      });
      gridProps.gridRef.current.getInstance().appendRows(filterdData);
    }
  };
};

const extractModalContext = name => {
  return {
    title: `생산불출 등록`,
    columns: ColumnStore.OUT_STORE_ECOUNT_INTERFACE,
    okButtonProps: {
      hidden: true,
    },
    extraButtons: [
      {
        buttonProps: {
          text: '엑셀 파일 선택',
        },
        buttonAction: (_event, _buttonProps, gridProps) => {
          const file = document.createElement('input');
          file.type = 'file';
          file.click();

          file.addEventListener('change', async e => {
            await importExcelFile(
              (e.target as HTMLInputElement).files[0],
              name,
            )(gridProps);
          });
        },
      },
      {
        buttonProps: {
          text: '데이터 검증',
        },
        buttonAction: (_event, _buttonProps, gridProps) => {
          console.log(gridProps);
        },
      },
      {
        align: 'right',
        buttonProps: {
          text: '저장',
        },
        buttonAction: (_event, _buttonProps, gridProps) => {
          console.log(gridProps);
        },
      },
    ],
  };
};

export const PgInvOutgoEcountERPInterface = () => {
  const [visible, setVisible] = useState(false);
  const searchERPHistory = values => {
    // ERP 히스토리 조회
  };
  const searchInfo = useSearchbox('SEARCH_ERP_CONDITION', [
    {
      type: 'daterange',
      id: 'reg_date',
      ids: ['start_date', 'end_date'],
      defaults: [getToday(-7), getToday()],
      label: '검색기간',
    },
  ]);
  const [modalContext, setModalContext] = useState(extractModalContext('구매'));

  const openModal = name => {
    setModalContext(extractModalContext(name));
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  const uploadButtons = [
    {
      ...ButtonStore.EXCEL_UPLOAD,
      ImageType: 'popup',
      children: `생산불출 ${WORD.UPLOAD}`,
      onClick: () => openModal('생산불출'),
    },
  ];

  return (
    <>
      <ButtonGroup btnItems={uploadButtons} />
      <Searchbox
        searchItems={searchInfo.searchItems}
        innerRef={searchInfo.props.innerRef}
        onSearch={searchERPHistory}
      />
      <Container>
        <Datagrid
          columns={ColumnStore.INCOME_STORE_ECOUNT_INTERFACE}
          disabledAutoDateColumn={true}
        />
      </Container>
      <GridPopup
        visible={visible}
        onOk={() => closeModal()}
        onCancel={() => closeModal()}
        {...modalContext}
        disabledAutoDateColumn={true}
      ></GridPopup>
    </>
  );
};
