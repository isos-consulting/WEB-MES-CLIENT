import { getData } from '~/functions';
import ExcelUploadType from '~/models/user/excel-upload-type';

export const excelUploadTypeList = async () => {
  return await (
    await getData({}, '/adm/excel-forms')
  ).map(
    excelUploadTypeApiResponse =>
      new ExcelUploadType(excelUploadTypeApiResponse),
  );
};
