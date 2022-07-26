// import { Modal } from 'antd';
import React, { useState } from 'react';
import {
  Container,
  Datagrid,
  GridPopup,
  IGridPopupProps,
} from '~/components/UI';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { getPageName } from '~/functions';
import ExcelUploadType from '~/models/user/excel-upload-type';
import { COLOROURS } from '~/styles/palette';
import Header, { Button } from './excel-upload-type/components/Header';
import { excelUploadTypeList } from './excel-upload-type/hooks/excel-upload-type';
import BasicModalContext from './excel-upload-type/hooks/modal';

const columns = [
  { header: '메뉴명', name: 'menuName', editable: true },
  { header: '컬럼코드', name: 'formColumnCode', editable: true },
  { header: '컬럼명', name: 'formColumnName', editable: true },
  { header: '컬럼유형', name: 'formType', editable: true },
  { header: '순서', name: 'order', editable: true },
  { header: '사용여부', name: 'required', editable: true },
];

export const PgAdmExcelUploadType: React.FC = () => {
  const title = getPageName();

  const [excelUploadTypeListData, setExcelUploadTypeListData] = useState<
    ExcelUploadType[]
  >([]);

  const basicModalContext = new BasicModalContext<ExcelUploadType>({
    title: title,
    columns: columns,
    visible: false,
    gridMode: 'view',
    data: excelUploadTypeListData,
  });
  const [modalStore, setModalStore] =
    useState<IGridPopupProps>(basicModalContext);

  return (
    <>
      <Header>
        <Header.FlexBox justifyContent="space-between">
          <Button
            primary="true"
            btnType="buttonFill"
            widthSize="medium"
            heightSize="small"
            fontSize="small"
            ImageType="search"
            onClick={async () => {
              setExcelUploadTypeListData(await excelUploadTypeList());
            }}
          >
            {WORD.SEARCH}
          </Button>
          <Header.FlexBox gap="0 5px">
            <Button
              primary="true"
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="delete"
              colorType={COLOROURS.SECONDARY.ORANGE[500]}
            >
              {WORD.DELETE}
            </Button>
            <Button
              primary="true"
              btnType="buttonFill"
              widthSize="medium"
              heightSize="small"
              fontSize="small"
              ImageType="edit"
              onClick={() => {
                setModalStore(
                  BasicModalContext.edit<ExcelUploadType>({
                    title,
                    columns: columns,
                    data: [...excelUploadTypeListData],
                  }),
                );
              }}
            >
              {WORD.EDIT}
            </Button>
            <Button
              primary="true"
              btnType="buttonFill"
              widthSize="large"
              heightSize="small"
              fontSize="small"
              ImageType="add"
              onClick={() => {
                setModalStore(
                  BasicModalContext.add<ExcelUploadType>({
                    title,
                    columns: columns,
                  }),
                );
              }}
            >
              {SENTENCE.ADD_RECORD}
            </Button>
          </Header.FlexBox>
        </Header.FlexBox>
      </Header>
      <Container>
        <Datagrid data={excelUploadTypeListData} columns={columns} />
        {modalStore.visible === true ? (
          <GridPopup
            {...modalStore.info()}
            onCancel={() => {
              setModalStore(basicModalContext);
            }}
          />
        ) : null}
      </Container>
    </>
  );
};
