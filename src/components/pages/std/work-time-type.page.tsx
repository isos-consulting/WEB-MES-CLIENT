import Grid from '@toast-ui/react-grid';
import { message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import {
  Container,
  Datagrid,
  GridInstanceReference,
  GridPopup,
  IGridColumn,
  IGridPopupProps,
} from '~/components/UI';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { executeData, getData, getPageName } from '~/functions';
import { COLOROURS } from '~/styles/palette';
import Header, { Button } from '../adm/excel-upload-type/components/Header';
import BasicModalContext from '../adm/excel-upload-type/hooks/modal';

const { confirm } = Modal;

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
    onOk: (workTimeTypeAddGridRef: GridInstanceReference<Grid>) => {
      executeData(
        [
          ...workTimeTypeAddGridRef.current.getInstance().getModifiedRows()
            .createdRows,
        ],
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
    onOk: (workTimeTypeEditGridRef: GridInstanceReference<Grid>) => {
      executeData(
        workTimeTypeEditGridRef.current
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
  const [modalContextStore, setModalContextStore] = useState<IGridPopupProps>(
    displayHiddenBasicModalContext,
  );
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

const WORK_TIME_TYPE_GRID_COLUMNS: IGridColumn[] = [
  {
    header: '',
    name: 'worktime_type_uuid',
    hidden: true,
  },
  {
    header: '근무시간유형코드',
    name: 'worktime_type_cd',
    format: 'text',
    editable: true,
    requiredField: true,
  },
  {
    header: '근무시간유형명',
    name: 'worktime_type_nm',
    format: 'text',
    editable: true,
    requiredField: true,
  },
];
