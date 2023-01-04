import React from 'react';
import { GridPopup } from '~/components/UI';

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
  popupFooter,
}) => {
  return (
    <GridPopup
      popupId={`${gridId}_POPUP`}
      defaultVisible={false}
      title={`${title}`}
      visible={visible}
      okText="저장하기"
      cancelText="취소"
      onAfterOk={(isSuccess, savedData) => {
        onAfterApiExecuted(isSuccess, savedData);
      }}
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
      footer={popupFooter}
    />
  );
};
