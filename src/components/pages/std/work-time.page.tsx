import Grid from '@toast-ui/react-grid';
import TuiGrid, { Dictionary } from 'tui-grid';
import { CellValue } from 'tui-grid/types/store/data';
import { message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { Container, Datagrid, GridPopup, Textbox } from '~/components/UI';
import { ColumnStore } from '~/constants/columns';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { executeData, getData, getPageName } from '~/functions';
import { COLOROURS } from '~/styles/palette';
import Header, { Button } from '../adm/excel-upload-type/components/Header';
import { HeaderIncludedModalContext } from '../adm/excel-upload-type/hooks/header-included-modal';
import { FormikProps, FormikValues } from 'formik';
import ComboStore from '~/constants/combos';
import { isNil } from '~/helper/common';

const { confirm } = Modal;
const WORK_TYPE_GRID_COLUMNS = ColumnStore.WORK_TYPE.filter(
  ({ name }) => name === 'work_type_nm',
);
const WORK_TIME_GRID_COLUMNS = ColumnStore.WORK_TIME;

const displayHiddenHeaderIncludedModalContext = () =>
  new HeaderIncludedModalContext<unknown>({
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
    inputProps: [],
  });

const addWorkTimeHeaderIncludedModalContext = ({
  addWorkTimeModalTitle,
  workTypeHeaderFormRef,
  workTypeUuid,
  workTypeName,
  workTimePostApiCallback,
}: {
  addWorkTimeModalTitle: string;
  workTypeHeaderFormRef: React.MutableRefObject<FormikProps<FormikValues>>;
  workTypeUuid: string;
  workTypeName: string;
  workTimePostApiCallback: () => void;
}) =>
  new HeaderIncludedModalContext<unknown>({
    title: addWorkTimeModalTitle,
    columns: [...WORK_TIME_GRID_COLUMNS],
    visible: true,
    gridMode: 'create',
    data: [],
    gridPopupInfo: [],
    gridComboInfo: [{ ...ComboStore.WORK_TIME_TYPE }],
    inputProps: [
      {
        id: '',
        innerRef: workTypeHeaderFormRef,
        inputItems: [
          {
            type: 'text',
            id: 'work_type_uuid',
            label: '',
            default: workTypeUuid,
            disabled: true,
            hidden: true,
          },
          {
            type: 'text',
            id: 'work_type_nm',
            default: workTypeName,
            label: '근무유형',
            disabled: true,
          },
        ],
      },
    ],
    onOk: addedWorkTimeDataGrid => {
      executeData(
        addedWorkTimeDataGrid.current
          .getInstance()
          .getData()
          .map(newWorkTimeData => ({
            ...newWorkTimeData,
            ...workTypeHeaderFormRef.current.values,
          })),
        '/std/worktimes',
        'post',
      ).then(({ success }) => {
        if (success) {
          workTimePostApiCallback();
        }
      });
    },
  });
const editWorkTimeHeaderIncludedModalContext = ({
  editWorkTimeModalTitle,
  editWOrkTimeDatas,
  workTypeHeaderFormRef,
  workTypeUuid,
  workTypeName,
  workTimePutApiCallback,
}: {
  editWorkTimeModalTitle: string;
  editWOrkTimeDatas: unknown[];
  workTypeHeaderFormRef: React.MutableRefObject<FormikProps<FormikValues>>;
  workTypeUuid: string;
  workTypeName: string;
  workTimePutApiCallback: () => void;
}) =>
  new HeaderIncludedModalContext<unknown>({
    title: editWorkTimeModalTitle,
    columns: [...WORK_TIME_GRID_COLUMNS],
    visible: true,
    gridMode: 'update',
    data: editWOrkTimeDatas,
    gridPopupInfo: [],
    gridComboInfo: [{ ...ComboStore.WORK_TIME_TYPE }],
    inputProps: [
      {
        id: '',
        innerRef: workTypeHeaderFormRef,
        inputItems: [
          {
            type: 'text',
            id: 'work_type_uuid',
            label: '',
            default: workTypeUuid,
            disabled: true,
            hidden: true,
          },
          {
            type: 'text',
            id: 'work_type_nm',
            default: workTypeName,
            label: '근무유형',
            disabled: true,
          },
        ],
      },
    ],
    onOk: addedWorkTimeDataGrid => {
      executeData(
        addedWorkTimeDataGrid.current
          .getInstance()
          .getModifiedRows()
          .updatedRows.map(updatedWorkTimeData => ({
            ...updatedWorkTimeData,
            ...workTypeHeaderFormRef.current.values,
            uuid: updatedWorkTimeData.worktime_uuid,
          })),
        '/std/worktimes',
        'put',
      ).then(({ success }) => {
        if (success) {
          workTimePutApiCallback();
        }
      });
    },
  });

type DeletedWorkTimeParameters = {
  uuid: string;
};

const deleteWorkTimeConfirmDialogContext = ({
  deletedWorkTimeDatas,
  workTimeDeleteApiCallback,
}: {
  deletedWorkTimeDatas: DeletedWorkTimeParameters[];
  workTimeDeleteApiCallback: () => void;
}) =>
  confirm({
    icon: null,
    title: WORD.DELETE,
    content: SENTENCE.DELETE_CONFIRM,
    onOk: () => {
      executeData(deletedWorkTimeDatas, 'std/worktimes', 'delete').then(
        workTimeDeleteApiCallback,
      );
    },
  });

const fetchWorkTypeDataGetApi = ({ use_fg }: { use_fg: boolean }) =>
  getData({ use_fg }, 'std/work-types');
const fetchWorkTimeDataGetApi = ({ work_type_uuid }: Dictionary<CellValue>) =>
  getData({ work_type_uuid }, 'std/worktimes');

export const PgStdWorkTime = () => {
  const title = getPageName();
  const [workTimeModalContext, setWorkTimeModalContext] = useState(
    displayHiddenHeaderIncludedModalContext(),
  );
  const [workTypeDatas, setWorkTypeData] = useState([]);
  const [workTimeDatas, setWorkTimeData] = useState([]);
  const [userSelectedWorkTypeData, setUserSelectedWorkTypeData] = useState<
    Dictionary<CellValue>
  >({});
  const workTimeDataGridRef = useRef<Grid>(null);
  const wotkTimeModalHeaderRef = useRef(null);

  const showDeleteWorkTimeConfirmDialog = () => {
    const { updatedRows } = workTimeDataGridRef.current
      .getInstance()
      .getModifiedRows();

    if (updatedRows.length === 0) {
      message.warn(SENTENCE.NO_DELETE_ITEMS);
      return;
    }

    deleteWorkTimeConfirmDialogContext({
      deletedWorkTimeDatas: updatedRows.map<DeletedWorkTimeParameters>(row => ({
        uuid: isNil(row.worktime_uuid) ? '' : (row.worktime_uuid as string),
      })),
      workTimeDeleteApiCallback: () =>
        afterWorkTimeApiSuccess(procedureAtAfterWorkTimeDeleteApiCall),
    });
  };

  const showEditWorkTimeModal = () => {
    const { work_type_uuid, work_type_nm } = userSelectedWorkTypeData;

    if (isNil(work_type_uuid)) {
      message.warn(SENTENCE.NO_SELECTED_WORK_TYPE);
      return;
    }

    setWorkTimeModalContext(
      editWorkTimeHeaderIncludedModalContext({
        editWorkTimeModalTitle: title,
        editWOrkTimeDatas: [
          ...workTimeDataGridRef.current.getInstance().getData(),
        ],
        workTypeHeaderFormRef: wotkTimeModalHeaderRef,
        workTypeUuid: work_type_uuid as string,
        workTypeName: work_type_nm as string,
        workTimePutApiCallback: () =>
          afterWorkTimeApiSuccess(procedureAtAfterWorkTimeSaveApiCall),
      }),
    );
  };

  const showAddWorkTimeModal = () => {
    const { work_type_uuid, work_type_nm } = userSelectedWorkTypeData;

    if (isNil(work_type_uuid)) {
      message.warn(SENTENCE.NO_SELECTED_WORK_TYPE);
      return;
    }

    setWorkTimeModalContext(
      addWorkTimeHeaderIncludedModalContext({
        addWorkTimeModalTitle: title,
        workTypeHeaderFormRef: wotkTimeModalHeaderRef,
        workTypeUuid: work_type_uuid as string,
        workTypeName: work_type_nm as string,
        workTimePostApiCallback: () =>
          afterWorkTimeApiSuccess(procedureAtAfterWorkTimeSaveApiCall),
      }),
    );
  };

  const afterWorkTimeApiSuccess = (
    afterworkTimeApiCallbackSuccess: Function,
  ) => {
    afterworkTimeApiCallbackSuccess();
    searchWorkTimesRelatedWithWorkType({ ...userSelectedWorkTypeData });
  };

  const procedureAtAfterWorkTimeSaveApiCall = () => {
    setWorkTimeModalContext(displayHiddenHeaderIncludedModalContext());
    message.info(SENTENCE.SAVE_COMPLETE);
  };

  const procedureAtAfterWorkTimeDeleteApiCall = () => {
    message.info(SENTENCE.SAVE_COMPLETE);
  };

  const searchUsedWorkTypeDatas = () =>
    fetchWorkTypeDataGetApi({ use_fg: true }).then(setWorkTypeData);

  const searchWorkTimesRelatedWithWorkType = (
    userSelectedWorkType: Dictionary<CellValue>,
  ) => fetchWorkTimeDataGetApi(userSelectedWorkType).then(setWorkTimeData);

  useEffect(() => {
    if (Object.keys(userSelectedWorkTypeData).length === 0) return;

    searchWorkTimesRelatedWithWorkType({ ...userSelectedWorkTypeData });
  }, [userSelectedWorkTypeData]);

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
            onClick={searchUsedWorkTypeDatas}
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
              onClick={showDeleteWorkTimeConfirmDialog}
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
              onClick={showEditWorkTimeModal}
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
              onClick={showAddWorkTimeModal}
            >
              {SENTENCE.ADD_RECORD}
            </Button>
          </Header.FlexBox>
        </Header.FlexBox>
      </Header>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%', marginRight: '10px' }}>
          <Container>
            <Datagrid
              gridId="workTypeDataGrid"
              ref={workTimeDataGridRef}
              data={[...workTypeDatas]}
              columns={[...WORK_TYPE_GRID_COLUMNS]}
              gridMode={'delete'}
              disabledAutoDateColumn={true}
              height={document.getElementById('main-body')?.clientHeight}
              onClick={({
                rowKey,
                instance,
              }: {
                rowKey: number;
                instance: TuiGrid;
              }) => {
                if (isNil(rowKey)) return;

                setUserSelectedWorkTypeData(instance.getRowAt(rowKey));
              }}
            />
          </Container>
        </div>
        <div style={{ width: '70%' }}>
          <Container>
            <Textbox
              label="선택한 근무유형"
              value={userSelectedWorkTypeData.work_type_nm}
              readOnly={true}
            />
            <Datagrid
              gridId="workTimeDataGrid"
              ref={workTimeDataGridRef}
              data={[...workTimeDatas]}
              height={document.getElementById('main-body')?.clientHeight}
              columns={[...WORK_TIME_GRID_COLUMNS]}
              gridMode={'delete'}
            />
          </Container>
        </div>
      </div>
      {workTimeModalContext.visible === true && (
        <GridPopup
          {...workTimeModalContext.info()}
          onCancel={() => {
            setWorkTimeModalContext(displayHiddenHeaderIncludedModalContext());
          }}
        />
      )}
    </>
  );
};
