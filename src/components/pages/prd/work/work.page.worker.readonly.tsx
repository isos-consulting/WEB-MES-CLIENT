import Grid from '@toast-ui/react-grid';
import { Modal } from 'antd';
import _ from 'lodash';
import React, { useRef, useState } from 'react';
import { Container, Datagrid } from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import { getData } from '~/functions';
import { TAB_CODE } from './work.page.util';

//#region 🔶✅투입인원관리
/** 투입인원관리 */
export const WORKERREADONLY = () => {
  //#region 🔶공용 설정
  const [, contextHolder] = Modal.useModal();
  const [searchParams, setSearchParams] = useState({});
  const [saveOptionParams, setSaveOptionParams] = useState({});
  //#endregion

  //#region 🔶투입인원 그리드 관련
  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  /** 투입인원 그리드 속성 */
  const gridInfo: IDatagridProps = {
    /** 그리드 아이디 */
    gridId: TAB_CODE.workWorker + '_GRID' + '_POPUP_GRID',
    /** 참조 */
    ref: gridRef,
    /** 그리드 높이 */
    height: 400,
    /** 그리드 모드 */
    gridMode: 'delete',
    /** 저장 END POINT */
    saveUriPath: '/prd/work-workers',
    /** 조회 END POINT */
    searchUriPath: '/prd/work-workers',
    /** 컬럼 */
    columns: [
      {
        header: '작업자투입UUID',
        name: 'work_worker_uuid',
        alias: 'uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '작업자UUID',
        name: 'emp_uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '작업자',
        name: 'emp_nm',
        width: 100,
        hidden: false,
        format: 'text',
      },
      {
        header: '시작일시',
        name: 'start_date',
        width: 120,
        hidden: false,
        format: 'date',
        editable: true,
      },
      {
        header: '시작시간',
        name: 'start_time',
        width: 100,
        hidden: false,
        format: 'time',
        editable: true,
      },
      {
        header: '종료일시',
        name: 'end_date',
        width: 120,
        hidden: false,
        format: 'date',
        editable: true,
      },
      {
        header: '종료시간',
        name: 'end_time',
        width: 100,
        hidden: false,
        format: 'time',
        editable: true,
      },
      // {header:'작업시간', name:'work_time', width:100, hidden:false, format:'time', editable:true},
    ],
    /** 그리드 데이터 */
    data: data,
    /** 행추가팝업 */
    rowAddPopupInfo: {
      columnNames: [
        { original: 'emp_uuid', popup: 'emp_uuid' },
        { original: 'emp_nm', popup: 'emp_nm' },
      ],
      columns: [
        {
          header: '작업자UUID',
          name: 'emp_uuid',
          width: 200,
          hidden: true,
          format: 'text',
        },
        {
          header: '작업자명',
          name: 'emp_nm',
          width: 120,
          hidden: false,
          format: 'text',
        },
        {
          header: '부서',
          name: 'dept_nm',
          width: 200,
          hidden: false,
          format: 'text',
        },
        {
          header: '직급',
          name: 'grade_nm',
          width: 120,
          hidden: false,
          format: 'text',
        },
      ],
      dataApiSettings: {
        uriPath: '/std/emps',
        params: { worker_fg: true, emp_status: 'incumbent' },
      },
      gridMode: 'multi-select',
    },
  };
  //#endregion

  //#region ✅함수
  const onSearch = () => {
    const work_uuid = searchParams?.['work_uuid'];
    const work_routing_uuid = searchParams?.['work_routing_uuid'];
    getData(
      {
        work_uuid,
        work_routing_uuid,
      },
      gridInfo.searchUriPath,
      undefined,
      undefined,
      undefined,
      undefined,
      { disabledZeroMessage: true },
    ).then(res => {
      setData(res);
    });
  };

  //#region ✅렌더부
  const component = (
    <>
      <Container boxShadow={false}>
        <Datagrid {...gridInfo} height={420} />
      </Container>

      {contextHolder}
    </>
  );
  //#endregion

  return {
    component,

    gridRef,
    gridMode: gridInfo.gridMode,

    data,
    setData,

    searchParams,
    setSearchParams,

    saveOptionParams,
    setSaveOptionParams,

    onSearch,

    SEARCH_URI_PATH: gridInfo.searchUriPath,
  };
};
//#endregion
