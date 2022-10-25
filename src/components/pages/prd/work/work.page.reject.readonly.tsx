import Grid from '@toast-ui/react-grid';
import { Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { Container, Datagrid } from '~/components/UI';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import { getData } from '~/functions';
import { TAB_CODE } from './work.page.util';
import { ENUM_DECIMAL } from '~/enums';

/** 생산관리 - 부적합관리 */
export const REJECTREADONLY = () => {
  //#region 🔶공용 설정
  const [contextHolder] = Modal.useModal();
  const [searchParams, setSearchParams] = useState({});
  const [saveOptionParams, setSaveOptionParams] = useState({});
  const [rowAddedParams, setRowAddedParams] = useState({});
  //#endregion

  //#region 🔶부적합 그리드 관련
  const gridRef = useRef<Grid>();
  const [data, setData] = useState([]);

  /** 비가동 그리드 속성 */
  const gridInfo: IDatagridProps = {
    /** 그리드 아이디 */
    gridId: TAB_CODE.workReject + '_GRID' + '_POPUP_GRID',
    /** 참조 */
    ref: gridRef,
    /** 그리드 높이 */
    height: 400,
    /** 그리드 모드 */
    gridMode: 'delete',
    /** 저장 END POINT */
    saveUriPath: '/prd/work-rejects',
    /** 조회 END POINT */
    searchUriPath: '/prd/work-rejects',
    /** 컬럼 */
    columns: [
      {
        header: '생산부적합UUID',
        name: 'work_reject_uuid',
        alias: 'uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '부적합UUID',
        name: 'reject_uuid',
        width: 200,
        hidden: true,
        format: 'text',
        requiredField: true,
      },
      {
        header: '부적합 유형',
        name: 'reject_type_nm',
        width: 120,
        format: 'text',
      },
      {
        header: '부적합명',
        name: 'reject_nm',
        width: 120,
        format: 'text',
        requiredField: true,
      },
      {
        header: '수량',
        name: 'qty',
        width: 100,
        format: 'number',
        decimal: ENUM_DECIMAL.DEC_STCOK,
        editable: true,
        requiredField: true,
      },
      {
        header: '입고 창고UUID',
        name: 'to_store_uuid',
        width: 200,
        hidden: true,
        format: 'text',
        requiredField: true,
      },
      {
        header: '입고 창고',
        name: 'to_store_nm',
        width: 120,
        format: 'combo',
        editable: true,
        requiredField: true,
      },
      {
        header: '입고 위치UUID',
        name: 'to_location_uuid',
        width: 200,
        hidden: true,
        format: 'text',
      },
      {
        header: '입고 위치',
        name: 'to_location_nm',
        width: 120,
        format: 'combo',
        editable: true,
      },
      {
        header: '비고',
        name: 'remark',
        width: 150,
        format: 'text',
        editable: true,
      },
    ],
    /** 그리드 데이터 */
    data: data,
    gridComboInfo: [
      {
        //입고창고 콤보박스
        columnNames: [
          {
            codeColName: { original: 'to_store_uuid', popup: 'store_uuid' },
            textColName: { original: 'to_store_nm', popup: 'store_nm' },
          },
        ],
        dataApiSettings: {
          uriPath: '/std/stores',
          params: {
            store_type: 'reject',
          },
        },
      },
      {
        //입고위치 콤보박스
        columnNames: [
          {
            codeColName: {
              original: 'to_location_uuid',
              popup: 'location_uuid',
            },
            textColName: { original: 'to_location_nm', popup: 'location_nm' },
          },
        ],
        dataApiSettings: {
          uriPath: '/std/locations',
          params: {
            //store_uuid
          },
        },
      },
    ],
    /** 행추가팝업 */
    rowAddPopupInfo: {
      columnNames: [
        { original: 'reject_uuid', popup: 'reject_uuid' },
        { original: 'reject_nm', popup: 'reject_nm' },
        { original: 'reject_type_nm', popup: 'reject_type_nm' },
      ],
      columns: [
        {
          header: '부적합UUID',
          name: 'reject_uuid',
          width: 200,
          hidden: true,
          format: 'text',
        },
        {
          header: '부적합 유형',
          name: 'reject_type_nm',
          width: 150,
          hidden: false,
          format: 'text',
        },
        {
          header: '부적합명',
          name: 'reject_nm',
          width: 150,
          hidden: false,
          format: 'text',
        },
      ],
      dataApiSettings: {
        uriPath: '/std/proc-rejects',
        params: { ...rowAddedParams },
      },
      gridMode: 'multi-select',
    },
  };
  //#endregion

  //#region 🔶함수
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

  //#region 🔶렌더부
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
    setRowAddedParams,

    onSearch,

    SEARCH_URI_PATH: gridInfo.searchUriPath,
  };
};
