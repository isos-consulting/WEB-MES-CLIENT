import Grid from '@toast-ui/react-grid';
import { Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { Container, Datagrid } from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import { getData } from '~/functions';
import { TAB_CODE } from './work.page.util';

/** 투입인원관리 */
export const useReadonlyWorkInjectManagement = () => {
  const [, contextHolder] = Modal.useModal();
  const [searchParams, setSearchParams] = useState({});
  const [saveOptionParams, setSaveOptionParams] = useState({});

  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  const gridInfo: IDatagridProps = {
    gridId: TAB_CODE.workWorker + '_GRID' + '_POPUP_GRID',
    ref: gridRef,
    height: 400,
    gridMode: 'delete',
    saveUriPath: '/prd/work-workers',
    searchUriPath: '/prd/work-workers',
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
    ],
    data: data,
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

  const component = (
    <>
      <Container boxShadow={false}>
        <Datagrid {...gridInfo} height={420} />
      </Container>

      {contextHolder}
    </>
  );

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
