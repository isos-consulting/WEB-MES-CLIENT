import Grid from '@toast-ui/react-grid';
import { message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import {
  Container,
  Datagrid,
  GridInstanceReference,
  GridPopup,
  IGridColumn,
} from '~/components/UI';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import ComboStore from '~/constants/combos';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import ModalStore from '~/constants/modals';
import { ENUM_DECIMAL } from '~/enums';
import { executeData, getModifiedRows, getPageName } from '~/functions';
import ExcelUploadType from '~/models/user/excel-upload-type';
import { COLORS } from '~/styles/palette';
import Header, { Button } from './components/Header';
import { excelUploadTypeList } from './hooks/excel-upload-type';
import BasicModalContext from './hooks/modal';

const { confirm } = Modal;

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
    decimal: ENUM_DECIMAL.DEC_NORMAL,
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
  const [excelUploadTypeListData, setExcelUploadTypeListData] = useState<
    ExcelUploadType[]
  >([]);
  const excelUploadTypeGridRef = useRef<Grid>();

  const searchExcelUploadTypeList = async () => {
    setExcelUploadTypeListData(await excelUploadTypeList());
  };

  const successSaveDataAfterEvent = () => {
    setModalContextStore(basicModalContext);
    message.info(SENTENCE.SAVE_COMPLETE);
    searchExcelUploadTypeList();
  };

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
        return success === true ? successSaveDataAfterEvent() : null;
      },
    );
  };

  const updateExcelUploadType = (
    excelUploadTypeGridRef: GridInstanceReference<Grid>,
  ) => {
    const updatedExcelUploadTypeList = excelUploadTypeGridRef.current
      .getInstance()
      .getModifiedRows()
      .updatedRows.map(createdRow =>
        ExcelUploadType.instance(
          createdRow.valueOf() as ExcelUploadType,
        ).info(),
      );

    executeData(updatedExcelUploadTypeList, 'adm/excel-forms', 'put').then(
      ({ success }) => {
        return success === true ? successSaveDataAfterEvent() : null;
      },
    );
  };

  const basicModalContext = new BasicModalContext<ExcelUploadType>({
    title: title,
    columns: columns,
    visible: false,
    gridMode: 'view',
    data: excelUploadTypeListData,
    gridPopupInfo: [ModalStore.autMenu],
    gridComboInfo: [ComboStore.formType],
    onOk: () => {
      // this function intentionally left blank
    },
  });
  const [modalContextStore, setModalContextStore] =
    useState<IGridPopupProps>(basicModalContext);

  return (
    <>
      {modalContextStore.visible === true ? (
        <GridPopup
          {...modalContextStore.info()}
          onCancel={() => {
            setModalContextStore(basicModalContext);
          }}
        />
      ) : null}
      <Header>
        <Header.FlexBox justifyContent="space-between">
          <Button
            primary="true"
            btnType="buttonFill"
            widthSize="medium"
            heightSize="small"
            fontSize="small"
            ImageType="search"
            onClick={searchExcelUploadTypeList}
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
              colorType={COLORS.SECONDARY.ORANGE[500]}
              onClick={() => {
                confirm({
                  icon: null,
                  title: WORD.DELETE,
                  content: SENTENCE.DELETE_CONFIRM,
                  onOk: () => {
                    const deletedExcelUploadTypeList = getModifiedRows(
                      excelUploadTypeGridRef,
                      columns,
                    ).deletedRows.map(deletedRow =>
                      ExcelUploadType.instance(
                        deletedRow.valueOf() as ExcelUploadType,
                      ).info(),
                    );

                    executeData(
                      deletedExcelUploadTypeList,
                      'adm/excel-forms',
                      'delete',
                    ).then(({ success }) => {
                      return success === true
                        ? successSaveDataAfterEvent()
                        : null;
                    });
                  },
                });
              }}
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
                    onOk: updateExcelUploadType,
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
        <Datagrid
          ref={excelUploadTypeGridRef}
          data={excelUploadTypeListData}
          columns={columns}
          gridMode={'delete'}
          disabledAutoDateColumn={true}
        />
      </Container>
    </>
  );
};
