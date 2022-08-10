import IModalProps from '../modal/modal.ui.type';
import IDatagridProps from '../datagrid-new/datagrid.ui.type';
import ISearchboxProps from '../searchbox/searchbox.ui.type';
import {
  IGridColumn,
  IGridPopupInfo,
  IGridComboInfo,
  TGridMode,
  IGridModifiedRows,
} from '../datagrid-new/datagrid.ui.type';
import { IGridPopupProps } from '../popup-datagrid';
import { IInputGroupboxProps } from '../input-groupbox';

/** 팝업 속성 인터페이스 */
export default interface IPopupModalInfo extends IGridPopupProps {}

/** 기타 팝업 옵션 속성 인터페이스 */
export interface IPopupOptionType {
  /** 엑셀 업로드 이벤트 */
  onExcelUpload?: (ev) => void;
}

/** 팝업 템플릿 함수의 반환 유형 인터페이스 */
export interface IPopupItemsRetrunProps {
  /** 모달 속성 */
  modalProps?: IModalProps;

  /** 검색박스 속성 */
  searchProps?: ISearchboxProps;

  /** 입력 컴포넌트 그룹 속성 */
  inputGroupProps?: IInputGroupboxProps;

  /** 데이터 그리드 속성 */
  datagridProps?: IDatagridProps; //IDatagridProps;

  /** 서버 조회 엔드포인트 */
  uriPath?: string;

  /** 서버 조회 조건 */
  params?: object;

  /** 부모 그리드 아이디 */
  parentGridId?: string;

  onInterlock?: () => boolean;
}

/** 함수로 가공이 필요할시 사용될 옵션 인터페이스 */
export interface IPopupItemOptionProps {
  id?: string;
  parentGridId?: string;
  title?: string;
  columns?: IGridColumn[];
  gridPopupInfo?: IGridPopupInfo[];
  gridComboInfo?: IGridComboInfo[];
  editMode?: boolean;
  gridMode?: TGridMode;
  uriPath?: string;
  params?: object;
  appendSubUrl?: string;
  appendSelectMode?: boolean;
}

export type TPopupList = IPopupModalInfo[];
export type TPopupType = 'grid' | 'any';

/**
 * 그리드 액션 이벤트 속성 인터페이스
 */
export interface IPopupActionEvents {
  onSave?: (
    id: string,
    modifyRows?: IGridModifiedRows,
    queryParameter?: object,
  ) => void;
  onSelectMultiRow?: () => void;
  onSelectRow?: () => void;
  onMultiSelectPopup?: () => void;
  onSelectGetRow?: () => void;
  onCancel?: () => void;
  onSaveCancel?: (id: string) => void;
}
