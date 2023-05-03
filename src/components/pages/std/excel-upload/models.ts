import { isNil } from '~/helper/common';

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

export type DataGridDatas = {
  [key: string]: string | number | boolean | Array<unknown>;
};

export class UserSelectableMenu {
  item: ExcelSample & SampleUploadableMenu;
  selectMenu: Function;

  constructor() {
    this.item = null;
    this.selectMenu = () => {
      // This is intentional
    };
  }

  allocateSelectMenu(trigger: Function) {
    this.selectMenu = trigger;
  }

  isSelected() {
    return !isNil(this.item);
  }
}

export class ExcelDataGrid {
  private data: Set<DataGridDatas>;
  private setter: Function;

  constructor(data, setter: Function) {
    this.data = data;
    this.setter = setter;
  }

  setData(data: DataGridDatas[]) {
    this.setter(new Set(data));
  }

  asList() {
    return Array.from(this.data);
  }

  clear() {
    this.setter(new Set());
  }

  isExcelDataEmpty() {
    return this.data.size === 0;
  }

  private hasValidate() {
    return Array.from(this.data).every(data => data.hasOwnProperty('error'));
  }

  isValidate() {
    if (this.data.size === 0) {
      return false;
    }

    if (this.hasValidate() === false) {
      return false;
    }

    return Array.from(this.data).every(({ error }) => {
      if (error instanceof Array) {
        return error.length === 0;
      } else {
        throw new Error(
          '엑셀 업로드 데이터 유효성 검사 API 반환 형식이 잘못되었습니다.',
        );
      }
    });
  }
}
