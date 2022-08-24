import Grid from '@toast-ui/react-grid';
import TuiGrid, { Dictionary } from 'tui-grid';
import { CellValue } from 'tui-grid/types/store/data';
import { message, Modal } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { Container, Datagrid, GridPopup } from '~/components/UI';
import { ColumnStore } from '~/constants/columns';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { executeData, getData, getPageName } from '~/functions';
import { COLOROURS } from '~/styles/palette';
import Header, { Button } from '../adm/excel-upload-type/components/Header';
import { HeaderIncludedModalContext } from '../adm/excel-upload-type/hooks/header-included-modal';
import { FormikProps, FormikValues } from 'formik';
import ComboStore from '~/constants/combos';

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
  workTypeHeaderFormRef,
  workTypeUuid,
  workTypeName,
}: {
  workTypeHeaderFormRef: React.Ref<FormikProps<FormikValues>>;
  workTypeUuid: string;
  workTypeName: string;
}) =>
  new HeaderIncludedModalContext<unknown>({
    title: '추가',
    columns: [...WORK_TIME_GRID_COLUMNS],
    visible: true,
    gridMode: 'create',
    data: [],
    gridPopupInfo: [],
    gridComboInfo: [{ ...ComboStore.WORK_TIME_TYPE }],
    onOk: () => {
      console.log(workTypeHeaderFormRef);
    },
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
      executeData(deletedWorkTimeRows, 'std/worktimes', 'delete').then(
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
  const [basicModalContext, setBasicModalContext] = useState(
    displayHiddenHeaderIncludedModalContext(),
  );
  const [workTypeDatas, setWorkTypeData] = useState([]);
  const [workTimeDatas, setWorkTimeData] = useState([]);
  const [userSelectedWorkTypeData, setUserSelectedWorkTypeData] = useState<
    Dictionary<CellValue>
  >({});
  const workTimeDataGridRef = useRef<Grid>(null);
  const wotkTimeModalHeaderRef = useRef(null);

  const afterWorkTimeApiSuccess = (
    afterworkTimeApiCallbackSuccess: Function,
  ) => {
    afterworkTimeApiCallbackSuccess();
  };

  const procedureAtAfterWorkTimeSaveApiCall = () => {
    setBasicModalContext(displayHiddenHeaderIncludedModalContext());
    message.info(SENTENCE.SAVE_COMPLETE);
    getData({}, '/std/worktimes').then(setWorkTimeData);
  };

  const procedureAtAfterWorkTimeDeleteApiCall = () => {
    message.info(SENTENCE.SAVE_COMPLETE);
    getData({}, '/std/worktimes').then(setWorkTimeData);
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
              onClick={() => {
                deleteWorkTimeBasicModalContext({
                  deletedWorkTimeRows: workTimeDataGridRef.current
                    .getInstance()
                    .getModifiedRows()
                    .updatedRows.map(({ worktime_uuid }) => ({
                      uuid: worktime_uuid,
                    })),
                  workTimeDeleteApiCallback: () =>
                    afterWorkTimeApiSuccess(
                      procedureAtAfterWorkTimeDeleteApiCall,
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
                // setBasicModalContext(
                // );
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
                const { work_type_uuid, work_type_nm } =
                  userSelectedWorkTypeData;

                if (work_type_uuid == null) return;

                setBasicModalContext(
                  addWorkTimeHeaderIncludedModalContext({
                    workTypeHeaderFormRef: wotkTimeModalHeaderRef,
                    workTypeUuid: work_type_uuid,
                    workTypeName: work_type_nm,
                  }),
                );
              }}
            >
              {SENTENCE.ADD_RECORD}
            </Button>
          </Header.FlexBox>
        </Header.FlexBox>
      </Header>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '30%' }}>
          <Container>
            <Datagrid
              ref={workTimeDataGridRef}
              data={[...workTypeDatas]}
              columns={[...WORK_TYPE_GRID_COLUMNS]}
              gridMode={'delete'}
              disabledAutoDateColumn={true}
              onClick={({
                rowKey,
                instance,
              }: {
                rowKey: number;
                instance: TuiGrid;
              }) => {
                if (rowKey == null) return;

                setUserSelectedWorkTypeData(instance.getRowAt(rowKey));
              }}
            />
          </Container>
        </div>
        <div style={{ width: '70%' }}>
          <Container>
            <Datagrid
              ref={workTimeDataGridRef}
              data={[...workTimeDatas]}
              columns={[...WORK_TIME_GRID_COLUMNS]}
              gridMode={'delete'}
            />
          </Container>
        </div>
      </div>
      {basicModalContext.visible === true ? (
        <GridPopup
          {...basicModalContext.info()}
          onCancel={() => {
            setBasicModalContext(displayHiddenHeaderIncludedModalContext());
          }}
        />
      ) : null}
    </>
  );
};
