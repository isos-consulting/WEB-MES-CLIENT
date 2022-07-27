import {
  IGridColumn,
  IGridPopupProps,
  TGridComboInfos,
  TGridMode,
  TGridPopupInfos,
} from '~/components/UI';
import { SENTENCE, WORD } from '~/constants/lang/ko';

interface BasicModalContextProps<T> {
  title: string;
  columns: IGridColumn[];
  visible: boolean;
  gridMode: TGridMode;
  data: T[];
  gridPopupInfo: TGridPopupInfos;
  gridComboInfo: TGridComboInfos;
}

interface AddBasicModalContextProps<T> {
  title: string;
  columns: IGridColumn[];
  gridPopupInfo: TGridPopupInfos;
  gridComboInfo: TGridComboInfos;
}
interface EditBasicModalContextProps<T> {
  title: string;
  columns: IGridColumn[];
  data: T[];
  gridPopupInfo: TGridPopupInfos;
  gridComboInfo: TGridComboInfos;
}

interface BasicGridPopupProps extends IGridPopupProps {}

class BasicModalContext<T> implements BasicGridPopupProps {
  readonly popupId: string;
  readonly saveUriPath: string;
  readonly columns: IGridColumn[];
  readonly saveType: 'basic' | 'headerInclude';
  readonly gridId: string;
  readonly title: string;
  readonly visible: boolean;
  readonly okText: string;
  readonly cancelText: string;
  readonly gridMode: TGridMode;
  readonly data: T[];
  readonly gridPopupInfo: TGridPopupInfos;
  readonly gridComboInfo: TGridComboInfos;

  constructor({
    title,
    columns,
    visible,
    gridMode,
    data,
    gridPopupInfo,
    gridComboInfo,
  }: BasicModalContextProps<T>) {
    const uniqueKey = (Math.random() * 100).toString();
    this.popupId = `${title}-popup-${uniqueKey}`;
    this.gridId = `${title}-grid-${uniqueKey}`;
    this.saveUriPath = '';
    this.columns = columns;
    this.saveType = 'basic';
    this.title = title;
    this.visible = visible;
    this.okText = SENTENCE.SAVE_DATA;
    this.cancelText = WORD.CANCEL;
    this.gridMode = gridMode;
    this.data = data;
    this.gridPopupInfo = gridPopupInfo;
    this.gridComboInfo = gridComboInfo;
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
      gridMode: this.gridMode,
      data: this.data,
      gridPopupInfo: this.gridPopupInfo,
      gridComboInfo: this.gridComboInfo,
    };
  }

  static add<T>({
    title,
    columns,
    gridPopupInfo,
    gridComboInfo,
  }: AddBasicModalContextProps<T>): BasicModalContext<T> {
    return new BasicModalContext({
      title: `${title} - ${SENTENCE.ADD_RECORD}`,
      columns: columns,
      visible: true,
      gridMode: 'create',
      data: [],
      gridPopupInfo: gridPopupInfo,
      gridComboInfo: gridComboInfo,
    });
  }

  static edit<T>({
    title,
    columns,
    data,
    gridPopupInfo,
    gridComboInfo,
  }: EditBasicModalContextProps<T>): BasicModalContext<T> {
    return new BasicModalContext({
      title: `${title} - ${WORD.EDIT}`,
      columns: columns,
      visible: true,
      gridMode: 'update',
      data: data,
      gridPopupInfo: gridPopupInfo,
      gridComboInfo: gridComboInfo,
    });
  }
}

export default BasicModalContext;
