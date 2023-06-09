import Grid from '@toast-ui/react-grid';
import { message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import {
  Container,
  Datagrid,
  GridInstanceReference,
  GridPopup,
} from '~/components/UI';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { executeData, getData, getPageName } from '~/functions';
import { COLORS } from '~/styles/palette';
import Header, { Button } from '../adm/excel-upload-type/components/Header';
import BasicModalContext from '../adm/excel-upload-type/hooks/modal';
import { ColumnStore } from '~/constants/columns';

const { confirm } = Modal;
const WORK_TYPE_GRID_COLUMNS = ColumnStore.WORK_TYPE;

const displayHiddenWorkTypeBasicModalContext = () =>
  new BasicModalContext<unknown>({
    title: '',
    columns: [...WORK_TYPE_GRID_COLUMNS],
    visible: false,
    gridMode: 'view',
    data: [],
    gridPopupInfo: [],
    gridComboInfo: [],
    onOk: () => {
      // this function intentionally left blank
    },
  });

const addWorkTypeBasicModalContext = ({
  addWorkTypeModalTitle,
  onAfterFetchWorkTypePostApi,
}: {
  addWorkTypeModalTitle: string;
  onAfterFetchWorkTypePostApi: Function;
}) =>
  BasicModalContext.add({
    ...displayHiddenWorkTypeBasicModalContext(),
    title: addWorkTypeModalTitle,
    onOk: (workTypeAddGridRef: GridInstanceReference<Grid>) => {
      executeData(
        [
          ...workTypeAddGridRef.current.getInstance().getModifiedRows()
            .createdRows,
        ],
        '/std/work-types',
        'post',
      ).then(({ success }) => {
        if (success === true) {
          onAfterFetchWorkTypePostApi();
        }
      });
    },
  });

const editWorkTypeBasicModalContext = ({
  editWorkTypeModalTitle,
  editWorkTypeDatas,
  onAfterFetchWorkTypePutApi,
}: {
  editWorkTypeModalTitle: string;
  editWorkTypeDatas: unknown[];
  onAfterFetchWorkTypePutApi: Function;
}) =>
  BasicModalContext.edit({
    ...displayHiddenWorkTypeBasicModalContext(),
    title: editWorkTypeModalTitle,
    data: [...editWorkTypeDatas],
    onOk: (workTypeEditGridRef: GridInstanceReference<Grid>) => {
      executeData(
        workTypeEditGridRef.current
          .getInstance()
          .getModifiedRows()
          .updatedRows.map(updatedRow => ({
            uuid: updatedRow.work_type_uuid,
            ...updatedRow,
          })),
        'std/work-types',
        'put',
      ).then(({ success }) => {
        if (success === true) {
          onAfterFetchWorkTypePutApi();
        }
      });
    },
  });

const deleteWorkTypeConfirm = ({
  deletedWorkTypeRows,
  afterFetchWorkTypeDeleteApi,
}: {
  deletedWorkTypeRows: unknown[];
  afterFetchWorkTypeDeleteApi: () => void;
}) =>
  confirm({
    icon: null,
    title: WORD.DELETE,
    content: SENTENCE.DELETE_CONFIRM,
    onOk: () => {
      executeData(deletedWorkTypeRows, 'std/work-types', 'delete').then(
        afterFetchWorkTypeDeleteApi,
      );
    },
  });

const fetchWorkTypesGetApi = () => getData({}, 'std/work-types');

export const PgStdWorkType = () => {
  const title = getPageName();
  const [modalContextStore, setModalContextStore] = useState<IGridPopupProps>(
    displayHiddenWorkTypeBasicModalContext(),
  );
  const [workTypeDatas, setWorkTypeDatas] = React.useState<any[]>([]);
  const workTypeDataGridRef = useRef<Grid>(null);

  const handleAfterApiSuccess = () => {
    setModalContextStore(displayHiddenWorkTypeBasicModalContext());
    message.info(SENTENCE.SAVE_COMPLETE);
    mountWorkTypeDatas();
  };

  const mountWorkTypeDatas = () => {
    fetchWorkTypesGetApi().then(setWorkTypeDatas);
  };

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
            onClick={mountWorkTypeDatas}
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
              onClick={() =>
                deleteWorkTypeConfirm({
                  deletedWorkTypeRows: workTypeDataGridRef.current
                    .getInstance()
                    .getModifiedRows()
                    .updatedRows.map(deletedRow => ({
                      uuid: deletedRow.work_type_uuid,
                      deletedRow,
                    })),
                  afterFetchWorkTypeDeleteApi: handleAfterApiSuccess,
                })
              }
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
                  editWorkTypeBasicModalContext({
                    editWorkTypeModalTitle: title,
                    editWorkTypeDatas: [...workTypeDatas],
                    onAfterFetchWorkTypePutApi: handleAfterApiSuccess,
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
                  addWorkTypeBasicModalContext({
                    addWorkTypeModalTitle: title,
                    onAfterFetchWorkTypePostApi: handleAfterApiSuccess,
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
          ref={workTypeDataGridRef}
          data={[...workTypeDatas]}
          columns={WORK_TYPE_GRID_COLUMNS}
          gridMode={'delete'}
        ></Datagrid>
      </Container>
      {modalContextStore.visible === true ? (
        <GridPopup
          {...modalContextStore.info()}
          onCancel={() => {
            setModalContextStore(displayHiddenWorkTypeBasicModalContext());
          }}
        />
      ) : null}
    </>
  );
};
