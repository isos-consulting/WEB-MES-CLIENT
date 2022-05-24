import { IButtonProps, IDatagridProps, IGridColumn, IGridPopupInfo, IModalProps } from "~/components/UI";
import { IInputGroupboxItem } from "~/components/UI/input-groupbox";
import { ENUM_WIDTH, URL_PATH_AUT } from "~/enums";

export const menuGridColumns: IGridColumn[] = [
  {header: "메뉴UUID", name: "menu_uuid", alias: "uuid", width: ENUM_WIDTH.M, filter: "text", hidden: true},
  {header: "메뉴레벨", name: "lv", width: ENUM_WIDTH.M, filter: "text", hidden: true},
  {header: "메뉴명", name: "menu_nm", width: ENUM_WIDTH.L, filter: "text", editable: true, requiredField: true},
  {header: "메뉴유형UUID", name: "menu_type_uuid", width: ENUM_WIDTH.L, filter: "text", editable: true, hidden: true},
  {header: "메뉴유형", name: "menu_type_nm", width: ENUM_WIDTH.L, format: "combo", filter: "text", editable: true},
  {header: "메뉴URL", name: "menu_uri", width: ENUM_WIDTH.L, filter: "text", editable: true, requiredField: true},
  {header: "컴포넌트명", name: "component_nm", width: ENUM_WIDTH.L, filter: "text", editable: true},
  {header: "아이콘", name: "icon", width: ENUM_WIDTH.L, filter: "text", editable: true},
  {header: "사용", name: "use_fg", width: ENUM_WIDTH.S, format: "check", editable: true, requiredField: true},
];

const menuGridComboCodeColName = {original: "menu_type_uuid", popup: "menu_type_uuid"};
const menuGridComboTextColName = {original: "menu_type_nm", popup: "menu_type_nm" };

const gridComboColumnNames = [
  {codeColName: menuGridComboCodeColName, textColName: menuGridComboTextColName}
];
const gridCoboDataApiSettings = {uriPath: URL_PATH_AUT.MENU_TYPE.GET.MENU_TYPES, params: {}};

const menuGridTreeColumnOptions = {name: "menu_nm", useIcon: true, useCascadingCheckbox: true};

const menuGridComboInfo = [
  {columnNames: gridComboColumnNames, dataApiSettings: gridCoboDataApiSettings}
];

export const menuGridOptions = {treeColumnOptions: menuGridTreeColumnOptions, gridComboInfo: menuGridComboInfo};

const menuGridRowColumnNames = [
  {original:'parent_uuid', popup:'menu_uuid'},
  {original:'parent_nm', popup:'menu_nm'}
  {original:'parent_lv', popup:'lv'}
];
const menuGridRowAddPopupInfo:IGridPopupInfo = {gridMode: 'select', columnNames:menuGridRowColumnNames};
const menuGridSettings:IDatagridProps= {gridId: '', columns: [], rowAddPopupInfo: menuGridRowAddPopupInfo};
const menuGridPopupButtonSettings = {datagridSettings: menuGridSettings};

const menuGridRowColumnNames2 = [
  {original:'uuid', popup:'menu_uuid'},
  {original:'menu_nm_edit', popup:'menu_nm'}
];
const menuGridRowAddPopupInfo2:IGridPopupInfo = {gridMode: 'select', columnNames:menuGridRowColumnNames2};
const menuGridSettings2:IDatagridProps= {gridId: '', columns: [], rowAddPopupInfo: menuGridRowAddPopupInfo2};
const menuGridPopupButtonSettings2 = {datagridSettings: menuGridSettings2};

const menuUsedRadios = [
  {code: true, disabled: false, text: '사용'},
  {code: false, disabled: false, text: '미사용'}
];
export const menuInputGroupBoxs: IInputGroupboxItem[] = [
  {type: "text", id: "parent_nm", label: "상위메뉴 이름", usePopup: true, popupKey: "메뉴관리", popupKeys: ["parent_uuid", "parent_nm"], popupButtonSettings: menuGridPopupButtonSettings},
  {type: "text", id: "parent_uuid", label: "parent_uuid*", disabled: true, hidden: true},
  {type: "text", id: "menu_nm_edit", label: "메뉴 이름*", usePopup: true, popupKey: "메뉴관리", popupKeys: ["uuid", "menu_nm_edit", "use_fg", "component_nm", "menu_uri","menu_type_uuid"], popupButtonSettings: menuGridPopupButtonSettings2},
  {type: "text", id: "uuid", label: "uuid*", disabled: true, hidden: true},
  {type: "text", id: "menu_nm", label: "신규메뉴 이름", disabled: false},
  {type: "text", id: "sortby", label: "정렬순서*"},
  {type: "radio", id: "use_fg", label: "사용유무", options: menuUsedRadios, default: true},
  {type: "combo", id: "menu_type_uuid", label: "메뉴유형", dataSettingOptions:{ codeName:'menu_type_uuid', textName:'menu_type_nm', uriPath: URL_PATH_AUT.MENU_TYPE.GET.MENU_TYPES, params: {store_type: 'all'}}},
  {type: "text", id: "menu_type_uuid", label: "menu_type_uuid", disabled: false, hidden: true},
  {type: "text", id: "menu_uri", label: "메뉴 URI"},
  {type: "text", id: "component_nm", label: "컴포넌트 이름"},
];

export const menuSearchButtonProps: IButtonProps = {btnType: "buttonFill", widthSize: "medium", heightSize: "small", fontSize: "small", ImageType: "search", colorType: "basic", disabled: false, onClick: null};

export const detailModalButtonProps: IButtonProps = {btnType: "buttonFill", widthSize: "large", heightSize: "small", fontSize: "small", colorType: "basic", onClick: null, disabled: false};

export const detailModalProps: IModalProps = {title: "메뉴 관리", okText: null, cancelText: null, maskClosable: false, visible: false, onCancel: null, onOk: null, width: "60%"};
export const messages = {
  wargning: {post: {prefix: '메뉴를 생성 하시려면', surfix: '을 입력하세요!'}, put: {prefix: '메뉴를 수정 하시려면', surfix: '을 입력하세요!'}, delete: {prefix: '', surfix: ''} },
  confirm: {post: '생성', put: '수정', delete: '삭제'},
  complete: "메뉴 적용은 재시작이 필요합니다."
};