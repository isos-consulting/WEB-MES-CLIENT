import Grid from '@toast-ui/react-grid';
import React, { useState, useRef, useLayoutEffect } from 'react';
import { Container, Datagrid, IGridColumn } from '~/components/UI';
import { ENUM_WIDTH } from '~/enums';

/**
 * 공정순서(라우팅) 스토어
 */
export const workRoutingStore = () => {
  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});

  useLayoutEffect(() => {
    if (data?.lenght > 0) setSelectedRow(data[0]);
  }, [data]);

  const infos = {
    uriPath: '/prd/work-routings',
  };

  return {
    data,
    setData,
    selectedRow,
    setSelectedRow,
    gridRef,
    ...infos,
  };
};

/**
 * 라우팅 정보 컴포넌트
 */
export const RoutingInfo = ({
  permissions,
  gridRef,
  data,
  selectedRow,
  setSelectedRow,
  height,
}) => {
  const columns: IGridColumn[] = [
    {
      header: '공정순서UUID',
      name: 'work_routing_uuid',
      alias: 'uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '생산실적UUID',
      name: 'work_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '공정UUID',
      name: 'proc_uuid',
      width: 200,
      hidden: true,
      format: 'text',
    },
    {
      header: '공정순서',
      name: 'proc_no',
      width: ENUM_WIDTH.S,
      format: 'text',
    },
    { header: '공정', name: 'proc_nm', width: ENUM_WIDTH.XL, format: 'text' },
    //** 아래는 숨김 */
    {
      header: '작업장UUID',
      name: 'workings_uuid',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '작업장코드',
      name: 'workings_cd',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '작업장',
      name: 'workings_nm',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '설비UUID',
      name: 'equip_uuid',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '설비코드',
      name: 'equip_cd',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '설비',
      name: 'equip_nm',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '금형UUID',
      name: 'mold_uuid',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '금형코드',
      name: 'mold_cd',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '금형',
      name: 'mold_nm',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '금형Cavity',
      name: 'mold_cavity',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '시작일자',
      name: 'start_date',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '종료일자',
      name: 'end_date',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '작업시간',
      name: 'work_time',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '생산중인 공정 여부',
      name: 'ongoing_fg',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
    {
      header: '비고',
      name: 'remark',
      width: ENUM_WIDTH.M,
      format: 'text',
      hidden: true,
    },
  ];

  const gridProps = {
    disabledAutoDateColumn: true,
    gridId: 'WORK_ROUTING_GRID',
    ref: gridRef,
    gridMode: 'view',
    columns: columns,
    data: data,
  };

  const onAfterClick = ev => {
    const { rowKey, instance } = ev;
    const rawData = instance.store.data.rawData;
    const row = rawData?.find(row => row?.rowKey === rowKey);

    setSelectedRow(row);
  };

  return (
    <Container>
      <Datagrid
        {...gridProps}
        columns={columns}
        data={data}
        height={height}
        onAfterClick={onAfterClick}
      />
    </Container>
  );
};
