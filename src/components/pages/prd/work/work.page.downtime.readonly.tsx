import Grid from '@toast-ui/react-grid';
import { Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { Container, Datagrid } from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import { getData } from '~/functions';
import { TAB_CODE } from './work.page.util';

/** 생산관리 - 비가동관리 */
export const useReadonlyDownTimeManagement = () => {
  const [_, contextHolder] = Modal.useModal();
  const [searchParams, setSearchParams] = useState({});
  const [saveOptionParams, setSaveOptionParams] = useState({});

  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  const gridInfo: IDatagridProps = {
    gridId: TAB_CODE.workDowntime + '_GRID' + '_POPUP_GRID',
    ref: gridRef,
    height: 400,
    gridMode: 'delete',
    saveUriPath: '/prd/work-downtimes',
    searchUriPath: '/prd/work-downtimes',
    columns: [
      {
        header: '생산부적합UUID',
        name: 'work_downtime_uuid',
        alias: 'uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '비가동 유형UUID',
        name: 'downtime_type_uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '비가동 유형',
        name: 'downtime_type_nm',
        width: 120,
        hidden: false,
        format: 'text',
      },
      {
        header: '비가동UUID',
        name: 'downtime_uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '비가동',
        name: 'downtime_nm',
        width: 120,
        hidden: false,
        format: 'text',
      },
      {
        header: '시작일자',
        name: 'start_date',
        width: 100,
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
        header: '종료일자',
        name: 'end_date',
        width: 100,
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
      {
        header: '비가동 시간',
        name: 'downtime',
        width: 100,
        hidden: true,
        format: 'time',
      },
      {
        header: '비고',
        name: 'remark',
        width: 150,
        hidden: false,
        format: 'text',
        editable: true,
      },
    ],
    data: data,
    rowAddPopupInfo: {
      columnNames: [
        { original: 'downtime_uuid', popup: 'downtime_uuid' },
        { original: 'downtime_nm', popup: 'downtime_nm' },
        { original: 'downtime_type_uuid', popup: 'downtime_type_uuid' },
        { original: 'downtime_type_nm', popup: 'downtime_type_nm' },
      ],
      columns: [
        {
          header: '비가동UUID',
          name: 'downtime_uuid',
          width: 200,
          hidden: true,
          format: 'text',
        },
        {
          header: '비가동 유형UUID',
          name: 'downtime_type_uuid',
          width: 200,
          hidden: true,
          format: 'text',
        },
        {
          header: '비가동 유형',
          name: 'downtime_type_nm',
          width: 150,
          hidden: false,
          format: 'text',
        },
        {
          header: '비가동명',
          name: 'downtime_nm',
          width: 150,
          hidden: false,
          format: 'text',
        },
      ],
      dataApiSettings: {
        uriPath: '/std/downtimes',
        params: {},
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
