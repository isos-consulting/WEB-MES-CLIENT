import React from 'react';
import { Container, Datagrid } from '~/components/UI';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { COLOROURS } from '~/styles/palette';
import Header, { Button } from '../adm/excel-upload-type/components/Header';

export const PgStdWorkTime = () => {
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
          data={[]}
          columns={[
            {
              header: '근무유형',
              name: 'work_type_code',
            },
            {
              header: '체크박스1',
              name: 'work_start_flag',
            },
            {
              header: '시작시간',
              name: 'work_start_time',
            },
            {
              header: '종료시간',
              name: 'work_term_time',
            },
          ]}
          gridMode={'delete'}
        ></Datagrid>
      </Container>
    </>
  );
};
