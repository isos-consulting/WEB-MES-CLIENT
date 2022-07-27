import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import React, { useState } from 'react';
import {
  Container,
  Datagrid,
  GridInstanceReference,
  GridPopup,
  IGridColumn,
  IGridPopupProps,
} from '~/components/UI';
import ComboStore from '~/constants/combos';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import ModalStore from '~/constants/modals';
import { executeData, getPageName } from '~/functions';
import ExcelUploadType from '~/models/user/excel-upload-type';
import { COLOROURS } from '~/styles/palette';
import Header, { Button } from './excel-upload-type/components/Header';
import { excelUploadTypeList } from './excel-upload-type/hooks/excel-upload-type';
import BasicModalContext from './excel-upload-type/hooks/modal';

const columns: IGridColumn[] = [
  {
    header: '메뉴Uuid',
    name: 'menuUuid',
    format: 'text',
    editable: false,
    requiredField: true,
    hidden: true,
  },
  {
    header: '메뉴명',
    name: 'menuName',
    format: 'popup',
    editable: true,
    requiredField: true,
  },
  {
    header: '양식코드',
    name: 'formCode',
    format: 'text',
    editable: true,
    requiredField: true,
  },
  {
    header: '양식명',
    name: 'formName',
    format: 'text',
    editable: true,
    requiredField: true,
  },
  {
    header: '컬럼코드',
    name: 'formColumnCode',
    format: 'text',
    editable: true,
    requiredField: true,
  },
  {
    header: '컬럼명',
    name: 'formColumnName',
    format: 'text',
    editable: true,
    requiredField: true,
  },
  {
    header: '컬럼유형',
    name: 'formType',
    format: 'combo',
    editable: true,
    requiredField: true,
  },
  {
    header: '순서',
    name: 'order',
    format: 'number',
    editable: true,
    requiredField: true,
  },
  {
    header: '사용여부',
    name: 'required',
    format: 'check',
    editable: true,
  },
];

export const PgAdmExcelUploadType: React.FC = () => {
  const title = getPageName();

  const createExcelUploadType = (
    excelUploadTypeGridRef: GridInstanceReference<Grid>,
  ) => {
    const createdExcelUploadTypeList = excelUploadTypeGridRef.current
      .getInstance()
      .getModifiedRows()
      .createdRows.map(createdRow =>
        ExcelUploadType.instance(
          createdRow.valueOf() as ExcelUploadType,
        ).info(),
      );

    executeData(createdExcelUploadTypeList, 'adm/excel-forms', 'post').then(
      ({ success }) => {
        return success === true
          ? (() => {
              setModalContextStore(basicModalContext);
              message.info(SENTENCE.SAVE_COMPLETE);
            })()
          : null;
      },
    );
  };

  const [excelUploadTypeListData, setExcelUploadTypeListData] = useState<
    ExcelUploadType[]
  >([]);

  const basicModalContext = new BasicModalContext<ExcelUploadType>({
    title: title,
    columns: columns,
    visible: false,
    gridMode: 'view',
    data: excelUploadTypeListData,
    gridPopupInfo: [ModalStore.autMenu],
    gridComboInfo: [ComboStore.formType],
    onOk: () => {},
  });
  const [modalContextStore, setModalContextStore] =
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
                setModalContextStore(
                  BasicModalContext.edit<ExcelUploadType>({
                    title,
                    columns: columns,
                    data: [...excelUploadTypeListData],
                    gridPopupInfo: [ModalStore.autMenu],
                    gridComboInfo: [ComboStore.formType],
                    onOk: () => {},
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
                setModalContextStore(
                  BasicModalContext.add<ExcelUploadType>({
                    title,
                    columns: columns,
                    gridPopupInfo: [ModalStore.autMenu],
                    gridComboInfo: [ComboStore.formType],
                    onOk: createExcelUploadType,
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
        {modalContextStore.visible === true ? (
          <GridPopup
            {...modalContextStore.info()}
            onCancel={() => {
              setModalContextStore(basicModalContext);
            }}
          />
        ) : null}
      </Container>
    </>
  );
};
