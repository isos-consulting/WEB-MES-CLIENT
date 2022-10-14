export type ExcelSample = {
  file_extension: string;
  file_name: string;
  file_type: string;
};

export type SampleUploadableMenu = {
  menu_file_uuid: string;
  menu_nm: string;
  menu_uuid: string;
  menu_uri: string;
};

export type DataGridColumns = {
  header: string;
  name: string;
  format: string;
};

type DataGridDatas = {
  [key: string]: string | number | boolean;
};

export class UserSelectableMenu {
  item: ExcelSample & SampleUploadableMenu;
  selectMenu: Function;

  constructor() {
    this.item = null;
    this.selectMenu = () => {};
  }

  allocateSelectMenu(trigger: Function) {
    this.selectMenu = trigger;
  }

  isSelected() {
    return this.item != null;
  }
}

export class ExcelDataGrid {
  private data: Set<DataGridDatas>;
  setData: Function;

  constructor(data, setter: Function) {
    this.data = data;
    this.setData = setter;
  }

  asList() {
    return Array.from(this.data);
  }

  clear() {
    this.setData(new Set());
  }

  isExcelDataEmpty() {
    return this.data.size === 0;
  }
}
