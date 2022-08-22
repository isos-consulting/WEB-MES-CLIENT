import React, { useState } from 'react';
import { Container, Datagrid, GridPopup, IGridColumn } from '~/components/UI';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { getData, getPageName } from '~/functions';
import { COLOROURS } from '~/styles/palette';
import Header, { Button } from '../adm/excel-upload-type/components/Header';
import BasicModalContext from '../adm/excel-upload-type/hooks/modal';

const workTimeGridColumns: IGridColumn[] = [
  {
    header: '근무UUID',
    name: 'worktime_uuid',
    hidden: true,
  },
  {
    header: '근무코드',
    name: 'worktime_cd',
    editable: true,
    requiredField: true,
  },
  {
    header: '근무명',
    name: 'worktime_nm',
    editable: true,
    requiredField: true,
  },
  {
    header: '근무시간UUID',
    name: 'worktime_type_uuid',
    requiredField: true,
    hidden: true,
  },
  {
    header: '근무시간코드',
    name: 'worktime_type_cd',
    requiredField: true,
    hidden: true,
  },
  {
    header: '근무시간',
    name: 'worktime_type_nm',
    format: 'combo',
    editable: true,
    requiredField: true,
  },
  {
    header: '근무유형UUID',
    name: 'work_type_uuid',
    requiredField: true,
    hidden: true,
  },
  {
    header: '근무유형코드',
    name: 'work_type_cd',
    requiredField: true,
    hidden: true,
  },
  {
    header: '근무유형',
    name: 'work_type_nm',
    format: 'combo',
    editable: true,
    requiredField: true,
  },
  {
    header: '사용유무',
    name: 'use_fg',
    format: 'check',
    editable: true,
    requiredField: true,
  },
  {
    header: '휴게유무',
    name: 'break_time_fg',
    format: 'check',
    editable: true,
    requiredField: true,
  },
  {
    header: '시작시간',
    name: 'start_time',
    format: 'time',
    editable: true,
    requiredField: true,
  },
  {
    header: '종료시간',
    name: 'end_time',
    format: 'time',
    editable: true,
    requiredField: true,
  },
];

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

const addWorkTimeBasicModalContext = (addWorkTimeModalTitle: string) =>
  BasicModalContext.add<unknown>({
    title: addWorkTimeModalTitle,
    columns: [...workTimeGridColumns],
    gridPopupInfo: [],
    gridComboInfo: [],
    onOk: () => {
      // 신규항목추가 저장 버튼을 클릭했을 때 동작할 코드를 여기에 작성합니다.
    },
  });

export const PgStdWorkTime = () => {
  const title = getPageName();
  const [basicModalContext, setBasicModalContext] = useState(
    displayHiddenBasicModalContext(),
  );
  const [workTimeDatas, setworkTimeData] = useState([]);

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
              // 조회 버튼을 클릭했을 때 동작할 코드를 여기에 작성합니다.
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
                // 삭제 버튼을 클릭했을 때 동작할 코드를 여기에 작성합니다.
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
                // 수정 버튼을 클릭했을 때 동작할 코드를 여기에 작성합니다.
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
                // 추가 버튼을 클릭했을 때 동작할 코드를 여기에 작성합니다.
                console.log(addWorkTimeBasicModalContext(title));
              }}
            >
              {SENTENCE.ADD_RECORD}
            </Button>
          </Header.FlexBox>
        </Header.FlexBox>
      </Header>
      <Container>
        <Datagrid
          ref={null}
          data={[...workTimeDatas]}
          columns={[...workTimeGridColumns]}
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
