import { Dispatch, MutableRefObject } from 'react';
import Grid from '@toast-ui/react-grid';
import {IDatagridProps} from '~/components/UI/datagrid-new';
import { ISearchboxProps } from '~/components/UI';
import { IInputGroupboxProps } from '~/components/UI/input-groupbox/input-groupbox.ui';

export default interface ITpSingleGridProps {
  pageType?: 'basic' | 'report';
  gridRef: MutableRefObject<Grid>;
  gridItems: IDatagridProps;
  gridDispatch: Dispatch<any>;
  createPopupGridRef: MutableRefObject<Grid>;
  createPopupGridItems: IDatagridProps;
  saveUriPath: string;
  saveOptionParams?: object;
  searchUriPath: string;
  searchParams?: object;
  setParentData:(data: any) => void;
  parentGridRef: MutableRefObject<Grid>;
  saveType?: 'basic' | 'headerInclude';
  
  searchProps?: ISearchboxProps;
  inputProps?: IInputGroupboxProps;

  onSearch?:() => void;
  onDeleteMode?:() => void;
  onUpdateMode?:() => void;
  onShowCreatePopup?:() => void;
  onCancel?:() => void;
  onSave?:() => void;
}
