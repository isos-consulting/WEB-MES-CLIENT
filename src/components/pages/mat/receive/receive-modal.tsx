import React from 'react';
import { Datagrid, Modal } from '~/components/UI';
import { ENUM_DECIMAL, ENUM_WIDTH } from '~/enums';
import { MatReceiveModalService } from '~/service/mat/ReceiveService';
import { MatReceiveEditableForm } from './receive-editable-form';
import { MatReceiveGridInterfaceButtonGroup } from './receive-grid-button-group';

const gridPopupInfo = [
  {
    // 창고팝업
    columnNames: [
      { original: 'to_store_uuid', popup: 'store_uuid' },
      { original: 'to_store_cd', popup: 'store_cd' },
      { original: 'to_store_nm', popup: 'store_nm' },
    ],
    columns: [
      {
        header: '창고UUID',
        name: 'store_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '창고코드',
        name: 'store_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '창고명',
        name: 'store_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    dataApiSettings: ev => {
      const { rowKey, instance } = ev;
      const { rawData } = instance?.store?.data;

      return {
        uriPath: '/std/stores',
        params: { store_type: 'available' },
        onAfterOk: () => {
          rawData[rowKey].to_location_uuid = '';
          rawData[rowKey].to_location_nm = '';
        },
      };
    },
    gridMode: 'select',
  },
  {
    // 위치팝업
    columnNames: [
      { original: 'to_location_uuid', popup: 'location_uuid' },
      { original: 'to_location_cd', popup: 'location_cd' },
      { original: 'to_location_nm', popup: 'location_nm' },
    ],
    columns: [
      {
        header: '위치UUID',
        name: 'location_uuid',
        width: ENUM_WIDTH.L,
        filter: 'text',
        hidden: true,
      },
      {
        header: '위치코드',
        name: 'location_cd',
        width: ENUM_WIDTH.M,
        filter: 'text',
      },
      {
        header: '위치명',
        name: 'location_nm',
        width: ENUM_WIDTH.L,
        filter: 'text',
      },
    ],
    dataApiSettings: ev => {
      const { rowKey, instance } = ev;
      const { rawData } = instance?.store?.data;

      const storeUuid = rawData[rowKey]?.to_store_uuid;
      return {
        uriPath: '/std/locations',
        params: { store_uuid: storeUuid ?? undefined },
      };
    },
    gridMode: 'select',
  },
];

export const MatReceiveModal = ({
  modalService,
}: {
  modalService: MatReceiveModalService;
}) => {
  const columns = [
    {
      header: '세부입하UUID',
      name: 'receive_detail_uuid',
      alias: 'uuid',
      hidden: true,
    },
    {
      header: '입하UUID',
      name: 'receive_uuid',
      hidden: true,
    },
    {
      header: '발주UUID',
      name: 'order_detail_uuid',
      hidden: true,
    },
    {
      header: '입고UUID',
      name: 'income_uuid',
      hidden: true,
    },
    {
      header: '품목UUID',
      name: 'prod_uuid',
      hidden: true,
      requiredField: true,
    },
    {
      header: '품목유형',
      width: ENUM_WIDTH.M,
      name: 'item_type_nm',
      filter: 'text',
      format: 'popup',
      align: 'center',
      editable: false,
    },
    {
      header: '제품유형',
      width: ENUM_WIDTH.M,
      name: 'prod_type_nm',
      filter: 'text',
      format: 'popup',
      align: 'center',
      editable: false,
    },
    {
      header: '품번',
      width: ENUM_WIDTH.M,
      name: 'prod_no',
      filter: 'text',
      format: 'popup',
      requiredField: true,
      editable: false,
    },
    {
      header: '품명',
      width: ENUM_WIDTH.L,
      name: 'prod_nm',
      filter: 'text',
      format: 'popup',
      requiredField: true,
      editable: false,
    },
    {
      header: '모델',
      width: ENUM_WIDTH.M,
      name: 'model_nm',
      filter: 'text',
      format: 'popup',
      editable: false,
    },
    {
      header: 'Rev',
      width: ENUM_WIDTH.S,
      name: 'rev',
      filter: 'text',
      format: 'popup',
      editable: false,
    },
    {
      header: '규격',
      width: ENUM_WIDTH.L,
      name: 'prod_std',
      filter: 'text',
      format: 'popup',
      editable: false,
    },
    {
      header: '안전재고',
      width: ENUM_WIDTH.S,
      name: 'safe_stock',
      format: 'popup',
      editable: false,
    },
    {
      header: '단위UUID',
      name: 'unit_uuid',
      format: 'popup',
      editable: true,
      hidden: true,
      requiredField: true,
    },
    {
      header: '단위',
      width: ENUM_WIDTH.XS,
      name: 'unit_nm',
      filter: 'text',
      format: 'popup',
      editable: false,
      requiredField: true,
    },
    {
      header: 'LOT NO',
      width: ENUM_WIDTH.M,
      name: 'lot_no',
      filter: 'text',
      editable: true,
      requiredField: true,
      defaultValue: modalService.formValues.reg_date.replaceAll('-', ''),
    },
    {
      header: '화폐단위UUID',
      name: 'money_unit_uuid',
      hidden: true,
      format: 'popup',
      editable: true,
      requiredField: true,
    },
    {
      header: '화폐단위',
      width: ENUM_WIDTH.M,
      name: 'money_unit_nm',
      filter: 'text',
      format: 'popup',
      editable: false,
      requiredField: true,
    },
    {
      header: '단가',
      width: ENUM_WIDTH.S,
      name: 'price',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_PRICE,
      editable: true,
      requiredField: true,
    },
    {
      header: '환율',
      width: ENUM_WIDTH.S,
      name: 'exchange',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_PRICE,
      editable: true,
      requiredField: true,
    },
    {
      header: '수량',
      width: ENUM_WIDTH.S,
      name: 'qty',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
      editable: true,
      requiredField: true,
    },
    {
      header: '수입검사',
      width: ENUM_WIDTH.S,
      name: 'insp_fg',
      format: 'check',
      editable: false,
      requiredField: true,
    },
    {
      header: '이월',
      width: ENUM_WIDTH.S,
      name: 'carry_fg',
      format: 'check',
      editable: true,
      requiredField: true,
    },
    {
      header: '입고창고UUID',
      name: 'to_store_uuid',
      hidden: true,
      format: 'popup',
      editable: true,
      requiredField: true,
    },
    {
      header: '입고창고',
      width: ENUM_WIDTH.M,
      name: 'to_store_nm',
      filter: 'text',
      format: 'popup',
      editable: true,
      requiredField: true,
    },
    {
      header: '입고위치UUID',
      name: 'to_location_uuid',
      hidden: true,
      format: 'popup',
      editable: true,
    },
    {
      header: '입고위치',
      width: ENUM_WIDTH.M,
      name: 'to_location_nm',
      filter: 'text',
      format: 'popup',
      editable: true,
    },
    {
      header: '단위수량',
      width: ENUM_WIDTH.M,
      name: 'unit_qty',
      format: 'number',
      decimal: ENUM_DECIMAL.DEC_STCOK,
      editable: true,
    },
    {
      header: '비고',
      width: ENUM_WIDTH.XL,
      name: 'remark',
      editable: true,
    },
  ];

  const memorizedDatagrid = React.useMemo(
    () => (
      <Datagrid
        ref={modalService.modalDatagridRef}
        columns={columns}
        gridMode="create"
        gridPopupInfo={gridPopupInfo}
      />
    ),
    [modalService.modalVisible],
  );

  return (
    <Modal
      title={modalService.modalTitle}
      visible={modalService.modalVisible}
      okText="저장하기"
      onCancel={() => {
        modalService.close();
      }}
    >
      <MatReceiveEditableForm service={modalService} />
      <MatReceiveGridInterfaceButtonGroup service={modalService} />
      {memorizedDatagrid}
      <Modal
        title={modalService.subModalTitle}
        visible={modalService.subModalVisible}
        okText="선택"
        onOk={modalService.selectSubModal}
        onCancel={modalService.closeSubModal}
      >
        <Datagrid
          ref={modalService.subModalDatagridRef}
          columns={modalService.subModalDatagridColumns}
          data={modalService.subModalDatagridDatas}
          gridMode="multi-select"
        />
      </Modal>
    </Modal>
  );
};
