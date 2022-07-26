import { IGridColumn, IGridPopupProps } from '~/components/UI';
import { SENTENCE, WORD } from '~/constants/lang/ko';

interface BasicModalContextProps {
  title: string;
  surfix: string;
  columns: IGridColumn[];
  visible: boolean;
}

interface BasicGridPopupProps extends IGridPopupProps {
  readonly surfix: string;
}

class BasicModalContext implements BasicGridPopupProps {
  readonly popupId: string;
  readonly saveUriPath: string;
  readonly columns: IGridColumn[];
  readonly saveType: 'basic' | 'headerInclude';
  readonly gridId: string;
  readonly title: string;
  readonly visible: boolean;
  readonly okText: string;
  readonly cancelText: string;
  readonly surfix: string;

  constructor({ title, surfix, columns, visible }: BasicModalContextProps) {
    const uniqueKey = (Math.random() * 100).toString();
    this.popupId = `${title}-popup-${uniqueKey}`;
    this.gridId = `${title}-grid-${uniqueKey}`;
    this.saveUriPath = '';
    this.columns = columns;
    this.saveType = 'basic';
    this.title =
      surfix === ''
        ? title.trim()
        : `${title.split('-')[0].trim()} - ${surfix}`;
    this.surfix = surfix;
    this.visible = visible;
    this.okText = SENTENCE.SAVE_DATA;
    this.cancelText = WORD.CANCEL;
  }

  info(): IGridPopupProps {
    return {
      popupId: this.popupId,
      gridId: this.gridId,
      saveUriPath: this.saveUriPath,
      columns: this.columns,
      saveType: this.saveType,
      title: this.title,
      okText: this.okText,
      cancelText: this.cancelText,
      visible: this.visible,
    };
  }

  add(): BasicModalContext {
    return new BasicModalContext({
      title: this.title,
      surfix: SENTENCE.ADD_RECORD,
      visible: true,
      columns: this.columns,
    });
  }

  edit(): BasicModalContext {
    return new BasicModalContext({
      title: this.title,
      surfix: WORD.EDIT,
      visible: true,
      columns: this.columns,
    });
  }
}

export default BasicModalContext;
