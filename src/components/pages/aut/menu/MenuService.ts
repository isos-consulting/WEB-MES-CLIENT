import { IDatagridProps } from "~/components/UI";
import { getData } from "~/functions";

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

class MenuService {
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
      .then((res) => {
        data = res;
      })
      .finally(() => {
        let menuDatas: TMenuData[] = [];
        data.map((el) => {
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
  }

  afterCloseMenuModal = (): void => {
    this.modalHook(false);
  }
}

export default MenuService;
