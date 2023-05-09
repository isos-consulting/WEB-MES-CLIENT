import Grid from '@toast-ui/react-grid';
import { message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { Container, Datagrid, GridPopup } from '~/components/UI';
import { ColumnStore } from '~/constants/columns';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { executeData, getData, getPageName } from '~/functions';
import { COLOROURS } from '~/styles/palette';
import Header, { Button } from '../adm/excel-upload-type/components/Header';
import BasicModalContext, {
  BasicGridPopupProps,
} from '../adm/excel-upload-type/hooks/modal';

const { confirm } = Modal;
const WORK_TIME_TYPE_GRID_COLUMNS = ColumnStore.WORK_TIME_TYPE;

const displayHiddenBasicModalContext = () =>
  new BasicModalContext<unknown>({
    title: '',
    columns: [...WORK_TIME_TYPE_GRID_COLUMNS],
    visible: false,
    gridMode: 'view',
    data: [],
    gridPopupInfo: [],
    gridComboInfo: [],
    onOk: () => {
      // this function intentionally left blank
    },
  });

const addWorkTimeTypeBasicModalContext = ({
  addWorkTypeBasicModalTitle,
  workTimeTypePostApiCallback,
}: {
  addWorkTypeBasicModalTitle: string;
  workTimeTypePostApiCallback: () => void;
}) =>
  BasicModalContext.add({
    ...displayHiddenBasicModalContext(),
    title: addWorkTypeBasicModalTitle,
    onOk: okEvent => {
      const gridRef = okEvent as unknown as React.MutableRefObject<Grid>;
      executeData(
        [...gridRef.current.getInstance().getModifiedRows().createdRows],
        '/std/worktime-types',
        'post',
      ).then(({ success }) => {
        if (success) {
          workTimeTypePostApiCallback();
        }
      });
    },
  });

const editWorkTimeTypeBasicModalContext = ({
  editWorkTimeTypeModalTitle,
  editWorkTimeTypeModalDatas,
  workTimeTypePutApiCallback,
}: {
  editWorkTimeTypeModalTitle: string;
  editWorkTimeTypeModalDatas: unknown[];
  workTimeTypePutApiCallback: () => void;
}) =>
  BasicModalContext.edit({
    ...displayHiddenBasicModalContext(),
    title: editWorkTimeTypeModalTitle,
    data: editWorkTimeTypeModalDatas,
    onOk: okEvent => {
      const gridRef = okEvent as unknown as React.MutableRefObject<Grid>;

      executeData(
        gridRef.current
          .getInstance()
          .getModifiedRows()
          .updatedRows.map(updatedRow => ({
            uuid: updatedRow.worktime_type_uuid,
            ...updatedRow,
          })),
        'std/worktime-types',
        'put',
      ).then(({ success }) => {
        if (success) {
          workTimeTypePutApiCallback();
        }
      });
    },
  });

const deleteWorkTimeTypeConfirm = ({
  deletedWorkTimeTypeRows,
  procedureAfterSuccessWorkTimeTypeDeleteApi,
}: {
  deletedWorkTimeTypeRows: unknown[];
  procedureAfterSuccessWorkTimeTypeDeleteApi: () => void;
}) => {
  confirm({
    icon: null,
    title: WORD.DELETE,
    content: SENTENCE.DELETE_CONFIRM,
    onOk: () => {
      executeData(deletedWorkTimeTypeRows, 'std/worktime-types', 'delete').then(
        procedureAfterSuccessWorkTimeTypeDeleteApi,
      );
    },
  });
};

const fetchWorkTimeTypesGetApi = () => getData({}, 'std/worktime-types');

export const PgStdWorkTimeType = () => {
  const title = getPageName();
  const [modalContextStore, setModalContextStore] =
    useState<BasicGridPopupProps>(displayHiddenBasicModalContext);
  const [workTimeTypeDatas, setWorkTimeTypeDatas] = React.useState<any[]>([]);
  const workTimeTypeDataGridRef = useRef<Grid>(null);

  const afterWorkTimeTypeApiSuccess = (afterCallbackFunction: Function) => {
    afterCallbackFunction();
  };

  const procedureAtAfterWorkTimeTypeSaveApiCall = () => {
    setModalContextStore(displayHiddenBasicModalContext);
    message.info(SENTENCE.SAVE_COMPLETE);
    fetchWorkTimeTypesGetApi().then(setWorkTimeTypeDatas);
  };

  const procedureAtAfterWorkTimeTypeDeleteApiCall = () => {
    message.info(SENTENCE.SAVE_COMPLETE);
    fetchWorkTimeTypesGetApi().then(setWorkTimeTypeDatas);
  };

  const searchWorkTypeDatas = () =>
    fetchWorkTimeTypesGetApi().then(setWorkTimeTypeDatas);

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
            onClick={() => {
              afterWorkTimeTypeApiSuccess(searchWorkTypeDatas);
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
              onClick={() => {
                deleteWorkTimeTypeConfirm({
                  deletedWorkTimeTypeRows: workTimeTypeDataGridRef.current
                    .getInstance()
                    .getModifiedRows()
                    .updatedRows.map(deletedRow => ({
                      uuid: deletedRow.worktime_type_uuid,
                      deletedRow,
                    })),
                  procedureAfterSuccessWorkTimeTypeDeleteApi: () =>
                    afterWorkTimeTypeApiSuccess(
                      procedureAtAfterWorkTimeTypeDeleteApiCall,
                    ),
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
                  editWorkTimeTypeBasicModalContext({
                    editWorkTimeTypeModalTitle: title,
                    editWorkTimeTypeModalDatas: [...workTimeTypeDatas],
                    workTimeTypePutApiCallback: () =>
                      afterWorkTimeTypeApiSuccess(
                        procedureAtAfterWorkTimeTypeSaveApiCall,
                      ),
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
                  addWorkTimeTypeBasicModalContext({
                    addWorkTypeBasicModalTitle: title,
                    workTimeTypePostApiCallback: () =>
                      afterWorkTimeTypeApiSuccess(
                        procedureAtAfterWorkTimeTypeSaveApiCall,
                      ),
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
          gridId="workTimeTypeDataGrid"
          ref={workTimeTypeDataGridRef}
          data={[...workTimeTypeDatas]}
          columns={WORK_TIME_TYPE_GRID_COLUMNS}
          gridMode={'delete'}
        ></Datagrid>
      </Container>
      {modalContextStore.visible === true ? (
        <GridPopup
          {...modalContextStore.info()}
          onCancel={() => {
            setModalContextStore(displayHiddenBasicModalContext);
          }}
        />
      ) : null}
    </>
  );
};
