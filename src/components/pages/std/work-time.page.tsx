import Grid from '@toast-ui/react-grid';
import { message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import {
  Container,
  Datagrid,
  GridInstanceReference,
  GridPopup,
} from '~/components/UI';
import { ColumnStore } from '~/constants/columns';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { executeData, getData, getPageName } from '~/functions';
import { COLOROURS } from '~/styles/palette';
import Header, { Button } from '../adm/excel-upload-type/components/Header';
import BasicModalContext from '../adm/excel-upload-type/hooks/modal';

const { confirm } = Modal;
const WORK_TIME_GRID_COLUMNS = ColumnStore.WORK_TIME;

const displayHiddenBasicModalContext = () =>
  new BasicModalContext<unknown>({
    title: '숨김',
    columns: [],
    visible: false,
    gridMode: 'view',
    data: [],
    gridPopupInfo: [],
    gridComboInfo: [],
    onOk: () => {
      // do nothing
    },
  });

const addWorkTimeBasicModalContext = ({
  addWorkTimeModalTitle,
  workTimePostApiCallback,
}: {
  addWorkTimeModalTitle: string;
  workTimePostApiCallback: () => void;
}) =>
  BasicModalContext.add<unknown>({
    title: addWorkTimeModalTitle,
    columns: [...WORK_TIME_GRID_COLUMNS],
    gridPopupInfo: [],
    gridComboInfo: [
      {
        columnNames: [
          {
            codeColName: {
              original: 'work_type_uuid',
              popup: 'work_type_uuid',
            },
            textColName: { original: 'work_type_nm', popup: 'work_type_nm' },
          },
        ],
        dataApiSettings: {
          uriPath: '/std/work-types',
          params: {},
        },
      },
      {
        columnNames: [
          {
            codeColName: {
              original: 'worktime_type_uuid',
              popup: 'worktime_type_uuid',
            },
            textColName: {
              original: 'worktime_type_nm',
              popup: 'worktime_type_nm',
            },
          },
        ],
        dataApiSettings: {
          uriPath: '/std/worktime-types',
          params: {},
        },
      },
    ],
    onOk: (workTimeGridRef: GridInstanceReference<Grid>) => {
      executeData(
        [...workTimeGridRef.current.getInstance().getData()],
        '/std/worktimes',
        'post',
      ).then(({ success }) => {
        if (success) {
          workTimePostApiCallback();
        }
      });
    },
  });

const editWorkTimeBasicModalContext = ({
  editWorkTimeModalTitle,
  editWOrkTimeDatas,
  workTimePutApiCallback,
}: {
  editWorkTimeModalTitle: string;
  editWOrkTimeDatas: unknown[];
  workTimePutApiCallback: () => void;
}) =>
  BasicModalContext.edit<unknown>({
    title: editWorkTimeModalTitle,
    columns: [...WORK_TIME_GRID_COLUMNS],
    data: editWOrkTimeDatas,
    gridPopupInfo: [],
    gridComboInfo: [
      {
        columnNames: [
          {
            codeColName: {
              original: 'work_type_uuid',
              popup: 'work_type_uuid',
            },
            textColName: { original: 'work_type_nm', popup: 'work_type_nm' },
          },
        ],
        dataApiSettings: {
          uriPath: '/std/work-types',
          params: {},
        },
      },
      {
        columnNames: [
          {
            codeColName: {
              original: 'worktime_type_uuid',
              popup: 'worktime_type_uuid',
            },
            textColName: {
              original: 'worktime_type_nm',
              popup: 'worktime_type_nm',
            },
          },
        ],
        dataApiSettings: {
          uriPath: '/std/worktime-types',
          params: {},
        },
      },
    ],
    onOk: (workTimeGridRef: GridInstanceReference<Grid>) => {
      executeData(
        [
          ...workTimeGridRef.current
            .getInstance()
            .getModifiedRows()
            .updatedRows.map(updatedRow => ({
              ...updatedRow,
              uuid: updatedRow.worktime_uuid,
            })),
        ],
        '/std/worktimes',
        'put',
      ).then(({ success }) => {
        if (success) {
          workTimePutApiCallback();
        }
      });
    },
  });

const deleteWorkTimeBasicModalContext = ({
  deletedWorkTimeRows,
  workTimeDeleteApiCallback,
}: {
  deletedWorkTimeRows: unknown[];
  workTimeDeleteApiCallback: () => void;
}) =>
  confirm({
    icon: null,
    title: WORD.DELETE,
    content: SENTENCE.DELETE_CONFIRM,
    onOk: () => {
      executeData(
        deletedWorkTimeRows,
        'std/worktimes',
        'delete',
      ).then(workTimeDeleteApiCallback);
    },
  });

export const PgStdWorkTime = () => {
  const title = getPageName();
  const [basicModalContext, setBasicModalContext] = useState(
    displayHiddenBasicModalContext(),
  );
  const [workTimeDatas, setworkTimeData] = useState([]);
  const workTimeDataGridRef = useRef<Grid>(null);

  const afterWorkTimeApiSuccess = (
    afterworkTimeApiCallbackSuccess: Function,
  ) => {
    afterworkTimeApiCallbackSuccess();
  };

  const procedureAtAfterWorkTimeSaveApiCall = () => {
    setBasicModalContext(displayHiddenBasicModalContext());
    message.info(SENTENCE.SAVE_COMPLETE);
    getData({}, '/std/worktimes').then(setworkTimeData);
  };

  const procedureAtAfterWorkTimeDeleteApiCall = () => {
    setBasicModalContext(displayHiddenBasicModalContext());
    message.info(SENTENCE.SAVE_COMPLETE);
    getData({}, '/std/worktimes').then(setworkTimeData);
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
            onClick={() => {
              getData({}, 'std/worktimes').then(setworkTimeData);
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
                deleteWorkTimeBasicModalContext({deletedWorkTimeRows: workTimeDataGridRef.current
                  .getInstance()
                  .getModifiedRows()
                  .updatedRows.map(deletedRow => ({
                    ...deletedRow,
                    uuid: deletedRow.worktime_uuid,
                  })), 
                  workTimeDeleteApiCallback: () => afterWorkTimeApiSuccess(procedureAtAfterWorkTimeDeleteApiCall);
              })}}
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
                setBasicModalContext(
                  editWorkTimeBasicModalContext({
                    editWorkTimeModalTitle: title,
                    editWOrkTimeDatas: [...workTimeDatas],
                    workTimePutApiCallback: () =>
                      afterWorkTimeApiSuccess(
                        procedureAtAfterWorkTimeSaveApiCall,
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
                setBasicModalContext(
                  addWorkTimeBasicModalContext({
                    addWorkTimeModalTitle: title,
                    workTimePostApiCallback: () =>
                      afterWorkTimeApiSuccess(
                        procedureAtAfterWorkTimeSaveApiCall,
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
          ref={workTimeDataGridRef}
          data={[...workTimeDatas]}
          columns={[...WORK_TIME_GRID_COLUMNS]}
          gridMode={'delete'}
        />
      </Container>
      {basicModalContext.visible === true ? (
        <GridPopup
          {...basicModalContext.info()}
          onCancel={() => {
            setBasicModalContext(displayHiddenBasicModalContext());
          }}
        />
      ) : null}
    </>
  );
};
