import { message } from 'antd';
import IDatagridProps from '~/components/UI/datagrid-new/datagrid.ui.type';
import { getData } from '~/functions';
import { isEmpty } from '~/helper/common';

type TGridAttributes = {
  expanded?: boolean;
  disabled?: boolean;
};

type TMenuData = {
  component_nm?: string;
  icon?: string;
  lv?: number;
  menu_nm?: string;
  menu_type_nm?: string;
  menu_type_uuid?: string;
  menu_uri?: string;
  menu_uuid?: string;
  sortby?: string;
  use_fg?: boolean;
  created_at?: string;
  created_nm?: string;
  updated_at?: string;
  updated_nm?: string;
  _attributes?: TGridAttributes;
  _children?: TMenuData[];
};

type TGetMenuData = {
  lv?: number;
  menu_nm?: string;
  menu_type_nm?: string;
  menu_type_uuid?: string;
  menu_uri?: string;
  menu_uuid?: string;
  sortby?: string;
  use_fg?: boolean;
};

const MenuService = class {
  private searchUriPath: string;
  private grid: any;
  private modalHook: any;

  constructor(searchUriPath: string, grid: any, modalHook: any) {
    this.searchUriPath = searchUriPath;
    this.grid = grid;
    this.modalHook = modalHook;
  }
  searchMenuList = (): void => {
    const searchParams = {};
    let data = [];

    getData<TGetMenuData[]>(searchParams, this.searchUriPath)
      .then(res => {
        data = res;
      })
      .finally(() => {
        let menuDatas: TMenuData[] = [];
        data.forEach(el => {
          if (el.lv == 1) {
            menuDatas.push({
              ...el,
              _attributes: {
                expanded: true,
              },
              _children: [],
            });
          } else if (el.lv == 2) {
            menuDatas[menuDatas.length - 1]._children.push({
              ...el,
              _attributes: {
                expanded: true,
              },
              _children: el.component_nm ? null : [],
            });
          } else if (el.lv == 3) {
            menuDatas[menuDatas.length - 1]?._children[
              menuDatas[menuDatas.length - 1]?._children?.length - 1
            ]?._children?.push({
              ...el,
              _attributes: {
                expanded: false,
              },
              _children: null,
            });
          }
        });
        this.grid.setGridData(menuDatas);
      });
  };

  getGridProps = (): IDatagridProps => {
    return {
      ref: this.grid.gridRef,
      ...this.grid.gridInfo,
    };
  };

  openMenuModal = (): void => {
    this.modalHook(true);
  };

  afterCloseMenuModal = (): void => {
    this.modalHook(false);
  };

  isNewRecord = ({ uuid }) => {
    return isEmpty(uuid);
  };

  isDeleteRecord = ({ parent_uuid, sortby }) => {
    return isEmpty(parent_uuid) && isEmpty(sortby);
  };

  inValidError = text => {
    message.warning(text);
    return false;
  };

  newRecordValid = ({ parent_uuid, menu_nm, menu_uri }, { prefix, suffix }) => {
    return isEmpty(parent_uuid)
      ? this.inValidError(`${prefix} [상위메뉴 이름]${suffix}`)
      : isEmpty(menu_nm)
      ? this.inValidError(`${prefix} [신규메뉴 이름]${suffix}`)
      : isEmpty(menu_uri)
      ? this.inValidError(`${prefix} [메뉴 URI]${suffix}`)
      : true;
  };

  deleteRecordValid = _record => {
    console.log('메뉴 삭제에 대한 유효성 검사는 아직 없습니다');
    return true;
  };

  updateRecordValid = (
    { parent_uuid, menu_nm, menu_uri },
    { prefix, suffix },
  ) => {
    return isEmpty(parent_uuid)
      ? this.inValidError(`${prefix} [상위메뉴 이름]${suffix}`)
      : isEmpty(menu_nm)
      ? this.inValidError(`${prefix} [신규메뉴 이름]${suffix}`)
      : isEmpty(menu_uri)
      ? this.inValidError(`${prefix} [메뉴 URI]${suffix}`)
      : true;
  };
};

export default MenuService;
