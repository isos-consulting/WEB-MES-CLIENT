import Grid from '@toast-ui/react-grid';
import {
  GridInstanceReference,
  IGridColumn,
  TGridComboInfos,
  TGridMode,
  TGridPopupInfos,
} from '~/components/UI';
import IGridPopupProps from '~/components/UI/popup-datagrid/popup-datagrid.ui.type';
import { IInputGroupboxProps } from '~/components/UI/input-groupbox';
import { SENTENCE, WORD } from '~/constants/lang/ko';
import { encryptedString } from '~/functions/encrypt';

type HeaderIncludedModalContextProps<T> = {
  title: string;
  columns: IGridColumn[];
  visible: boolean;
  gridMode: TGridMode;
  data: T[];
  gridPopupInfo: TGridPopupInfos;
  gridComboInfo: TGridComboInfos;
  onOk: (headerIncludedModalDataGridRef: GridInstanceReference<Grid>) => void;
  inputProps: IInputGroupboxProps[];
};

interface HeaderIncludedGridPopupProps extends IGridPopupProps {}

export class HeaderIncludedModalContext<T>
  implements HeaderIncludedGridPopupProps
{
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
  readonly onOk: (
    headerIncludedModalDataGridRef: GridInstanceReference<Grid>,
  ) => void;
  readonly inputProps: IInputGroupboxProps[];

  constructor({
    title,
    columns,
    visible,
    gridMode,
    data,
    gridPopupInfo,
    gridComboInfo,
    onOk,
    inputProps,
  }: HeaderIncludedModalContextProps<T>) {
    const uniqueKey = encryptedString();
    this.popupId = `${title}-popup-${uniqueKey}`;
    this.gridId = `${title}-grid-${uniqueKey}`;
    this.saveUriPath = '';
    this.columns = columns;
    this.saveType = 'headerInclude';
    this.title = title;
    this.visible = visible;
    this.okText = SENTENCE.SAVE_DATA;
    this.cancelText = WORD.CANCEL;
    this.gridMode = gridMode;
    this.data = data;
    this.gridPopupInfo = gridPopupInfo;
    this.gridComboInfo = gridComboInfo;
    this.onOk = onOk;
    this.inputProps = inputProps;
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
      inputProps: this.inputProps,
    };
  }
}
