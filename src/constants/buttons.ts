import { IButtonGroupItem } from '~/components/UI';
import { SENTENCE, WORD } from './lang/ko';

export const ButtonStore: {
  [key: string]: { key: string } & IButtonGroupItem;
} = {
  DELETE: {
    key: 'delete',
    btnType: 'buttonFill',
    widthSize: 'medium',
    heightSize: 'small',
    fontSize: 'small',
    colorType: 'delete',
    ImageType: 'delete',
    children: WORD.DELETE,
  },
  EDIT: {
    key: 'edit',
    btnType: 'buttonFill',
    widthSize: 'medium',
    heightSize: 'small',
    fontSize: 'small',
    ImageType: 'edit',
    children: WORD.EDIT,
  },
  ADD: {
    key: 'add',
    btnType: 'buttonFill',
    widthSize: 'large',
    heightSize: 'small',
    fontSize: 'small',
    ImageType: 'add',
    children: SENTENCE.ADD_RECORD,
  },
  EXCEL_UPLOAD: {
    key: 'excel-upload',
    btnType: 'buttonFill',
    widthSize: 'large',
    heightSize: 'small',
    fontSize: 'small',
    ImageType: 'add',
    children: SENTENCE.EXCEL_UPLOAD,
  },
  EXCEL_DOWNLOAD: {
    key: 'excel-download',
    btnType: 'buttonFill',
    widthSize: 'large',
    heightSize: 'small',
    fontSize: 'small',
    ImageType: 'add',
    children: SENTENCE.EXCEL_DOWNLOAD,
  },
};
