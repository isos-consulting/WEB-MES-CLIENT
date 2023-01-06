import Grid from '@toast-ui/react-grid';
import {
  GridInstanceReference,
  IGridColumn,
  TGridMode,
  TGridPopupInfos,
  TGridComboInfos,
} from '~/components/UI';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { encryptedString } from '~/functions/encrypt';

type BasicModalContextProps<T> = {
  title: string;
  columns: IGridColumn[];
  visible: boolean;
  gridMode: TGridMode;
  data: T[];
  gridPopupInfo: TGridPopupInfos;
  gridComboInfo: TGridComboInfos;
  onOk: (excelUploadTypeGridRef: GridInstanceReference<Grid>) => void;
};

type AddBasicModalContextProps<T> = Omit<
  BasicModalContextProps<T>,
  'visible' | 'gridMode' | 'data'
>;
type EditBasicModalContextProps<T> = Omit<
  BasicModalContextProps<T>,
  'visible' | 'gridMode'
>;

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
  readonly onOk: (excelUploadTypeGridRef: GridInstanceReference<Grid>) => void;

  constructor({
    title,
    columns,
    visible,
    gridMode,
    data,
    gridPopupInfo,
    gridComboInfo,
    onOk,
  }: BasicModalContextProps<T>) {
    const uniqueKey = encryptedString();
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
    this.onOk = onOk;
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
      onOk: this.onOk,
    };
  }

  static add<T>({
    title,
    columns,
    gridPopupInfo,
    gridComboInfo,
    onOk,
  }: AddBasicModalContextProps<T>): BasicModalContext<T> {
    return new BasicModalContext({
      title: `${title} - ${SENTENCE.ADD_RECORD}`,
      columns: columns,
      visible: true,
      gridMode: 'create',
      data: [],
      gridPopupInfo: gridPopupInfo,
      gridComboInfo: gridComboInfo,
      onOk: onOk,
    });
  }

  static edit<T>({
    title,
    columns,
    data,
    gridPopupInfo,
    gridComboInfo,
    onOk,
  }: EditBasicModalContextProps<T>): BasicModalContext<T> {
    return new BasicModalContext({
      title: `${title} - ${WORD.EDIT}`,
      columns: columns,
      visible: true,
      gridMode: 'update',
      data: data,
      gridPopupInfo: gridPopupInfo,
      gridComboInfo: gridComboInfo,
      onOk: onOk,
    });
  }
}

export default BasicModalContext;
