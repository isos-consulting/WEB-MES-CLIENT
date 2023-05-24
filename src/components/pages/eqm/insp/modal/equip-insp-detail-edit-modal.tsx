import Grid from '@toast-ui/react-grid';
import { message } from 'antd';
import React from 'react';
import { GridPopup } from '~/components/UI';
import { EquipmentInspectReportGetResponseEntity } from '~/v2/api/model/EquipmentInspectReportDTO';
import { MESSAGE } from '~/v2/core/Message';
import { GridInstance } from '~/v2/core/ToastGrid';
import { EquipmentInspectReportService } from '~/v2/service/EquipmentInspectReportService';

export const EquipInspDetailEditModal = ({
  gridId,
  title,
  visible,
  onAfterApiExecuted,
  onCancel,
  modalRef,
  parentGridRef,
  gridMode,
  defaultData,
  columns,
  searchUriPath,
  searchParams,
  saveUriPath,
  saveParams,
  searchProps,
  inputProps,
  gridComboInfo,
  gridPopupInfo,
  rowAddPopupInfo,
}) => {
  return (
    <GridPopup
      popupId={`${gridId}_POPUP`}
      defaultVisible={false}
      title={`${title}`}
      visible={visible}
      okText="저장하기"
      cancelText="취소"
      disabledAutoDateColumn={true}
      onCancel={onCancel}
      ref={modalRef}
      parentGridRef={parentGridRef}
      gridId={gridId}
      gridMode={gridMode}
      defaultData={defaultData}
      columns={columns}
      saveType={'headerInclude'}
      searchUriPath={searchUriPath}
      searchParams={searchParams}
      saveUriPath={saveUriPath}
      saveParams={saveParams}
      searchProps={searchProps}
      inputProps={inputProps}
      gridComboInfo={gridComboInfo}
      gridPopupInfo={gridPopupInfo}
      rowAddPopupInfo={rowAddPopupInfo}
      onOk={(clickEvent: React.MouseEvent<HTMLElement>) => {
        const instance = (
          clickEvent as unknown as React.MutableRefObject<Grid>
        ).current.getInstance();

        EquipmentInspectReportService.getInstance()
          .updateWithHeaderDetail(
            instance as GridInstance,
            inputProps.innerRef.current
              .values as EquipmentInspectReportGetResponseEntity,
          )
          .then(_ => {
            message.success(MESSAGE.EQUIPMENT_INSPECT_REPORT_UPDATE_SUCCESS);
            onAfterApiExecuted(true, {});
          })
          .catch((error: unknown) => {
            console.error(error);
            message.error(error.toString());
          });
      }}
    />
  );
};
