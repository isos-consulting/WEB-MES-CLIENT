import React from 'react';
import { Button } from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import { ButtonStore } from '~/constants/buttons';
import Excel from 'exceljs';

const exportEcountERPExcelFile = async data => {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('1_재고실사(MES->이카운터)');

  worksheet.columns = [
    { header: '일자', key: '일자', width: 13 },
    { header: '순번', key: '순번', width: 13 },
    { header: '담당자', key: '담당자', width: 13 },
    { header: '창고', key: '창고', width: 13 },
    { header: '품목코드', key: '품목코드', width: 13 },
    { header: '품목명', key: '품목명', width: 13 },
    { header: 'BOX', key: 'BOX', width: 13 },
    { header: '수량', key: '수량', width: 13 },
    { header: '적요', key: '적요', width: 13 },
    { header: '관리항목', key: '관리항목', width: 13 },
  ];

  data.forEach((row, index) => {
    worksheet.addRow({
      일자: '',
      순번: index + 1,
      담당자: '',
      창고: row.store_nm,
      품목코드: row.prod_no,
      품목명: row.prod_nm,
      BOX: row.BOX,
      수량: row.qty,
      적요: '',
      관리항목: '',
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const blob = new Blob([buffer], { type: fileType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ecount ERP Download${fileExtension}`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const EcountERPStocksDownloadButton = ({
  gridInfo,
}: {
  gridInfo: IDatagridProps;
}) => {
  const downloadButtonProps = {
    ...ButtonStore.EXCEL_DOWNLOAD,
    children: ButtonStore.EXCEL_DOWNLOAD.children.replace('엑셀', '재고실사'),
    onClick: () => {
      exportEcountERPExcelFile(gridInfo.data);
    },
  };
  return <Button {...downloadButtonProps} />;
};
