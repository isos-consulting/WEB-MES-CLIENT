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
