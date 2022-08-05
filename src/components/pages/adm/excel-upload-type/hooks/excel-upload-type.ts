import { getData } from '~/functions';
import ExcelUploadType from '~/models/user/excel-upload-type';

export const excelUploadTypeList = async () => {
  const excelForms = await getData({}, '/adm/excel-forms');

  return excelForms.map(
    excelUploadTypeApiResponse =>
      new ExcelUploadType(excelUploadTypeApiResponse),
  );
};
