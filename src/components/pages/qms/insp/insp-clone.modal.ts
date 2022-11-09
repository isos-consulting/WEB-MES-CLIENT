import { COLUMN_CODE, EDIT_ACTION_CODE } from '~/components/UI';
import { getData } from '~/functions';

export const inspCloneModalInfo = () => {
  return {
    title: '기준서 복사',
    width: '80%',
    icon: null,
    okText: '선택',
    cancelText: '취소',
    maskClosable: false,
  };
};

export const inspCloneData = async inspHeaderData => {
  if (inspHeaderData.length > 0) {
    return await (
      await getData({}, `qms/insp/${inspHeaderData[0].insp_uuid}/details`)
    ).map(cloneData => ({
      ...cloneData,
      [COLUMN_CODE.EDIT]: EDIT_ACTION_CODE.CREATE,
    }));
  }

  return [];
};

export const isInspTypeCodeNotAllocated = inspTypeCode => inspTypeCode == null;
export const isProdUuidNotAllocated = prodUuid => prodUuid == null;
