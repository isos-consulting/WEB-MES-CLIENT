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
  {original:'upper_menu_uuid', popup:'menu_uuid'},
  {original:'upper_menu_nm', popup:'menu_nm'}
];
const menuGridRowAddPopupInfo:IGridPopupInfo = {gridMode: 'select', columnNames:menuGridRowColumnNames};

const menuGridSettings:IDatagridProps= {gridId: '', columns: [], rowAddPopupInfo: menuGridRowAddPopupInfo};

const menuGridPopupButtonSettings = {datagridSettings: menuGridSettings};


export const menuInputGroupBoxs: IInputGroupboxItem[] = [
  {type: "text", id: "menu_uuid", alias: "uuid", label: "메뉴UUID", usePopup: true, popupKey: "메뉴관리", popupKeys: ["menu_uuid", "menu_nm"]},
  {type: "text", id: "lv", label: "메뉴레벨", disabled: true, hidden: true},
  {type: "text", id: "upper_menu_nm", label: "상위 메뉴", usePopup: true, popupKey: "메뉴관리", popupKeys: ["upper_menu_uuid", "upper_menu_nm"], popupButtonSettings: menuGridPopupButtonSettings},
  {type: "text", id: "menu_nm", label: "메뉴명"},
  {type: "text", id: "menu_type_uuid", label: "메뉴유형UUID", disabled: true, hidden: true},
  {type: "text", id: "menu_type_nm", label: "메뉴유형"},
  {type: "text", id: "menu_uri", label: "메뉴URL"},
  {type: "text", id: "component_nm", label: "컴포넌트명"},
  {type: "text", id: "icon", label: "아이콘"},
];

export const menuSearchButtonProps: IButtonProps = {btnType: "buttonFill", widthSize: "medium", heightSize: "small", fontSize: "small", ImageType: "search", colorType: "basic", disabled: false, onClick: null};

export const detailModalButtonProps: IButtonProps = {btnType: "buttonFill", widthSize: "large", heightSize: "small", fontSize: "small", colorType: "basic", onClick: null, disabled: false};

export const detailModalProps: IModalProps = {title: "메뉴 관리", okText: null, cancelText: null, maskClosable: false, visible: false, onCancel: null, onOk: null, width: "80%"};