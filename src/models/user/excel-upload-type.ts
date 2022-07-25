export interface ExcelUploadTypeProps {
  uuid: string;
  menu_uuid: string;
  menu_nm: string;
  excel_form_cd: string;
  excel_form_nm: string;
  excel_form_column_nm: string;
  excel_form_column_cd: string;
  excel_form_type: string;
  column_fg: boolean;
  sortby: number;
  created_at: string;
  created_nm: string;
  updated_at: string;
  updated_nm: string;
}

class ExcelUploadType {
  private readonly uuid: string;
  private readonly menuUuid: string;
  private readonly menuName: string;
  private readonly formCode: string;
  private readonly formName: string;
  private readonly formColumnCode: string;
  private readonly formColumnName: string;
  private readonly formType: string;
  private readonly required: boolean;
  private readonly order: number;
  private readonly createdAt: string;
  private readonly updatedAt: string;
  private readonly createdBy: string;
  private readonly updatedBy: string;

  constructor({
    uuid,
    menu_uuid,
    menu_nm,
    excel_form_cd,
    excel_form_nm,
    excel_form_column_nm,
    excel_form_column_cd,
    excel_form_type,
    column_fg,
    sortby,
    created_at,
    created_nm,
    updated_at,
    updated_nm,
  }: ExcelUploadTypeProps) {
    this.uuid = uuid;
    this.menuUuid = menu_uuid;
    this.menuName = menu_nm;
    this.formCode = excel_form_cd;
    this.formName = excel_form_nm;
    this.formColumnCode = excel_form_column_cd;
    this.formColumnName = excel_form_column_nm;
    this.formType = excel_form_type;
    this.required = column_fg;
    this.order = sortby;
    this.createdAt = created_at;
    this.updatedAt = updated_at;
    this.createdBy = created_nm;
    this.updatedBy = updated_nm;
  }

  info(): ExcelUploadTypeProps {
    return {
      uuid: this.uuid,
      menu_uuid: this.menuUuid,
      menu_nm: this.menuName,
      excel_form_cd: this.formCode,
      excel_form_nm: this.formName,
      excel_form_column_nm: this.formColumnName,
      excel_form_column_cd: this.formColumnCode,
      excel_form_type: this.formType,
      column_fg: this.required,
      sortby: this.order,
      created_at: this.createdAt,
      created_nm: this.createdBy,
      updated_at: this.updatedAt,
      updated_nm: this.updatedBy,
    };
  }
}

export default ExcelUploadType;
