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
import { executeData, getToday, getUserFactoryUuid } from '~/functions';
import { WORD } from '~/constants/lang/ko';
import { message } from 'antd';

const excelAction = {
  state: 'unload',
  update(state) {
    this.state = state;
  },
};

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

    if (selectedSheet.length === 0) {
      message.error(
        '구매 데이터 업로드를 올바르게 할 수 있는 엑셀 파일인지 확인해주세요.',
      );
      return;
    }

    const data = selectedSheet[0].getSheetValues();
    const dataWithoutHeader = data.filter(row => row.length > 2);

    const filterdData = dataWithoutHeader.slice(1).map(row => {
      const obj = {};
      for (let i = 1; i < row.length; i++) {
        const excelColumnName = ColumnStore.INCOME_STORE_ECOUNT_INTERFACE.find(
          column => column.header === dataWithoutHeader[0][i],
        ).name;
        obj[excelColumnName] = row[i];
      }

      return obj;
    });
    gridProps.gridRef.current.getInstance().resetData(filterdData);
  };
};

const extractModalContext = name => {
  return {
    title: `구매 등록`,
    columns: [
      ColumnStore.INCOME_STORE_ECOUNT_INTERFACE[0],
      ...ColumnStore.EXCEL_INVALID_ERROR,
      ...ColumnStore.INCOME_STORE_ECOUNT_INTERFACE.slice(1),
    ],
    okButtonProps: {
      hidden: true,
    },
    extraButtons: [
      {
        buttonProps: {
          text: '엑셀 파일 선택',
        },
      },
      {
        buttonProps: {
          text: '데이터 검증',
        },
      },
      {
        align: 'right',
        buttonProps: {
          text: '저장',
        },
      },
    ],
  };
};

export const PgInvIncomeEcountERPInterface = () => {
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

  modalContext.extraButtons[0].buttonAction = async (
    _event,
    _buttonProps,
    gridProps,
  ) => {
    const file = document.createElement('input');
    file.type = 'file';
    file.click();

    file.addEventListener('change', async e => {
      await importExcelFile(
        (e.target as HTMLInputElement).files[0],
        '구매',
      )(gridProps);
      excelAction.update('load');
    });
  };

  modalContext.extraButtons[1].buttonAction = async (
    _event,
    _buttonProps,
    gridProps,
  ) => {
    if (excelAction.state === 'unload') {
      message.warn('엑셀 파일을 먼저 선택해주세요.');
      return;
    }

    const validatedDatas = await executeData(
      gridProps.gridRef.current.getInstance().getData(),
      '/mat/receives/e-count/validation',
      'post',
    );

    gridProps.gridRef.current
      .getInstance()
      .resetData(validatedDatas.datas.raws);

    const isValid = validatedDatas.datas.raws.every(
      data => data.error.length === 0,
    );

    if (isValid === false) {
      excelAction.update('invalid');
      return;
    }

    excelAction.update('valid');
  };

  modalContext.extraButtons[2].buttonAction = async (
    _event,
    _buttonProps,
    gridProps,
  ) => {
    if (excelAction.state === 'unload') {
      message.warn('엑셀 파일을 먼저 선택해주세요.');
      return;
    }
    if (excelAction.state === 'load') {
      message.warn('데이터 검증을 먼저 해주세요.');
      return;
    }

    if (excelAction.state === 'invalid') {
      message.warn('유효하지 않은 데이터 입니다 오류 내역 행을 확인해주세요.');
      return;
    }

    const uploadIncomData = await executeData(
      gridProps.gridRef.current
        .getInstance()
        .getData()
        .map(data => ({
          ...data,
          factory_uuid: getUserFactoryUuid(),
        })),
      '/mat/receives/e-count',
      'post',
    );

    if (uploadIncomData == null) {
      return;
    }

    message.info('구매 데이터 업로드가 완료되었습니다.');
    closeModal();
  };

  const openModal = name => {
    setModalContext(extractModalContext(name));
    setVisible(true);
  };

  const closeModal = () => {
    excelAction.update('unload');
    setVisible(false);
  };

  const uploadButtons = [
    {
      ...ButtonStore.EXCEL_UPLOAD,
      ImageType: 'popup',
      children: `구매 ${WORD.UPLOAD}`,
      onClick: () => openModal('구매'),
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
        onCancel={() => {
          closeModal();
        }}
        {...modalContext}
        disabledAutoDateColumn={true}
      ></GridPopup>
    </>
  );
};
